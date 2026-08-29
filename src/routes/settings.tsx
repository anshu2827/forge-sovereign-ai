import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { AppShell } from "@/components/layout/AppShell";
import {
  Settings,
  User,
  Building2,
  Shield,
  HardDrive,
  Cpu,
  LogOut,
  ChevronRight,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings — FORGE" }] }),
  component: SettingsRoute,
});

function SettingsRoute() {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) navigate({ to: "/signin" });
  }, [isLoading, isAuthenticated, navigate]);

  if (isLoading) return <div className="flex min-h-screen items-center justify-center bg-background"><Loader2 className="size-6 animate-spin text-primary" /></div>;
  if (!isAuthenticated) return null;

  return (
    <AppShell>
      <SettingsPage />
    </AppShell>
  );
}

function Section({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-card/70 overflow-hidden">
      <div className="flex items-center gap-2.5 border-b border-border bg-surface/50 px-5 py-4">
        <Icon className="size-4 text-primary" />
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
      </div>
      <div className="divide-y divide-border">{children}</div>
    </div>
  );
}

function SettingRow({ label, description, children }: { label: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 px-5 py-4">
      <div className="min-w-0">
        <p className="text-sm font-medium text-foreground">{label}</p>
        {description && <p className="mt-0.5 text-[12px] text-muted-foreground">{description}</p>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

function Toggle({ defaultChecked = false }: { defaultChecked?: boolean }) {
  const [checked, setChecked] = useState(defaultChecked);
  return (
    <button
      onClick={() => setChecked((v) => !v)}
      className={cn(
        "relative inline-flex h-5 w-9 shrink-0 rounded-full border-2 border-transparent transition-colors focus:outline-none",
        checked ? "bg-primary" : "bg-border-strong"
      )}
    >
      <span
        className={cn(
          "pointer-events-none inline-block size-4 rounded-full bg-white shadow-lg transition-transform",
          checked ? "translate-x-4" : "translate-x-0"
        )}
      />
    </button>
  );
}

function Select({ options, defaultValue }: { options: string[]; defaultValue: string }) {
  const [value, setValue] = useState(defaultValue);
  return (
    <select
      value={value}
      onChange={(e) => setValue(e.target.value)}
      className="rounded-lg border border-border bg-surface px-3 py-1.5 text-sm text-foreground outline-none"
    >
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}

function SettingsPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleLogout = () => {
    logout();
    navigate({ to: "/signin" });
  };

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-8 space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Settings className="size-6 text-primary" />
            Settings
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">Workspace configuration and preferences.</p>
        </div>
        <button
          onClick={handleSave}
          className={cn(
            "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all",
            saved
              ? "border border-success/30 bg-success/10 text-success"
              : "bg-primary text-primary-foreground hover:opacity-90"
          )}
        >
          {saved ? <><CheckCircle2 className="size-4" /> Saved</> : "Save changes"}
        </button>
      </div>

      {/* Workspace */}
      <Section title="Workspace" icon={Building2}>
        <SettingRow label="Workspace Name" description="Display name for this FORGE instance">
          <input defaultValue="FORGE Sovereign AI" className="rounded-lg border border-border bg-surface px-3 py-1.5 text-sm text-foreground outline-none w-48 focus:border-primary/40" />
        </SettingRow>
        <SettingRow label="Organization" description="Organization or department name">
          <input defaultValue={user?.organization ?? "Your Organization"} className="rounded-lg border border-border bg-surface px-3 py-1.5 text-sm text-foreground outline-none w-48 focus:border-primary/40" />
        </SettingRow>
        <SettingRow label="Deployment Region" description="Physical location of local deployment">
          <Select options={["On-Premises — Primary", "On-Premises — DR", "Air-Gapped"]} defaultValue="On-Premises — Primary" />
        </SettingRow>
      </Section>

      {/* AI Configuration */}
      <Section title="AI Configuration" icon={Cpu}>
        <SettingRow label="Default Model" description="Model selected when starting a new conversation">
          <Select options={["FORGE Document", "FORGE Text", "FORGE Vision"]} defaultValue="FORGE Document" />
        </SettingRow>
        <SettingRow label="Default Effort Level" description="Reasoning depth for new tasks">
          <Select options={["Low", "Medium", "High", "Max"]} defaultValue="High" />
        </SettingRow>
        <SettingRow label="Auto-classify tasks" description="Automatically route tasks to the best model">
          <Toggle defaultChecked={true} />
        </SettingRow>
        <SettingRow label="Show model routing details" description="Display routing card in chat responses">
          <Toggle defaultChecked={true} />
        </SettingRow>
      </Section>

      {/* Privacy */}
      <Section title="Privacy & Security" icon={Shield}>
        <SettingRow label="Data stays on-premises" description="All processing happens locally — no external API calls">
          <div className="flex items-center gap-1.5 text-[12px] font-medium text-success">
            <CheckCircle2 className="size-3.5" />
            Always on
          </div>
        </SettingRow>
        <SettingRow label="Audit logging" description="Record all agent actions for compliance and traceability">
          <Toggle defaultChecked={true} />
        </SettingRow>
        <SettingRow label="Audit log retention" description="How long to retain activity logs">
          <Select options={["30 days", "90 days", "1 year", "Indefinite"]} defaultValue="90 days" />
        </SettingRow>
        <SettingRow label="Session persistence" description="Keep session active between browser restarts">
          <Toggle defaultChecked={true} />
        </SettingRow>
      </Section>

      {/* Storage */}
      <Section title="Local Storage" icon={HardDrive}>
        <SettingRow label="Total storage used" description="Across all documents and generated files">
          <div className="flex items-center gap-3">
            <div className="h-2 w-32 rounded-full bg-surface-2 overflow-hidden">
              <div className="h-full w-[21%] rounded-full bg-primary" />
            </div>
            <span className="text-[12px] text-muted-foreground">4.2 / 20 GB</span>
          </div>
        </SettingRow>
        <SettingRow label="Document library" description="Uploaded documents">
          <span className="text-sm text-muted-foreground">3.1 GB · 47 files</span>
        </SettingRow>
        <SettingRow label="Generated files" description="FORGE deliverables">
          <span className="text-sm text-muted-foreground">1.1 GB · 23 files</span>
        </SettingRow>
        <SettingRow label="Clear cache" description="Remove temporary processing files">
          <button className="rounded-lg border border-border px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:border-destructive/40 hover:text-destructive">
            Clear cache
          </button>
        </SettingRow>
      </Section>

      {/* Account */}
      <Section title="Account" icon={User}>
        <SettingRow label="Signed in as" description={user?.email ?? "—"}>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-success/20 bg-success/10 px-2.5 py-1 text-[11px] font-medium text-success">
            <CheckCircle2 className="size-3" />
            Active
          </span>
        </SettingRow>
        <SettingRow label="Role" description="Your access level in this workspace">
          <span className="text-sm text-muted-foreground">Analyst</span>
        </SettingRow>
        <SettingRow label="FORGE Version" description="Current build">
          <span className="font-mono text-sm text-muted-foreground">v0.9.0-prototype</span>
        </SettingRow>
        <SettingRow label="Sign out" description="End your current session">
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-1.5 text-sm font-medium text-destructive transition-colors hover:border-destructive/50 hover:bg-destructive/20"
          >
            <LogOut className="size-3.5" />
            Sign out
            <ChevronRight className="size-3" />
          </button>
        </SettingRow>
      </Section>
    </div>
  );
}
