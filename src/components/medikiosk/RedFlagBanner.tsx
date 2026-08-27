import { AlertTriangle, Siren } from "lucide-react";
import type { RedFlag } from "@/lib/medikiosk/types";
import { t, type LanguageCode } from "@/lib/medikiosk/i18n";

export function RedFlagBanner({ flags, lang = "en" }: { flags: RedFlag[]; lang?: LanguageCode }) {
  if (!flags.length) return null;
  const high = flags.some((f) => f.severity === "high");
  return (
    <div className={high ? "rounded-2xl border border-emergency/30 bg-emergency/10 p-4" : "rounded-2xl border border-warning/30 bg-warning/15 p-4"}>
      <div className="flex items-start gap-3">
        <div className={high ? "rounded-full bg-emergency p-2 text-emergency-foreground" : "rounded-full bg-warning p-2 text-warning-foreground"}>
          {high ? <Siren className="h-5 w-5" /> : <AlertTriangle className="h-5 w-5" />}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-foreground">{t("emergencyDetected", lang)}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{t("emergencyNotice", lang)}</p>
          <ul className="mt-3 space-y-1.5">
            {flags.map((f) => (
              <li key={f.id} className="flex items-start gap-2 text-sm">
                <span className={high ? "text-emergency" : "text-warning-foreground"}>•</span>
                <span>
                  <span className="font-medium">{f.label}</span>
                  {f.detail ? <span className="text-muted-foreground"> — {f.detail}</span> : null}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
