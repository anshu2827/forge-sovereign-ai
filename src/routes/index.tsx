import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { ScrambledText } from "@/components/ui/ScrambledText";
import { ArrowRight } from "lucide-react";

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
      
      {/* Extremely subtle ambient lighting */}
      <div 
        aria-hidden 
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-[500px] rounded-full bg-gradient-radial from-slate-800/20 via-transparent to-transparent blur-3xl opacity-40"
      />

      <div className="h-12" />

      {/* Main Hero Section (Centered) */}
      <main className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center px-6 text-center">
        
        {/* Main Title: FORGE with tuned cinematic smooth ScrambledText */}
        <h1 className="font-display text-7xl font-black tracking-[0.25em] text-white sm:text-8xl md:text-9xl lg:text-[11rem] uppercase select-none leading-none">
          <ScrambledText
            radius={100}
            duration={2.5}
            speed={0.15}
            scrambleChars="xx"
          >
            FORGE
          </ScrambledText>
        </h1>

        {/* Subtitle with tuned subtle cinematic ScrambledText */}
        <div className="mt-8 max-w-3xl px-4 sm:mt-10">
          <p className="font-sans text-base font-medium tracking-wide text-slate-400 sm:text-lg md:text-xl leading-relaxed select-none">
            <ScrambledText
              radius={80}
              duration={2.8}
              speed={0.12}
              scrambleChars="xx"
            >
              Sovereign Agentic AI Workbench for Confidential Industrial Intelligence
            </ScrambledText>
          </p>
        </div>

        {/* Enter Workspace Button */}
        <div className="mt-12 sm:mt-16">
          <Link
            to="/signin"
            className="group relative inline-flex items-center gap-3 rounded-md border border-slate-700/60 bg-slate-900/60 px-8 py-3.5 text-sm font-semibold tracking-wider text-slate-200 backdrop-blur-md transition-all duration-300 hover:border-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <span>ENTER WORKSPACE</span>
            <ArrowRight className="size-4 text-slate-400 transition-transform duration-300 group-hover:translate-x-1.5 group-hover:text-white" />
          </Link>
        </div>
      </main>

      {/* Understated Status Footer */}
      <footer className="relative z-10 flex items-center justify-center py-6 text-[10px] font-mono tracking-[0.25em] text-slate-600 uppercase">
        <span>SOVEREIGN MODE</span>
        <span className="mx-3 text-slate-700">•</span>
        <span>ON-PREMISES</span>
      </footer>

    </div>
  );
}
