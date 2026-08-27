import { Clock, User } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PatientRecord } from "@/lib/medikiosk/types";
import { PriorityBadge } from "./PriorityBadge";

export function QueueCard({
  patient,
  selected,
  onClick,
}: {
  patient: PatientRecord;
  selected?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full rounded-xl border-l-4 bg-card p-4 text-left shadow-soft transition-all hover:shadow-lift",
        patient.priority === "emergency" ? "border-l-emergency" : patient.priority === "priority" ? "border-l-warning" : "border-l-success",
        selected && "ring-2 ring-primary ring-offset-2 ring-offset-background",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
            <User className="h-5 w-5" />
          </div>
          <div>
            <div className="font-semibold text-foreground">{patient.name}</div>
            <div className="text-xs text-muted-foreground">
              {patient.age} y • {patient.gender} • {patient.token}
            </div>
          </div>
        </div>
        <PriorityBadge priority={patient.priority} />
      </div>
      <div className="mt-3 flex items-center gap-3 text-sm">
        <span className="rounded-md bg-secondary px-2 py-1 font-medium text-secondary-foreground">{patient.chiefComplaint || "—"}</span>
      </div>
      <div className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
        <Clock className="h-3.5 w-3.5" />
        {Math.floor(patient.intakeSeconds / 60)}m {patient.intakeSeconds % 60}s intake
      </div>
    </button>
  );
}
