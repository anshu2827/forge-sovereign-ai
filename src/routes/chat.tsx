import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { ChatInterface } from "@/components/chat/ChatInterface";
import { Toaster } from "@/components/ui/sonner";
import { useAuth } from "@/lib/auth";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "FORGE — Sovereign AI Workbench" },
      {
        name: "description",
        content:
          "FORGE is a private, self-hosted AI workbench: it routes each task to the right model, performs multi-step work, verifies results and keeps an audit trail.",
      },
      { property: "og:title", content: "FORGE — Sovereign AI Workbench" },
      {
        property: "og:description",
        content:
          "Private intelligence. Local execution. Full control. A sovereign AI workbench for sensitive industrial and government work.",
      },
    ],
  }),
  component: ChatRoute,
});

function ChatRoute() {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate({ to: "/signin" });
    }
  }, [isLoading, isAuthenticated, navigate]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background text-foreground">
        <Loader2 className="size-8 animate-spin text-primary" />
        <p className="mt-4 font-mono text-xs text-muted-foreground uppercase tracking-widest">
          Verifying Sovereign Credentials...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <ChatInterface />
      <Toaster />
    </>
  );
}
