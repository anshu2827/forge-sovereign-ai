import { useState } from "react";
import { ChevronDown, Check, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

const CLAIMS = [
  "Local model",
  "Local knowledge base",
  "Local file processing",
  "Controlled tool access",
];

export function SovereignPanel({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-surface/70 text-xs",
        className,
      )}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-2 px-3 py-2.5 text-left"
      >
        <span className="size-1.5 shrink-0 rounded-full bg-success animate-status-dot" />
        <span className="flex-1 font-medium tracking-wide text-foreground">
          Sovereign Mode
        </span>
        <ChevronDown
          className={cn(
            "size-3.5 text-muted-foreground transition-transform",
            open && "rotate-180",
          )}
        />
      </button>

      {!open && (
        <div className="space-y-0.5 px-3 pb-2.5 text-[11px] text-muted-foreground">
          <div>Local processing</div>
          <div className="flex items-center justify-between">
            <span>External connections</span>
            <span className="font-mono text-foreground">0</span>
          </div>
        </div>
      )}

      {open && (
        <div className="animate-fade-up space-y-2 border-t border-border px-3 py-2.5">
          <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Sovereign Mode
          </div>
          <ul className="space-y-1">
            {CLAIMS.map((c) => (
              <li key={c} className="flex items-center gap-2 text-[11px]">
                <Check className="size-3 text-success" />
                <span className="text-foreground/90">{c}</span>
              </li>
            ))}
          </ul>
          <div className="flex items-center justify-between rounded-md border border-border bg-background/60 px-2 py-1.5 text-[11px]">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <Lock className="size-3" /> External connections
            </span>
            <span className="font-mono text-foreground">0</span>
          </div>
          <p className="text-[10px] leading-relaxed text-muted-foreground">
            Prototype indicator — not a live network measurement.
          </p>
        </div>
      )}
    </div>
  );
}
