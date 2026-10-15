import { useEffect, useRef, useState, type FormEvent } from "react";
import type { Message, Suggestion, WorkItem } from "../types";

type Props = {
  messages: Message[];
  suggestions: Suggestion[];
  awaiting: boolean;
  typing: boolean;
  activeWork: WorkItem | null;
  workDone: boolean;
  started: boolean;
  stage: string;
  onSend: (text: string) => void;
};

export function ChatPane({
  messages,
  suggestions,
  awaiting,
  typing,
  activeWork,
  workDone,
  started,
  stage,
  onSend,
}: Props) {
  const [draft, setDraft] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = scrollRef.current;
    if (!node) return;
    node.scrollTop = node.scrollHeight;
  }, [messages, typing, suggestions]);

  function submit(event: FormEvent) {
    event.preventDefault();
    const text = draft.trim();
    if (!text) return;
    onSend(text);
    setDraft("");
  }

  const workingLabel = !started
    ? null
    : typing
      ? "Thinking it through"
      : activeWork
        ? activeWork.label
        : workDone && (stage === "readiness" || stage === "pack")
          ? "First pass finished. Remaining judgements are human."
          : awaiting
            ? "Waiting for your view on this one"
            : null;

  return (
    <section className="chat-pane" aria-label="Conversation">
      <div className="chat-scroll" ref={scrollRef}>
        {messages.map((message, index) => {
          const showLabel = index === 0 || messages[index - 1].role !== message.role;
          return (
            <article key={message.id} className={`msg msg-${message.role}`}>
              {showLabel ? (
                <span className="msg-label">{message.role === "assistant" ? "Alongside" : "You"}</span>
              ) : null}
              <div className="msg-body">{message.text}</div>
            </article>
          );
        })}
        {typing ? (
          <p className="working" aria-live="polite">
            <span className="working-dot" />
            Working
          </p>
        ) : null}
      </div>

      <form className="composer" onSubmit={submit}>
        {suggestions.length > 0 ? (
          <div className="suggestions" aria-label="Suggested replies">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion.id}
                type="button"
                className={suggestion.primary ? "chip chip-primary" : "chip"}
                onClick={() => onSend(suggestion.label)}
              >
                {suggestion.label}
              </button>
            ))}
          </div>
        ) : null}

        <div className="composer-row">
          <input
            aria-label="Reply"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Reply, or steer it another way"
            disabled={typing}
          />
          <button className="send-btn" type="submit" disabled={typing || !draft.trim()}>
            Send
          </button>
        </div>

        {workingLabel ? (
          <p className="working" aria-live="polite">
            {activeWork || typing ? <span className="working-dot" /> : null}
            {workingLabel}
          </p>
        ) : null}
      </form>
    </section>
  );
}
