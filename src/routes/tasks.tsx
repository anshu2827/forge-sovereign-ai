import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { AppShell } from "@/components/layout/AppShell";
import {
  CheckCircle2,
  Clock,
  Loader2,
  XCircle,
  ChevronDown,
  ChevronRight,
  MessageSquare,
  FileText,
  Image as ImageIcon,
  Code2,
  ListChecks,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/tasks")({
  head: () => ({ meta: [{ title: "Tasks — FORGE" }] }),
  component: TasksRoute,
});

type TaskStatus = "Running" | "Completed" | "Failed" | "Queued";
type TaskType = "Document Analysis" | "Visual Inspection" | "Code & Computation" | "General Reasoning";

interface Task {
  id: string;
  type: TaskType;
  subject: string;
  status: TaskStatus;
  model: string;
  startedAt: string;
  progress: number;
  steps: { label: string; status: "done" | "active" | "pending" }[];
}

const MOCK_TASKS: Task[] = [
  {
    id: "TSK-0041", type: "Document Analysis", subject: "Valve_Inspection_Q3.pdf", status: "Running",
    model: "FORGE Document", startedAt: "17:31:04", progress: 57,
    steps: [
      { label: "Reading document", status: "done" },
      { label: "Processing pages", status: "done" },
      { label: "Searching knowledge base", status: "done" },
      { label: "Extracting findings", status: "active" },
      { label: "Verifying results", status: "pending" },
      { label: "Preparing deliverable", status: "pending" },
    ],
  },
  {
    id: "TSK-0040", type: "Visual Inspection", subject: "Flange_Photo_07.jpg", status: "Queued",
    model: "FORGE Vision", startedAt: "17:29:55", progress: 0,
    steps: [
      { label: "Loading image", status: "pending" },
      { label: "Running vision model", status: "pending" },
      { label: "Detecting anomalies", status: "pending" },
      { label: "Cross-checking SOP", status: "pending" },
      { label: "Preparing summary", status: "pending" },
    ],
  },
  {
    id: "TSK-0039", type: "Document Analysis", subject: "Pump_Inspection_Report_PMP402.pdf", status: "Completed",
    model: "FORGE Document", startedAt: "13:41:00", progress: 100,
    steps: [
      { label: "Reading inspection report", status: "done" },
      { label: "Processing scanned pages", status: "done" },
      { label: "Searching internal knowledge", status: "done" },
      { label: "Finding applicable SOP", status: "done" },
      { label: "Extracting findings", status: "done" },
      { label: "Verifying results", status: "done" },
      { label: "Preparing approval note", status: "done" },
    ],
  },
  {
    id: "TSK-0038", type: "Code & Computation", subject: "Pipe wall thickness — 12 bar", status: "Completed",
    model: "FORGE Text", startedAt: "11:02:17", progress: 100,
    steps: [
      { label: "Parsing request", status: "done" },
      { label: "Retrieving engineering standards", status: "done" },
      { label: "Drafting computation", status: "done" },
      { label: "Running verification", status: "done" },
      { label: "Preparing deliverable", status: "done" },
    ],
  },
  {
    id: "TSK-0037", type: "Document Analysis", subject: "Safety_Procedures_Manual.docx", status: "Failed",
    model: "FORGE Document", startedAt: "09:14:32", progress: 33,
    steps: [
      { label: "Reading document", status: "done" },
      { label: "Processing pages", status: "done" },
      { label: "Searching knowledge base", status: "pending" },
    ],
  },
];

const STATUS_CONFIG: Record<TaskStatus, { icon: React.ElementType; color: string; bg: string }> = {
  Running: { icon: Loader2, color: "text-info", bg: "border-info/20 bg-info/10" },
  Completed: { icon: CheckCircle2, color: "text-success", bg: "border-success/20 bg-success/10" },
  Failed: { icon: XCircle, color: "text-destructive", bg: "border-destructive/20 bg-destructive/10" },
  Queued: { icon: Clock, color: "text-muted-foreground", bg: "border-border bg-surface" },
};

const TYPE_ICONS: Record<TaskType, React.ElementType> = {
  "Document Analysis": FileText,
  "Visual Inspection": ImageIcon,
  "Code & Computation": Code2,
  "General Reasoning": MessageSquare,
};

function TasksRoute() {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) navigate({ to: "/signin" });
  }, [isLoading, isAuthenticated, navigate]);

  if (isLoading) return <div className="flex min-h-screen items-center justify-center bg-background"><Loader2 className="size-6 animate-spin text-primary" /></div>;
  if (!isAuthenticated) return null;

  return (
    <AppShell>
      <TasksPage />
    </AppShell>
  );
}

function TaskRow({ task }: { task: Task }) {
  const [expanded, setExpanded] = useState(false);
  const StatusIcon = STATUS_CONFIG[task.status].icon;
  const TypeIcon = TYPE_ICONS[task.type];

  return (
    <>
      <tr
        className="cursor-pointer transition-colors hover:bg-surface/40"
        onClick={() => setExpanded((v) => !v)}
      >
        <td className="px-4 py-3">
          <div className="flex items-center gap-2">
            {expanded ? <ChevronDown className="size-3.5 text-muted-foreground" /> : <ChevronRight className="size-3.5 text-muted-foreground" />}
            <span className="font-mono text-[12px] text-muted-foreground">{task.id}</span>
          </div>
        </td>
        <td className="px-4 py-3">
          <div className="flex items-center gap-2">
            <TypeIcon className="size-3.5 shrink-0 text-muted-foreground" />
            <div className="min-w-0">
              <p className="text-[13px] font-medium text-foreground">{task.type}</p>
              <p className="truncate text-[11px] text-muted-foreground max-w-[200px]">{task.subject}</p>
            </div>
          </div>
        </td>
        <td className="hidden px-4 py-3 md:table-cell">
          <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium", STATUS_CONFIG[task.status].bg, STATUS_CONFIG[task.status].color)}>
            <StatusIcon className={cn("size-3", task.status === "Running" && "animate-spin")} />
            {task.status}
          </span>
        </td>
        <td className="hidden px-4 py-3 lg:table-cell">
          {task.status === "Running" && (
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-24 rounded-full bg-surface-2 overflow-hidden">
                <div className="h-full rounded-full bg-info transition-all" style={{ width: `${task.progress}%` }} />
              </div>
              <span className="text-[11px] text-muted-foreground">{task.progress}%</span>
            </div>
          )}
          {task.status === "Completed" && <span className="text-[12px] text-success">100%</span>}
          {task.status !== "Running" && task.status !== "Completed" && <span className="text-[12px] text-muted-foreground">—</span>}
        </td>
        <td className="hidden px-4 py-3 text-[12px] text-muted-foreground sm:table-cell">{task.model}</td>
        <td className="hidden px-4 py-3 text-[12px] font-mono text-muted-foreground lg:table-cell">{task.startedAt}</td>
        <td className="px-4 py-3">
          <Link
            to="/chat"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1 text-[11px] text-primary hover:underline"
          >
            <MessageSquare className="size-3" />
            Workbench
          </Link>
        </td>
      </tr>
      {expanded && (
        <tr>
          <td colSpan={7} className="bg-surface/30 px-4 py-3">
            <div className="ml-8 space-y-1.5">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Agent Steps</p>
              {task.steps.map((step, i) => (
                <div key={i} className="flex items-center gap-2.5 text-[12px]">
                  {step.status === "done" && <CheckCircle2 className="size-3.5 text-success" />}
                  {step.status === "active" && <Loader2 className="size-3.5 animate-spin text-info" />}
                  {step.status === "pending" && <div className="size-3.5 rounded-full border border-border" />}
                  <span className={step.status === "pending" ? "text-muted-foreground" : "text-foreground"}>{step.label}</span>
                </div>
              ))}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

function TasksPage() {
  const [statusFilter, setStatusFilter] = useState<TaskStatus | "all">("all");

  const filtered = MOCK_TASKS.filter((t) => statusFilter === "all" || t.status === statusFilter);

  const counts = {
    all: MOCK_TASKS.length,
    Running: MOCK_TASKS.filter(t => t.status === "Running").length,
    Queued: MOCK_TASKS.filter(t => t.status === "Queued").length,
    Completed: MOCK_TASKS.filter(t => t.status === "Completed").length,
    Failed: MOCK_TASKS.filter(t => t.status === "Failed").length,
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-8 space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <ListChecks className="size-6 text-primary" />
          Tasks
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">Monitor and manage AI task execution across your workspace.</p>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-1.5">
        {(["all", "Running", "Queued", "Completed", "Failed"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={cn(
              "rounded-full border px-3 py-1 text-[12px] font-medium transition-colors",
              statusFilter === s
                ? "border-primary/40 bg-primary/15 text-primary"
                : "border-border text-muted-foreground hover:border-primary/20 hover:text-foreground"
            )}
          >
            {s === "all" ? "All" : s} <span className="ml-1 font-mono text-[11px]">{counts[s]}</span>
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-card/70 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-surface/50">
            <tr>
              <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Task ID</th>
              <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Type / Subject</th>
              <th className="hidden px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground md:table-cell">Status</th>
              <th className="hidden px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground lg:table-cell">Progress</th>
              <th className="hidden px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground sm:table-cell">Model</th>
              <th className="hidden px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground lg:table-cell">Started</th>
              <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">View</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map((task) => <TaskRow key={task.id} task={task} />)}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="py-12 text-center text-muted-foreground">
            <ListChecks className="mx-auto size-8 mb-3 opacity-40" />
            <p className="text-sm">No tasks with this status.</p>
          </div>
        )}
      </div>
    </div>
  );
}
