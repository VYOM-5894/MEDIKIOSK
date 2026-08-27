import { useState } from "react";
import { Volume2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { t, type LanguageCode } from "@/lib/medikiosk/i18n";

export function ConsentScreen({ lang = "en", onConsent }: { lang?: LanguageCode; onConsent: () => void }) {
  const [checked, setChecked] = useState(false);

  const playAudio = () => {
    if (typeof window === "undefined") return;
    const u = new SpeechSynthesisUtterance(t("consentBody", lang));
    u.lang = lang === "en" ? "en-IN" : `${lang}-IN`;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  };

  return (
    <Card className="mx-auto max-w-2xl border-border bg-card shadow-lift">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl font-semibold text-foreground">
          <ShieldCheck className="h-6 w-6 text-primary" />
          {t("consentTitle", lang)}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="rounded-2xl bg-muted/40 p-5 text-base leading-relaxed text-foreground">
          {t("consentBody", lang)}
        </div>

        <Button variant="outline" onClick={playAudio} className="gap-2">
          <Volume2 className="h-4 w-4" />
          {t("consentAudio", lang)}
        </Button>

        <div className="flex items-start gap-3 rounded-xl border border-border p-4">
          <Checkbox
            id="consent"
            checked={checked}
            onCheckedChange={(v) => setChecked(v === true)}
            className="mt-1 h-6 w-6"
          />
          <label htmlFor="consent" className="text-sm leading-relaxed text-foreground">
            I have read and understood the above. I give my explicit consent to proceed.
          </label>
        </div>

        <Button size="lg" className="w-full" disabled={!checked} onClick={onConsent}>
          {t("continue", lang)}
        </Button>
      </CardContent>
    </Card>
  );
}
