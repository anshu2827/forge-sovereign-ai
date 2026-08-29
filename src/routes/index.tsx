import { createFileRoute } from "@tanstack/react-router";
import { ChatInterface } from "@/components/chat/ChatInterface";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/")({
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
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <ChatInterface />
      <Toaster />
    </>
  );
}
