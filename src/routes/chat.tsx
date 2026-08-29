import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { useAuth } from "@/lib/auth";
import { AppShell } from "@/components/layout/AppShell";
import { ChatInterface } from "@/components/chat/ChatInterface";
import { Toaster } from "@/components/ui/sonner";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "AI Workbench — FORGE Sovereign AI" },
      {
        name: "description",
        content:
          "FORGE AI Workbench: private, local AI that routes tasks to the right model, processes documents, and keeps a full audit trail.",
      },
    ],
  }),
  component: ChatRoute,
});

function ChatRoute() {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const newChatRef = useRef<(() => void) | null>(null);

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
          Loading Workbench...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const handleNewChat = () => {
    newChatRef.current?.();
  };

  return (
    <>
      <AppShell onNewChat={handleNewChat}>
        <ChatInterface onNewChatRef={newChatRef} />
      </AppShell>
      <Toaster />
    </>
  );
}
