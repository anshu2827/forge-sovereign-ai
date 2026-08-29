import { useMemo, useState } from "react";
import { Plus, Search, MessageSquareText, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Conversation } from "@/lib/forge";
import { ForgeMark } from "@/components/layout/ForgeMark";
import { SovereignPanel } from "@/components/chat/SovereignPanel";

interface SidebarProps {
  conversations: Conversation[];
  activeId: string;
  onSelect: (id: string) => void;
  onNewChat: () => void;
}

export function Sidebar({
  conversations,
  activeId,
  onSelect,
  onNewChat,
}: SidebarProps) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(
    () =>
      conversations.filter((c) =>
        c.title.toLowerCase().includes(query.trim().toLowerCase()),
      ),
    [conversations, query],
  );

  return (
    <aside className="flex h-full w-full flex-col border-r border-border bg-sidebar">
      <div className="flex items-center gap-3 border-b border-sidebar-border px-4 py-4">
        <ForgeMark />
        <div className="min-w-0">
          <div className="font-display text-[15px] font-semibold tracking-[0.18em] text-sidebar-foreground">
            FORGE
          </div>
          <div className="truncate text-[11px] text-muted-foreground">
            Sovereign AI Workbench
          </div>
        </div>
      </div>

      <div className="space-y-2 px-3 pt-3">
        <button
          onClick={onNewChat}
          className="flex w-full items-center gap-2 rounded-lg border border-border-strong bg-surface-2 px-3 py-2 text-sm font-medium text-sidebar-foreground transition-colors hover:border-primary/40 hover:bg-surface"
        >
          <Plus className="size-4 text-primary" />
          New Chat
        </button>

        <div className="flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 focus-within:border-primary/40">
          <Search className="size-4 shrink-0 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search"
            className="w-full bg-transparent text-sm text-sidebar-foreground outline-none placeholder:text-muted-foreground"
          />
        </div>
      </div>

      <div className="mt-5 flex-1 overflow-y-auto px-3 pb-3">
        <div className="px-1 pb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Recent
        </div>
        <div className="space-y-1">
          {filtered.map((c) => (
            <button
              key={c.id}
              onClick={() => onSelect(c.id)}
              className={cn(
                "group flex w-full items-start gap-2.5 rounded-lg border border-transparent px-2.5 py-2 text-left transition-colors",
                c.id === activeId
                  ? "border-border-strong bg-sidebar-accent"
                  : "hover:bg-sidebar-accent/60",
              )}
            >
              <MessageSquareText
                className={cn(
                  "mt-0.5 size-4 shrink-0",
                  c.id === activeId ? "text-primary" : "text-muted-foreground",
                )}
              />
              <span className="min-w-0">
                <span className="block truncate text-[13px] text-sidebar-foreground">
                  {c.title}
                </span>
                <span className="block truncate text-[11px] text-muted-foreground">
                  {c.meta}
                </span>
              </span>
            </button>
          ))}
          {filtered.length === 0 && (
            <p className="px-2 py-6 text-center text-xs text-muted-foreground">
              No conversations match “{query}”.
            </p>
          )}
        </div>
      </div>

      <div className="border-t border-sidebar-border p-3">
        <SovereignPanel />
        <div className="mt-3 flex items-center gap-1.5 px-1 text-[10px] text-muted-foreground">
          <ShieldCheck className="size-3" />
          Prototype status indicator
        </div>
      </div>
    </aside>
  );
}
