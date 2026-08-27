import { Leaf } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { PatientRecord } from "@/lib/medikiosk/types";

export function AyushSummary({ patient }: { patient: PatientRecord }) {
  if (!patient.ayush) return null;
  const d = patient.ayush.dashavidha;
  return (
    <Card className="border-ayush/30 bg-ayush/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base font-semibold text-ayush">
          <Leaf className="h-5 w-5" />
          Ayurvedic Intake Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          {Object.entries(d).map(([k, v]) => (
            <div key={k} className="rounded-lg bg-card p-3 shadow-soft">
              <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{k}</div>
              <div className="mt-1 text-sm font-medium text-foreground">{v}</div>
            </div>
          ))}
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg bg-card p-3 shadow-soft">
            <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Agni</div>
            <div className="mt-1 text-sm font-medium text-foreground">{patient.ayush.agni}</div>
          </div>
          <div className="rounded-lg bg-card p-3 shadow-soft">
            <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Ahara</div>
            <div className="mt-1 text-sm font-medium text-foreground">{patient.ayush.ahara}</div>
          </div>
          <div className="rounded-lg bg-card p-3 shadow-soft">
            <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Vihara</div>
            <div className="mt-1 text-sm font-medium text-foreground">{patient.ayush.vihara}</div>
          </div>
          <div className="rounded-lg bg-card p-3 shadow-soft">
            <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Koshtha</div>
            <div className="mt-1 text-sm font-medium text-foreground">{patient.ayush.koshtha}</div>
          </div>
        </div>
        <div className="rounded-lg bg-card p-3 shadow-soft">
          <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Nidana (perceived trigger)</div>
          <div className="mt-1 text-sm font-medium text-foreground">{patient.ayush.nidana}</div>
        </div>
        <p className="text-xs italic text-muted-foreground">
          This information is structured for the Ayurvedic practitioner. It does not generate an autonomous diagnosis.
        </p>
      </CardContent>
    </Card>
  );
}
