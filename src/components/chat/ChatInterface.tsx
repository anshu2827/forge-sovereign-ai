import { useCallback, useEffect, useRef, useState } from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { ChatComposer } from "@/components/chat/ChatComposer";
import { ForgeMark } from "@/components/layout/ForgeMark";
import {
  CONVERSATIONS,
  answerForTask,
  buildAudit,
  classifyRequest,
  getModel,
  stepsForTask,
  type Attachment,
  type ChatMessageData,
  type Conversation,
  type EffortLevel,
  type ModelId,
} from "@/lib/forge";

const PIPELINE = [
  "Task classification",
  "Model selection",
  "Document processing",
  "Knowledge retrieval",
  "Analysis",
  "Verification",
  "Deliverable",
];

const SUGGESTIONS = [
  "Analyze this inspection report and prepare an approval note based on the applicable SOP.",
  "Review the flange photograph for corrosion against SOP 3.2.",
  "Calculate the required pipe wall thickness for 12 bar design pressure.",
];

export function ChatInterface() {
  const [conversations, setConversations] =
    useState<Conversation[]>(CONVERSATIONS);
  const [activeId, setActiveId] = useState(CONVERSATIONS[0].id);
  const [model, setModel] = useState<ModelId>("forge-document");
  const [effort, setEffort] = useState<EffortLevel>("High");
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [busy, setBusy] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const timers = useRef<number[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const active =
    conversations.find((c) => c.id === activeId) ?? conversations[0];

  useEffect(() => {
    return () => timers.current.forEach((t) => window.clearTimeout(t));
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [active.messages, busy]);

  const patchAssistant = useCallback(
    (
      convId: string,
      msgId: string,
      patch: (m: ChatMessageData) => ChatMessageData,
    ) => {
      setConversations((prev) =>
        prev.map((c) =>
          c.id !== convId
            ? c
            : {
                ...c,
                messages: c.messages.map((m) => (m.id === msgId ? patch(m) : m)),
              },
        ),
      );
    },
    [],
  );

  const handleSend = (text: string) => {
    const convId = activeId;
    const routing = classifyRequest(text, attachments);
    const selectedModel = getModel(routing.model);
    const stepLabels = stepsForTask(routing.task);
    const userId = `u-${Date.now()}`;
    const botId = `a-${Date.now()}`;

    setModel(routing.model);
    setBusy(true);

    const userMsg: ChatMessageData = {
      id: userId,
      role: "user",
      content: text,
      attachments,
    };
    const botMsg: ChatMessageData = {
      id: botId,
      role: "assistant",
      content: "",
      routing,
      effort,
      steps: stepLabels.map((label, i) => ({
        label,
        status: i === 0 ? "active" : "pending",
      })),
      activityDone: false,
    };

    setConversations((prev) =>
      prev.map((c) =>
        c.id !== convId
          ? c
          : {
              ...c,
              title:
                c.messages.length === 0
                  ? text.slice(0, 42) + (text.length > 42 ? "…" : "")
                  : c.title,
              meta: `Now · ${selectedModel.name}`,
              messages: [...c.messages, userMsg, botMsg],
            },
      ),
    );
    setAttachments([]);

    const stepDelay = { Low: 380, Medium: 520, High: 700, Max: 900 }[effort];

    stepLabels.forEach((_, i) => {
      const t = window.setTimeout(
        () => {
          patchAssistant(convId, botId, (m) => ({
            ...m,
            steps: m.steps?.map((s, idx) => ({
              ...s,
              status:
                idx <= i ? "done" : idx === i + 1 ? "active" : "pending",
            })),
          }));
        },
        stepDelay * (i + 1),
      );
      timers.current.push(t);
    });

    const finish = window.setTimeout(
      () => {
        patchAssistant(convId, botId, (m) => ({
          ...m,
          activityDone: true,
          steps: m.steps?.map((s) => ({ ...s, status: "done" })),
          answer: answerForTask(routing.task),
          audit: buildAudit(selectedModel.name, routing.task),
        }));
        setBusy(false);
      },
      stepDelay * (stepLabels.length + 1),
    );
    timers.current.push(finish);
  };

  const newChat = () => {
    const id = `c-${Date.now()}`;
    setConversations((prev) => [
      { id, title: "New conversation", meta: "Now · Unrouted", messages: [] },
      ...prev,
    ]);
    setActiveId(id);
    setAttachments([]);
    setSidebarOpen(false);
  };

  const sidebar = (
    <Sidebar
      conversations={conversations}
      activeId={activeId}
      onSelect={(id) => {
        setActiveId(id);
        setSidebarOpen(false);
      }}
      onNewChat={newChat}
    />
  );

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <div className="hidden w-[272px] shrink-0 lg:block">{sidebar}</div>

      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-[280px] border-border p-0">
          {sidebar}
        </SheetContent>
      </Sheet>

      <div className="flex min-w-0 flex-1 flex-col">
        <Header
          model={getModel(model)}
          onOpenSidebar={() => setSidebarOpen(true)}
        />

        <div ref={scrollRef} className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-3xl space-y-6 px-4 py-6 md:px-6">
            {active.messages.length === 0 ? (
              <EmptyState onPick={handleSend} />
            ) : (
              active.messages.map((m) => <ChatMessage key={m.id} message={m} />)
            )}
          </div>
        </div>

        <div className="border-t border-border bg-background/80 px-4 py-4 backdrop-blur md:px-6">
          <ChatComposer
            model={model}
            onModelChange={setModel}
            effort={effort}
            onEffortChange={setEffort}
            attachments={attachments}
            onAddAttachment={(a) => setAttachments((prev) => [...prev, a])}
            onRemoveAttachment={(id) =>
              setAttachments((prev) => prev.filter((a) => a.id !== id))
            }
            onSend={handleSend}
            busy={busy}
          />
        </div>
      </div>
    </div>
  );
}

function EmptyState({ onPick }: { onPick: (text: string) => void }) {
  return (
    <div className="flex flex-col items-center px-2 py-10 text-center">
      <ForgeMark className="size-12" />
      <h1 className="mt-4 font-display text-2xl font-semibold tracking-[0.22em]">
        FORGE
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Sovereign AI Workbench
      </p>
      <p className="mt-0.5 text-[11px] uppercase tracking-[0.16em] text-muted-foreground/80">
        Private intelligence. Local execution. Full control.
      </p>

      <div className="mt-8 grid w-full max-w-xl grid-cols-2 gap-2 sm:grid-cols-4">
        {PIPELINE.slice(0, 4).map((p) => (
          <div
            key={p}
            className="rounded-lg border border-border bg-surface/50 px-2 py-2 text-[11px] text-muted-foreground"
          >
            {p}
          </div>
        ))}
      </div>

      <div className="mt-6 w-full max-w-xl space-y-2 text-left">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            onClick={() => onPick(s)}
            className="w-full rounded-lg border border-border bg-surface/50 px-3 py-2.5 text-[13px] text-foreground/85 transition-colors hover:border-primary/40 hover:bg-surface"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
