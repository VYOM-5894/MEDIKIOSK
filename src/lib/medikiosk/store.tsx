import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useHydrated } from "@tanstack/react-router";
import type { ExtractedDocument, PatientRecord, Priority, RedFlag, TimelineEvent } from "./types";
import { seedPatients, uid, extractDocument, timelineFromDocuments } from "./mockData";
import { buildSummary, summaryToText } from "./summary";
import { detectRedFlags, priorityFromFlags } from "./engine";

const STORAGE_KEY = "medikiosk-store-v1";

interface StoreState {
  patients: PatientRecord[];
  currentId: string | null;
  a11y: { large: boolean; contrast: boolean };
}

interface StoreActions {
  startPatient: (partial: Partial<PatientRecord> & Pick<PatientRecord, "name" | "age" | "gender" | "abhaId" | "mobile" | "language" | "mode">) => PatientRecord;
  setCurrent: (id: string | null) => void;
  updateCurrent: (patch: Partial<PatientRecord>) => void;
  addAnswer: (questionId: string, question: string, value: string, section: string) => void;
  setChiefComplaint: (complaint: string) => void;
  runRedFlags: () => void;
  addDocument: (fileName: string, kind?: ExtractedDocument["kind"]) => void;
  updateDocument: (docId: string, patch: Partial<ExtractedDocument>) => void;
  removeDocument: (docId: string) => void;
  approveSummary: (id: string) => void;
  rejectSummary: (id: string) => void;
  setDoctorNote: (id: string, note: string) => void;
  overrideSummary: (id: string, text: string) => void;
  removePatient: (id: string) => void;
  toggleA11y: (key: "large" | "contrast") => void;
  resetQueue: () => void;
}

type Store = StoreState & StoreActions;

const StoreContext = createContext<Store | null>(null);

function defaultState(): StoreState {
  return {
    patients: seedPatients(),
    currentId: null,
    a11y: { large: false, contrast: false },
  };
}

export function MediKioskProvider({ children }: { children: ReactNode }) {
  const hydrated = useHydrated();
  const [state, setState] = useState<StoreState>(() => ({
    patients: [],
    currentId: null,
    a11y: { large: false, contrast: false },
  }));

  // Load persisted state client-side only
  useEffect(() => {
    if (!hydrated) return;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as StoreState;
        setState((s) => ({
          ...s,
          patients: parsed.patients?.length ? parsed.patients : seedPatients(),
          a11y: parsed.a11y ?? { large: false, contrast: false },
        }));
      } else {
        setState((s) => ({ ...s, patients: seedPatients() }));
      }
    } catch {
      setState((s) => ({ ...s, patients: seedPatients() }));
    }
  }, [hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ patients: state.patients, a11y: state.a11y }));
    document.documentElement.classList.toggle("a11y-large", state.a11y.large);
    document.documentElement.classList.toggle("a11y-contrast", state.a11y.contrast);
  }, [state.patients, state.a11y, hydrated]);

  const setCurrent = useCallback((id: string | null) => {
    setState((s) => ({ ...s, currentId: id }));
  }, []);

  const startPatient = useCallback(
    (partial: Partial<PatientRecord> & Pick<PatientRecord, "name" | "age" | "gender" | "language" | "mode">): PatientRecord => {
      const patient: PatientRecord = {
        id: uid("pt"),
        token: `OPD-${String(Math.floor(Math.random() * 900) + 100)}`,
        name: partial.name,
        age: partial.age,
        gender: partial.gender,
        abhaId: partial.abhaId ?? "",
        mobile: partial.mobile ?? "",
        language: partial.language,
        mode: partial.mode,
        consentAt: null,
        chiefComplaint: "",
        answers: [],
        redFlags: [],
        priority: "routine",
        status: "in-intake",
        documents: [],
        timeline: [],
        ayush: null,
        summaryOverride: null,
        doctorNote: "",
        createdAt: new Date().toISOString(),
        completedAt: null,
        intakeSeconds: 0,
        inputMode: "touch",
        abdm: { abhaLinked: true, consentVerified: false, recordReady: false },
      };
      setState((s) => ({ ...s, patients: [patient, ...s.patients], currentId: patient.id }));
      return patient;
    },
    [],
  );

  const updateCurrent = useCallback((patch: Partial<PatientRecord>) => {
    setState((s) => {
      if (!s.currentId) return s;
      return {
        ...s,
        patients: s.patients.map((p) => (p.id === s.currentId ? { ...p, ...patch } : p)),
      };
    });
  }, []);

  const addAnswer = useCallback((questionId: string, question: string, value: string, section: string) => {
    setState((s) => {
      if (!s.currentId) return s;
      return {
        ...s,
        patients: s.patients.map((p) =>
          p.id === s.currentId
            ? {
                ...p,
                answers: [...p.answers.filter((a) => a.questionId !== questionId), { questionId, question, value, section, at: new Date().toISOString() }],
              }
            : p,
        ),
      };
    });
  }, []);

  const setChiefComplaint = useCallback((complaint: string) => {
    setState((s) => {
      if (!s.currentId) return s;
      return {
        ...s,
        patients: s.patients.map((p) => (p.id === s.currentId ? { ...p, chiefComplaint: complaint } : p)),
      };
    });
  }, []);

  const runRedFlags = useCallback(() => {
    setState((s) => {
      if (!s.currentId) return s;
      return {
        ...s,
        patients: s.patients.map((p) => {
          if (p.id !== s.currentId) return p;
          const answerMap = Object.fromEntries(p.answers.map((a) => [a.questionId, a.value]));
          const flags = detectRedFlags(complaintIdFromComplaint(p.chiefComplaint), answerMap);
          const priority = priorityFromFlags(flags);
          return { ...p, redFlags: flags, priority };
        }),
      };
    });
  }, []);

  const addDocument = useCallback((fileName: string, kind?: ExtractedDocument["kind"]) => {
    setState((s) => {
      if (!s.currentId) return s;
      return {
        ...s,
        patients: s.patients.map((p) => {
          if (p.id !== s.currentId) return p;
          const doc = extractDocument(fileName, kind);
          const docs = [...p.documents, doc];
          return { ...p, documents: docs, timeline: timelineFromDocuments(docs) };
        }),
      };
    });
  }, []);

  const updateDocument = useCallback((docId: string, patch: Partial<ExtractedDocument>) => {
    setState((s) => {
      if (!s.currentId) return s;
      return {
        ...s,
        patients: s.patients.map((p) => {
          if (p.id !== s.currentId) return p;
          const docs = p.documents.map((d) => (d.id === docId ? { ...d, ...patch } : d));
          return { ...p, documents: docs, timeline: timelineFromDocuments(docs) };
        }),
      };
    });
  }, []);

  const removeDocument = useCallback((docId: string) => {
    setState((s) => {
      if (!s.currentId) return s;
      return {
        ...s,
        patients: s.patients.map((p) => {
          if (p.id !== s.currentId) return p;
          const docs = p.documents.filter((d) => d.id !== docId);
          return { ...p, documents: docs, timeline: timelineFromDocuments(docs) };
        }),
      };
    });
  }, []);

  const approveSummary = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      patients: s.patients.map((p) => (p.id === id ? { ...p, status: "approved" as PatientRecord["status"] } : p)),
    }));
  }, []);

  const rejectSummary = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      patients: s.patients.map((p) => (p.id === id ? { ...p, status: "rejected" as PatientRecord["status"] } : p)),
    }));
  }, []);

  const setDoctorNote = useCallback((id: string, note: string) => {
    setState((s) => ({
      ...s,
      patients: s.patients.map((p) => (p.id === id ? { ...p, doctorNote: note } : p)),
    }));
  }, []);

  const overrideSummary = useCallback((id: string, text: string) => {
    setState((s) => ({
      ...s,
      patients: s.patients.map((p) => (p.id === id ? { ...p, summaryOverride: text } : p)),
    }));
  }, []);

  const removePatient = useCallback((id: string) => {
    setState((s) => ({ ...s, patients: s.patients.filter((p) => p.id !== id), currentId: s.currentId === id ? null : s.currentId }));
  }, []);

  const toggleA11y = useCallback((key: "large" | "contrast") => {
    setState((s) => ({ ...s, a11y: { ...s.a11y, [key]: !s.a11y[key] } }));
  }, []);

  const resetQueue = useCallback(() => {
    setState((s) => ({ ...s, patients: seedPatients() }));
  }, []);

  const value = useMemo<Store>(
    () => ({
      ...state,
      setCurrent,
      startPatient,
      updateCurrent,
      addAnswer,
      setChiefComplaint,
      runRedFlags,
      addDocument,
      updateDocument,
      removeDocument,
      approveSummary,
      rejectSummary,
      setDoctorNote,
      overrideSummary,
      removePatient,
      toggleA11y,
      resetQueue,
    }),
    [state, setCurrent, startPatient, updateCurrent, addAnswer, setChiefComplaint, runRedFlags, addDocument, updateDocument, removeDocument, approveSummary, rejectSummary, setDoctorNote, overrideSummary, removePatient, toggleA11y, resetQueue],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useMediKiosk() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useMediKiosk must be used within MediKioskProvider");
  return ctx;
}

export function useCurrentPatient(): PatientRecord | null {
  const { patients, currentId } = useMediKiosk();
  return patients.find((p) => p.id === currentId) ?? null;
}

function complaintIdFromComplaint(label: string): string {
  const map: Record<string, string> = {
    "Chest pain": "chest-pain",
    "Breathing difficulty": "breathlessness",
    Headache: "headache",
    "Stomach / abdominal pain": "abdominal-pain",
    Fever: "fever",
    "Diabetes / BP follow-up": "diabetes-followup",
    "Joint or back pain": "joint-pain",
    "Something else": "other",
  };
  return map[label] ?? "other";
}

export { buildSummary, summaryToText, timelineFromDocuments, detectRedFlags, priorityFromFlags };
