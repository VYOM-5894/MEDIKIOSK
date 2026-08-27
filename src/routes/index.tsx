import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Activity,
  ArrowRight,
  FileScan,
  Languages,
  Leaf,
  Mic,
  ShieldCheck,
  Siren,
  Stethoscope,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { FeatureCard } from "@/components/medikiosk/FeatureCard";
import { ImpactCalculator } from "@/components/medikiosk/ImpactCalculator";
import { LANGUAGES } from "@/lib/medikiosk/types";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MediKiosk — AI Patient Intake Before the Consultation" },
      {
        name: "description",
        content:
          "MediKiosk is a multilingual, voice-first hospital kiosk that captures patient history, detects red-flag symptoms and prepares a doctor-ready clinical summary.",
      },
      { property: "og:title", content: "MediKiosk — AI Patient Intake Kiosk" },
      {
        property: "og:description",
        content: "Your health story, ready before you meet your doctor.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

const steps = [
  { icon: ShieldCheck, title: "Identify", text: "ABHA ID or mobile, language and care stream in seconds." },
  { icon: Mic, title: "Converse", text: "Adaptive voice or touch interview in the patient's language." },
  { icon: FileScan, title: "Scan", text: "Old prescriptions and lab reports read and structured." },
  { icon: Activity, title: "Summarize", text: "SOAP-style draft with red flags surfaced upfront." },
  { icon: Stethoscope, title: "Consult", text: "Doctor reviews, edits and approves in under a minute." },
];

function Landing() {
  return (
    <div>
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-primary/10 via-background to-background">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-20 lg:grid-cols-2 lg:px-6 lg:py-28">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
              <Activity className="h-3.5 w-3.5" />
              SMART INDIA · DIGITAL HEALTH
            </span>
            <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Your health story, ready before you meet your doctor.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
              MediKiosk runs a clinically structured, multilingual intake conversation in the waiting
              room — then hands the physician a reviewable summary with warning symptoms already
              flagged.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="gap-2 text-base">
                <Link to="/intake">
                  Start Patient Intake
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="gap-2 text-base">
                <Link to="/demo">Run demo scenario</Link>
              </Button>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <Languages className="h-4 w-4" />
              {LANGUAGES.map((l) => (
                <span key={l.code} className="rounded-md bg-muted px-2 py-1 font-medium text-foreground">
                  {l.native}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-card p-6 shadow-lift">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <span className="text-sm font-semibold text-foreground">Live triage board</span>
              <span className="rounded-full bg-success/10 px-2 py-1 text-xs font-medium text-success">
                Synced
              </span>
            </div>
            <div className="mt-4 space-y-3">
              <div className="rounded-xl border-l-4 border-l-emergency bg-emergency/5 p-4">
                <div className="flex items-center gap-2 font-semibold text-emergency">
                  <Siren className="h-4 w-4" /> Emergency · OPD-214
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  Chest pain radiating to left arm with sweating — escalated automatically.
                </p>
              </div>
              <div className="rounded-xl border-l-4 border-l-warning bg-warning/10 p-4">
                <div className="font-semibold text-foreground">Priority · OPD-219</div>
                <p className="mt-1 text-sm text-muted-foreground">
                  Diabetes follow-up, HbA1c 9.1% extracted from uploaded lab report.
                </p>
              </div>
              <div className="rounded-xl border-l-4 border-l-success bg-success/5 p-4">
                <div className="font-semibold text-foreground">Routine · OPD-223</div>
                <p className="mt-1 text-sm text-muted-foreground">
                  AYUSH stream — Dashavidha Pariksha completed in Tamil.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 lg:px-6">
        <h2 className="text-3xl font-bold tracking-tight text-foreground">How it works</h2>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {steps.map((s, i) => (
            <div key={s.title} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <s.icon className="h-5 w-5" />
              </div>
              <div className="mt-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Step {i + 1}
              </div>
              <h3 className="text-lg font-semibold text-foreground">{s.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-muted/30 py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Built for real OPD load</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={<Mic className="h-6 w-6" />}
              title="Voice-first, six languages"
              description="Speech input with touch fallback so low-literacy and elderly patients can complete intake unaided."
            />
            <FeatureCard
              icon={<Activity className="h-6 w-6" />}
              title="Adaptive clinical interview"
              description="SOCRATES-driven branching for pain, plus past, drug and family history — never a fixed form."
            />
            <FeatureCard
              icon={<Siren className="h-6 w-6" />}
              title="Red-flag escalation"
              description="Rule-based warning-symptom detection reprioritises the queue instantly. It never diagnoses."
            />
            <FeatureCard
              icon={<FileScan className="h-6 w-6" />}
              title="Document intelligence"
              description="Prescriptions and lab reports are read into editable medications, labs and a longitudinal timeline."
            />
            <FeatureCard
              icon={<Leaf className="h-6 w-6" />}
              title="AYUSH-ready"
              description="Dedicated Ayurveda stream capturing Dashavidha Pariksha, Agni, Koshtha and Nidana."
            />
            <FeatureCard
              icon={<ShieldCheck className="h-6 w-6" />}
              title="Consent and ABDM alignment"
              description="Explicit, audio-explained consent before any health data is captured or shared."
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 lg:px-6">
        <ImpactCalculator />
      </section>

      <section className="border-t border-border bg-card">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-4 py-14 lg:flex-row lg:items-center lg:px-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              See the full journey end to end
            </h2>
            <p className="mt-2 text-muted-foreground">
              Three scripted scenarios: emergency detection, document AI and an Ayurveda consultation.
            </p>
          </div>
          <Button asChild size="lg" className="gap-2">
            <Link to="/demo">
              Open demo mode <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      <footer className="border-t border-border bg-background py-8 text-center text-xs text-muted-foreground">
        MediKiosk does not diagnose disease. All summaries require review by a qualified clinician.
      </footer>
    </div>
  );
}
