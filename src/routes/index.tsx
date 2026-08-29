import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { ScrambledText } from "@/components/ui/ScrambledText";
import { ArrowRight, Lock, Shield, Server } from "lucide-react";
import { ForgeMark } from "@/components/layout/ForgeMark";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FORGE — Sovereign AI Workbench" },
      {
        name: "description",
        content:
          "Sovereign Agentic AI Workbench for Confidential Industrial Intelligence.",
      },
    ],
  }),
  component: LandingRoute,
});

function LandingRoute() {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [titleDone, setTitleDone] = useState(false);

  // If user is already logged in, redirect them to dashboard
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate({ to: "/dashboard" });
    }
  }, [isLoading, isAuthenticated, navigate]);

  if (isLoading) {
    return null;
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col justify-between bg-[#0B0C0E] text-slate-100 selection:bg-amber-500/20 selection:text-amber-200 font-sans antialiased overflow-hidden">
      
      {/* Subtle Radial Ambient Lighting */}
      <div 
        aria-hidden 
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-[600px] rounded-full bg-gradient-radial from-amber-500/5 via-slate-900/0 to-transparent blur-3xl opacity-60"
      />

      {/* Top Header Bar (Subtle & Minimal) */}
      <header className="relative z-10 flex items-center justify-between px-6 py-6 lg:px-12">
        <div className="flex items-center gap-3">
          <ForgeMark className="size-6 border-slate-800 bg-slate-900/60 text-slate-300" />
          <span className="font-mono text-xs font-semibold tracking-[0.25em] text-slate-400 uppercase">
            FORGE
          </span>
        </div>
        <div className="flex items-center gap-2 text-[11px] font-mono tracking-wider text-slate-500 uppercase">
          <span className="size-1.5 rounded-full bg-emerald-500/80 animate-pulse" />
          Gateway Standby
        </div>
      </header>

      {/* Main Hero Section (Centered) */}
      <main className="relative z-10 mx-auto flex w-full max-w-4xl flex-1 flex-col items-center justify-center px-6 text-center">
        
        {/* Main Title: FORGE */}
        <h1 className="font-display text-6xl font-black tracking-[0.3em] text-white sm:text-7xl md:text-8xl lg:text-9xl uppercase select-none">
          <ScrambledText
            duration={1.4}
            speed={0.4}
            delay={0.2}
            scrambleChars="ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&"
            onComplete={() => setTitleDone(true)}
          >
            FORGE
          </ScrambledText>
        </h1>

        {/* Subtitle */}
        <div className="mt-6 min-h-[3.5rem] max-w-2xl px-4 sm:mt-8">
          <p className="font-sans text-sm font-medium tracking-wide text-slate-400 sm:text-base md:text-lg leading-relaxed">
            <ScrambledText
              duration={1.2}
              speed={0.3}
              delay={1.2}
              scrambleChars="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
            >
              Sovereign Agentic AI Workbench for Confidential Industrial Intelligence
            </ScrambledText>
          </p>
        </div>

        {/* Action CTA Button */}
        <div className="mt-10 sm:mt-12">
          <Link
            to="/signin"
            className="group relative inline-flex items-center gap-3 rounded-lg border border-slate-700/60 bg-slate-900/80 px-7 py-3.5 text-sm font-semibold tracking-wider text-slate-100 backdrop-blur-md transition-all duration-300 hover:border-amber-500/50 hover:bg-slate-800 hover:text-white shadow-lg shadow-black/40"
          >
            <span>ENTER WORKSPACE</span>
            <ArrowRight className="size-4 text-amber-500/90 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </main>

      {/* Bottom Sovereign Status Bar */}
      <footer className="relative z-10 flex items-center justify-center border-t border-slate-900/60 py-5 text-[11px] font-mono tracking-[0.2em] text-slate-500 uppercase">
        <span className="flex items-center gap-2">
          <span>SOVEREIGN MODE</span>
          <span className="text-slate-700">•</span>
          <span>ON-PREMISES</span>
        </span>
      </footer>

    </div>
  );
}
