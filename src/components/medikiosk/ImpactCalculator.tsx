import { useState } from "react";
import { Clock, Users, ArrowRight } from "lucide-react";
import { Slider } from "@/components/ui/slider";

export function ImpactCalculator() {
  const [patientsPerDay, setPatientsPerDay] = useState(5000);
  const without = 5; // minutes
  const withSystem = 1; // minutes
  const savedPerPatient = without - withSystem;
  const totalSavedMin = patientsPerDay * savedPerPatient;
  const totalSavedHours = Math.round(totalSavedMin / 60);

  return (
    <div className="rounded-3xl border border-border bg-card p-6 shadow-lift md:p-10">
      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <h3 className="text-2xl font-bold tracking-tight text-foreground">Impact Calculator</h3>
          <p className="mt-2 text-muted-foreground">See how much doctor time MediKiosk can reclaim every day.</p>

          <div className="mt-8">
            <label className="text-sm font-medium text-muted-foreground">Patients per day</label>
            <div className="mt-3 flex items-center gap-4">
              <Slider
                value={[patientsPerDay]}
                onValueChange={(v) => setPatientsPerDay(v[0] ?? 0)}
                min={500}
                max={20000}
                step={500}
                className="flex-1"
              />
              <span className="w-20 text-right text-lg font-semibold tabular-nums text-foreground">{patientsPerDay.toLocaleString()}</span>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="rounded-2xl bg-muted/50 p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Clock className="h-4 w-4" />
                Without MediKiosk
              </div>
              <div className="mt-2 text-2xl font-bold text-foreground">{without} min</div>
              <div className="text-xs text-muted-foreground">Average history-taking</div>
            </div>
            <div className="rounded-2xl bg-primary/10 p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-primary">
                <Clock className="h-4 w-4" />
                With MediKiosk
              </div>
              <div className="mt-2 text-2xl font-bold text-primary">{withSystem} min</div>
              <div className="text-xs text-primary/80">Doctor review</div>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center rounded-3xl bg-gradient-to-br from-primary to-accent p-8 text-primary-foreground">
          <div className="flex items-center gap-3">
            <Users className="h-8 w-8" />
            <span className="text-lg font-medium opacity-90">Potential time saved</span>
          </div>
          <div className="mt-4 text-5xl font-extrabold tracking-tight">{totalSavedHours.toLocaleString()} hrs</div>
          <div className="mt-2 text-primary-foreground/90">per day across {patientsPerDay.toLocaleString()} patients</div>
          <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-semibold backdrop-blur-sm">
            <ArrowRight className="h-4 w-4" />
            {savedPerPatient} minutes saved per patient
          </div>
        </div>
      </div>
    </div>
  );
}
