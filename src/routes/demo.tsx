import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Play, RotateCcw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMediKiosk } from "@/lib/medikiosk/store";
import { DEMO_SCENARIOS } from "@/lib/medikiosk/mockData";
import { COMPLAINTS } from "@/lib/medikiosk/engine";

export const Route = createFileRoute("/demo")({
  head: () => ({
    meta: [
      { title: "Demo Scenarios — MediKiosk" },
      {
        name: "description",
        content:
          "Launch scripted MediKiosk walkthroughs: emergency chest-pain escalation, diabetes document extraction and an AYUSH Ayurveda consultation.",
      },
      { property: "og:title", content: "Demo Scenarios — MediKiosk" },
      {
        property: "og:description",
        content: "Three one-click demos covering the full MediKiosk journey.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DemoPage,
});

function DemoPage() {
  const { startPatient, setChiefComplaint, updateCurrent, resetQueue } = useMediKiosk();
  const navigate = useNavigate();

  const launch = (s: (typeof DEMO_SCENARIOS)[number]) => {
    startPatient({
      name: s.name,
      age: s.age,
      gender: s.gender,
      abhaId: "12-3456-7890-1234",
      mobile: "98765 43210",
      language: s.language,
      mode: s.mode,
    });
    updateCurrent({ consentAt: new Date().toISOString() });
    const complaint = COMPLAINTS.find((c) => c.id === s.complaint);
    if (complaint) setChiefComplaint(complaint.label);
    toast.success(`${s.title} loaded — consent pre-signed.`);
    navigate({ to: "/intake" });
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 lg:px-6">
      <div className="flex items-center gap-3">
        <Sparkles className="h-7 w-7 text-primary" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Demo Mode</h1>
          <p className="text-sm text-muted-foreground">
            One click loads a patient, skips consent and drops you into the adaptive conversation.
          </p>
        </div>
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {DEMO_SCENARIOS.map((s) => (
          <Card key={s.id} className="flex flex-col shadow-soft transition-all hover:-translate-y-1 hover:shadow-lift">
            <CardHeader>
              <div className="text-4xl">{s.icon}</div>
              <CardTitle className="pt-3 text-lg leading-snug">{s.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col justify-between gap-6">
              <p className="text-sm leading-relaxed text-muted-foreground">{s.description}</p>
              <Button className="w-full gap-2" onClick={() => launch(s)}>
                <Play className="h-4 w-4" /> Run scenario
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-card p-6">
        <div>
          <div className="font-semibold text-foreground">Presenting live?</div>
          <p className="text-sm text-muted-foreground">
            Reset the queue to the four seeded patients before your walkthrough.
          </p>
        </div>
        <Button
          variant="outline"
          className="gap-2"
          onClick={() => {
            resetQueue();
            toast.success("Queue reset to demo baseline.");
          }}
        >
          <RotateCcw className="h-4 w-4" /> Reset queue
        </Button>
      </div>
    </div>
  );
}
