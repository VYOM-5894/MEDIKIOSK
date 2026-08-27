import type { ExtractedDocument, PatientRecord, TimelineEvent } from "./types";

let counter = 0;
export const uid = (prefix = "id") => `${prefix}-${Date.now().toString(36)}-${(counter++).toString(36)}`;

export function makeToken(n: number) {
  return `OPD-${String(n).padStart(3, "0")}`;
}

/** Simulated Document Intelligence pipeline output (OCR + medical entity recognition). */
export function extractDocument(fileName: string, hint?: ExtractedDocument["kind"]): ExtractedDocument {
  const lower = fileName.toLowerCase();
  const kind: ExtractedDocument["kind"] =
    hint ??
    (/lab|report|cbc|hba1c|blood/.test(lower)
      ? "lab-report"
      : /discharge|summary/.test(lower)
        ? "discharge-summary"
        : /xray|mri|ct|scan|usg/.test(lower)
          ? "imaging"
          : "prescription");

  const base = {
    id: uid("doc"),
    fileName,
    kind,
    confidence: 0.88 + Math.random() * 0.1,
  };

  if (kind === "lab-report") {
    return {
      ...base,
      doctor: "Dr. R. Menon, MD (Pathology)",
      hospital: "District Hospital Central Lab",
      date: "2026-06-18",
      diagnosis: "Routine metabolic panel",
      medications: [],
      labs: [
        { id: uid("lab"), test: "HbA1c", value: "8.4 %", reference: "< 5.7 %", abnormal: true },
        { id: uid("lab"), test: "Fasting Glucose", value: "168 mg/dL", reference: "70–100 mg/dL", abnormal: true },
        { id: uid("lab"), test: "Serum Creatinine", value: "1.0 mg/dL", reference: "0.6–1.2 mg/dL", abnormal: false },
        { id: uid("lab"), test: "Haemoglobin", value: "11.2 g/dL", reference: "13–17 g/dL", abnormal: true },
      ],
      notes: "Sample collected fasting. Values flagged against lab reference ranges.",
    };
  }

  if (kind === "discharge-summary") {
    return {
      ...base,
      doctor: "Dr. S. Iyer, MD (General Medicine)",
      hospital: "Government Medical College Hospital",
      date: "2025-11-02",
      diagnosis: "Community acquired pneumonia — resolved",
      medications: [
        { id: uid("med"), name: "Amoxicillin-Clavulanate", dosage: "625 mg", frequency: "Three times daily × 7 days" },
      ],
      labs: [{ id: uid("lab"), test: "WBC", value: "14,200 /µL", reference: "4,000–11,000 /µL", abnormal: true }],
      notes: "Discharged stable. Advised review after 2 weeks.",
    };
  }

  if (kind === "imaging") {
    return {
      ...base,
      doctor: "Dr. A. Bose, MD (Radiology)",
      hospital: "District Hospital Imaging Centre",
      date: "2026-02-11",
      diagnosis: "Chest X-ray PA view — no active lung lesion",
      medications: [],
      labs: [],
      notes: "Cardiothoracic ratio within normal limits.",
    };
  }

  return {
    ...base,
    doctor: "Dr. P. Sharma, MBBS",
    hospital: "Primary Health Centre, Sector 9",
    date: "2026-05-04",
    diagnosis: "Type 2 Diabetes Mellitus; Hypertension",
    medications: [
      { id: uid("med"), name: "Metformin", dosage: "500 mg", frequency: "Twice daily" },
      { id: uid("med"), name: "Telmisartan", dosage: "40 mg", frequency: "Once daily (morning)" },
      { id: uid("med"), name: "Atorvastatin", dosage: "10 mg", frequency: "Once daily (night)" },
    ],
    labs: [],
    notes: "Advised to review after 3 months with fasting sugar report.",
  };
}

export function timelineFromDocuments(docs: ExtractedDocument[]): TimelineEvent[] {
  return docs
    .map<TimelineEvent>((d) => ({
      id: uid("tl"),
      date: d.date,
      title:
        d.kind === "lab-report"
          ? "Laboratory investigation"
          : d.kind === "discharge-summary"
            ? "Hospital admission"
            : d.kind === "imaging"
              ? "Imaging study"
              : "Doctor consultation",
      detail: d.diagnosis,
      kind: d.kind === "lab-report" ? "lab" : d.kind === "discharge-summary" ? "admission" : d.kind === "imaging" ? "follow-up" : "consultation",
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

const now = () => new Date().toISOString();

function basePatient(over: Partial<PatientRecord>): PatientRecord {
  return {
    id: uid("pt"),
    token: makeToken(Math.floor(Math.random() * 300) + 1),
    name: "Unknown",
    age: 40,
    gender: "Male",
    abhaId: "",
    mobile: "",
    language: "en",
    mode: "allopathy",
    consentAt: now(),
    chiefComplaint: "",
    answers: [],
    redFlags: [],
    priority: "routine",
    status: "awaiting-doctor",
    documents: [],
    timeline: [],
    ayush: null,
    summaryOverride: null,
    doctorNote: "",
    createdAt: now(),
    completedAt: now(),
    intakeSeconds: 240,
    inputMode: "voice",
    abdm: { abhaLinked: true, consentVerified: true, recordReady: true },
    ...over,
  };
}

const ans = (questionId: string, question: string, value: string, section: string) => ({
  questionId,
  question,
  value,
  section,
  at: now(),
});

/** Pre-seeded queue so dashboards are alive from the first load. */
export function seedPatients(): PatientRecord[] {
  const prescription = extractDocument("prescription_phc_sector9.jpg", "prescription");
  const lab = extractDocument("hba1c_lab_report.pdf", "lab-report");

  const chestPain = basePatient({
    id: "pt-demo-chest",
    token: "OPD-104",
    name: "Ramesh Kumar",
    age: 58,
    gender: "Male",
    abhaId: "12-3456-7890-1234",
    mobile: "98765 43210",
    language: "hi",
    chiefComplaint: "Chest pain",
    intakeSeconds: 198,
    answers: [
      ans("hpi.duration", "How long has this been going on?", "A few hours", "Chief Complaint"),
      ans("hpi.site", "Where exactly do you feel the chest pain?", "Centre of chest", "History of Present Illness"),
      ans("hpi.onset", "When did it start?", "Less than 1 hour ago", "History of Present Illness"),
      ans("hpi.character", "How would you describe the feeling?", "Pressure / heaviness", "History of Present Illness"),
      ans("hpi.radiation", "Does the pain spread anywhere?", "To the left arm", "History of Present Illness"),
      ans("hpi.severity", "Severity 0–10", "8", "History of Present Illness"),
      ans("hpi.timing", "Is it constant?", "Constant", "History of Present Illness"),
      ans("hpi.aggravating", "Does anything make it worse?", "Walking or exertion", "History of Present Illness"),
      ans("hpi.relieving", "Does anything make it better?", "Nothing helps", "History of Present Illness"),
      ans("hpi.associated", "Associated symptoms", "Sweating, Difficulty breathing", "History of Present Illness"),
      ans("pmh.conditions", "Known conditions", "High blood pressure, Diabetes", "Past Medical History"),
      ans("allergy.drug", "Allergies", "No known allergy", "Allergy History"),
      ans("personal.habits", "Habits", "Smoking / tobacco", "Personal History"),
      ans("family.history", "Family history", "Heart attack", "Family History"),
    ],
    redFlags: [
      { id: "cp-severe", label: "Severe chest pain", detail: "Patient rated chest pain 8/10.", severity: "high" },
      { id: "cp-radiation", label: "Chest pain radiating to arm/jaw", detail: "Radiation to left arm.", severity: "high" },
      { id: "cp-assoc", label: "Chest pain with autonomic symptoms", detail: "Sweating and breathlessness reported.", severity: "high" },
    ],
    priority: "emergency",
  });

  const diabetes = basePatient({
    id: "pt-demo-diab",
    token: "OPD-112",
    name: "Sunita Devi",
    age: 46,
    gender: "Female",
    abhaId: "45-6789-0123-4567",
    mobile: "99001 22334",
    language: "hi",
    chiefComplaint: "Diabetes / BP follow-up",
    intakeSeconds: 276,
    documents: [prescription, lab],
    timeline: timelineFromDocuments([prescription, lab]),
    answers: [
      ans("hpi.duration", "How long?", "More than a month", "Chief Complaint"),
      ans("hpi.control", "Recent readings?", "Often high", "History of Present Illness"),
      ans("hpi.adherence", "Medicines regularly?", "Sometimes miss", "History of Present Illness"),
      ans("hpi.associated", "Associated symptoms", "Excessive thirst, Numbness in feet", "History of Present Illness"),
      ans("pmh.conditions", "Known conditions", "Diabetes, High blood pressure", "Past Medical History"),
      ans("drugs.current", "Current medicines", "Yes — I have the prescription with me", "Drug History"),
      ans("allergy.drug", "Allergies", "Penicillin / antibiotics", "Allergy History"),
      ans("family.history", "Family history", "Diabetes", "Family History"),
      ans("personal.habits", "Habits", "Poor sleep", "Personal History"),
    ],
    redFlags: [],
    priority: "priority",
  });

  const ayush = basePatient({
    id: "pt-demo-ayush",
    token: "AYU-021",
    name: "Lakshmi Narayanan",
    age: 62,
    gender: "Female",
    abhaId: "78-9012-3456-7890",
    mobile: "90123 45678",
    language: "ta",
    mode: "ayush",
    chiefComplaint: "Joint or back pain",
    intakeSeconds: 312,
    inputMode: "touch",
    answers: [
      ans("hpi.duration", "How long?", "More than a month", "Chief Complaint"),
      ans("hpi.site", "Where?", "Knee", "History of Present Illness"),
      ans("hpi.character", "Character", "Dull ache", "History of Present Illness"),
      ans("hpi.severity", "Severity", "5", "History of Present Illness"),
      ans("hpi.associated", "Associated", "Morning stiffness", "History of Present Illness"),
      ans("pmh.conditions", "Known conditions", "None", "Past Medical History"),
      ans("allergy.drug", "Allergies", "No known allergy", "Allergy History"),
    ],
    ayush: {
      dashavidha: {
        Prakriti: "Vata-Pitta",
        Vikriti: "Dryness, gas, pain (Vata)",
        Sara: "Moderate (Madhyama)",
        Samhanana: "Average",
        Pramana: "Proportionate",
        Satmya: "Sweet, Sour, Salty",
        Sattva: "Moderately (Madhyama)",
        "Ahara Shakti": "Moderate",
        "Vyayama Shakti": "Moderate work",
        Vaya: "Vriddha (elderly)",
      },
      agni: "Vishama (irregular, gas)",
      ahara: "Irregular timing",
      vihara: "Very sedentary",
      koshtha: "Krura (hard, constipated)",
      nidana: "Seasonal change",
    },
    priority: "routine",
  });

  const routine = basePatient({
    id: "pt-demo-fever",
    token: "OPD-118",
    name: "Arjun Patra",
    age: 27,
    gender: "Male",
    abhaId: "23-4567-8901-2345",
    mobile: "88220 11223",
    language: "or",
    chiefComplaint: "Fever",
    intakeSeconds: 165,
    answers: [
      ans("hpi.duration", "How long?", "3–7 days", "Chief Complaint"),
      ans("hpi.pattern", "Pattern", "Comes in the evening", "History of Present Illness"),
      ans("hpi.severity", "Severity", "4", "History of Present Illness"),
      ans("hpi.associated", "Associated", "Body ache", "History of Present Illness"),
      ans("pmh.conditions", "Known conditions", "None", "Past Medical History"),
      ans("allergy.drug", "Allergies", "No known allergy", "Allergy History"),
    ],
    priority: "routine",
  });

  return [chestPain, diabetes, ayush, routine];
}

export const DEMO_SCENARIOS = [
  {
    id: "chest-pain",
    title: "Chest Pain — Emergency Detection",
    icon: "🚨",
    description: "58 y/o male, crushing central chest pain radiating to left arm. Triggers red flag escalation and emergency queue routing.",
    name: "Ramesh Kumar",
    age: 58,
    gender: "Male" as const,
    language: "hi" as const,
    mode: "allopathy" as const,
    complaint: "chest-pain",
  },
  {
    id: "diabetes",
    title: "Diabetes Follow-up — Document AI",
    icon: "📄",
    description: "46 y/o female with prior prescription and HbA1c lab report. Demonstrates OCR extraction, editable entities and timeline build.",
    name: "Sunita Devi",
    age: 46,
    gender: "Female" as const,
    language: "hi" as const,
    mode: "allopathy" as const,
    complaint: "diabetes-followup",
  },
  {
    id: "ayush",
    title: "Ayurveda Consultation — AYUSH Mode",
    icon: "🌿",
    description: "62 y/o female with chronic knee pain. Full Dashavidha Pariksha, Agni, Koshtha and Nidana structured intake.",
    name: "Lakshmi Narayanan",
    age: 62,
    gender: "Female" as const,
    language: "ta" as const,
    mode: "ayush" as const,
    complaint: "joint-pain",
  },
];
