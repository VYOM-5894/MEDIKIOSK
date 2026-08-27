import { AI_DISCLAIMER, type PatientRecord } from "./types";

const pick = (p: PatientRecord, id: string) => p.answers.find((a) => a.questionId === id)?.value ?? "";

function narrative(p: PatientRecord): string {
  const duration = pick(p, "hpi.duration");
  const site = pick(p, "hpi.site");
  const character = pick(p, "hpi.character");
  const radiation = pick(p, "hpi.radiation");
  const severity = pick(p, "hpi.severity");
  const timing = pick(p, "hpi.timing");
  const agg = pick(p, "hpi.aggravating");
  const rel = pick(p, "hpi.relieving");
  const assoc = pick(p, "hpi.associated");
  const free = pick(p, "hpi.describe");

  const parts: string[] = [];
  parts.push(
    `${p.age}-year-old ${p.gender.toLowerCase()} presenting with ${p.chiefComplaint.toLowerCase()}${
      duration ? `, ongoing for ${duration.toLowerCase()}` : ""
    }.`,
  );
  if (site) parts.push(`Site reported as ${site.toLowerCase()}.`);
  if (character) parts.push(`Character described as ${character.toLowerCase()}.`);
  if (radiation && !/^No/.test(radiation)) parts.push(`Radiation ${radiation.toLowerCase()}.`);
  if (severity) parts.push(`Patient-rated severity ${severity}/10.`);
  if (timing) parts.push(`Timing: ${timing.toLowerCase()}.`);
  if (agg) parts.push(`Aggravated by ${agg.toLowerCase()}.`);
  if (rel) parts.push(`Relieved by ${rel.toLowerCase()}.`);
  if (assoc && !/^None/.test(assoc)) parts.push(`Associated symptoms: ${assoc.toLowerCase()}.`);
  if (free) parts.push(`In the patient's words: "${free}"`);
  return parts.join(" ");
}

export interface SummarySection {
  title: string;
  body: string;
  tone?: "default" | "warning";
}

export function buildSummary(p: PatientRecord): SummarySection[] {
  const sections: SummarySection[] = [];
  sections.push({ title: "Chief Complaint", body: `${p.chiefComplaint}${pick(p, "hpi.duration") ? ` — ${pick(p, "hpi.duration")}` : ""}.` });
  sections.push({ title: "History of Present Illness", body: narrative(p) });

  const pmh = pick(p, "pmh.conditions");
  const adm = pick(p, "pmh.hospitalisation");
  const admDetail = pick(p, "pmh.hospitalisation-detail");
  sections.push({
    title: "Past Medical History",
    body:
      (pmh && !/^None/.test(pmh) ? pmh : "No chronic conditions reported by patient.") +
      (/^Yes/.test(adm) ? ` Prior hospital admission reported${admDetail ? `: ${admDetail}` : ""}.` : ""),
  });

  const surg = pick(p, "surgical.history");
  sections.push({ title: "Surgical History", body: surg && !/^No surgery/.test(surg) ? surg : "No prior surgery reported." });

  const docMeds = p.documents.flatMap((d) => d.medications);
  const drugAns = pick(p, "drugs.current");
  sections.push({
    title: "Current Medication",
    body:
      docMeds.length > 0
        ? docMeds.map((m) => `${m.name} ${m.dosage} — ${m.frequency}`).join("; ") +
          " (extracted from uploaded records)"
        : drugAns || "No regular medication reported.",
  });

  const allergy = pick(p, "allergy.drug");
  sections.push({
    title: "Allergies",
    body: allergy || "Not recorded.",
    tone: allergy && !/^No known/.test(allergy) ? "warning" : "default",
  });

  const labs = p.documents.flatMap((d) => d.labs);
  sections.push({
    title: "Previous Investigations",
    body:
      labs.length > 0
        ? labs.map((l) => `${l.test}: ${l.value} (ref ${l.reference})${l.abnormal ? " — outside reference range" : ""}`).join("; ")
        : "No investigation reports uploaded.",
  });

  const fam = pick(p, "family.history");
  const hab = pick(p, "personal.habits");
  sections.push({ title: "Family History", body: fam && !/^None/.test(fam) ? fam : "Non-contributory as reported." });
  sections.push({ title: "Personal History", body: hab && !/^None/.test(hab) ? hab : "No significant habits reported." });

  if (p.ayush) {
    const d = p.ayush.dashavidha;
    sections.push({
      title: "Ayurvedic Intake Summary (Dashavidha Pariksha)",
      body: [
        ...Object.entries(d).map(([k, v]) => `${k}: ${v}`),
        `Agni: ${p.ayush.agni}`,
        `Ahara: ${p.ayush.ahara}`,
        `Vihara: ${p.ayush.vihara}`,
        `Koshtha: ${p.ayush.koshtha}`,
        `Nidana (perceived trigger): ${p.ayush.nidana}`,
      ]
        .filter(Boolean)
        .join(" · "),
    });
  }

  const abnormal = labs.filter((l) => l.abnormal);
  const observations: string[] = [];
  p.redFlags.forEach((f) => observations.push(`${f.label} — ${f.detail}`));
  abnormal.forEach((l) => observations.push(`Abnormal investigation: ${l.test} ${l.value} (ref ${l.reference}).`));
  if (allergy && !/^No known/.test(allergy)) observations.push(`Reported allergy: ${allergy}.`);
  sections.push({
    title: "Important Observations",
    body: observations.length ? observations.map((o) => `⚠ ${o}`).join("\n") : "No warning features identified during structured intake.",
    tone: observations.length ? "warning" : "default",
  });

  sections.push({ title: "Disclaimer", body: AI_DISCLAIMER });
  return sections;
}

export function summaryToText(p: PatientRecord): string {
  return buildSummary(p)
    .map((s) => `${s.title.toUpperCase()}\n${s.body}`)
    .join("\n\n");
}
