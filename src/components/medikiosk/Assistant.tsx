import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { HeadsetIcon, MessageSquare, X } from "lucide-react";
import { useMemo, useState } from "react";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
} from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const SUGGESTIONS = [
  "How does patient intake work?",
  "When will I know my doctor and time slot?",
  "What happens if I have warning symptoms?",
  "How do hospital staff sign in?",
];

export function Assistant() {
  const [open, setOpen] = useState(false);
  const transport = useMemo(() => new DefaultChatTransport({ api: "/api/chat" }), []);
  const { messages, sendMessage, status } = useChat({
    transport,
    onError: (error) => toast.error(error.message || "The help assistant is unavailable."),
  });

  const busy = status === "submitted" || status === "streaming";

  return (
    <>
      {!open && (
        <Button
          onClick={() => setOpen(true)}
          className="fixed bottom-5 right-5 z-50 h-12 gap-2 rounded-none px-4 shadow-lift"
          aria-label="Open help assistant"
        >
          <MessageSquare className="h-5 w-5" />
          <span className="hidden sm:inline">Help Desk</span>
        </Button>
      )}

      {open && (
        <div className="fixed inset-x-2 bottom-2 z-50 flex h-[min(78vh,620px)] flex-col border border-border bg-card shadow-lift sm:inset-x-auto sm:right-5 sm:bottom-5 sm:w-[400px]">
          <div className="h-1 shrink-0 tricolor-rule" />
          <div className="flex shrink-0 items-center justify-between gap-2 bg-primary px-4 py-3 text-primary-foreground">
            <div className="flex items-center gap-2">
              <HeadsetIcon className="h-5 w-5" />
              <div>
                <p className="text-sm font-semibold">MediKiosk Help Desk</p>
                <p className="text-xs opacity-80">Sahayak · AI assistant</p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close help assistant"
              className="rounded-sm p-1 hover:bg-primary-foreground/15"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <Conversation className="flex-1">
            <ConversationContent className="gap-3 p-4">
              {messages.length === 0 && (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Namaste. Ask me anything about MediKiosk — intake, appointments, languages,
                    triage priority or staff access. I do not provide medical advice.
                  </p>
                  <div className="flex flex-col gap-2">
                    {SUGGESTIONS.map((s) => (
                      <button
                        key={s}
                        onClick={() => void sendMessage({ text: s })}
                        className="border-l-2 border-l-accent bg-muted px-3 py-2 text-left text-sm text-foreground transition-colors hover:bg-secondary"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((message) => {
                const text = message.parts
                  .map((part) => (part.type === "text" ? part.text : ""))
                  .join("");
                if (!text) return null;
                return (
                  <Message from={message.role} key={message.id}>
                    <MessageContent
                      className={
                        message.role === "user"
                          ? "rounded-none bg-primary text-primary-foreground"
                          : "rounded-none bg-transparent p-0 text-foreground"
                      }
                    >
                      <MessageResponse>{text}</MessageResponse>
                    </MessageContent>
                  </Message>
                );
              })}

              {status === "submitted" && <Shimmer className="text-sm">Thinking...</Shimmer>}
            </ConversationContent>
            <ConversationScrollButton />
          </Conversation>

          <div className="shrink-0 border-t border-border p-3">
            <PromptInput
              onSubmit={(message) => {
                const text = message.text.trim();
                if (!text || busy) return;
                void sendMessage({ text });
              }}
            >
              <PromptInputTextarea placeholder="Type your question…" />
              <PromptInputFooter className="justify-end">
                <PromptInputSubmit status={status} disabled={busy} />
              </PromptInputFooter>
            </PromptInput>
            <p className="mt-2 text-[11px] leading-snug text-muted-foreground">
              For emergencies call 108. This assistant does not diagnose or prescribe.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
