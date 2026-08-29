import { useState, useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AuthForm } from "@/components/ui/sign-in";
import { useAuth } from "@/lib/auth";
import { ForgeMark } from "@/components/layout/ForgeMark";
import { FileText, Cpu, CheckCircle2, Shield, Server, Lock } from "lucide-react";
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
      navigate({ to: "/chat" });
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
        navigate({ to: "/chat" });
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

      {/* Top Corporate Navigation Bar */}
      <header className="border-b border-slate-200/80 bg-white/80 px-6 py-4 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <ForgeMark className="size-7" />
            <div className="flex flex-col">
              <span className="font-display text-base font-bold tracking-[0.2em] text-slate-900 dark:text-white">
                FORGE
              </span>
              <span className="text-[10px] font-medium tracking-wider text-slate-500 uppercase dark:text-slate-400">
                Sovereign AI Workbench
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-400">
            <span className="hidden items-center gap-1.5 rounded-full border border-slate-200 bg-slate-100 px-2.5 py-1 sm:flex dark:border-slate-800 dark:bg-slate-800">
              <Server className="size-3 text-amber-600 dark:text-amber-400" />
              On-Premises Gateway
            </span>
            <span className="flex items-center gap-1.5 font-medium text-emerald-700 dark:text-emerald-400">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              System Active
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="mx-auto flex w-full max-w-7xl flex-1 items-center justify-center p-6 lg:p-12">
        <div className="grid w-full grid-cols-1 items-center gap-12 lg:grid-cols-12">
          
          {/* LEFT COLUMN / DESKTOP SIDE VISUAL (Hidden on mobile) */}
          <div className="hidden space-y-8 lg:col-span-7 lg:block lg:pr-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-50/80 px-3 py-1 text-xs font-semibold tracking-wide text-amber-800 dark:border-amber-500/30 dark:bg-amber-950/40 dark:text-amber-300">
              <Shield className="size-3.5" />
              ENTERPRISE SOVEREIGN INTELLIGENCE
            </div>

            <div className="space-y-4">
              <h1 className="font-display text-4xl font-extrabold tracking-tight text-slate-900 lg:text-5xl dark:text-white">
                FORGE
              </h1>
              <p className="text-xl font-medium text-slate-700 dark:text-slate-300">
                Sovereign AI for sensitive work
              </p>
              <p className="max-w-xl text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                Secure access to your organization's AI workspace. Designed for confidential industrial, government, PSU, and defence-related AI tasks.
              </p>
            </div>

            {/* Minimal Architecture Flow Graphic */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                SOVEREIGN EXECUTION FLOW
              </div>
              <div className="grid grid-cols-3 items-center gap-3 text-center">
                <div className="flex flex-col items-center gap-2 rounded-lg border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800/60">
                  <div className="grid size-9 place-items-center rounded-md bg-white text-slate-700 shadow-xs dark:bg-slate-700 dark:text-slate-200">
                    <FileText className="size-4" />
                  </div>
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">Documents</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">Isolated Intake</span>
                </div>

                <div className="flex flex-col items-center gap-1">
                  <div className="h-0.5 w-full bg-gradient-to-r from-slate-200 via-amber-500 to-slate-200 dark:from-slate-800 dark:via-amber-500 dark:to-slate-800" />
                  <div className="grid size-9 place-items-center rounded-md bg-amber-500 text-slate-950 font-bold shadow-xs">
                    <Cpu className="size-4" />
                  </div>
                  <span className="text-xs font-bold text-amber-700 dark:text-amber-400">AI Workbench</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">Routed Reasoning</span>
                </div>

                <div className="flex flex-col items-center gap-2 rounded-lg border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800/60">
                  <div className="grid size-9 place-items-center rounded-md bg-white text-emerald-700 shadow-xs dark:bg-slate-700 dark:text-emerald-400">
                    <CheckCircle2 className="size-4" />
                  </div>
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">Verified Output</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">Audit Ready</span>
                </div>
              </div>
            </div>

            {/* Security Indicators Panel */}
            <div className="rounded-xl border border-slate-200/80 bg-slate-100/60 p-5 dark:border-slate-800 dark:bg-slate-900/60">
              <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Security & Compliance Controls
              </div>
              <div className="space-y-2 text-xs font-medium text-slate-700 dark:text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400" />
                  <span>On-premises deployment</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Organization-controlled data</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Secure workspace</span>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Private intelligence. Local execution. Full control.
            </p>
          </div>

          {/* RIGHT COLUMN / AUTH FORM CARD */}
          <div className="flex justify-center lg:col-span-5">
            <AuthForm
              onEmailSubmit={handleEmailSubmit}
              onSocialSignIn={handleSocialSignIn}
              isLoading={isSubmitting}
              error={errorMessage}
            />
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 bg-white/60 px-6 py-4 text-center text-xs text-slate-500 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/60 dark:text-slate-400">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 sm:flex-row">
          <span>
            FORGE Sovereign AI Workbench — Enterprise Portal
          </span>
          <span className="flex items-center gap-1.5 text-[11px]">
            <Lock className="size-3 text-slate-400" />
            Authorized Internal Use Only
          </span>
        </div>
      </footer>
    </div>
  );
}
