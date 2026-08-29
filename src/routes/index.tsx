import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FORGE — Sovereign AI Workbench" },
      {
        name: "description",
        content:
          "FORGE is a private, self-hosted AI workbench: it routes each task to the right model, performs multi-step work, verifies results and keeps an audit trail.",
      },
    ],
  }),
  component: IndexRoute,
});

function IndexRoute() {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        navigate({ to: "/dashboard" });
      } else {
        navigate({ to: "/signin" });
      }
    }
  }, [isLoading, isAuthenticated, navigate]);

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background text-foreground">
      <Loader2 className="size-8 animate-spin text-primary" />
      <p className="mt-4 font-mono text-xs text-muted-foreground uppercase tracking-widest">
        Initializing Sovereign Portal...
      </p>
    </div>
  );
}
