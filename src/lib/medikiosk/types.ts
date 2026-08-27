export type LanguageCode = "en" | "hi" | "bn" | "or" | "ta" | "te";

export type Priority = "routine" | "priority" | "emergency";

export type IntakeMode = "allopathy" | "ayush";

export type PatientStatus =
  | "in-intake"
  | "awaiting-doctor"
  | "in-consultation"
  | "approved"
  | "rejected";

export interface Answer {
  questionId: string;
  question: string;
  value: string;
  section: string;
  at: string;
}

export interface RedFlag {
  id: string;
  label: string;
  detail: string;
  severity: "high" | "moderate";
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
}

export interface LabValue {
  id: string;
  test: string;
  value: string;
  reference: string;
  abnormal: boolean;
}

export interface ExtractedDocument {
  id: string;
  fileName: string;
  kind: "prescription" | "lab-report" | "discharge-summary" | "imaging";
  doctor: string;
  hospital: string;
  date: string;
  diagnosis: string;
  medications: Medication[];
  labs: LabValue[];
  notes: string;
  confidence: number;
}

export interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  detail: string;
  kind: "lab" | "consultation" | "admission" | "follow-up" | "medication";
}

export interface AyushAssessment {
  dashavidha: Record<string, string>;
  agni: string;
  ahara: string;
  vihara: string;
  koshtha: string;
  nidana: string;
}

export interface PatientRecord {
  id: string;
  token: string;
  name: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  abhaId: string;
  mobile: string;
  language: LanguageCode;
  mode: IntakeMode;
  consentAt: string | null;
  chiefComplaint: string;
  answers: Answer[];
  redFlags: RedFlag[];
  priority: Priority;
  status: PatientStatus;
  documents: ExtractedDocument[];
  timeline: TimelineEvent[];
  ayush: AyushAssessment | null;
  summaryOverride: string | null;
  doctorNote: string;
  createdAt: string;
  completedAt: string | null;
  intakeSeconds: number;
  inputMode: "voice" | "touch";
  abdm: { abhaLinked: boolean; consentVerified: boolean; recordReady: boolean };
}

export const LANGUAGES: { code: LanguageCode; label: string; native: string; flag: string }[] = [
  { code: "en", label: "English", native: "English", flag: "🇬🇧" },
  { code: "hi", label: "Hindi", native: "हिन्दी", flag: "🇮🇳" },
  { code: "bn", label: "Bengali", native: "বাংলা", flag: "🇮🇳" },
  { code: "or", label: "Odia", native: "ଓଡ଼ିଆ", flag: "🇮🇳" },
  { code: "ta", label: "Tamil", native: "தமிழ்", flag: "🇮🇳" },
  { code: "te", label: "Telugu", native: "తెలుగు", flag: "🇮🇳" },
];

export const PRIORITY_META: Record<
  Priority,
  { label: string; dot: string; badge: string; row: string }
> = {
  emergency: {
    label: "Emergency",
    dot: "bg-emergency",
    badge: "bg-emergency/10 text-emergency border-emergency/30",
    row: "border-l-emergency",
  },
  priority: {
    label: "Priority",
    dot: "bg-warning",
    badge: "bg-warning/15 text-warning-foreground border-warning/40",
    row: "border-l-warning",
  },
  routine: {
    label: "Routine",
    dot: "bg-success",
    badge: "bg-success/10 text-success border-success/30",
    row: "border-l-success",
  },
};

export const AI_DISCLAIMER =
  "This summary is generated from patient-provided information and requires review by a qualified healthcare professional. MediKiosk does not diagnose disease.";
