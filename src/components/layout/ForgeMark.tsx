import { cn } from "@/lib/utils";

export function ForgeMark({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "grid size-9 shrink-0 place-items-center rounded-md border border-primary/30 bg-primary/10",
        className,
      )}
      aria-hidden
    >
      <svg viewBox="0 0 24 24" className="size-5" fill="none">
        <path
          d="M12 2.5 20 7v10l-8 4.5L4 17V7l8-4.5Z"
          stroke="var(--primary)"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
        <path
          d="M9 8.5h6M9 12h4.5M9 15.5h3"
          stroke="var(--primary)"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
