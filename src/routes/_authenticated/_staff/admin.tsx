import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { toast } from "sonner";
import { Clock, FileScan, Languages, Leaf, RotateCcw, Siren, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MetricCard } from "@/components/medikiosk/MetricCard";
import { useMediKiosk } from "@/lib/medikiosk/store";
import { LANGUAGES } from "@/lib/medikiosk/types";

export const Route = createFileRoute("/_authenticated/_staff/admin")({
  head: () => ({
    meta: [
      { title: "Admin Analytics — MediKiosk" },
      {
        name: "description",
        content:
          "Hospital-level analytics on kiosk throughput, language mix, red-flag escalations, AYUSH usage and doctor time saved.",
      },
      { property: "og:title", content: "Admin Analytics — MediKiosk" },
      {
        property: "og:description",
        content: "Operational metrics for the MediKiosk intake network.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const { patients, resetQueue } = useMediKiosk();

  const stats = useMemo(() => {
    const total = patients.length;
    const emergencies = patients.filter((p) => p.priority === "emergency").length;
    const ayush = patients.filter((p) => p.mode === "ayush").length;
    const docs = patients.reduce((s, p) => s + p.documents.length, 0);
    const avg = total ? Math.round(patients.reduce((s, p) => s + p.intakeSeconds, 0) / total) : 0;
    const savedMin = total * 4;
    const byLang = LANGUAGES.map((l) => ({
      ...l,
      count: patients.filter((p) => p.language === l.code).length,
    }));
    const complaints = Object.entries(
      patients.reduce<Record<string, number>>((acc, p) => {
        const key = p.chiefComplaint || "Unspecified";
        acc[key] = (acc[key] ?? 0) + 1;
        return acc;
      }, {}),
    ).sort((a, b) => b[1] - a[1]);
    return { total, emergencies, ayush, docs, avg, savedMin, byLang, complaints };
  }, [patients]);

  const maxLang = Math.max(1, ...stats.byLang.map((l) => l.count));
  const maxComplaint = Math.max(1, ...stats.complaints.map(([, n]) => n));

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 lg:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Admin Analytics</h1>
          <p className="text-sm text-muted-foreground">Kiosk performance across the OPD block.</p>
        </div>
        <Button
          variant="outline"
          className="gap-2"
          onClick={() => {
            resetQueue();
            toast.success("Demo queue reset.");
          }}
        >
          <RotateCcw className="h-4 w-4" /> Reset demo data
        </Button>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Patients processed" value={String(stats.total)} icon={<Users className="h-5 w-5" />} />
        <MetricCard
          label="Red-flag escalations"
          value={String(stats.emergencies)}
          tone="emergency"
          icon={<Siren className="h-5 w-5" />}
        />
        <MetricCard
          label="Documents extracted"
          value={String(stats.docs)}
          tone="success"
          icon={<FileScan className="h-5 w-5" />}
        />
        <MetricCard
          label="Doctor time saved"
          value={`${Math.round(stats.savedMin / 60)} hrs`}
          sub={`${stats.savedMin} minutes reclaimed`}
          tone="primary"
          icon={<Clock className="h-5 w-5" />}
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Languages className="h-4 w-4 text-primary" /> Language distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {stats.byLang.map((l) => (
              <div key={l.code}>
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-foreground">{l.native}</span>
                  <span className="text-muted-foreground">{l.count}</span>
                </div>
                <div className="mt-1 h-2 rounded-full bg-muted">
                  <div
                    className="h-2 rounded-full bg-primary"
                    style={{ width: `${(l.count / maxLang) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Top chief complaints</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {stats.complaints.map(([label, n]) => (
              <div key={label}>
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-foreground">{label}</span>
                  <span className="text-muted-foreground">{n}</span>
                </div>
                <div className="mt-1 h-2 rounded-full bg-muted">
                  <div
                    className="h-2 rounded-full bg-accent"
                    style={{ width: `${(n / maxComplaint) * 100}%` }}
                  />
                </div>
              </div>
            ))}
            {stats.complaints.length === 0 && (
              <p className="text-sm text-muted-foreground">No intake data yet.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6 border-ayush/30 bg-ayush/5">
        <CardContent className="flex flex-wrap items-center justify-between gap-4 py-6">
          <div className="flex items-center gap-3">
            <Leaf className="h-6 w-6 text-ayush" />
            <div>
              <div className="font-semibold text-foreground">AYUSH stream usage</div>
              <div className="text-sm text-muted-foreground">
                {stats.ayush} of {stats.total || 0} intakes used the Ayurveda protocol.
              </div>
            </div>
          </div>
          <div className="text-3xl font-bold text-ayush">
            {stats.total ? Math.round((stats.ayush / stats.total) * 100) : 0}%
          </div>
        </CardContent>
      </Card>

      <StaffCodesPanel />

      <p className="mt-8 text-center text-xs text-muted-foreground">
        Average intake duration: {Math.floor(stats.avg / 60)}m {stats.avg % 60}s
      </p>

    </div>
  );
}
