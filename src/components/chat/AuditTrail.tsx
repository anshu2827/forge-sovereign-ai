import { useState } from "react";
import { ChevronDown, ScrollText, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AuditEntry } from "@/lib/forge";

export function AuditTrail({ entries }: { entries: AuditEntry[] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-xl border border-border bg-surface/50">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-2 px-3 py-2.5 text-left"
      >
        <ScrollText className="size-4 text-muted-foreground" />
        <span className="flex-1 text-[12.5px] text-foreground">
          Audit trail{" "}
          <span className="text-muted-foreground">· {entries.length} events</span>
        </span>
        <ChevronDown
          className={cn(
            "size-4 text-muted-foreground transition-transform",
            open && "rotate-180",
          )}
        />
      </button>

      {open && (
        <ul className="animate-fade-up space-y-1.5 border-t border-border px-3 py-2.5">
          {entries.map((e) => (
            <li key={e.time + e.event} className="flex items-center gap-3">
              <CheckCircle2 className="size-3 shrink-0 text-success/80" />
              <span className="shrink-0 font-mono text-[11px] text-muted-foreground">
                {e.time}
              </span>
              <span className="text-[12px] text-foreground/90">{e.event}</span>
            </li>
          ))}
          <li className="pt-1 text-[10px] text-muted-foreground">
            Every action FORGE takes is recorded and traceable.
          </li>
        </ul>
      )}
    </div>
  );
}
