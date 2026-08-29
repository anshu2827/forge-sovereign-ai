import { BookMarked, FileText } from "lucide-react";
import type { SourceRef } from "@/lib/forge";
import { cn } from "@/lib/utils";

export function SourceCard({ source }: { source: SourceRef }) {
  const isSop = source.kind === "sop";
  const Icon = isSop ? BookMarked : FileText;

  return (
    <div
      className={cn(
        "rounded-lg border bg-surface/60 p-3 transition-colors hover:border-border-strong",
        isSop ? "border-info/25" : "border-primary/25",
      )}
    >
      <div className="flex items-center gap-2">
        <span
          className={cn(
            "grid size-6 place-items-center rounded",
            isSop ? "bg-info/12 text-info" : "bg-primary/12 text-primary",
          )}
        >
          <Icon className="size-3.5" />
        </span>
        <span className="min-w-0 flex-1 truncate text-[12px] text-foreground">
          {source.file}
        </span>
        <span className="shrink-0 rounded border border-border px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
          {source.locator}
        </span>
      </div>
      <p className="mt-2 line-clamp-2 text-[11px] leading-relaxed text-muted-foreground">
        {source.excerpt}
      </p>
    </div>
  );
}
