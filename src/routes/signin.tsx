import { useState, useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AuthForm } from "@/components/ui/sign-in";
import { useAuth } from "@/lib/auth";
import { Toaster, toast } from "sonner";

export const Route = createFileRoute("/signin")({
  head: () => ({
    meta: [
      { title: "Sign In — FORGE Sovereign AI Workbench" },
      {
        name: "description",
        content:
          "Secure corporate authentication gateway for FORGE Sovereign AI Workbench. Private intelligence, local execution, full control.",
      },
    ],
  }),
  component: SignInPage,
});

function SignInPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      navigate({ to: "/dashboard" });
    }
  }, [isAuthenticated, navigate]);

  const handleEmailSubmit = async (data: { email: string; password?: string }) => {
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const success = await login(data.email, data.password);
      if (success) {
        toast.success("Authentication successful", {
          description: "Entering secure FORGE Sovereign AI Workbench...",
        });
        navigate({ to: "/dashboard" });
      } else {
        setErrorMessage("Authentication failed. Please verify credentials.");
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("System authorization error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSocialSignIn = (provider: string) => {
    handleEmailSubmit({ email: "sso-user@organization.gov", password: "sso" });
  };

  return (
    <div className="min-h-screen w-full bg-[#F8F9FA] text-slate-900 selection:bg-amber-100 selection:text-amber-900 font-sans antialiased flex flex-col justify-between dark:bg-slate-950 dark:text-slate-100">
      <Toaster position="top-right" />

      {/* Minimal Header */}
      <header className="px-6 py-6 border-b border-slate-200/60 dark:border-slate-800/60">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <span className="font-display text-sm font-bold tracking-[0.25em] text-slate-900 dark:text-white uppercase">
            FORGE
          </span>
          <span className="text-[11px] font-mono text-slate-500 uppercase tracking-widest">
            Internal Access Portal
          </span>
        </div>
      </header>

      {/* Main Form Centered */}
      <main className="mx-auto flex w-full max-w-md flex-1 items-center justify-center p-6">
        <div className="w-full">
          <AuthForm
            onEmailSubmit={handleEmailSubmit}
            onSocialSignIn={handleSocialSignIn}
            isLoading={isSubmitting}
            error={errorMessage}
          />
        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="py-4 text-center text-[11px] font-mono text-slate-500 dark:text-slate-400">
        Protected workspace · Local deployment
      </footer>
    </div>
  );
}
