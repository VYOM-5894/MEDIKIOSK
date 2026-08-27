import { cn } from "@/lib/utils";

export function MetricCard({
  label,
  value,
  sub,
  icon,
  tone = "primary",
}: {
  label: string;
  value: string;
  sub?: string;
  icon: React.ReactNode;
  tone?: "primary" | "emergency" | "success" | "warning" | "ayush";
}) {
  const toneClass = {
    primary: "bg-primary/10 text-primary",
    emergency: "bg-emergency/10 text-emergency",
    success: "bg-success/10 text-success",
    warning: "bg-warning/15 text-warning-foreground",
    ayush: "bg-ayush/10 text-ayush",
  }[tone];

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
        <div className={cn("flex h-9 w-9 items-center justify-center rounded-lg", toneClass)}>{icon}</div>
      </div>
      <div className="mt-3 text-3xl font-bold tracking-tight text-foreground">{value}</div>
      {sub ? <div className="mt-1 text-xs text-muted-foreground">{sub}</div> : null}
    </div>
  );
}
