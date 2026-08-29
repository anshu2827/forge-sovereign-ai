import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { AppShell } from "@/components/layout/AppShell";
import {
  Cpu,
  FileText,
  ListChecks,
  ScrollText,
  ShieldCheck,
  MessageSquare,
  Upload,
  BookOpen,
  Circle,
  CheckCircle2,
  Clock,
  Loader2,
  Activity,
  Server,
  HardDrive,
  Zap,
} from "lucide-react";
import { Loader2 as LoaderIcon } from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [{ title: "Dashboard — FORGE Sovereign AI Workbench" }],
  }),
  component: DashboardRoute,
});

function DashboardRoute() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate({ to: "/signin" });
    }
  }, [isLoading, isAuthenticated, navigate]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <LoaderIcon className="size-6 animate-spin text-primary" />
      </div>
    );
  }
  if (!isAuthenticated) return null;

  return (
    <AppShell>
      <DashboardPage user={user} />
    </AppShell>
  );
}

const RECENT_ACTIVITY = [
  { time: "13:41:14", event: "Approval note generated", task: "Document Analysis", status: "done" },
  { time: "13:38:05", event: "SOP retrieved from Knowledge Base", task: "Document Analysis", status: "done" },
  { time: "13:21:42", event: "Visual inspection completed", task: "Visual Inspection", status: "done" },
  { time: "11:04:19", event: "Calculation sheet prepared", task: "Code & Computation", status: "done" },
  { time: "09:58:03", event: "Model selected: FORGE Document", task: "Document Analysis", status: "done" },
];

const QUICK_ACTIONS = [
  {
    label: "New Chat",
    description: "Start a new AI conversation",
    icon: MessageSquare,
    to: "/chat",
    accent: "text-primary bg-primary/10 border-primary/20",
  },
  {
    label: "Upload Document",
    description: "Add to document library",
    icon: Upload,
    to: "/documents",
    accent: "text-info bg-info/10 border-info/20",
  },
  {
    label: "Knowledge Base",
    description: "Browse SOPs & manuals",
    icon: BookOpen,
    to: "/knowledge-base",
    accent: "text-success bg-success/10 border-success/20",
  },
];

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  accent = "text-primary",
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ElementType;
  accent?: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card/70 p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
          <p className="mt-1 text-2xl font-bold tracking-tight text-foreground">{value}</p>
          {sub && <p className="mt-0.5 text-[11px] text-muted-foreground">{sub}</p>}
        </div>
        <div className={`grid size-9 place-items-center rounded-lg border ${accent} bg-current/10`} style={{ backgroundColor: "transparent" }}>
          <Icon className={`size-4.5 ${accent.split(" ")[0]}`} />
        </div>
      </div>
    </div>
  );
}

function DashboardPage({ user }: { user: { name: string; organization: string } | null }) {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-8 px-6 py-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
          <span className="size-1.5 rounded-full bg-success animate-status-dot" />
          System Active
        </div>
        <h1 className="mt-2 font-display text-2xl font-bold tracking-tight text-foreground">
          Welcome back{user?.name ? `, ${user.name}` : ""}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {user?.organization ?? "FORGE"} · Sovereign AI Workbench
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Local AI Status" value="Online" sub="All models ready" icon={Cpu} accent="text-success" />
        <StatCard label="Documents" value="47" sub="12 processed today" icon={FileText} accent="text-primary" />
        <StatCard label="Active Tasks" value="2" sub="1 running · 1 queued" icon={ListChecks} accent="text-info" />
        <StatCard label="Generated Files" value="23" sub="5 this week" icon={ScrollText} accent="text-success" />
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Quick Actions */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Quick Actions</h2>
          <div className="space-y-2">
            {QUICK_ACTIONS.map((a) => (
              <Link
                key={a.to}
                to={a.to}
                className="flex items-center gap-3 rounded-xl border border-border bg-card/70 p-4 transition-colors hover:border-primary/30 hover:bg-surface group"
              >
                <div className={`grid size-9 shrink-0 place-items-center rounded-lg border ${a.accent}`}>
                  <a.icon className={`size-4 ${a.accent.split(" ")[0]}`} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground">{a.label}</p>
                  <p className="text-[11px] text-muted-foreground">{a.description}</p>
                </div>
              </Link>
            ))}
          </div>

          {/* Environment Info */}
          <div className="rounded-xl border border-border bg-card/70 p-4 space-y-3">
            <h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Local Environment</h3>
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-muted-foreground"><Server className="size-3" /> Deployment</span>
                <span className="font-medium text-foreground">On-Premises</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-muted-foreground"><Cpu className="size-3" /> Active Model</span>
                <span className="font-medium text-foreground">FORGE Document</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-muted-foreground"><HardDrive className="size-3" /> Storage</span>
                <span className="font-medium text-foreground">4.2 GB / 20 GB</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-muted-foreground"><Zap className="size-3" /> External Calls</span>
                <span className="font-medium text-success">0</span>
              </div>
            </div>
          </div>

          {/* Privacy Status */}
          <div className="rounded-xl border border-success/20 bg-success/5 p-4 space-y-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-4 text-success" />
              <span className="text-sm font-medium text-foreground">Sovereign Mode Active</span>
            </div>
            <div className="space-y-1 text-[11px] text-muted-foreground">
              <div className="flex items-center gap-1.5"><CheckCircle2 className="size-3 text-success" /> Local model execution</div>
              <div className="flex items-center gap-1.5"><CheckCircle2 className="size-3 text-success" /> Organization-controlled data</div>
              <div className="flex items-center gap-1.5"><CheckCircle2 className="size-3 text-success" /> No external connections</div>
            </div>
          </div>
        </div>

        {/* Right: Activity + Tasks */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Tasks */}
          <div className="rounded-xl border border-border bg-card/70 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Active Tasks</h2>
              <Link to="/tasks" className="text-[11px] text-primary hover:underline">View all →</Link>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-3 rounded-lg border border-border bg-surface/50 px-3 py-2.5">
                <Loader2 className="size-4 animate-spin text-info" />
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-medium text-foreground truncate">Document Analysis — Valve_Inspection_Q3.pdf</p>
                  <p className="text-[11px] text-muted-foreground">Running · FORGE Document · Step 4/7</p>
                </div>
                <span className="shrink-0 rounded-full border border-info/30 bg-info/10 px-2 py-0.5 text-[10px] font-medium text-info uppercase">Running</span>
              </div>
              <div className="flex items-center gap-3 rounded-lg border border-border bg-surface/50 px-3 py-2.5">
                <Clock className="size-4 text-muted-foreground" />
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-medium text-foreground truncate">Visual Inspection — Flange_Photo_07.jpg</p>
                  <p className="text-[11px] text-muted-foreground">Queued · FORGE Vision</p>
                </div>
                <span className="shrink-0 rounded-full border border-border bg-surface px-2 py-0.5 text-[10px] font-medium text-muted-foreground uppercase">Queued</span>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="rounded-xl border border-border bg-card/70 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Activity className="size-3.5" /> Recent Activity
              </h2>
              <Link to="/activity-logs" className="text-[11px] text-primary hover:underline">View audit trail →</Link>
            </div>
            <div className="space-y-1.5">
              {RECENT_ACTIVITY.map((entry, i) => (
                <div key={i} className="flex items-start gap-3 rounded-lg px-1 py-1">
                  <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-success" />
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] text-foreground/90">{entry.event}</p>
                    <p className="text-[11px] text-muted-foreground">{entry.task}</p>
                  </div>
                  <span className="shrink-0 font-mono text-[10px] text-muted-foreground">{entry.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
