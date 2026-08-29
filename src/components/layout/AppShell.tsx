import { useState, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { ForgeMark } from "@/components/layout/ForgeMark";
import { useAuth } from "@/lib/auth";
import { useNavigate } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  MessageSquare,
  FileText,
  BookOpen,
  ListChecks,
  PackageOpen,
  ScrollText,
  Settings,
  Plus,
  Menu,
  LogOut,
  User,
  Shield,
  ChevronRight,
} from "lucide-react";

interface NavItem {
  label: string;
  to: string;
  icon: React.ElementType;
}

const WORKSPACE_NAV: NavItem[] = [
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
  { label: "AI Workbench", to: "/chat", icon: MessageSquare },
  { label: "Documents", to: "/documents", icon: FileText },
  { label: "Knowledge Base", to: "/knowledge-base", icon: BookOpen },
];

const OPERATIONS_NAV: NavItem[] = [
  { label: "Tasks", to: "/tasks", icon: ListChecks },
  { label: "Generated Files", to: "/generated-files", icon: PackageOpen },
  { label: "Activity Logs", to: "/activity-logs", icon: ScrollText },
];

const SYSTEM_NAV: NavItem[] = [
  { label: "Settings", to: "/settings", icon: Settings },
];

function NavLink({ item, currentPath }: { item: NavItem; currentPath: string }) {
  const isActive = currentPath === item.to || currentPath.startsWith(item.to + "/");
  return (
    <Link
      to={item.to}
      className={cn(
        "group flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] transition-colors",
        isActive
          ? "bg-sidebar-accent border border-border-strong text-sidebar-foreground font-medium"
          : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-foreground border border-transparent"
      )}
    >
      <item.icon
        className={cn(
          "size-4 shrink-0 transition-colors",
          isActive ? "text-primary" : "text-muted-foreground group-hover:text-sidebar-foreground"
        )}
      />
      {item.label}
      {isActive && <ChevronRight className="ml-auto size-3 text-primary/60" />}
    </Link>
  );
}

function NavSection({ title, items, currentPath }: { title: string; items: NavItem[]; currentPath: string }) {
  return (
    <div className="space-y-0.5">
      <div className="px-2.5 pb-1.5 pt-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground/70">
        {title}
      </div>
      {items.map((item) => (
        <NavLink key={item.to} item={item} currentPath={currentPath} />
      ))}
    </div>
  );
}

function SidebarContent({ currentPath, onNewChat, onClose }: {
  currentPath: string;
  onNewChat: () => void;
  onClose?: () => void;
}) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate({ to: "/signin" });
  };

  return (
    <aside className="flex h-full w-full flex-col border-r border-border bg-sidebar">
      {/* Logo */}
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

      {/* New Chat Button */}
      <div className="px-3 pt-3">
        <Link
          to="/chat"
          onClick={() => {
            onNewChat();
            onClose?.();
          }}
          className="flex w-full items-center gap-2 rounded-lg border border-border-strong bg-surface-2 px-3 py-2 text-sm font-medium text-sidebar-foreground transition-colors hover:border-primary/40 hover:bg-surface"
        >
          <Plus className="size-4 text-primary" />
          New Chat
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 pb-3">
        <NavSection title="Workspace" items={WORKSPACE_NAV} currentPath={currentPath} />
        <NavSection title="Operations" items={OPERATIONS_NAV} currentPath={currentPath} />
        <NavSection title="System" items={SYSTEM_NAV} currentPath={currentPath} />
      </nav>

      {/* Sovereign Mode Indicator */}
      <div className="border-t border-sidebar-border p-3 space-y-2">
        <div className="flex items-center gap-2 rounded-lg border border-border bg-surface/70 px-3 py-2 text-xs">
          <span className="size-1.5 shrink-0 rounded-full bg-success animate-status-dot" />
          <span className="flex-1 font-medium text-foreground">Sovereign Mode</span>
          <Shield className="size-3.5 text-muted-foreground" />
        </div>

        {/* User + Sign Out */}
        {user && (
          <div className="flex items-center gap-2 px-1">
            <div className="flex min-w-0 flex-1 items-center gap-2">
              <div className="grid size-6 shrink-0 place-items-center rounded-md border border-border bg-surface">
                <User className="size-3.5 text-muted-foreground" />
              </div>
              <span className="truncate text-[11px] text-muted-foreground">{user.email}</span>
            </div>
            <button
              onClick={handleLogout}
              className="grid size-6 shrink-0 place-items-center rounded-md border border-border text-muted-foreground transition-colors hover:border-destructive/40 hover:text-destructive"
              title="Sign out"
            >
              <LogOut className="size-3" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}

interface AppShellProps {
  children: ReactNode;
  /** Called when "New Chat" is clicked — only relevant on /chat */
  onNewChat?: () => void;
}

export function AppShell({ children, onNewChat }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const handleNewChat = () => {
    setSidebarOpen(false);
    onNewChat?.();
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* Desktop sidebar */}
      <div className="hidden w-[260px] shrink-0 lg:block">
        <SidebarContent currentPath={currentPath} onNewChat={handleNewChat} />
      </div>

      {/* Mobile sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-[260px] border-border p-0">
          <SidebarContent
            currentPath={currentPath}
            onNewChat={handleNewChat}
            onClose={() => setSidebarOpen(false)}
          />
        </SheetContent>
      </Sheet>

      {/* Main content */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* Mobile top bar */}
        <div className="flex items-center gap-3 border-b border-border bg-background/80 px-4 py-3 backdrop-blur lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="grid size-8 place-items-center rounded-md border border-border text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Open navigation"
          >
            <Menu className="size-4" />
          </button>
          <div className="flex items-center gap-2">
            <ForgeMark className="size-7" />
            <span className="font-display text-sm font-semibold tracking-[0.2em]">FORGE</span>
          </div>
        </div>

        {/* Page content */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
