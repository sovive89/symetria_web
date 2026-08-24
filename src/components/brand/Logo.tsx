import { cn } from "@/lib/utils";

export function SymetraMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
      className={cn("h-8 w-8", className)}
    >
      <defs>
        <linearGradient id="symetra-mark" x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor="currentColor" stopOpacity="0.95" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0.6" />
        </linearGradient>
      </defs>
      <path
        d="M7 6c9 2 14 8 17 18-3 10-8 16-17 18 0-8 3-13 8-18-5-5-8-10-8-18Z"
        stroke="url(#symetra-mark)"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M41 6c-9 2-14 8-17 18 3 10 8 16 17 18 0-8-3-13-8-18 5-5 8-10 8-18Z"
        stroke="url(#symetra-mark)"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function SymetraLogo({
  className,
  showTagline = false,
  compact = false,
}: {
  className?: string;
  showTagline?: boolean;
  compact?: boolean;
}) {
  return (
    <span className={cn("flex min-w-0 items-center gap-2.5", className)}>
      <SymetraMark className={cn("shrink-0 text-primary", compact ? "h-7 w-7" : "h-9 w-9")} />
      {!compact && (
        <span className="flex min-w-0 flex-col leading-none">
          <span className="font-display text-lg font-semibold tracking-[0.22em] text-foreground">
            SYMETRA
          </span>
          {showTagline && (
            <span className="mt-1 text-[9px] font-medium tracking-[0.18em] text-muted-foreground uppercase">
              Tecnologia para evolução estética
            </span>
          )}
        </span>
      )}
    </span>
  );
}
