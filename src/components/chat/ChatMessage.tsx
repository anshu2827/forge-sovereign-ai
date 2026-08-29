import { ShieldCheck, User } from "lucide-react";
import type { ChatMessageData } from "@/lib/forge";
import { ForgeMark } from "@/components/layout/ForgeMark";
import { AttachmentChip } from "@/components/chat/AttachmentChip";
import { ModelRouter } from "@/components/chat/ModelRouter";
import { ActivityPanel } from "@/components/chat/ActivityPanel";
import { SourceCard } from "@/components/chat/SourceCard";
import { AuditTrail } from "@/components/chat/AuditTrail";
import { ApprovalNote } from "@/components/chat/ApprovalNote";

export function ChatMessage({ message }: { message: ChatMessageData }) {
  if (message.role === "user") {
    return (
      <div className="animate-fade-up flex justify-end gap-3">
        <div className="max-w-[85%] space-y-2 sm:max-w-[72%]">
          <div className="rounded-2xl rounded-br-md border border-border-strong bg-surface-2 px-4 py-3 text-[14px] leading-relaxed text-foreground">
            {message.content}
          </div>
          {message.attachments && message.attachments.length > 0 && (
            <div className="flex flex-wrap justify-end gap-2">
              {message.attachments.map((a) => (
                <AttachmentChip key={a.id} attachment={a} />
              ))}
            </div>
          )}
        </div>
        <span className="mt-1 grid size-8 shrink-0 place-items-center rounded-md border border-border bg-surface text-muted-foreground">
          <User className="size-4" />
        </span>
      </div>
    );
  }

  const answer = message.answer;

  return (
    <div className="animate-fade-up flex gap-3">
      <ForgeMark className="mt-1 size-8" />
      <div className="min-w-0 flex-1 space-y-3">
        {message.routing && <ModelRouter routing={message.routing} />}

        {message.steps && (
          <ActivityPanel
            steps={message.steps}
            done={Boolean(message.activityDone)}
          />
        )}

        {answer && (
          <div className="space-y-4 rounded-xl border border-border bg-card/70 p-4">
            <p className="text-[14px] leading-relaxed text-foreground/90">
              {answer.summary}
            </p>

            <section>
              <h3 className="mb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Key Findings
              </h3>
              <ol className="space-y-2">
                {answer.findings.map((f, i) => (
                  <li
                    key={f.title}
                    className="flex gap-3 rounded-lg border border-border bg-surface/50 p-3"
                  >
                    <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded border border-border font-mono text-[10px] text-muted-foreground">
                      {i + 1}
                    </span>
                    <span className="min-w-0">
                      <span className="flex flex-wrap items-center gap-2">
                        <span className="text-[13px] font-medium text-foreground">
                          {f.title}
                        </span>
                        <span className="rounded border border-primary/30 bg-primary/10 px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-primary">
                          {f.severity}
                        </span>
                      </span>
                      <span className="mt-1 block text-[12.5px] leading-relaxed text-muted-foreground">
                        {f.detail}
                      </span>
                    </span>
                  </li>
                ))}
              </ol>
            </section>

            <section>
              <h3 className="mb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Internal Sources
              </h3>
              <div className="grid gap-2 sm:grid-cols-2">
                {answer.sources.map((s) => (
                  <SourceCard key={s.file + s.locator} source={s} />
                ))}
              </div>
            </section>

            <div className="flex items-center gap-2 rounded-lg border border-success/25 bg-success/8 px-3 py-2 text-[12.5px] text-foreground/90">
              <ShieldCheck className="size-4 text-success" />
              {answer.verification}
            </div>

            {answer.deliverable && (
              <ApprovalNote
                label={answer.deliverable.label}
                fileName={answer.deliverable.fileName}
              />
            )}
          </div>
        )}

        {message.audit && message.audit.length > 0 && (
          <AuditTrail entries={message.audit} />
        )}
      </div>
    </div>
  );
}
