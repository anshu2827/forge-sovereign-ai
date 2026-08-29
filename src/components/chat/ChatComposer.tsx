import { useState, type FormEvent, type KeyboardEvent } from "react";
import { ArrowUp, Loader2 } from "lucide-react";
import { BorderBeam } from "@/components/ui/border-beam";
import { ModelSelector } from "@/components/chat/ModelSelector";
import { EffortSelector } from "@/components/chat/EffortSelector";
import { AttachmentMenu } from "@/components/chat/AttachmentMenu";
import { AttachmentChip } from "@/components/chat/AttachmentChip";
import type { Attachment, EffortLevel, ModelId } from "@/lib/forge";

interface ChatComposerProps {
  model: ModelId;
  onModelChange: (m: ModelId) => void;
  effort: EffortLevel;
  onEffortChange: (e: EffortLevel) => void;
  attachments: Attachment[];
  onAddAttachment: (a: Attachment) => void;
  onRemoveAttachment: (id: string) => void;
  onSend: (text: string) => void;
  busy: boolean;
}

export function ChatComposer({
  model,
  onModelChange,
  effort,
  onEffortChange,
  attachments,
  onAddAttachment,
  onRemoveAttachment,
  onSend,
  busy,
}: ChatComposerProps) {
  const [text, setText] = useState("");

  const submit = (e?: FormEvent) => {
    e?.preventDefault();
    if (busy) return;
    const value = text.trim();
    if (!value && attachments.length === 0) return;
    onSend(value || "Analyze the attached file.");
    setText("");
  };

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  return (
    <div className="mx-auto w-full max-w-3xl">
      <BorderBeam
        size="md"
        colorVariant="sunset"
        theme="dark"
        strength={0.35}
        duration={4}
        borderRadius={18}
        active={busy}
        className="w-full"
      >
        <form
          onSubmit={submit}
          className="rounded-[18px] border border-border-strong bg-surface/90 p-2.5 backdrop-blur"
        >
          {attachments.length > 0 && (
            <div className="mb-2 flex flex-wrap gap-2">
              {attachments.map((a) => (
                <AttachmentChip
                  key={a.id}
                  attachment={a}
                  onRemove={onRemoveAttachment}
                />
              ))}
            </div>
          )}

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={onKeyDown}
            rows={2}
            placeholder="Ask FORGE anything..."
            className="max-h-40 w-full resize-none bg-transparent px-2 py-1.5 text-[14px] leading-relaxed text-foreground outline-none placeholder:text-muted-foreground"
          />

          <div className="mt-1 flex flex-wrap items-center gap-2">
            <AttachmentMenu onAdd={onAddAttachment} />
            <ModelSelector value={model} onChange={onModelChange} />
            <EffortSelector value={effort} onChange={onEffortChange} />
            <div className="ml-auto flex items-center gap-2">
              <span className="hidden text-[10px] text-muted-foreground sm:inline">
                Local execution
              </span>
              <button
                type="submit"
                disabled={busy}
                aria-label="Send message"
                className="grid size-8 place-items-center rounded-full bg-primary text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
              >
                {busy ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <ArrowUp className="size-4" />
                )}
              </button>
            </div>
          </div>
        </form>
      </BorderBeam>

      <p className="mt-2 text-center text-[10px] text-muted-foreground">
        Prototype · mock data · all processing indicators are illustrative.
      </p>
    </div>
  );
}
