import { Check, ChevronDown, Gauge } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EFFORT_LEVELS, type EffortLevel } from "@/lib/forge";

const HINTS: Record<EffortLevel, string> = {
  Low: "Fast single pass",
  Medium: "Balanced verification",
  High: "Deeper retrieval & checks",
  Max: "Exhaustive multi-pass review",
};

interface EffortSelectorProps {
  value: EffortLevel;
  onChange: (v: EffortLevel) => void;
}

export function EffortSelector({ value, onChange }: EffortSelectorProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-1.5 rounded-full border border-border bg-surface px-2.5 py-1.5 text-xs text-foreground/90 transition-colors hover:border-border-strong">
          <Gauge className="size-3.5 shrink-0 text-primary" />
          <span className="hidden shrink-0 text-muted-foreground sm:inline">
            Effort
          </span>
          <span>{value}</span>
          <ChevronDown className="size-3 shrink-0 text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-52">
        <DropdownMenuLabel className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
          Effort
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {EFFORT_LEVELS.map((level) => (
          <DropdownMenuItem
            key={level}
            onSelect={() => onChange(level)}
            className="gap-2 py-1.5"
          >
            <span className="flex-1">
              <span className="block text-[13px]">{level}</span>
              <span className="block text-[11px] text-muted-foreground">
                {HINTS[level]}
              </span>
            </span>
            {level === value && <Check className="size-3.5 text-primary" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
