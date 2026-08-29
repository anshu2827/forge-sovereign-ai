import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { AppShell } from "@/components/layout/AppShell";
import {
  ScrollText,
  Search,
  CheckCircle2,
  Loader2,
  XCircle,
  Clock,
  Filter,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/activity-logs")({
  head: () => ({ meta: [{ title: "Activity Logs — FORGE" }] }),
  component: ActivityLogsRoute,
});

interface LogEntry {
  id: string;
  time: string;
  date: string;
  taskId: string;
  event: string;
  model: string;
  user: string;
  status: "success" | "active" | "failed" | "info";
}

const MOCK_LOGS: LogEntry[] = [
  { id: "l1", time: "17:31:04", date: "2026-08-29", taskId: "TSK-0041", event: "Task received: Document Analysis", model: "FORGE Document", user: "admin@forge.local", status: "active" },
  { id: "l2", time: "17:31:06", date: "2026-08-29", taskId: "TSK-0041", event: "Model selected: FORGE Document", model: "FORGE Document", user: "system", status: "success" },
  { id: "l3", time: "17:31:08", date: "2026-08-29", taskId: "TSK-0041", event: "Document processing started", model: "FORGE Document", user: "system", status: "active" },
  { id: "l4", time: "13:41:02", date: "2026-08-29", taskId: "TSK-0039", event: "Task received: Document Analysis", model: "FORGE Document", user: "admin@forge.local", status: "success" },
  { id: "l5", time: "13:41:03", date: "2026-08-29", taskId: "TSK-0039", event: "Model selected: FORGE Document", model: "FORGE Document", user: "system", status: "success" },
  { id: "l6", time: "13:41:05", date: "2026-08-29", taskId: "TSK-0039", event: "Document processed locally", model: "FORGE Document", user: "system", status: "success" },
  { id: "l7", time: "13:41:08", date: "2026-08-29", taskId: "TSK-0039", event: "Internal knowledge searched (4 results)", model: "FORGE Document", user: "system", status: "success" },
  { id: "l8", time: "13:41:11", date: "2026-08-29", taskId: "TSK-0039", event: "Findings verified against SOP", model: "FORGE Document", user: "system", status: "success" },
  { id: "l9", time: "13:41:14", date: "2026-08-29", taskId: "TSK-0039", event: "Approval note generated: Approval_Note_PMP402.docx", model: "FORGE Document", user: "system", status: "success" },
  { id: "l10", time: "11:02:17", date: "2026-08-29", taskId: "TSK-0038", event: "Task received: Code & Computation", model: "FORGE Text", user: "admin@forge.local", status: "success" },
  { id: "l11", time: "11:02:19", date: "2026-08-29", taskId: "TSK-0038", event: "Engineering standards retrieved (Piping_Design_Spec.pdf)", model: "FORGE Text", user: "system", status: "success" },
  { id: "l12", time: "11:02:25", date: "2026-08-29", taskId: "TSK-0038", event: "Calculation sheet prepared: Calculation_Sheet_PipeThickness.docx", model: "FORGE Text", user: "system", status: "success" },
  { id: "l13", time: "09:14:32", date: "2026-08-29", taskId: "TSK-0037", event: "Task received: Document Analysis", model: "FORGE Document", user: "admin@forge.local", status: "info" },
  { id: "l14", time: "09:14:45", date: "2026-08-29", taskId: "TSK-0037", event: "Error: Unsupported document format detected", model: "FORGE Document", user: "system", status: "failed" },
  { id: "l15", time: "15:22:11", date: "2026-08-28", taskId: "TSK-0035", event: "Visual inspection completed: Inspection_Note_Flange_07.docx", model: "FORGE Vision", user: "admin@forge.local", status: "success" },
  { id: "l16", time: "09:15:00", date: "2026-08-27", taskId: "TSK-0033", event: "Engineering report generated: Engineering_Report_Q3.xlsx", model: "FORGE Document", user: "admin@forge.local", status: "success" },
];

const STATUS_CONFIG = {
  success: { icon: CheckCircle2, color: "text-success", dot: "bg-success" },
  active: { icon: Loader2, color: "text-info", dot: "bg-info" },
  failed: { icon: XCircle, color: "text-destructive", dot: "bg-destructive" },
  info: { icon: Clock, color: "text-muted-foreground", dot: "bg-muted-foreground" },
};

function ActivityLogsRoute() {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) navigate({ to: "/signin" });
  }, [isLoading, isAuthenticated, navigate]);

  if (isLoading) return <div className="flex min-h-screen items-center justify-center bg-background"><Loader2 className="size-6 animate-spin text-primary" /></div>;
  if (!isAuthenticated) return null;

  return (
    <AppShell>
      <ActivityLogsPage />
    </AppShell>
  );
}

function ActivityLogsPage() {
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState<"today" | "week" | "all">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "success" | "active" | "failed">("all");

  const filtered = MOCK_LOGS.filter((l) => {
    const matchSearch = l.event.toLowerCase().includes(search.toLowerCase()) || l.taskId.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || l.status === statusFilter;
    const matchDate = dateFilter === "all" ||
      (dateFilter === "today" && l.date === "2026-08-29") ||
      (dateFilter === "week" && l.date >= "2026-08-23");
    return matchSearch && matchStatus && matchDate;
  });

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-8 space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <ScrollText className="size-6 text-primary" />
          Activity Logs
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Full audit trail of every action FORGE takes. Every step is recorded and traceable.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 flex-1 min-w-[200px]">
          <Search className="size-4 shrink-0 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search events or task IDs..."
            className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="size-4 text-muted-foreground" />
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value as "today" | "week" | "all")}
            className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none"
          >
            <option value="all">All time</option>
            <option value="today">Today</option>
            <option value="week">This week</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
            className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none"
          >
            <option value="all">All events</option>
            <option value="success">Success</option>
            <option value="active">Active</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      <p className="text-sm text-muted-foreground">{filtered.length} events</p>

      {/* Log Table */}
      <div className="rounded-xl border border-border bg-card/70 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-surface/50">
            <tr>
              <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
              <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Event</th>
              <th className="hidden px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground sm:table-cell">Task ID</th>
              <th className="hidden px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground md:table-cell">Model</th>
              <th className="hidden px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground lg:table-cell">User</th>
              <th className="px-4 py-3 text-right text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map((log) => {
              const cfg = STATUS_CONFIG[log.status];
              const StatusIcon = cfg.icon;
              return (
                <tr key={log.id} className="transition-colors hover:bg-surface/40">
                  <td className="px-4 py-3">
                    <StatusIcon className={cn("size-3.5", cfg.color, log.status === "active" && "animate-spin")} />
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-[13px] text-foreground/90">{log.event}</p>
                  </td>
                  <td className="hidden px-4 py-3 sm:table-cell">
                    <span className="font-mono text-[12px] text-muted-foreground">{log.taskId}</span>
                  </td>
                  <td className="hidden px-4 py-3 text-[12px] text-muted-foreground md:table-cell">{log.model}</td>
                  <td className="hidden px-4 py-3 text-[11px] font-mono text-muted-foreground/80 lg:table-cell">{log.user}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="text-[11px] font-mono text-muted-foreground">
                      <div>{log.time}</div>
                      <div className="text-[10px] text-muted-foreground/60">{log.date}</div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="py-12 text-center text-muted-foreground">
            <ScrollText className="mx-auto size-8 mb-3 opacity-40" />
            <p className="text-sm">No log entries match your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
