import { Activity, FileText, Microscope, Stethoscope } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TimelineEvent } from "@/lib/medikiosk/types";

const icons = {
  lab: Microscope,
  consultation: Stethoscope,
  admission: Activity,
  "follow-up": FileText,
  medication: FileText,
};

const colors = {
  lab: "bg-chart-1",
  consultation: "bg-chart-2",
  admission: "bg-chart-5",
  "follow-up": "bg-chart-4",
  medication: "bg-chart-3",
};

export function Timeline({ events }: { events: TimelineEvent[] }) {
  if (!events.length) {
    return <div className="rounded-2xl border border-dashed border-border bg-muted/30 p-8 text-center text-sm text-muted-foreground">No records on the timeline yet.</div>;
  }

  const grouped = events.reduce<Record<string, TimelineEvent[]>>((acc, e) => {
    const month = new Date(e.date).toLocaleString("en-IN", { month: "long", year: "numeric" });
    acc[month] = [...(acc[month] ?? []), e];
    return acc;
  }, {});

  return (
    <div className="relative space-y-6 pl-4">
      <div className="absolute left-4 top-2 bottom-2 w-px bg-border" />
      {Object.entries(grouped).map(([month, items]) => (
        <div key={month}>
          <div className="relative mb-3 flex items-center gap-3">
            <span className="relative z-10 h-3 w-3 rounded-full bg-primary" />
            <span className="text-sm font-semibold text-foreground">{month}</span>
          </div>
          <div className="space-y-3 pl-6">
            {items.map((e) => {
              const Icon = icons[e.kind];
              return (
                <div key={e.id} className="flex items-start gap-3 rounded-xl border border-border bg-card p-3 shadow-soft">
                  <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white", colors[e.kind])}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-foreground">{e.title}</div>
                    <div className="text-xs text-muted-foreground">{new Date(e.date).toLocaleDateString("en-IN")}</div>
                    <div className="mt-1 text-sm text-muted-foreground">{e.detail}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
