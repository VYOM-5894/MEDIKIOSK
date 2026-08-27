import type { Answer, RedFlag } from "./types";

export interface Question {
  id: string;
  section: string;
  prompt: string;
  hint?: string;
  kind: "choice" | "multi" | "text" | "scale";
  options?: string[];
}

type AnswerMap = Record<string, string>;

export const COMPLAINTS = [
  { id: "chest-pain", label: "Chest pain", icon: "❤️" },
  { id: "breathlessness", label: "Breathing difficulty", icon: "🫁" },
  { id: "headache", label: "Headache", icon: "🧠" },
  { id: "abdominal-pain", label: "Stomach / abdominal pain", icon: "🩺" },
  { id: "fever", label: "Fever", icon: "🌡️" },
  { id: "diabetes-followup", label: "Diabetes / BP follow-up", icon: "💉" },
  { id: "joint-pain", label: "Joint or back pain", icon: "🦴" },
  { id: "other", label: "Something else", icon: "➕" },
];

const YESNO = ["Yes", "No", "Not sure"];

/** SOCRATES-based branch for pain complaints. */
function painBranch(topic: string, sites: string[]): Question[] {
  return [
    {
      id: "hpi.site",
      section: "History of Present Illness",
      prompt: `Where exactly do you feel the ${topic}?`,
      hint: "Site (S of SOCRATES)",
      kind: "choice",
      options: sites,
    },
    {
      id: "hpi.onset",
      section: "History of Present Illness",
      prompt: "When did it start?",
      hint: "Onset",
      kind: "choice",
      options: ["Less than 1 hour ago", "Today", "2–3 days ago", "About a week ago", "Over a month"],
    },
    {
      id: "hpi.character",
      section: "History of Present Illness",
      prompt: "How would you describe the feeling?",
      hint: "Character",
      kind: "choice",
      options: ["Sharp / stabbing", "Dull ache", "Burning", "Pressure / heaviness", "Cramping"],
    },
    {
      id: "hpi.radiation",
      section: "History of Present Illness",
      prompt: "Does the pain travel or spread anywhere?",
      hint: "Radiation",
      kind: "choice",
      options: ["No, it stays in one place", "To the left arm", "To the jaw or neck", "To the back", "To the shoulder"],
    },
    {
      id: "hpi.severity",
      section: "History of Present Illness",
      prompt: "On a scale of 0 to 10, how bad is it right now?",
      hint: "Severity",
      kind: "scale",
    },
    {
      id: "hpi.timing",
      section: "History of Present Illness",
      prompt: "Is it there all the time, or does it come and go?",
      hint: "Timing",
      kind: "choice",
      options: ["Constant", "Comes and goes", "Only on activity", "Mostly at night"],
    },
    {
      id: "hpi.aggravating",
      section: "History of Present Illness",
      prompt: "Does anything make it worse?",
      hint: "Exacerbating factors",
      kind: "choice",
      options: ["Walking or exertion", "Eating", "Movement / bending", "Stress", "Nothing in particular"],
    },
    {
      id: "hpi.relieving",
      section: "History of Present Illness",
      prompt: "Does anything make it better?",
      hint: "Relieving factors",
      kind: "choice",
      options: ["Rest", "Medicine", "Food or water", "Lying down", "Nothing helps"],
    },
  ];
}

function associatedFor(complaint: string): Question {
  const map: Record<string, string[]> = {
    "chest-pain": [
      "Difficulty breathing",
      "Sweating",
      "Nausea or vomiting",
      "Palpitations",
      "Fainting or blackout",
      "None of these",
    ],
    breathlessness: [
      "Chest pain",
      "Wheezing",
      "Cough with blood",
      "Swelling in legs",
      "Blue lips or fingers",
      "None of these",
    ],
    headache: [
      "Sudden worst-ever headache",
      "Weakness on one side of body",
      "Slurred speech",
      "Vomiting",
      "Blurred vision",
      "None of these",
    ],
    "abdominal-pain": [
      "Vomiting blood",
      "Black stools",
      "Unable to pass urine",
      "Fever with chills",
      "Loss of appetite",
      "None of these",
    ],
    fever: [
      "Difficulty breathing",
      "Rash",
      "Confusion or drowsiness",
      "Severe bleeding",
      "Body ache",
      "None of these",
    ],
    "joint-pain": ["Swelling", "Redness", "Morning stiffness", "Fever", "None of these"],
    "diabetes-followup": [
      "Excessive thirst",
      "Frequent urination",
      "Numbness in feet",
      "Blurred vision",
      "None of these",
    ],
    other: ["Fever", "Weight loss", "Weakness", "Loss of consciousness", "None of these"],
  };
  return {
    id: "hpi.associated",
    section: "History of Present Illness",
    prompt: "Are you having any of these along with it?",
    hint: "Associated symptoms — select all that apply",
    kind: "multi",
    options: map[complaint] ?? map["other"]!,
  };
}

const COMMON_TAIL: Question[] = [
  {
    id: "pmh.conditions",
    section: "Past Medical History",
    prompt: "Have you ever been told you have any of these conditions?",
    kind: "multi",
    options: [
      "Diabetes",
      "High blood pressure",
      "Asthma",
      "Heart disease",
      "Kidney disease",
      "Thyroid problem",
      "Tuberculosis",
      "None",
    ],
  },
  {
    id: "pmh.hospitalisation",
    section: "Past Medical History",
    prompt: "Have you been admitted to a hospital in the past 2 years?",
    kind: "choice",
    options: YESNO,
  },
  {
    id: "surgical.history",
    section: "Surgical History",
    prompt: "Have you had any surgery before?",
    hint: "Include approximate year if you remember",
    kind: "choice",
    options: [
      "No surgery",
      "Appendix surgery",
      "Caesarean section",
      "Cataract surgery",
      "Heart procedure / stent",
      "Other surgery",
    ],
  },
  {
    id: "drugs.current",
    section: "Drug History",
    prompt: "Are you taking any medicines regularly right now?",
    kind: "choice",
    options: [
      "No medicines",
      "Yes — for BP / sugar",
      "Yes — pain medicines",
      "Yes — I have the prescription with me",
      "Yes — but I don't remember names",
    ],
  },
  {
    id: "allergy.drug",
    section: "Allergy History",
    prompt: "Have you ever had a reaction to any medicine, food or injection?",
    kind: "choice",
    options: [
      "No known allergy",
      "Penicillin / antibiotics",
      "Painkillers (NSAIDs)",
      "Sulfa drugs",
      "Certain foods",
      "Yes — not sure what",
    ],
  },
  {
    id: "family.history",
    section: "Family History",
    prompt: "Does anyone in your immediate family have a major illness?",
    kind: "multi",
    options: ["Diabetes", "High blood pressure", "Heart attack", "Stroke", "Cancer", "Asthma", "None"],
  },
  {
    id: "personal.habits",
    section: "Personal History",
    prompt: "Do any of these apply to you?",
    kind: "multi",
    options: ["Smoking / tobacco", "Alcohol", "Vegetarian diet", "Poor sleep", "Regular exercise", "None"],
  },
];

const AYUSH_QUESTIONS: Question[] = [
  {
    id: "ayush.prakriti",
    section: "Dashavidha Pariksha",
    prompt: "Which body pattern describes you best?",
    hint: "Prakriti — constitution",
    kind: "choice",
    options: ["Vata (thin, active, dry skin)", "Pitta (medium, warm, sharp appetite)", "Kapha (heavy, calm, oily skin)", "Vata-Pitta", "Pitta-Kapha"],
  },
  {
    id: "ayush.vikriti",
    section: "Dashavidha Pariksha",
    prompt: "What feels most disturbed at present?",
    hint: "Vikriti — current imbalance",
    kind: "choice",
    options: ["Dryness, gas, pain (Vata)", "Burning, acidity, anger (Pitta)", "Heaviness, mucus, lethargy (Kapha)", "Mixed"],
  },
  {
    id: "ayush.sara",
    section: "Dashavidha Pariksha",
    prompt: "How would you rate your overall tissue strength and stamina?",
    hint: "Sara",
    kind: "choice",
    options: ["Excellent (Pravara)", "Moderate (Madhyama)", "Poor (Avara)"],
  },
  {
    id: "ayush.samhanana",
    section: "Dashavidha Pariksha",
    prompt: "How is your body build and compactness?",
    hint: "Samhanana",
    kind: "choice",
    options: ["Well built", "Average", "Weak / loose"],
  },
  {
    id: "ayush.pramana",
    section: "Dashavidha Pariksha",
    prompt: "How is your body proportion / weight relative to height?",
    hint: "Pramana",
    kind: "choice",
    options: ["Proportionate", "Overweight", "Underweight"],
  },
  {
    id: "ayush.satmya",
    section: "Dashavidha Pariksha",
    prompt: "Which tastes and habits suit you most?",
    hint: "Satmya — suitability",
    kind: "multi",
    options: ["Sweet", "Sour", "Salty", "Pungent", "Bitter", "Astringent", "Mixed diet"],
  },
  {
    id: "ayush.sattva",
    section: "Dashavidha Pariksha",
    prompt: "How do you handle mental stress?",
    hint: "Sattva — mental strength",
    kind: "choice",
    options: ["Very well (Pravara)", "Moderately (Madhyama)", "Poorly (Avara)"],
  },
  {
    id: "ayush.ahara-shakti",
    section: "Dashavidha Pariksha",
    prompt: "How much food can you comfortably eat?",
    hint: "Ahara Shakti",
    kind: "choice",
    options: ["Large quantity easily", "Moderate", "Very little"],
  },
  {
    id: "ayush.vyayama-shakti",
    section: "Dashavidha Pariksha",
    prompt: "How much physical work can you do without tiring?",
    hint: "Vyayama Shakti",
    kind: "choice",
    options: ["Heavy work", "Moderate work", "Tire very quickly"],
  },
  {
    id: "ayush.vaya",
    section: "Dashavidha Pariksha",
    prompt: "Which life stage are you in?",
    hint: "Vaya",
    kind: "choice",
    options: ["Bala (childhood)", "Madhya (adult)", "Vriddha (elderly)"],
  },
  {
    id: "ayush.agni",
    section: "Agni Assessment",
    prompt: "How is your digestion and appetite?",
    hint: "Agni",
    kind: "choice",
    options: ["Sama (regular)", "Vishama (irregular, gas)", "Tikshna (very strong, burning)", "Manda (slow, heaviness)"],
  },
  {
    id: "ayush.ahara",
    section: "Ahara Assessment",
    prompt: "What best describes your daily food?",
    kind: "choice",
    options: ["Home-cooked, on time", "Irregular timing", "Frequent oily / spicy food", "Frequent cold / packaged food"],
  },
  {
    id: "ayush.vihara",
    section: "Vihara / Lifestyle",
    prompt: "How is your daily routine and sleep?",
    kind: "choice",
    options: ["Regular routine, good sleep", "Night shifts / late sleep", "Disturbed sleep", "Very sedentary"],
  },
  {
    id: "ayush.koshtha",
    section: "Koshtha",
    prompt: "How are your bowel movements?",
    kind: "choice",
    options: ["Mridu (soft, regular)", "Madhyama (normal)", "Krura (hard, constipated)"],
  },
  {
    id: "ayush.nidana",
    section: "Nidana",
    prompt: "What do you feel triggered this problem?",
    kind: "choice",
    options: ["Change in food", "Seasonal change", "Stress / grief", "Excess physical strain", "Suppressing natural urges", "Not sure"],
  },
];

/**
 * Adaptive engine: returns the next unanswered question given current answers.
 * Branching depends on chief complaint and prior answers.
 */
export function buildQuestionPlan(complaintId: string, mode: "allopathy" | "ayush", answers: AnswerMap): Question[] {
  const plan: Question[] = [];

  const complaint = COMPLAINTS.find((c) => c.id === complaintId);
  plan.push({
    id: "hpi.duration",
    section: "Chief Complaint",
    prompt: `You mentioned ${complaint ? complaint.label.toLowerCase() : "your problem"}. How long has this been going on?`,
    kind: "choice",
    options: ["A few hours", "1–2 days", "3–7 days", "2–4 weeks", "More than a month"],
  });

  const sitesByComplaint: Record<string, string[]> = {
    "chest-pain": ["Centre of chest", "Left side", "Right side", "Upper abdomen", "All over the chest"],
    headache: ["Front / forehead", "One side", "Back of head", "All over", "Around the eyes"],
    "abdominal-pain": ["Upper abdomen", "Around navel", "Lower abdomen", "Right side", "Left side"],
    "joint-pain": ["Knee", "Lower back", "Shoulder", "Neck", "Multiple joints"],
  };

  if (sitesByComplaint[complaintId]) {
    plan.push(...painBranch(complaint?.label.toLowerCase() ?? "pain", sitesByComplaint[complaintId]!));
  } else if (complaintId === "breathlessness") {
    plan.push(
      {
        id: "hpi.onset",
        section: "History of Present Illness",
        prompt: "When did the breathing difficulty start?",
        kind: "choice",
        options: ["Just now", "Today", "Few days", "Weeks", "Long standing"],
      },
      {
        id: "hpi.exertion",
        section: "History of Present Illness",
        prompt: "When do you feel breathless?",
        kind: "choice",
        options: ["Even at rest", "On walking a short distance", "On climbing stairs", "Only on heavy work", "Lying flat at night"],
      },
      {
        id: "hpi.severity",
        section: "History of Present Illness",
        prompt: "How severe does it feel, from 0 to 10?",
        kind: "scale",
      },
    );
  } else if (complaintId === "fever") {
    plan.push(
      {
        id: "hpi.pattern",
        section: "History of Present Illness",
        prompt: "How is the fever behaving?",
        kind: "choice",
        options: ["Continuous", "Comes in the evening", "With chills and rigors", "On alternate days"],
      },
      {
        id: "hpi.severity",
        section: "History of Present Illness",
        prompt: "How high has it been, from 0 to 10 in discomfort?",
        kind: "scale",
      },
    );
  } else if (complaintId === "diabetes-followup") {
    plan.push(
      {
        id: "hpi.control",
        section: "History of Present Illness",
        prompt: "How have your sugar / BP readings been recently?",
        kind: "choice",
        options: ["Well controlled", "Sometimes high", "Often high", "I have not checked"],
      },
      {
        id: "hpi.adherence",
        section: "History of Present Illness",
        prompt: "Are you taking your medicines regularly?",
        kind: "choice",
        options: ["Every day", "Sometimes miss", "Stopped on my own", "Ran out of medicines"],
      },
    );
  } else {
    plan.push(
      {
        id: "hpi.describe",
        section: "History of Present Illness",
        prompt: "Please describe the problem in your own words.",
        kind: "text",
      },
      {
        id: "hpi.severity",
        section: "History of Present Illness",
        prompt: "How much is it affecting you, from 0 to 10?",
        kind: "scale",
      },
    );
  }

  plan.push(associatedFor(complaintId));

  // Adaptive escalation: severe pain triggers extra safety questions
  const severity = Number(answers["hpi.severity"] ?? "0");
  const associated = answers["hpi.associated"] ?? "";
  if (severity >= 7 || /Difficulty breathing|Fainting|Sweating|Weakness on one side|Slurred/i.test(associated)) {
    plan.push({
      id: "hpi.redflag-followup",
      section: "History of Present Illness",
      prompt: "Are you able to walk and speak normally at this moment?",
      hint: "Safety check",
      kind: "choice",
      options: ["Yes, normally", "With difficulty", "No, I need help"],
    });
  }
  if (/^Yes/.test(answers["pmh.hospitalisation"] ?? "")) {
    plan.push({
      id: "pmh.hospitalisation-detail",
      section: "Past Medical History",
      prompt: "What was the admission for?",
      kind: "text",
    });
  }

  plan.push(...COMMON_TAIL);
  if (mode === "ayush") plan.push(...AYUSH_QUESTIONS);
  return plan;
}

export function nextQuestion(plan: Question[], answers: AnswerMap): Question | null {
  return plan.find((q) => !answers[q.id]) ?? null;
}

/** Rule-based red flag detection. Never diagnostic — surfaces warning symptoms only. */
export function detectRedFlags(complaintId: string, answers: AnswerMap): RedFlag[] {
  const flags: RedFlag[] = [];
  const add = (id: string, label: string, detail: string, severity: RedFlag["severity"] = "high") => {
    if (!flags.some((f) => f.id === id)) flags.push({ id, label, detail, severity });
  };

  const severity = Number(answers["hpi.severity"] ?? "0");
  const associated = answers["hpi.associated"] ?? "";
  const radiation = answers["hpi.radiation"] ?? "";
  const onset = answers["hpi.onset"] ?? "";
  const walkTalk = answers["hpi.redflag-followup"] ?? "";

  if (complaintId === "chest-pain") {
    if (severity >= 6) add("cp-severe", "Severe chest pain", `Patient rated chest pain ${severity}/10.`);
    if (/left arm|jaw|neck/i.test(radiation))
      add("cp-radiation", "Chest pain radiating to arm/jaw", "Radiation pattern warrants urgent cardiac assessment.");
    if (/Sweating|Difficulty breathing|Fainting/i.test(associated))
      add("cp-assoc", "Chest pain with autonomic symptoms", `Reported: ${associated}.`);
    if (/hour|now|Today/i.test(onset) && severity >= 5)
      add("cp-acute", "Acute onset chest pain", "Symptom onset within hours.");
  }

  if (/Difficulty breathing|Blue lips|Cough with blood/i.test(associated))
    add("resp-distress", "Respiratory distress features", `Reported: ${associated}.`);

  if (complaintId === "breathlessness" && /rest/i.test(answers["hpi.exertion"] ?? ""))
    add("dyspnoea-rest", "Breathlessness at rest", "Dyspnoea at rest requires immediate review.");

  if (/Weakness on one side|Slurred speech|Sudden worst-ever/i.test(associated))
    add("stroke", "Possible stroke warning signs", `Reported: ${associated}.`);

  if (/Loss of consciousness|Fainting/i.test(associated))
    add("syncope", "Loss of consciousness reported", "Syncope episode reported during intake.");

  if (/Vomiting blood|Black stools|Severe bleeding/i.test(associated))
    add("bleed", "Possible significant bleeding", `Reported: ${associated}.`);

  if (/Confusion or drowsiness/i.test(associated))
    add("altered", "Altered sensorium reported", "Confusion or drowsiness reported with fever.");

  if (/Unable to pass urine/i.test(associated))
    add("urinary", "Urinary retention", "Unable to pass urine — needs urgent review.", "moderate");

  if (walkTalk === "No, I need help")
    add("mobility", "Unable to mobilise unaided", "Patient reports needing assistance to walk/speak.");
  else if (walkTalk === "With difficulty")
    add("mobility-mod", "Difficulty walking or speaking", "Reduced functional capacity at intake.", "moderate");

  if (severity >= 9) add("pain-extreme", "Extreme pain score", `Pain rated ${severity}/10.`, "moderate");

  if (/Stopped on my own|Ran out/i.test(answers["hpi.adherence"] ?? ""))
    add("adherence", "Medication non-adherence", "Patient not currently on prescribed therapy.", "moderate");

  return flags;
}

export function priorityFromFlags(flags: RedFlag[]): "routine" | "priority" | "emergency" {
  if (flags.some((f) => f.severity === "high")) return "emergency";
  if (flags.length > 0) return "priority";
  return "routine";
}

export function assistantAck(prompt: string, previousValue?: string): string {
  if (!previousValue) return prompt;
  const acks = [
    "Thank you for sharing that.",
    "Noted.",
    "That's helpful.",
    "I understand.",
    "Got it, thank you.",
  ];
  return `${acks[previousValue.length % acks.length]} ${prompt}`;
}
