import { Check, ChevronDown, Cpu } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FORGE_MODELS, getModel, type ModelId } from "@/lib/forge";
import { cn } from "@/lib/utils";

interface ModelSelectorProps {
  value: ModelId;
  onChange: (id: ModelId) => void;
}

export function ModelSelector({ value, onChange }: ModelSelectorProps) {
  const active = getModel(value);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex min-w-0 items-center gap-1.5 rounded-full border border-border bg-surface px-2.5 py-1.5 text-xs text-foreground/90 transition-colors hover:border-border-strong">
          <Cpu className="size-3.5 shrink-0 text-primary" />
          <span className="hidden shrink-0 text-muted-foreground sm:inline">
            Models
          </span>
          <span className="truncate">{active.name}</span>
          <ChevronDown className="size-3 shrink-0 text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64">
        <DropdownMenuLabel className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
          Models
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {FORGE_MODELS.map((m) => (
          <DropdownMenuItem
            key={m.id}
            onSelect={() => onChange(m.id)}
            className="gap-2.5 py-2"
          >
            <m.icon
              className={cn(
                "size-4",
                m.id === value ? "text-primary" : "text-muted-foreground",
              )}
            />
            <span className="flex-1">
              <span className="block text-[13px]">{m.name}</span>
              <span className="block text-[11px] text-muted-foreground">
                {m.description}
              </span>
            </span>
            {m.id === value && <Check className="size-3.5 text-primary" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
