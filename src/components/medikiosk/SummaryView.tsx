import { AlertCircle, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { PatientRecord } from "@/lib/medikiosk/types";
import { buildSummary } from "@/lib/medikiosk/store";
import { t, type LanguageCode } from "@/lib/medikiosk/i18n";
import { cn } from "@/lib/utils";

export function SummaryView({ patient, lang = "en" }: { patient: PatientRecord; lang?: LanguageCode }) {
  const sections = buildSummary(patient);

  return (
    <div className="space-y-4">
      {patient.redFlags.length > 0 && (
        <Card className="border-emergency/20 bg-emergency/5">
          <CardContent className="flex items-start gap-3 py-4">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-emergency" />
            <div>
              <div className="font-semibold text-emergency">{t("emergencyDetected", lang)} — {t("emergencyNotice", lang)}</div>
            </div>
          </CardContent>
        </Card>
      )}


      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <FileText className="h-4 w-4" />
        <span>AI-GENERATED DRAFT — REQUIRES PHYSICIAN REVIEW</span>
      </div>

      {sections.map((section) => (
        <Card
          key={section.title}
          className={cn(
            "overflow-hidden",
            section.tone === "warning" ? "border-warning/40 bg-warning/10" : "border-border bg-card",
          )}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-foreground">{section.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">{section.body}</div>
          </CardContent>
        </Card>
      ))}

      <div className="rounded-2xl border border-dashed border-border bg-muted/30 p-4 text-center text-xs text-muted-foreground">
        {t("aiDisclaimer", lang)}
      </div>
    </div>
  );
}
