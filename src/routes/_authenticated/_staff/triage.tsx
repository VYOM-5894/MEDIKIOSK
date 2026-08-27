import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { Activity, AlertTriangle, Clock, Siren, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MetricCard } from "@/components/medikiosk/MetricCard";
import { PriorityBadge } from "@/components/medikiosk/PriorityBadge";
import { useMediKiosk } from "@/lib/medikiosk/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/_staff/triage")({
  head: () => ({
    meta: [
      { title: "Triage Board — MediKiosk" },
      {
        name: "description",
        content:
          "Live nurse triage board showing emergency, priority and routine patients with the warning symptoms that escalated them.",
      },
      { property: "og:title", content: "Triage Board — MediKiosk" },
      {
        property: "og:description",
        content: "Real-time OPD triage with automatic red-flag escalation.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TriagePage,
});

const columns = [
  { key: "emergency", title: "Emergency", tone: "border-emergency bg-emergency/5" },
  { key: "priority", title: "Priority", tone: "border-warning bg-warning/10" },
  { key: "routine", title: "Routine", tone: "border-success bg-success/5" },
] as const;

function TriagePage() {
  const { patients } = useMediKiosk();
  const active = useMemo(() => patients.filter((p) => p.status !== "approved"), [patients]);

  const count = (k: string) => active.filter((p) => p.priority === k).length;
  const avgWait = active.length
    ? Math.round(active.reduce((s, p) => s + p.intakeSeconds, 0) / active.length / 60)
    : 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 lg:px-6">
      <h1 className="text-3xl font-bold tracking-tight text-foreground">Triage Board</h1>
      <p className="text-sm text-muted-foreground">Auto-refreshing view for nursing and front-desk staff.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="In queue" value={String(active.length)} icon={<Users className="h-5 w-5" />} />
        <MetricCard
          label="Emergency"
          value={String(count("emergency"))}
          tone="emergency"
          icon={<Siren className="h-5 w-5" />}
        />
        <MetricCard
          label="Priority"
          value={String(count("priority"))}
          tone="warning"
          icon={<AlertTriangle className="h-5 w-5" />}
        />
        <MetricCard
          label="Avg intake"
          value={`${avgWait} min`}
          tone="success"
          icon={<Clock className="h-5 w-5" />}
        />
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-3">
        {columns.map((col) => {
          const items = active.filter((p) => p.priority === col.key);
          return (
            <Card key={col.key} className={cn("border-t-4", col.tone)}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between text-base">
                  {col.title}
                  <span className="rounded-full bg-card px-2 py-0.5 text-sm font-semibold text-foreground">
                    {items.length}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {items.map((p) => (
                  <div key={p.id} className="rounded-xl border border-border bg-card p-4 shadow-soft">
                    <div className="flex items-center justify-between gap-2">
                      <div className="font-semibold text-foreground">{p.name}</div>
                      <PriorityBadge priority={p.priority} />
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {p.token} · {p.age} y · {p.chiefComplaint || "—"}
                    </div>
                    {p.redFlags.length > 0 && (
                      <ul className="mt-3 space-y-1">
                        {p.redFlags.map((f) => (
                          <li key={f.id} className="flex items-start gap-2 text-xs text-emergency">
                            <Activity className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                            {f.label}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
                {items.length === 0 && (
                  <div className="rounded-xl border border-dashed border-border p-6 text-center text-xs text-muted-foreground">
                    No patients
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
