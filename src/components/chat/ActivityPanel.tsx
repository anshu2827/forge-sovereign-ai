import { useState } from "react";
import { Check, ChevronDown, Circle, Loader2, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ActivityStep } from "@/lib/forge";

interface ActivityPanelProps {
  steps: ActivityStep[];
  done: boolean;
}

export function ActivityPanel({ steps, done }: ActivityPanelProps) {
  const [open, setOpen] = useState(true);
  const completed = steps.filter((s) => s.status === "done").length;

  return (
    <div className="rounded-xl border border-border bg-surface/60">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-2 px-3 py-2.5 text-left"
      >
        {done ? (
          <Check className="size-4 text-success" />
        ) : (
          <Loader2 className="size-4 animate-spin text-primary" />
        )}
        <span className="flex-1 text-[13px] text-foreground">
          {done ? (
            <>
              Task completed{" "}
              <span className="text-muted-foreground">
                · {steps.length} steps
              </span>
            </>
          ) : (
            <>
              FORGE is working
              <span className="text-muted-foreground">
                {" "}
                · {completed}/{steps.length}
              </span>
            </>
          )}
        </span>
        <ChevronDown
          className={cn(
            "size-4 text-muted-foreground transition-transform",
            open && "rotate-180",
          )}
        />
      </button>

      {open && (
        <ol className="space-y-1.5 border-t border-border px-3 py-2.5">
          {steps.map((step, i) => (
            <li
              key={step.label}
              className={cn(
                "flex items-center gap-2.5 text-[12.5px]",
                step.status === "pending"
                  ? "text-muted-foreground/70"
                  : "text-foreground/90",
              )}
              style={{ animationDelay: `${i * 40}ms` }}
            >
              {step.status === "done" && (
                <Check className="size-3.5 shrink-0 text-success" />
              )}
              {step.status === "active" && (
                <Loader2 className="size-3.5 shrink-0 animate-spin text-primary" />
              )}
              {step.status === "pending" && (
                <Circle className="size-3 shrink-0 text-muted-foreground/50" />
              )}
              <span className={cn(step.status === "active" && "text-primary")}>
                {step.label}
              </span>
            </li>
          ))}
          <li className="flex items-center gap-1.5 pt-1 text-[10px] text-muted-foreground">
            <Activity className="size-3" />
            Action log only — no private reasoning is exposed.
          </li>
        </ol>
      )}
    </div>
  );
}
