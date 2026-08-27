import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Check, Copy, Stethoscope, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QueueCard } from "@/components/medikiosk/QueueCard";
import { SummaryView } from "@/components/medikiosk/SummaryView";
import { AyushSummary } from "@/components/medikiosk/AyushSummary";
import { RedFlagBanner } from "@/components/medikiosk/RedFlagBanner";
import { Timeline } from "@/components/medikiosk/Timeline";
import { PriorityBadge } from "@/components/medikiosk/PriorityBadge";
import { useMediKiosk, summaryToText } from "@/lib/medikiosk/store";

export const Route = createFileRoute("/_authenticated/doctor")({
  head: () => ({
    meta: [
      { title: "Doctor Dashboard — MediKiosk" },
      {
        name: "description",
        content:
          "Review AI-drafted patient histories, red-flag alerts and extracted documents, then approve or edit before the consultation.",
      },
      { property: "og:title", content: "Doctor Dashboard — MediKiosk" },
      {
        property: "og:description",
        content: "Priority-sorted OPD queue with review-ready clinical summaries.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DoctorPage,
});

const order = { emergency: 0, priority: 1, routine: 2 } as const;

function DoctorPage() {
  const { patients, approveSummary, rejectSummary, setDoctorNote } = useMediKiosk();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const queue = useMemo(
    () =>
      [...patients]
        .filter((p) => p.status !== "in-intake")
        .sort((a, b) => order[a.priority] - order[b.priority]),
    [patients],
  );

  const selected = queue.find((p) => p.id === selectedId) ?? queue[0] ?? null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 lg:px-6">
      <div className="flex items-center gap-3">
        <Stethoscope className="h-7 w-7 text-primary" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Doctor Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            {queue.length} patients waiting · sorted by clinical priority
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[340px_1fr]">
        <div className="space-y-3">
          {queue.map((p) => (
            <QueueCard key={p.id} patient={p} selected={selected?.id === p.id} onClick={() => setSelectedId(p.id)} />
          ))}
          {queue.length === 0 && (
            <div className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
              Queue is empty.
            </div>
          )}
        </div>

        <div className="space-y-6">
          {!selected ? (
            <Card>
              <CardContent className="py-16 text-center text-muted-foreground">
                Select a patient to review their summary.
              </CardContent>
            </Card>
          ) : (
            <>
              <Card className="shadow-lift">
                <CardHeader className="flex flex-row items-start justify-between gap-4">
                  <div>
                    <CardTitle className="text-2xl">{selected.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {selected.age} y · {selected.gender} · {selected.token} ·{" "}
                      {selected.mode === "ayush" ? "AYUSH" : "Allopathy"} · Status: {selected.status}
                    </p>
                  </div>
                  <PriorityBadge priority={selected.priority} />
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  <Button
                    className="gap-2"
                    onClick={() => {
                      approveSummary(selected.id);
                      toast.success("Summary approved to the record.");
                    }}
                  >
                    <Check className="h-4 w-4" /> Approve
                  </Button>
                  <Button
                    variant="outline"
                    className="gap-2"
                    onClick={() => {
                      rejectSummary(selected.id);
                      toast("Summary marked for re-intake.");
                    }}
                  >
                    <X className="h-4 w-4" /> Reject
                  </Button>
                  <Button
                    variant="ghost"
                    className="gap-2"
                    onClick={() => {
                      void navigator.clipboard?.writeText(summaryToText(selected));
                      toast.success("Summary copied.");
                    }}
                  >
                    <Copy className="h-4 w-4" /> Copy text
                  </Button>
                </CardContent>
              </Card>

              {selected.redFlags.length > 0 && (
                <RedFlagBanner flags={selected.redFlags} lang={selected.language} />
              )}

              <SummaryView patient={selected} lang={selected.language} />
              {selected.mode === "ayush" && <AyushSummary patient={selected} />}

              {selected.timeline.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Medical timeline</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Timeline events={selected.timeline} />
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Physician note</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={selected.doctorNote}
                    onChange={(e) => setDoctorNote(selected.id, e.target.value)}
                    placeholder="Add your clinical note or correction..."
                    className="min-h-28"
                  />
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
