import type { PatientRecord, Priority } from "./types";

export interface DoctorProfile {
  id: string;
  name: string;
  department: string;
  qualification: string;
  room: string;
  handles: Priority[];
}

export const DOCTORS: DoctorProfile[] = [
  {
    id: "doc-emg",
    name: "Dr. Ananya Rao",
    department: "Emergency & Critical Care",
    qualification: "MBBS, MD (Emergency Medicine)",
    room: "Resus Bay 1",
    handles: ["emergency"],
  },
  {
    id: "doc-med",
    name: "Dr. Vikram Iyer",
    department: "General Medicine",
    qualification: "MBBS, MD (Internal Medicine)",
    room: "OPD Room 4",
    handles: ["priority", "routine"],
  },
  {
    id: "doc-fam",
    name: "Dr. Meera Joshi",
    department: "Family Medicine",
    qualification: "MBBS, DNB (Family Medicine)",
    room: "OPD Room 7",
    handles: ["routine"],
  },
  {
    id: "doc-ayush",
    name: "Vaidya Sanjeev Kulkarni",
    department: "AYUSH — Ayurveda",
    qualification: "BAMS, MD (Kayachikitsa)",
    room: "AYUSH Wing 2",
    handles: ["routine", "priority"],
  },
];

export interface Assignment {
  doctorId: string;
  doctorName: string;
  department: string;
  qualification: string;
  room: string;
  kind: "instant" | "scheduled";
  slotAt: string;
  queueNumber: number;
  assignedAt: string;
}

function pickDoctor(patient: PatientRecord): DoctorProfile {
  if (patient.priority === "emergency") return DOCTORS[0]!;
  if (patient.mode === "ayush") return DOCTORS[3]!;
  const pool = DOCTORS.filter((d) => d.handles.includes(patient.priority) && d.id !== "doc-emg" && d.id !== "doc-ayush");
  const idx = Math.abs(hash(patient.id)) % pool.length;
  return pool[idx] ?? DOCTORS[1]!;
}

function hash(value: string): number {
  let h = 0;
  for (let i = 0; i < value.length; i += 1) h = (h * 31 + value.charCodeAt(i)) | 0;
  return h;
}

/** Emergency patients get an instant slot; others the next free slot in their priority band. */
export function assignAppointment(patient: PatientRecord, existing: PatientRecord[]): Assignment {
  const doctor = pickDoctor(patient);
  const now = new Date();
  const sameDoctor = existing.filter((p) => p.assignment?.doctorId === doctor.id && p.id !== patient.id);
  const queueNumber = sameDoctor.length + 1;

  if (patient.priority === "emergency") {
    return {
      doctorId: doctor.id,
      doctorName: doctor.name,
      department: doctor.department,
      qualification: doctor.qualification,
      room: doctor.room,
      kind: "instant",
      slotAt: now.toISOString(),
      queueNumber: 0,
      assignedAt: now.toISOString(),
    };
  }

  const leadMinutes = patient.priority === "priority" ? 10 : 25;
  const slot = new Date(now.getTime() + (leadMinutes + (queueNumber - 1) * 15) * 60_000);
  slot.setSeconds(0, 0);
  slot.setMinutes(Math.ceil(slot.getMinutes() / 5) * 5);

  return {
    doctorId: doctor.id,
    doctorName: doctor.name,
    department: doctor.department,
    qualification: doctor.qualification,
    room: doctor.room,
    kind: "scheduled",
    slotAt: slot.toISOString(),
    queueNumber,
    assignedAt: now.toISOString(),
  };
}

export function formatSlot(iso: string): string {
  return new Date(iso).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}
