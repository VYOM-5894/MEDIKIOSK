import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import {
  AlarmClock,
  ArrowRight,
  BadgeCheck,
  CalendarClock,
  DoorOpen,
  Hourglass,
  MapPin,
  Siren,
  Stethoscope,
  Ticket,
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
      { title: "Your Appointment — MediKiosk" },
      {
        name: "description",
        content:
          "See the doctor assigned after your intake is approved, your OPD time slot, consultation room and queue position — or instant emergency routing.",
      },
      { property: "og:title", content: "Your Appointment — MediKiosk" },
      {
        property: "og:description",
        content: "Assigned doctor, department, room and time slot for your approved MediKiosk intake.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AppointmentPage,
});

function AppointmentPage() {
  const { patients, currentId } = useMediKiosk();

  const approved = useMemo(
    () =>
      patients
        .filter((p) => p.status === "approved" && p.assignment)
        .sort((a, b) => (a.priority === "emergency" ? -1 : b.priority === "emergency" ? 1 : 0)),
    [patients],
  );

  const mine = approved.find((p) => p.id === currentId) ?? approved[0] ?? null;
  const others = approved.filter((p) => p.id !== mine?.id);
  const pending = patients.find((p) => p.id === currentId && p.status !== "approved") ?? null;

  return (
    <div className="bg-gradient-to-b from-primary/5 via-background to-background">
      <div className="mx-auto max-w-5xl px-4 py-10 lg:px-6">
        <header className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary">
            <BadgeCheck className="h-3.5 w-3.5" /> Appointment desk
          </span>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Your consultation details
          </h1>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-muted-foreground">
            Once a physician approves your AI-assisted intake, MediKiosk assigns a doctor and reserves your
            OPD slot. Emergency cases are routed for immediate treatment.
          </p>
        </header>

        {!mine ? (
          <Card className="mt-10 border-dashed">
            <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
              <Hourglass className="h-10 w-10 text-muted-foreground" />
              <div>
                <p className="text-lg font-semibold text-foreground">
                  {pending ? "Waiting for physician approval" : "No approved appointment yet"}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {pending
                    ? `${pending.name} · ${pending.token} — your summary is with the doctor. This page updates the moment it is approved.`
                    : "Complete a kiosk intake first; your doctor and time slot appear here after approval."}
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
            <AppointmentCard patient={mine} primary />
            {others.length > 0 && (
              <section>
                <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Other scheduled patients today
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {others.map((p) => (
                    <AppointmentCard key={p.id} patient={p} />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}

        <p className="mt-10 text-center text-xs text-muted-foreground">
          Slots are indicative and may shift when an emergency case is triaged ahead of the queue.
        </p>
      </div>
    </div>
  );
}

function AppointmentCard({ patient, primary }: { patient: PatientRecord; primary?: boolean }) {
  const a = patient.assignment!;
  const instant = a.kind === "instant";

  return (
    <Card
      className={
        primary
          ? "overflow-hidden border-primary/25 shadow-lift"
          : "overflow-hidden shadow-soft"
      }
    >
      <div
        className={
          instant
            ? "flex items-center gap-3 bg-emergency px-5 py-3 text-emergency-foreground"
            : "flex items-center gap-3 bg-primary px-5 py-3 text-primary-foreground"
        }
      >
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
          <Detail
            icon={MapPin}
            label="Queue position"
            value={instant ? "Priority — no wait" : `#${a.queueNumber}`}
          />
        </dl>

        {instant && (
          <p className="rounded-lg border border-emergency/30 bg-emergency/10 p-3 text-sm font-medium text-emergency">
            Red flags detected during intake. Report to {a.room} now — staff have been alerted and no
            waiting is required.
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

function Detail({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof AlarmClock;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-border/70 p-3">
      <dt className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-muted-foreground">
        <Icon className="h-3.5 w-3.5" /> {label}
      </dt>
      <dd className="mt-1 font-semibold text-foreground">{value}</dd>
    </div>
  );
}
