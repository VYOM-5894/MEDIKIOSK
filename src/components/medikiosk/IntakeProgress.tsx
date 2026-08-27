import { cn } from "@/lib/utils";

const steps = ["Identify", "Consent", "Conversation", "Documents", "Review"];

export function IntakeProgress({ step }: { step: number }) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {steps.map((label, i) => {
          const active = i <= step;
          const current = i === step;
          return (
            <div key={label} className="relative flex flex-1 flex-col items-center">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors",
                  current
                    ? "border-primary bg-primary text-primary-foreground"
                    : active
                      ? "border-primary/60 bg-primary/10 text-primary"
                      : "border-muted bg-muted text-muted-foreground",
                )}
              >
                {i + 1}
              </div>
              <span className={cn("mt-2 hidden text-xs font-medium sm:block", active ? "text-foreground" : "text-muted-foreground")}>{label}</span>
              {i < steps.length - 1 && (
                <div
                  className={cn(
                    "absolute left-[calc(50%+1rem)] top-4 h-0.5 w-[calc(100%-2rem)] -translate-y-1/2",
                    active ? "bg-primary/60" : "bg-muted",
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
