import React, { useState } from "react";
import { Lock, Eye, EyeOff, Loader2, Building2, ShieldCheck, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { ForgeMark } from "@/components/layout/ForgeMark";

export interface AuthFormProps {
  onSocialSignIn?: (provider: string) => void;
  onEmailSubmit?: (data: { email: string; password?: string }) => void;
  onEmailLink?: () => void;
  className?: string;
  isLoading?: boolean;
  error?: string;
}

export function AuthForm({
  onSocialSignIn,
  onEmailSubmit,
  className,
  isLoading = false,
  error: externalError,
}: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError("");

    if (!email.trim()) {
      setValidationError("Please enter your organization work email.");
      return;
    }
    if (!email.includes("@")) {
      setValidationError("Please enter a valid work email address.");
      return;
    }
    if (!password) {
      setValidationError("Please enter your password.");
      return;
    }

    if (onEmailSubmit) {
      onEmailSubmit({ email, password });
    }
  };

  const handleSSOClick = () => {
    if (onSocialSignIn) {
      onSocialSignIn("Organization SSO");
    } else if (onEmailSubmit && email) {
      onEmailSubmit({ email, password: "sso-authenticated" });
    }
  };

  const errorMessage = validationError || externalError;

  return (
    <div
      className={cn(
        "w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/50 transition-all dark:border-slate-800 dark:bg-slate-900 dark:shadow-none",
        className
      )}
    >
      {/* Top Organization Access Badge */}
      <div className="mb-6 flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-100/80 px-3 py-1 text-[11px] font-semibold tracking-wider text-slate-700 uppercase dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300">
          <Lock className="size-3 text-amber-600 dark:text-amber-400" />
          AUTHORIZED PERSONNEL
        </span>
        <span className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
          <ShieldCheck className="size-3.5 text-emerald-600 dark:text-emerald-400" />
          Secure SSO
        </span>
      </div>

      {/* Header */}
      <div className="mb-8 space-y-2">
        <div className="flex items-center gap-3">
          <ForgeMark className="size-8" />
          <span className="font-display text-xl font-bold tracking-[0.18em] text-slate-900 dark:text-white">
            FORGE
          </span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Welcome back
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Sign in to your secure AI workspace
        </p>
      </div>

      {/* Error display */}
      {errorMessage && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-3.5 text-xs text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
          {errorMessage}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-1.5">
          <label
            htmlFor="work-email"
            className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300"
          >
            Work email
          </label>
          <div className="relative">
            <input
              id="work-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@organization.gov"
              disabled={isLoading}
              className="w-full rounded-lg border border-slate-300 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-900 transition-colors focus:border-amber-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-600/20 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-amber-500"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label
              htmlFor="password"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300"
            >
              Password
            </label>
            <span className="text-xs text-slate-500 hover:text-slate-700 dark:text-slate-400">
              Encrypted auth
            </span>
          </div>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              disabled={isLoading}
              className="w-full rounded-lg border border-slate-300 bg-slate-50/50 px-3.5 py-2.5 pr-10 text-sm text-slate-900 transition-colors focus:border-amber-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-600/20 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-amber-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="group flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 py-3 text-sm font-semibold text-white transition-all hover:bg-slate-800 active:scale-[0.99] disabled:opacity-70 dark:bg-amber-600 dark:hover:bg-amber-500 dark:text-slate-950"
        >
          {isLoading ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Authenticating session...
            </>
          ) : (
            <>
              Sign in securely
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </>
          )}
        </button>
      </form>

      {/* SSO Option */}
      <div className="mt-6 space-y-4">
        <div className="relative flex items-center justify-center">
          <div className="w-full border-t border-slate-200 dark:border-slate-800" />
          <span className="absolute bg-white px-2 text-[11px] font-medium uppercase tracking-wider text-slate-400 dark:bg-slate-900 dark:text-slate-500">
            Or
          </span>
        </div>

        <button
          type="button"
          onClick={handleSSOClick}
          disabled={isLoading}
          className="flex w-full items-center justify-center gap-2.5 rounded-lg border border-slate-300 bg-white py-2.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700/50"
        >
          <Building2 className="size-4 text-slate-500" />
          Sign in with Organization SSO
        </button>
      </div>

      {/* Footer Notice */}
      <div className="mt-8 border-t border-slate-100 pt-4 text-center text-xs text-slate-500 dark:border-slate-800/80 dark:text-slate-400">
        <p className="flex items-center justify-center gap-1.5 font-medium">
          <Lock className="size-3 text-slate-400" />
          Protected workspace · Local deployment
        </p>
      </div>
    </div>
  );
}
