import { Check, GitBranch } from "lucide-react";
import { getModel, type RoutingResult } from "@/lib/forge";

export function ModelRouter({ routing }: { routing: RoutingResult }) {
  const model = getModel(routing.model);

  return (
    <div className="animate-fade-up rounded-xl border border-border bg-surface/60 p-3">
      <div className="mb-3 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        <GitBranch className="size-3.5 text-primary" />
        Model Router
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div>
          <div className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
            Task detected
          </div>
          <div className="mt-1 text-[13px] text-foreground">{routing.task}</div>
        </div>

        <div>
          <div className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
            Required capabilities
          </div>
          <ul className="mt-1 space-y-0.5">
            {routing.capabilities.map((c) => (
              <li
                key={c}
                className="flex items-center gap-1.5 text-[12px] text-foreground/85"
              >
                <Check className="size-3 text-success" />
                {c}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
            Model selected
          </div>
          <div className="mt-1 inline-flex items-center gap-1.5 rounded-md border border-primary/30 bg-primary/10 px-2 py-1 text-[12px] text-foreground">
            <model.icon className="size-3.5 text-primary" />
            {model.name}
          </div>
        </div>
      </div>
    </div>
  );
}
