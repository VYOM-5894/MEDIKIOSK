import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import {
  AlarmClock,
  ArrowRight,
  BadgeCheck,
  CalendarClock,
  Check,
  Circle,
  DoorOpen,
  Hourglass,
  MapPin,
  RefreshCcw,
  Siren,
  Stethoscope,
  Ticket,
  X,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PriorityBadge } from "@/components/medikiosk/PriorityBadge";
import { useMediKiosk } from "@/lib/medikiosk/store";
import { formatSlot } from "@/lib/medikiosk/assignment";
import type { PatientRecord } from "@/lib/medikiosk/types";

export const Route = createFileRoute("/_authenticated/appointment")({
  head: () => ({
    meta: [
      { title: "My Appointment Tracking — MediKiosk" },
      {
        name: "description",
        content:
          "Track your MediKiosk intake review, doctor approval, rejection status and assigned consultation time.",
      },
      { property: "og:title", content: "My Appointment Tracking — MediKiosk" },
      {
        property: "og:description",
        content: "Follow your intake from doctor review to an assigned consultation time or instant treatment.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AppointmentPage,
});

function AppointmentPage() {
  const { patients, currentId } = useMediKiosk();
  const patient = useMemo(
    () => (currentId ? patients.find((entry) => entry.id === currentId) ?? null : null),
    [currentId, patients],
  );

  return (
    <div className="bg-gradient-to-b from-primary/5 via-background to-background">
      <div className="mx-auto max-w-5xl px-4 py-10 lg:px-6">
        <header className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary">
            <BadgeCheck className="h-3.5 w-3.5" /> My appointments
          </span>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Track your consultation
          </h1>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-muted-foreground">
            Follow your intake after submission. Your appointment details appear here as soon as a doctor
            reviews your summary.
          </p>
        </header>

        {!patient ? (
          <Card className="mt-10 border-dashed">
            <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
              <Hourglass className="h-10 w-10 text-muted-foreground" />
              <div>
                <p className="text-lg font-semibold text-foreground">No submitted intake yet</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Complete a patient intake first. Your review status and appointment will be tracked here.
                </p>
              </div>
              <Button asChild>
                <Link to="/intake">
                  Start intake <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="mt-10 space-y-6">
            <StatusTracker patient={patient} />
            {patient.status === "approved" && patient.assignment ? (
              <AppointmentCard patient={patient} primary />
            ) : patient.status === "rejected" ? (
              <RejectedCard />
            ) : (
              <PendingCard patient={patient} />
            )}
          </div>
        )}

        <p className="mt-10 text-center text-xs text-muted-foreground">
          Emergency symptoms are routed for immediate clinical attention. Call 108 for a life-threatening emergency.
        </p>
      </div>
    </div>
  );
}

function StatusTracker({ patient }: { patient: PatientRecord }) {
  const approved = patient.status === "approved";
  const rejected = patient.status === "rejected";
  const steps = [
    { label: "Intake submitted", done: true },
    { label: rejected ? "Needs re-intake" : approved ? "Doctor approved" : "Doctor review", done: approved || rejected },
    { label: approved ? "Appointment scheduled" : "Appointment", done: approved },
  ];

  return (
    <Card className="overflow-hidden border-primary/20 shadow-lift">
      <CardHeader className="border-b border-border/70 bg-secondary/30">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <CardTitle className="text-xl">Appointment status</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              {patient.name} · {patient.token}
            </p>
          </div>
          <StatusLabel status={patient.status} />
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid gap-4 sm:grid-cols-3">
          {steps.map((step, index) => (
            <div key={step.label} className="relative flex items-start gap-3">
              <div
                className={
                  step.done
                    ? "flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-success text-success-foreground"
                    : "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border bg-muted text-muted-foreground"
                }
              >
                {step.done ? <Check className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
              </div>
              <div className="pt-1">
                <p className="text-sm font-semibold text-foreground">{step.label}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {step.done ? (index === 0 ? "Received" : "Updated") : "Waiting"}
                </p>
              </div>
              {index < steps.length - 1 && <span className="absolute left-8 top-4 hidden h-px w-[calc(100%-1.5rem)] bg-border sm:block" />}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function StatusLabel({ status }: { status: PatientRecord["status"] }) {
  if (status === "approved") {
    return <span className="inline-flex items-center gap-1.5 rounded-full border border-success/30 bg-success/10 px-3 py-1.5 text-sm font-semibold text-success"><Check className="h-4 w-4" /> Scheduled</span>;
  }
  if (status === "rejected") {
    return <span className="inline-flex items-center gap-1.5 rounded-full border border-destructive/30 bg-destructive/10 px-3 py-1.5 text-sm font-semibold text-destructive"><X className="h-4 w-4" /> Rejected</span>;
  }
  return <span className="inline-flex items-center gap-1.5 rounded-full border border-warning/40 bg-warning/15 px-3 py-1.5 text-sm font-semibold text-warning-foreground"><Hourglass className="h-4 w-4" /> Awaiting doctor</span>;
}

function PendingCard({ patient }: { patient: PatientRecord }) {
  return (
    <Card>
      <CardContent className="flex items-start gap-4 py-8">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-warning/15 text-warning-foreground">
          <Hourglass className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">Waiting for doctor approval</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Your summary has been sent for clinical review. The doctor, time slot and room will appear here
            after approval. Keep this page handy to check your status.
          </p>
          <p className="mt-3 text-sm font-medium text-foreground">Token: {patient.token}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function RejectedCard() {
  return (
    <Card className="border-destructive/30">
      <CardContent className="flex flex-col items-start gap-4 py-8 sm:flex-row">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <XCircle className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">Doctor requested a fresh intake</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            This submission was not approved for scheduling. Please start a new intake with any missing or updated
            information so the clinical team can review it again.
          </p>
          <Button asChild className="mt-4 gap-2">
            <Link to="/intake"><RefreshCcw className="h-4 w-4" /> Start new intake</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function AppointmentCard({ patient, primary }: { patient: PatientRecord; primary?: boolean }) {
  const a = patient.assignment;
  if (!a) return null;
  const instant = a.kind === "instant";

  return (
    <Card className={primary ? "overflow-hidden border-primary/25 shadow-lift" : "overflow-hidden shadow-soft"}>
      <div className={instant ? "flex items-center gap-3 bg-emergency px-5 py-3 text-emergency-foreground" : "flex items-center gap-3 bg-primary px-5 py-3 text-primary-foreground"}>
        {instant ? <Siren className="h-5 w-5 animate-pulse" /> : <CalendarClock className="h-5 w-5" />}
        <div className="text-sm font-semibold uppercase tracking-wider">
          {instant ? "Instant treatment — proceed now" : `Scheduled · ${formatSlot(a.slotAt)}`}
        </div>
        <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-background/20 px-2.5 py-1 text-xs font-medium">
          <Ticket className="h-3.5 w-3.5" /> {patient.token}
        </span>
      </div>

      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
          <CardTitle className={primary ? "text-2xl" : "text-lg"}>{patient.name}</CardTitle>
          <p className="text-sm text-muted-foreground">
            {patient.age} y · {patient.gender} · {patient.mode === "ayush" ? "AYUSH" : "Allopathy"}
          </p>
        </div>
        <PriorityBadge priority={patient.priority} />
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-start gap-3 rounded-xl bg-secondary/60 p-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Stethoscope className="h-5 w-5" />
          </div>
          <div>
            <div className="font-semibold text-foreground">{a.doctorName}</div>
            <div className="text-xs text-muted-foreground">{a.qualification}</div>
            <div className="mt-1 text-sm text-muted-foreground">{a.department}</div>
          </div>
        </div>

        <Separator />

        <dl className="grid gap-4 sm:grid-cols-3">
          <Detail icon={AlarmClock} label={instant ? "Attend by" : "Time slot"} value={instant ? "Immediately" : formatSlot(a.slotAt)} />
          <Detail icon={DoorOpen} label="Room" value={a.room} />
          <Detail icon={MapPin} label="Queue position" value={instant ? "Priority — no wait" : `#${a.queueNumber}`} />
        </dl>

        {instant && (
          <p className="rounded-lg border border-emergency/30 bg-emergency/10 p-3 text-sm font-medium text-emergency">
            Warning symptoms were detected during intake. Report to {a.room} now — staff have been alerted and
            no waiting is required.
          </p>
        )}

        {patient.chiefComplaint && (
          <p className="text-sm text-muted-foreground">
            Reason for visit: <span className="font-medium text-foreground">{patient.chiefComplaint}</span>
          </p>
        )}
      </CardContent>
    </Card>
  );
}

function Detail({ icon: Icon, label, value }: { icon: typeof AlarmClock; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border/70 p-3">
      <dt className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-muted-foreground"><Icon className="h-3.5 w-3.5" /> {label}</dt>
      <dd className="mt-1 font-semibold text-foreground">{value}</dd>
    </div>
  );
}