import { Mic, MicOff, Keyboard } from "lucide-react";
import { useEffect, useRef, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SpeechRecognitionLike {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  onresult: ((event: any) => void) | null;
  onerror: ((event: any) => void) | null;
  start: () => void;
  stop: () => void;
}
type SpeechRecognitionCtor = new () => SpeechRecognitionLike;

interface VoiceOrbProps {
  listening: boolean;
  transcript: string;
  onToggle: () => void;
  onSwitchToType?: () => void;
  lang?: string;
  label?: string;
}

export function VoiceOrb({ listening, transcript, onToggle, onSwitchToType, lang = "en-IN", label }: VoiceOrbProps) {
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    setSupported(typeof window !== "undefined" && ("SpeechRecognition" in window || "webkitSpeechRecognition" in window));
  }, []);

  return (
    <div className="flex flex-col items-center gap-4">
      <button
        type="button"
        onClick={onToggle}
        disabled={!supported}
        aria-label={listening ? "Stop listening" : "Start listening"}
        className={cn(
          "relative flex h-28 w-28 items-center justify-center rounded-full transition-all focus:outline-none focus:ring-4 focus:ring-primary/30",
          listening
            ? "bg-emergency text-emergency-foreground shadow-[0_0_40px_rgba(var(--emergency)/0.35)]"
            : "bg-primary text-primary-foreground shadow-lift hover:scale-105",
        )}
      >
        <span className="animate-pulse-ring absolute inset-0 rounded-full" />
        {listening ? <Mic className="h-10 w-10 animate-pulse" /> : <MicOff className="h-10 w-10" />}
      </button>
      <div className="text-center">
        <div className="text-lg font-semibold text-foreground">{listening ? label || "Listening..." : label || "Tap microphone to speak"}</div>
        {transcript ? <div className="mt-1 max-w-md text-sm text-muted-foreground">“{transcript}”</div> : null}
        {!supported ? <div className="mt-1 text-xs text-muted-foreground">Voice not supported in this browser.</div> : null}
      </div>
      {onSwitchToType && (
        <Button variant="outline" size="sm" onClick={onSwitchToType} className="gap-2">
          <Keyboard className="h-4 w-4" />
          Type Instead
        </Button>
      )}
    </div>
  );
}

/** Hook that wraps Web Speech API for the intake assistant. */
export function useSpeech({ lang = "en-IN", onResult }: { lang?: string; onResult: (text: string) => void }) {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
    setListening(false);
  }, []);

  const start = useCallback(() => {
    if (typeof window === "undefined") return;
    const w = window as unknown as { SpeechRecognition?: SpeechRecognitionCtor; webkitSpeechRecognition?: SpeechRecognitionCtor };
    const SR = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!SR) return;

    const rec = new SR();
    rec.continuous = false;
    rec.interimResults = true;
    rec.lang = lang;
    rec.onstart = () => setListening(true);
    rec.onend = () => setListening(false);
    rec.onresult = (event: any) => {
      let interim = "";
      let final = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const r = event.results[i]!;
        if (r.isFinal) final += r[0]!.transcript;
        else interim += r[0]!.transcript;
      }
      setTranscript(interim || final);
      if (final) {
        onResult(final.trim());
        rec.stop();
      }
    };
    rec.onerror = () => rec.stop();
    recognitionRef.current = rec;
    rec.start();
  }, [lang, onResult]);

  const toggle = useCallback(() => {
    if (listening) stop();
    else start();
  }, [listening, start, stop]);

  const speak = useCallback(
    (text: string) => {
      if (typeof window === "undefined") return;
      const u = new SpeechSynthesisUtterance(text);
      u.lang = lang;
      u.rate = 0.95;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(u);
    },
    [lang],
  );

  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  return { listening, transcript, toggle, speak, setTranscript };
}
