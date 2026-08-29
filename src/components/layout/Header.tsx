import { PanelLeft, Settings2 } from "lucide-react";
import type { ForgeModel } from "@/lib/forge";

interface HeaderProps {
  model: ForgeModel;
  onOpenSidebar: () => void;
}

export function Header({ model, onOpenSidebar }: HeaderProps) {
  return (
    <header className="flex items-center gap-3 border-b border-border bg-background/80 px-4 py-3 backdrop-blur md:px-6">
      <button
        onClick={onOpenSidebar}
        className="grid size-8 place-items-center rounded-md border border-border text-muted-foreground transition-colors hover:text-foreground lg:hidden"
        aria-label="Open sidebar"
      >
        <PanelLeft className="size-4" />
      </button>

      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <span className="font-display text-sm font-semibold tracking-[0.2em]">
            FORGE
          </span>
          <span className="hidden text-[11px] text-muted-foreground sm:inline">
            Sovereign AI Workbench
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <model.icon className="size-3 text-primary" />
          <span className="truncate">{model.name}</span>
          <span className="hidden text-muted-foreground/60 md:inline">
            · Private intelligence. Local execution. Full control.
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="flex items-center gap-1.5 rounded-full border border-border bg-surface px-2.5 py-1 text-[11px] text-foreground/90">
          <span className="size-1.5 rounded-full bg-success animate-status-dot" />
          Local
        </span>
        <button
          className="grid size-8 place-items-center rounded-md border border-border text-muted-foreground transition-colors hover:border-border-strong hover:text-foreground"
          aria-label="Settings"
        >
          <Settings2 className="size-4" />
        </button>
      </div>
    </header>
  );
}
