import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, CheckCircle2, FileScan, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IntakeProgress } from "@/components/medikiosk/IntakeProgress";
import { ConsentScreen } from "@/components/medikiosk/ConsentScreen";
import { RedFlagBanner } from "@/components/medikiosk/RedFlagBanner";
import { SummaryView } from "@/components/medikiosk/SummaryView";
import { AyushSummary } from "@/components/medikiosk/AyushSummary";
import { DocumentCard } from "@/components/medikiosk/DocumentCard";
import { Timeline } from "@/components/medikiosk/Timeline";
import { VoiceOrb, useSpeech } from "@/components/medikiosk/VoiceOrb";
import { useCurrentPatient, useMediKiosk } from "@/lib/medikiosk/store";
import { COMPLAINTS, buildQuestionPlan, nextQuestion, assistantAck } from "@/lib/medikiosk/engine";
import { LANGUAGES, type IntakeMode, type LanguageCode } from "@/lib/medikiosk/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/intake")({
  head: () => ({
    meta: [
      { title: "Patient Intake — MediKiosk" },
      {
        name: "description",
        content:
          "Guided multilingual kiosk intake: identity, consent, adaptive clinical conversation, document scan and summary review.",
      },
      { property: "og:title", content: "Patient Intake — MediKiosk" },
      {
        property: "og:description",
        content: "Complete your health history at the kiosk before meeting the doctor.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: IntakePage,
});

function IntakePage() {
  const patient = useCurrentPatient();
  const [step, setStep] = useState(patient ? (patient.consentAt ? 2 : 1) : 0);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 lg:px-6">
      <IntakeProgress step={step} />
      <div className="mt-10">
        {step === 0 && <IdentifyStep onDone={() => setStep(1)} />}
        {step === 1 && <ConsentStep onDone={() => setStep(2)} />}
        {step === 2 && <ConversationStep onDone={() => setStep(3)} />}
        {step === 3 && <DocumentsStep onBack={() => setStep(2)} onDone={() => setStep(4)} />}
        {step === 4 && <ReviewStep onBack={() => setStep(3)} />}
      </div>
    </div>
  );
}

/* ---------------- Step 0: Identify ---------------- */

function IdentifyStep({ onDone }: { onDone: () => void }) {
  const { startPatient } = useMediKiosk();
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState<"Male" | "Female" | "Other">("Male");
  const [abhaId, setAbhaId] = useState("");
  const [mobile, setMobile] = useState("");
  const [language, setLanguage] = useState<LanguageCode>("en");
  const [mode, setMode] = useState<IntakeMode>("allopathy");

  const submit = () => {
    if (!name.trim() || !age) {
      toast.error("Please enter name and age.");
      return;
    }
    startPatient({
      name: name.trim(),
      age: Number(age),
      gender,
      abhaId,
      mobile,
      language,
      mode,
    });
    toast.success("Patient registered. Token generated.");
    onDone();
  };

  return (
    <Card className="shadow-lift">
      <CardHeader>
        <CardTitle className="text-xl">Who is visiting today?</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Full name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="h-12 text-base" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="age">Age</Label>
            <Input
              id="age"
              inputMode="numeric"
              value={age}
              onChange={(e) => setAge(e.target.value.replace(/\D/g, ""))}
              className="h-12 text-base"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="abha">ABHA ID (optional)</Label>
            <Input id="abha" value={abhaId} onChange={(e) => setAbhaId(e.target.value)} className="h-12 text-base" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="mobile">Mobile (optional)</Label>
            <Input
              id="mobile"
              inputMode="tel"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              className="h-12 text-base"
            />
          </div>
        </div>

        <Choice
          label="Gender"
          options={["Male", "Female", "Other"]}
          value={gender}
          onChange={(v) => setGender(v as typeof gender)}
        />

        <div>
          <Label className="mb-3 block">Preferred language</Label>
          <div className="flex flex-wrap gap-2">
            {LANGUAGES.map((l) => (
              <button
                key={l.code}
                onClick={() => setLanguage(l.code)}
                className={cn(
                  "rounded-xl border px-4 py-3 text-base font-medium transition-colors",
                  language === l.code
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-card text-foreground hover:bg-accent",
                )}
              >
                {l.native}
              </button>
            ))}
          </div>
        </div>

        <div>
          <Label className="mb-3 block">Care stream</Label>
          <div className="grid gap-3 sm:grid-cols-2">
            {(
              [
                { id: "allopathy", title: "Allopathy OPD", text: "Standard medical history intake" },
                { id: "ayush", title: "AYUSH / Ayurveda", text: "Adds Dashavidha Pariksha assessment" },
              ] as const
            ).map((o) => (
              <button
                key={o.id}
                onClick={() => setMode(o.id)}
                className={cn(
                  "rounded-2xl border p-4 text-left transition-colors",
                  mode === o.id
                    ? o.id === "ayush"
                      ? "border-ayush bg-ayush/10"
                      : "border-primary bg-primary/10"
                    : "border-border bg-card hover:bg-accent",
                )}
              >
                <div className="font-semibold text-foreground">{o.title}</div>
                <div className="text-sm text-muted-foreground">{o.text}</div>
              </button>
            ))}
          </div>
        </div>

        <Button size="lg" className="w-full gap-2 text-base" onClick={submit}>
          Continue <ArrowRight className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}

/* ---------------- Step 1: Consent ---------------- */

function ConsentStep({ onDone }: { onDone: () => void }) {
  const patient = useCurrentPatient();
  const { updateCurrent } = useMediKiosk();

  if (!patient) return <NoPatient />;

  return (
    <ConsentScreen
      lang={patient.language}
      onConsent={() => {
        updateCurrent({
          consentAt: new Date().toISOString(),
          abdm: { ...patient.abdm, consentVerified: true },
        });
        onDone();
      }}
    />
  );
}

/* ---------------- Step 2: Conversation ---------------- */

function ConversationStep({ onDone }: { onDone: () => void }) {
  const patient = useCurrentPatient();
  const { addAnswer, setChiefComplaint, runRedFlags, updateCurrent } = useMediKiosk();
  const [typed, setTyped] = useState("");
  const [scale, setScale] = useState(5);
  const [voiceMode, setVoiceMode] = useState(false);
  const [multiSelected, setMultiSelected] = useState<string[]>([]);

  const answers = useMemo(
    () => Object.fromEntries((patient?.answers ?? []).map((a) => [a.questionId, a.value])),
    [patient?.answers],
  );

  const complaintId = useMemo(
    () => COMPLAINTS.find((c) => c.label === patient?.chiefComplaint)?.id ?? "",
    [patient?.chiefComplaint],
  );

  const plan = useMemo(
    () => (complaintId ? buildQuestionPlan(complaintId, patient?.mode ?? "allopathy", answers) : []),
    [complaintId, patient?.mode, answers],
  );
  const question = useMemo(() => nextQuestion(plan, answers), [plan, answers]);

  useEffect(() => {
    const saved = question ? answers[question.id] : "";
    setMultiSelected(saved ? saved.split(", ").filter(Boolean) : []);
  }, [question?.id, answers]);

  const speech = useSpeech({
    lang: patient ? `${patient.language === "en" ? "en" : patient.language}-IN` : "en-IN",
    onResult: (text) => setTyped(text),
  });

  if (!patient) return <NoPatient />;

  const answered = plan.length - plan.filter((q) => !answers[q.id]).length;

  const record = (value: string) => {
    if (!question || !value.trim()) return;
    addAnswer(question.id, question.prompt, value.trim(), question.section);
    runRedFlags();
    setTyped("");
    setScale(5);
    if (patient.inputMode !== "voice" && voiceMode) updateCurrent({ inputMode: "voice" });
  };

  const toggleMultiOption = (option: string) => {
    setMultiSelected((current) => {
      if (option === "None" || option === "None of these") {
        return current.includes(option) ? [] : [option];
      }
      const withoutNone = current.filter((item) => item !== "None" && item !== "None of these");
      return withoutNone.includes(option)
        ? withoutNone.filter((item) => item !== option)
        : [...withoutNone, option];
    });
  };

  if (!patient.chiefComplaint) {
    return (
      <Card className="shadow-lift">
        <CardHeader>
          <CardTitle className="text-xl">What brings you in today, {patient.name}?</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2">
          {COMPLAINTS.map((c) => (
            <button
              key={c.id}
              onClick={() => setChiefComplaint(c.label)}
              className="flex items-center gap-3 rounded-2xl border border-border bg-card p-5 text-left text-lg font-medium text-foreground shadow-soft transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-lift"
            >
              <span className="text-2xl">{c.icon}</span>
              {c.label}
            </button>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (!question) {
    return (
      <Card className="shadow-lift">
        <CardContent className="space-y-6 py-10 text-center">
          <CheckCircle2 className="mx-auto h-14 w-14 text-success" />
          <div>
            <h2 className="text-2xl font-bold text-foreground">Conversation complete</h2>
            <p className="mt-2 text-muted-foreground">
              {plan.length} questions answered. Next, add any old prescriptions or reports.
            </p>
          </div>
          {patient.redFlags.length > 0 && <RedFlagBanner flags={patient.redFlags} lang={patient.language} />}
          <Button size="lg" className="gap-2" onClick={onDone}>
            Continue to documents <ArrowRight className="h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {patient.redFlags.length > 0 && <RedFlagBanner flags={patient.redFlags} lang={patient.language} />}

      <Card className="shadow-lift">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            <span>{question.section}</span>
            <span>
              {answered + 1} / {plan.length}
            </span>
          </div>
          <CardTitle className="pt-2 text-2xl leading-snug">{question.prompt}</CardTitle>
          {question.hint ? <p className="text-sm text-muted-foreground">{question.hint}</p> : null}
        </CardHeader>
        <CardContent className="space-y-6">
          {question.kind === "choice" ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {(question.options ?? []).map((o) => (
                <button
                  key={o}
                  onClick={() => record(o)}
                  className="rounded-xl border border-border bg-card p-4 text-left text-base font-medium text-foreground transition-all hover:-translate-y-0.5 hover:border-primary hover:bg-primary/5"
                >
                  {o}
                </button>
              ))}
            </div>
          ) : null}

          {question.kind === "multi" ? (
            <div className="space-y-4">
              <p className="text-sm font-medium text-muted-foreground">Select all that apply</p>
              <div className="grid gap-3 sm:grid-cols-2">
                {(question.options ?? []).map((o) => {
                  const selected = multiSelected.includes(o);
                  return (
                    <button
                      key={o}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => toggleMultiOption(o)}
                      className={cn(
                        "flex min-h-14 items-center justify-between rounded-xl border p-4 text-left text-base font-medium transition-all",
                        selected
                          ? "border-primary bg-primary/10 text-primary ring-1 ring-primary"
                          : "border-border bg-card text-foreground hover:-translate-y-0.5 hover:border-primary hover:bg-primary/5",
                      )}
                    >
                      <span>{o}</span>
                      <span
                        className={cn(
                          "flex h-5 w-5 shrink-0 items-center justify-center rounded-sm border text-xs",
                          selected ? "border-primary bg-primary text-primary-foreground" : "border-input",
                        )}
                      >
                        {selected ? "✓" : ""}
                      </span>
                    </button>
                  );
                })}
              </div>
              <Button
                size="lg"
                className="w-full"
                onClick={() => record(multiSelected.join(", "))}
                disabled={multiSelected.length === 0}
              >
                Confirm selection
              </Button>
            </div>
          ) : null}

          {question.kind === "scale" ? (
            <div className="space-y-6">
              <div className="text-center text-5xl font-extrabold tabular-nums text-primary">{scale}</div>
              <Slider value={[scale]} onValueChange={(v) => setScale(v[0] ?? 0)} min={0} max={10} step={1} />
              <Button size="lg" className="w-full" onClick={() => record(String(scale))}>
                Confirm
              </Button>
            </div>
          ) : null}

          {question.kind === "text" || voiceMode ? (
            <div className="space-y-4">
              {voiceMode ? (
                <VoiceOrb
                  listening={speech.listening}
                  transcript={speech.transcript || typed}
                  onToggle={speech.toggle}
                  onSwitchToType={() => setVoiceMode(false)}
                  label={speech.listening ? "Listening..." : "Tap to speak your answer"}
                />
              ) : null}
              <Textarea
                value={typed}
                onChange={(e) => setTyped(e.target.value)}
                placeholder="Type your answer..."
                className="min-h-24 text-base"
              />
              <Button size="lg" className="w-full" onClick={() => record(typed)} disabled={!typed.trim()}>
                Submit answer
              </Button>
            </div>
          ) : (
            <Button variant="outline" className="w-full" onClick={() => setVoiceMode(true)}>
              Answer by voice instead
            </Button>
          )}

          {patient.answers.length > 0 && (
            <p className="rounded-xl bg-muted/50 p-3 text-sm italic text-muted-foreground">
              {assistantAck(question.prompt, patient.answers[patient.answers.length - 1]?.value)}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

/* ---------------- Step 3: Documents ---------------- */

function DocumentsStep({ onBack, onDone }: { onBack: () => void; onDone: () => void }) {
  const patient = useCurrentPatient();
  const { addDocument, updateDocument, removeDocument } = useMediKiosk();

  if (!patient) return <NoPatient />;

  return (
    <div className="space-y-6">
      <Card className="shadow-lift">
        <CardHeader>
          <CardTitle className="text-xl">Any old prescriptions or reports?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="flex cursor-pointer flex-col items-center gap-2 rounded-2xl border border-dashed border-border bg-muted/30 p-8 text-center transition-colors hover:border-primary hover:bg-primary/5">
              <Upload className="h-7 w-7 text-primary" />
              <span className="font-medium text-foreground">Upload from device</span>
              <span className="text-xs text-muted-foreground">JPG, PNG or PDF</span>
              <input
                type="file"
                className="hidden"
                accept="image/*,application/pdf"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) {
                    addDocument(f.name);
                    toast.success("Document scanned and structured.");
                  }
                  e.currentTarget.value = "";
                }}
              />
            </label>
            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="flex items-center gap-2 font-medium text-foreground">
                <FileScan className="h-5 w-5 text-primary" /> Quick sample scans
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {(
                  [
                    ["prescription", "Prescription"],
                    ["lab-report", "Lab report"],
                    ["discharge-summary", "Discharge summary"],
                  ] as const
                ).map(([kind, label]) => (
                  <Button
                    key={kind}
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      addDocument(`${label}.jpg`, kind);
                      toast.success(`${label} extracted.`);
                    }}
                  >
                    {label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {patient.documents.map((d) => (
        <DocumentCard
          key={d.id}
          doc={d}
          onUpdate={(patch) => updateDocument(d.id, patch)}
          onRemove={() => removeDocument(d.id)}
        />
      ))}

      {patient.timeline.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Medical timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <Timeline events={patient.timeline} />
          </CardContent>
        </Card>
      )}

      <div className="flex justify-between gap-3">
        <Button variant="outline" onClick={onBack} className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
        <Button size="lg" className="gap-2" onClick={onDone}>
          Review summary <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

/* ---------------- Step 4: Review ---------------- */

function ReviewStep({ onBack }: { onBack: () => void }) {
  const patient = useCurrentPatient();
  const { updateCurrent, setCurrent } = useMediKiosk();
  const navigate = useNavigate();

  if (!patient) return <NoPatient />;

  const submit = () => {
    const seconds = Math.max(
      45,
      Math.round((Date.now() - new Date(patient.createdAt).getTime()) / 1000),
    );
    updateCurrent({
      status: "awaiting-doctor",
      completedAt: new Date().toISOString(),
      intakeSeconds: seconds,
      abdm: { ...patient.abdm, recordReady: true },
    });
    setCurrent(patient.id);
    toast.success("Summary sent to your doctor.");
    navigate({ to: "/appointment" });
  };

  return (
    <div className="space-y-6">
      {patient.redFlags.length > 0 && <RedFlagBanner flags={patient.redFlags} lang={patient.language} />}
      <SummaryView patient={patient} lang={patient.language} />
      {patient.mode === "ayush" && <AyushSummary patient={patient} />}

      <div className="flex justify-between gap-3">
        <Button variant="outline" onClick={onBack} className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
        <Button size="lg" onClick={submit} className="gap-2">
          Send to doctor <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

/* ---------------- helpers ---------------- */

function Choice({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <Label className="mb-3 block">{label}</Label>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            key={o}
            onClick={() => onChange(o)}
            className={cn(
              "rounded-xl border px-5 py-3 text-base font-medium transition-colors",
              value === o
                ? "border-primary bg-primary/10 text-primary"
                : "border-border bg-card text-foreground hover:bg-accent",
            )}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}

function NoPatient() {
  return (
    <Card>
      <CardContent className="py-12 text-center text-muted-foreground">
        No active intake session. Please start again from the first step.
      </CardContent>
    </Card>
  );
}
