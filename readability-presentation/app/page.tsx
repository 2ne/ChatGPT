"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  LayoutGroup,
  useScroll,
  useTransform,
  useInView,
} from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import {
  Check,
  Circle,
  Code2,
  Command,
  GitPullRequest,
  Moon,
  Sparkles,
  X,
} from "lucide-react";

const earthPhotoSrc = `${import.meta.env.BASE_URL}images/earth-from-space.jpg`;
const missionControlSrc = `${import.meta.env.BASE_URL}images/mission-control.jpg`;

const apolloTranscript = [
  { time: "55:55:20", speaker: "SWIGERT", line: "Okay, Houston, we've had a problem here." },
  { time: "55:55:28", speaker: "CAPCOM", line: "This is Houston. Say again, please." },
  { time: "55:55:35", speaker: "LOVELL", line: "Ah, Houston, we've had a problem. We've had a Main B Bus Undervolt." },
  { time: "55:55:42", speaker: "CAPCOM", line: "Roger. Main B Undervolt." },
  { time: "55:55:58", speaker: "LOVELL", line: "Okay. Right now, Houston, the voltage is looking good." },
  { time: "55:56:10", speaker: "HAISE", line: "We had a pretty large bang associated with the caution and warning." },
  { time: "55:57:39", speaker: "LOVELL", line: "And it looks to me, looking out the hatch, that we are venting something." },
  { time: "55:57:44", speaker: "CAPCOM", line: "Roger." },
  { time: "55:57:47", speaker: "LOVELL", line: "We are venting something out into the, into space." },
  { time: "55:58:07", speaker: "LOVELL", line: "It's a gas of some sort." },
  { time: "55:58:25", speaker: "HAISE", line: "Yeah. We got a Main Bus A Undervolt now, too." },
  { time: "55:58:38", speaker: "CAPCOM", line: "Main Bus A Undervolt." },
  { time: "55:58:40", speaker: "HAISE", line: "It's reading about 25 and a half. Main B is reading zip right now." },
  { time: "55:58:48", speaker: "CAPCOM", line: "Okay." },
  { time: "55:59:08", speaker: "SWIGERT", line: "Okay, Houston. Are you still reading us okay?" },
  { time: "55:59:12", speaker: "CAPCOM", line: "That's affirmative." },
  { time: "56:00:02", speaker: "HAISE", line: "Okay, Houston. Fuel cell 1 and 3 are both showing grey flags." },
  { time: "56:00:15", speaker: "CAPCOM", line: "Roger. Copy that." },
  { time: "56:25:41", speaker: "CAPCOM", line: "We'd like you to start powering down. We'll give you the procedure." },
];

const TRANSCRIPT_WINDOW = 3;

function getSeconds(time: string) {
  const [h, m, s] = time.split(":").map(Number);
  return h * 3600 + m * 60 + s;
}

function nextTranscriptDelay(count: number) {
  if (count === 0) return 2000;
  const len = apolloTranscript.length;
  const prev = apolloTranscript[(count - 1) % len];
  const next = apolloTranscript[count % len];
  if (count % len === 0) return 2800;
  const delta = Math.max(0, getSeconds(next.time) - getSeconds(prev.time));
  return Math.min(3600, Math.max(1600, 1400 + delta * 35));
}

function HeroTranscript() {
  const [count, setCount] = useState(0);
  const start = Math.max(0, count - TRANSCRIPT_WINDOW);
  const visible = Array.from({ length: count - start }, (_, i) => {
    const abs = start + i;
    return { ...apolloTranscript[abs % apolloTranscript.length], key: abs };
  });

  useEffect(() => {
    const timer = window.setTimeout(() => setCount((n) => n + 1), nextTranscriptDelay(count));
    return () => clearTimeout(timer);
  }, [count]);

  return (
    <div className="hero-transcript" aria-hidden="true">
      <div className="transcript-meta">
        <span>Air-to-ground</span>
        <span>Apollo 13 · GET</span>
      </div>
      <div className="transcript-viewport">
        <LayoutGroup id="apollo-transcript">
          <div className="transcript-feed">
            <AnimatePresence mode="popLayout" initial={false}>
              {visible.map((entry, i) => {
                const age = visible.length - 1 - i;
                return (
                  <motion.div
                    key={entry.key}
                    className={`transcript-msg is-age-${Math.min(age, 3)}`}
                    layout
                    initial={{ opacity: 0, y: 48 }}
                    animate={{
                      opacity: age === 0 ? 1 : age === 1 ? 0.62 : 0.28,
                      y: 0,
                    }}
                    exit={{ opacity: 0, y: -56 }}
                    transition={{
                      layout: { type: "spring", stiffness: 70, damping: 20, mass: 1.05 },
                      opacity: { duration: 0.7, ease: "easeOut" },
                      y: { type: "spring", stiffness: 70, damping: 20, mass: 1.05 },
                    }}
                  >
                    <div className="transcript-msg-top">
                      <span className="transcript-speaker">{entry.speaker}</span>
                      <span className="transcript-time">{entry.time}</span>
                    </div>
                    <p className="transcript-text">{entry.line}</p>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </LayoutGroup>
      </div>
    </div>
  );
}

const sections = [
  "The call",
  "Mission Control",
  "Today",
  "Our quality bar",
  "The contrast",
  "Write consciously",
  "Choose",
  "AI",
  "Good examples",
  "The change",
  "Leave it better",
];

const systemNodes = [
  "Agents",
  "MCP",
  "Models",
  "RAG",
  "Tools",
  "Auth",
  "Search",
  "Eval",
  "Memory",
  "API",
];

function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function Stars({ count = 70 }: { count?: number }) {
  const stars = Array.from({ length: count }, (_, i) => ({
    left: `${(i * 47.13) % 100}%`,
    top: `${(i * 31.77) % 100}%`,
    size: i % 9 === 0 ? 2 : 1,
    delay: (i % 11) * 0.4,
  }));
  return (
    <div className="stars" aria-hidden="true">
      {stars.map((s, i) => (
        <i
          key={i}
          style={{
            left: s.left,
            top: s.top,
            width: s.size,
            height: s.size,
            animationDelay: `${s.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

const readItems = [
  {
    title: "Procedures.",
    line: "The exact steps when a system fails, written so anyone can follow them.",
  },
  {
    title: "Schematics.",
    line: "Where systems connect, so you can find the fault without knowing every subsystem.",
  },
  {
    title: "Checklists.",
    line: "What must be true before the next move, not left to memory under pressure.",
  },
  {
    title: "Shared knowledge.",
    line: "Captured by someone else, so the room can act as one.",
  },
];

function MissionControlSection() {
  return (
    <section data-section="1" className="mission-control section-dark">
      <div className="control-sticky-bg" aria-hidden="true">
        <div
          className="control-image"
          style={{
            backgroundImage: `linear-gradient(90deg, rgba(9, 9, 11, 0.92) 0%, rgba(9, 9, 11, 0.55) 50%, rgba(9, 9, 11, 0.72)), url(${missionControlSrc})`,
          }}
        >
          <div className="monitor-grid">{Array.from({ length: 18 }).map((_, i) => <i key={i} />)}</div>
          <div className="control-light" />
        </div>
        <div className="control-dim is-static" />
      </div>
      <div data-step className="control-panel">
        <Reveal>
          <span className="eyebrow">MISSION CONTROL</span>
          <h2>You arrive.</h2>
        </Reveal>
        <Reveal delay={0.12} className="control-lines">
          <p>The room is full of brilliant engineers.</p>
          <p>Each understands their own system.</p>
          <p>No one understands everything.</p>
        </Reveal>
      </div>
      <div data-step className="read-compact">
        <Reveal className="read-compact-prompt">
          <p>So how do they help?</p>
          <h2>READ.</h2>
        </Reveal>
        <div className="read-compact-list">
          {readItems.map((item, i) => (
            <Reveal key={item.title} delay={0.08 + i * 0.08} className="read-compact-item">
              <b>{String(i + 1).padStart(2, "0")}</b>
              <div>
                <span>{item.title}</span>
                <p>{item.line}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
      <div data-step className="apollo-lesson">
        <Reveal>
          <p>When people are working under pressure,</p>
          <h2>ambiguity is a defect.</h2>
        </Reveal>
        <Reveal delay={0.14} className="lesson-words">
          <span>Clear.</span>
          <span>Concise.</span>
          <span>Checked.</span>
        </Reveal>
        <Reveal delay={0.24} className="apollo-exit">
          <p>That is the engineering lesson. The same need exists in our own systems.</p>
        </Reveal>
      </div>
    </section>
  );
}

function Progress({ active }: { active: number }) {
  return (
    <aside className="presentation-nav" aria-label="Presentation progress">
      <span className="nav-count">{String(active + 1).padStart(2, "0")}</span>
      <div className="nav-line">
        <motion.div animate={{ height: `${((active + 1) / sections.length) * 100}%` }} />
      </div>
      <span className="nav-label">{sections[active]}</span>
    </aside>
  );
}

function CodeWindow() {
  return (
    <div className="code-window">
      <div className="window-bar">
        <div className="dots"><i /><i /><i /></div>
        <span>retry.ts</span>
        <Code2 size={14} />
      </div>
      <pre>
        <span className="muted">{"// Retry transient failures only"}</span>{"\n"}
        <span className="violet">export async function</span>{" "}
        <span className="blue">withRetry</span>
        <span>{"<T>("}</span>{"\n  "}
        <span className="blue">operation</span>: () <span className="violet">=&gt;</span> Promise&lt;T&gt;,{"\n"}
        <span>{"  { attempts = "}</span><span className="gold">3</span>, delay = <span className="gold">500</span> {"} = {}"}{"\n"}
        <span>{") {"}</span>{"\n  "}
        <span className="violet">for</span> (<span className="violet">let</span> attempt = <span className="gold">1</span>; attempt &lt;= attempts; attempt++) {"{"}{"\n    "}
        <span className="violet">try</span> {"{"} <span className="violet">return await</span> operation(); {"}"}{"\n    "}
        <span className="violet">catch</span> (error) {"{"}{"\n      "}
        <span className="violet">if</span> (attempt === attempts) <span className="violet">throw</span> error;{"\n      "}
        <span className="violet">await</span> sleep(delay * attempt);{"\n    }}\n  }\n}"}
      </pre>
    </div>
  );
}

function DocumentationTransform() {
  const [clean, setClean] = useState(false);
  return (
    <div className="docs-demo">
      <div className="demo-label">
        <span>README.md</span>
        <button type="button" onClick={() => setClean(!clean)}>
          {clean ? "Show original" : "Make it readable"}
          <Sparkles size={14} />
        </button>
      </div>
      <AnimatePresence mode="wait">
        {!clean ? (
          <motion.div
            key="dense"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, filter: "blur(10px)" }}
            className="dense-doc"
          >
            <p>
              The retry functionality is a utility that can be utilised by the
              system in circumstances where an operation has failed and it
              should be noted that the default retry count is three although
              this can be configured as required and there is also a delay that
              is increased between every execution which assists with various
              situations where an upstream service may be temporarily
              unavailable and it is important that callers understand…
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="clean"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="clean-doc"
          >
            <span className="eyebrow">RETRY UTILITY</span>
            <h3>Retry temporary failures</h3>
            <p>Runs an operation up to three times, with an increasing delay.</p>
            <div className="doc-grid">
              <div><b>Use it for</b><span>Rate limits and temporary outages</span></div>
              <div><b>Do not use it for</b><span>Validation or permission errors</span></div>
            </div>
            <code>await withRetry(() =&gt; fetchAccount(id))</code>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function PullRequest({ checklist = false }: { checklist?: boolean }) {
  const [documentationNeeded, setDocumentationNeeded] = useState(false);
  const [checkedItems, setCheckedItems] = useState<string[]>([]);

  useEffect(() => {
    if (!checklist) return;
    setDocumentationNeeded(false);
    setCheckedItems([]);
    const tick = setTimeout(() => setDocumentationNeeded(true), 900);
    return () => clearTimeout(tick);
  }, [checklist]);

  const toggleItem = (item: string) => {
    setCheckedItems((items) =>
      items.includes(item) ? items.filter((current) => current !== item) : [...items, item],
    );
  };

  return (
    <div className="pr-window">
      <div className="pr-top">
        <div><GitPullRequest size={21} /><span>docs: explain retry behaviour</span></div>
        <span className="open-pill">Open</span>
      </div>
      <div className="pr-tabs">
        <span className="active">Conversation</span><span>Commits <b>2</b></span><span>Files changed <b>3</b></span>
      </div>
      <AnimatePresence mode="wait" initial={false}>
        {checklist ? (
          <motion.div
            key="checklist"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="review-checklist"
          >
            <span className="eyebrow">REVIEWER CHECK</span>
            <button
              type="button"
              onClick={() => setDocumentationNeeded((needed) => !needed)}
              className={documentationNeeded ? "done" : ""}
            >
              <span>{documentationNeeded ? <Check size={15} /> : <Circle size={15} />}</span>
              <div className="check-label">
                Does this change need documentation?
                <small>Decide coverage before reviewing quality.</small>
              </div>
            </button>
            <AnimatePresence initial={false}>
              {documentationNeeded && (
                <motion.div
                  className="review-subchecks"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  {[
                    "Documentation included",
                    "Checked for ambiguity",
                    "Checked for concision",
                    "Reviewed by another person",
                  ].map((item) => {
                    const done = checkedItems.includes(item);
                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => toggleItem(item)}
                        className={done ? "done" : ""}
                      >
                        <span>{done ? <Check size={15} /> : <Circle size={15} />}</span>
                        <div className="check-label">{item}</div>
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            key="review"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="review-body"
          >
            <div className="review-comment">
              <div className="avatar">AR</div>
              <div><b>Alex reviewed 2 minutes ago</b><p>Can we name the failure modes explicitly?</p></div>
            </div>
            <div className="review-comment">
              <div className="avatar gold">MK</div>
              <div><b>Maya approved these changes</b><p>Clear, tested and ready to merge.</p></div>
            </div>
            <button type="button" className="merge-button"><Check size={16} /> Merge pull request</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const quizOptions = [
  {
    id: "concise",
    title: "A concise runbook",
    meta: "90-second read · no named owner",
    body: "Clear, ordered incident actions and escalation thresholds. Nobody knows which team maintains it or when it was last tested.",
    good: false,
    why: "Easy to act on, but hard to trust without ownership or verification.",
  },
  {
    id: "comprehensive",
    title: "A comprehensive page",
    meta: "Strong summary · reviewed this month",
    body: "Accurate context, architecture and ownership. The incident steps are complete, but buried halfway down the page.",
    good: false,
    why: "Trustworthy and complete, but too slow to scan during an incident.",
  },
  {
    id: "runbook",
    title: "An ordered runbook",
    meta: "Named owner · verified last week",
    body: "Clear actions, escalation thresholds and links to deeper context. The owning team and last-tested date are visible at the top.",
    good: true,
    why: "Readable and operationally safe: ordered, owned and recently verified.",
  },
];

function DocQuiz() {
  const [picked, setPicked] = useState<string | null>(null);
  const revealed = picked !== null;

  return (
    <div className="quiz">
      <div className="quiz-grid">
        {quizOptions.map((option) => {
          const selected = picked === option.id;
          const showResult = revealed;
          return (
            <button
              key={option.id}
              type="button"
              className={[
                "quiz-card",
                selected ? "is-selected" : "",
                showResult && option.good ? "is-good" : "",
                showResult && selected && !option.good ? "is-miss" : "",
                showResult && !option.good && !selected ? "is-dim" : "",
              ].filter(Boolean).join(" ")}
              onClick={() => setPicked(option.id)}
              aria-pressed={selected}
            >
              <span className="quiz-meta">{option.meta}</span>
              <h3>{option.title}</h3>
              <p>{option.body}</p>
              {showResult && (selected || option.good) && (
                <footer>
                  {option.good ? <Check size={15} /> : <X size={15} />}
                  <span>{option.why}</span>
                </footer>
              )}
            </button>
          );
        })}
      </div>
      {!revealed && (
        <p className="quiz-hint">Choose the one you would trust first.</p>
      )}
      {revealed && (
        <p className="quiz-reveal">
          Concision helps. Ownership and verification make the document trustworthy.
        </p>
      )}
    </div>
  );
}

const goodExamples = [
  {
    kind: "INCIDENT PLAYBOOK",
    title: "payments-api",
    meta: "Verified last week · 90-second read",
    lines: [
      "Symptom: checkout returns 502",
      "1. Confirm impact → Payments dashboard",
      "2. Check Redis and Stripe health",
      "3. Roll back if error rate > 5%",
      "4. Escalate to Payments on-call after 10 min",
    ],
    why: "Ordered actions. Clear escalate point.",
  },
  {
    kind: "SERVICE README",
    title: "auth-gateway",
    meta: "First screen answers the job",
    lines: [
      "What it does: issues session tokens",
      "Owner: Identity · Slack #identity-oncall",
      "Start here: /docs/local-setup",
      "Do not: call /v1/internal externally",
      "Rotate keys: /docs/rotate-keys",
    ],
    why: "Ownership and next step up front.",
  },
  {
    kind: "DECISION RECORD",
    title: "ADR-014 · Retries",
    meta: "Short enough to stay true",
    lines: [
      "Decision: exponential backoff, max 3",
      "Why: transient faults recover within 2s",
      "Not chosen: infinite retry hides outages",
      "Alert if retry rate > 2% for 5 minutes",
      "Owner: Platform reliability",
    ],
    why: "Why, not just what. Easy to challenge.",
  },
];

function ExamplesGallery() {
  const [activeExample, setActiveExample] = useState(0);
  const example = goodExamples[activeExample];

  return (
    <div className="examples-gallery">
      <div className="example-tabs" role="tablist" aria-label="Documentation examples">
        {goodExamples.map((item, index) => (
          <button
            key={item.title}
            type="button"
            role="tab"
            aria-selected={activeExample === index}
            className={activeExample === index ? "is-active" : ""}
            onClick={() => setActiveExample(index)}
          >
            <span>{item.kind}</span>
            {item.title}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.article
          key={example.title}
          role="tabpanel"
          className="example-card example-card-featured"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          <span className="example-kind">{example.kind}</span>
          <h3>{example.title}</h3>
          <small>{example.meta}</small>
          <ul>
            {example.lines.map((line) => <li key={line}>{line}</li>)}
          </ul>
          <footer className="example-why">
            <span>Why it works</span>
            <p>{example.why}</p>
          </footer>
        </motion.article>
      </AnimatePresence>
    </div>
  );
}

function App() {
  const root = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const activeStepRef = useRef(0);
  const [active, setActive] = useState(0);
  const [hintVisible, setHintVisible] = useState(true);
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.1], ["0%", "14%"]);
  const checklistBeatRef = useRef<HTMLDivElement>(null);
  const checklistInView = useInView(checklistBeatRef, { amount: 0.5 });
  const lastLineRef = useRef<HTMLDivElement>(null);
  const lastLineInView = useInView(lastLineRef, { amount: 0.45 });

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const lenis = new Lenis({
      duration: 1.05,
      smoothWheel: true,
      anchors: false,
    });
    lenisRef.current = lenis;
    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    const items = gsap.utils.toArray<HTMLElement>("[data-section]");
    const triggers = items.map((item, i) =>
      ScrollTrigger.create({
        trigger: item,
        start: "top 55%",
        end: "bottom 45%",
        onEnter: () => setActive(i),
        onEnterBack: () => setActive(i),
      })
    );
    const steps = gsap.utils.toArray<HTMLElement>("[data-step]");
    const stepTriggers = steps.map((item, index) =>
      ScrollTrigger.create({
        trigger: item,
        start: "top 55%",
        end: "bottom 45%",
        onEnter: () => { activeStepRef.current = index; },
        onEnterBack: () => { activeStepRef.current = index; },
      })
    );

    const hideHint = window.setTimeout(() => setHintVisible(false), 5000);

    return () => {
      window.clearTimeout(hideHint);
      triggers.forEach((t) => t.kill());
      stepTriggers.forEach((t) => t.kill());
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  useEffect(() => {
    const isTypingTarget = (target: EventTarget | null) => {
      if (!(target instanceof HTMLElement)) return false;
      const tag = target.tagName;
      return tag === "INPUT" || tag === "TEXTAREA" || target.isContentEditable;
    };

    const go = (dir: 1 | -1) => {
      const items = Array.from(document.querySelectorAll<HTMLElement>("[data-step]"));
      const next = Math.min(items.length - 1, Math.max(0, activeStepRef.current + dir));
      const el = items[next];
      if (!el) return;
      setHintVisible(false);
      activeStepRef.current = next;
      lenisRef.current?.scrollTo(el, { offset: 0, duration: 1.05 });
    };

    const onKey = (event: KeyboardEvent) => {
      if (isTypingTarget(event.target)) return;
      if (event.metaKey || event.ctrlKey || event.altKey) return;

      if (["ArrowDown", "ArrowRight", "PageDown", " "].includes(event.key)) {
        event.preventDefault();
        go(1);
      } else if (["ArrowUp", "ArrowLeft", "PageUp"].includes(event.key)) {
        event.preventDefault();
        go(-1);
      } else if (event.key === "Home") {
        event.preventDefault();
        const first = document.querySelector<HTMLElement>("[data-step]");
        if (first) {
          activeStepRef.current = 0;
          lenisRef.current?.scrollTo(first, { offset: 0, duration: 1.05 });
        }
      } else if (event.key === "End") {
        event.preventDefault();
        const items = document.querySelectorAll<HTMLElement>("[data-step]");
        const last = items[items.length - 1];
        if (last) {
          activeStepRef.current = items.length - 1;
          lenisRef.current?.scrollTo(last, { offset: 0, duration: 1.05 });
        }
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div ref={root}>
      <motion.div className="top-progress" style={{ scaleX: scrollYProgress }} />
      <Progress active={active} />
      <div className={`presenter-hint${hintVisible ? " is-visible" : ""}`} aria-hidden={!hintVisible}>
        <kbd>←</kbd><kbd>→</kbd>
        <span>or scroll</span>
      </div>

      <main>
        <section data-section="0" data-step className="hero section-dark">
          <Stars count={90} />
          <motion.div className="hero-orbit" style={{ y: heroY }} aria-hidden="true">
            <motion.div
              className="transcript-wrap"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.6, delay: 0.8, ease: "easeOut" }}
            >
              <HeroTranscript />
            </motion.div>
          </motion.div>
          <div className="hero-copy">
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.2 }} className="mission-label">
              IMAGINE THIS
            </motion.p>
            <motion.h1 initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.5 }}>
              It’s <span>2:17 a.m.</span>
            </motion.h1>
            <div className="hero-sequence">
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.9, delay: 1.4 }}>Your phone rings.</motion.p>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.9, delay: 2.4 }}>There’s been an explosion on Apollo 13.</motion.p>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.9, delay: 3.4 }}>You’re needed in Mission Control.</motion.p>
            </div>
          </div>
        </section>

        <MissionControlSection />

        <section data-section="2" data-step className="complexity section-light">
          <div className="complexity-main">
            <div className="architecture" aria-hidden="true">
              <div className="arch-ring ring-one" /><div className="arch-ring ring-two" />
              {systemNodes.map((label, i) => (
                <div
                  key={label}
                  className="arch-node"
                  style={{ offsetDistance: `${(75 + (i / systemNodes.length) * 100) % 100}%` }}
                >
                  <i /><span>{label}</span>
                </div>
              ))}
              <div className="arch-core"><Command /><span>SYSTEM</span></div>
            </div>
            <Reveal delay={0.08} className="complexity-copy">
              <span className="eyebrow">TODAY</span>
              <h2>Our systems aren’t spacecraft.</h2>
              <p>They’re becoming just as complicated, and the next person still has to understand them.</p>
              <div className="evolution"><span>Services</span><b>→</b><span>Cloud</span><b>→</b><span>AI systems</span></div>
            </Reveal>
          </div>
          <Reveal delay={0.15} className="reader-bridge">
            <span>THE HABIT</span>
            <p>Write documentation consciously. Leave it clearer than you found it. The user is the next person who has to understand your work.</p>
            <div>
              <b>New starter</b>
              <b>Engineer on call</b>
              <b>Adjacent team</b>
              <b>Future you</b>
            </div>
          </Reveal>
        </section>

        <section data-section="3" data-step className="quality-bar section-dark">
          <Reveal className="quality-copy">
            <span className="eyebrow">OUR EXISTING STRENGTH</span>
            <h2>We already write<br />readable code.</h2>
            <p>We name things carefully. We test behaviour. We review changes before they merge.</p>
            <strong>The code already has the quality bar.<br />Our documentation should meet it.</strong>
          </Reveal>
          <Reveal delay={0.12} className="quality-code">
            <CodeWindow />
          </Reveal>
        </section>

        <section data-section="4" data-step className="contrast section-dark">
          <Reveal className="section-heading">
            <span className="eyebrow">EXTEND THE STANDARD</span>
            <h2>One engineering practice.<br /><span>Two kinds of output.</span></h2>
          </Reveal>
          <div className="contrast-grid">
            <Reveal><span className="panel-title"><Check size={14} /> THE CODE</span><CodeWindow /></Reveal>
            <Reveal delay={0.12}><span className="panel-title"><X size={14} /> THE DOCUMENTATION</span><DocumentationTransform /></Reveal>
          </div>
        </section>

        <section data-section="5" data-step className="principles section-dark">
          <Reveal className="principles-heading">
            <span className="eyebrow">THREE HABITS</span>
            <h2>Write for the next reader<br />on purpose.</h2>
            <p className="principles-lead">These are the criteria. Use them when you write and when you review.</p>
          </Reveal>
          <div className="principle-list">
            {[
              ["01", "Remove ambiguity.", "Say what happens, when it happens, and who owns the next action."],
              ["02", "Be concise.", "Make the answer easy to find before making the document complete."],
              ["03", "Review it like code.", "Accuracy is expected. Readability deserves the same attention."],
            ].map(([n, title, desc], i) => (
              <Reveal key={n} delay={i * 0.08}>
                <article>
                  <span>{n}</span>
                  <h3>{title}</h3>
                  <p>{desc}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        <section data-section="6" data-step className="quiz-section section-light">
          <Reveal className="quiz-heading">
            <span className="eyebrow">CHOOSE</span>
            <h2>Which document would you rather open at 2:17 a.m.?</h2>
            <p>Pick the one you’d trust in an incident. Then we’ll look at patterns worth copying.</p>
          </Reveal>
          <Reveal delay={0.1}>
            <DocQuiz />
          </Reveal>
        </section>

        <section data-section="7" data-step className="ai-section section-dark">
          <div className="ai-halo" aria-hidden="true"><span /><span /><span /></div>
          <Reveal className="ai-heading">
            <span className="eyebrow">AI & DOCUMENTATION</span>
            <h2>AI can generate a document.<br /><em>It cannot guarantee understanding.</em></h2>
            <p>AI has made writing easy. Editing is now the valuable part.</p>
          </Reveal>
          <div className="ownership-grid">
            <Reveal className="ownership-card ai-card">
              <Sparkles /><span>AI HELPS WITH</span>
              {["First drafts", "Structure", "Consistency"].map((x) => <div key={x}><Check size={17} />{x}</div>)}
            </Reveal>
            <Reveal delay={0.12} className="ownership-card human-card">
              <Moon /><span>YOU STILL OWN</span>
              {["Audience", "Judgement", "Leaving it better"].map((x) => <div key={x}><Check size={17} />{x}</div>)}
            </Reveal>
          </div>
          <Reveal delay={0.18} className="ai-note">
            <p>Use AI to draft and structure. You still own whether the result is clear, useful and true.</p>
          </Reveal>
        </section>

        <section data-section="8" data-step className="examples-section section-light">
          <Reveal className="examples-heading">
            <span className="eyebrow">WHAT GOOD LOOKS LIKE</span>
            <h2>Three patterns worth copying.</h2>
            <p>Short. Owned. Easy to act on. Steal the shape, not the length.</p>
          </Reveal>
          <Reveal delay={0.1}><ExamplesGallery /></Reveal>
        </section>

        <section data-section="9" className="change section-dark">
          <div className="change-scroll">
            <div className="change-beats">
              <div data-step className="change-beat" ref={checklistBeatRef}>
                <Reveal className="review-copy">
                  <span className="eyebrow">ONE PRACTICAL CHANGE</span>
                  <h2>Put documentation<br />inside the review.</h2>
                  <p>First check coverage. If documentation is needed, the reviewer checks its quality.</p>
                </Reveal>
              </div>
            </div>
            <div className="change-sticky">
              <Reveal delay={0.12} className="pr-wrap"><PullRequest checklist={checklistInView} /></Reveal>
            </div>
          </div>
          <Reveal className="change-statement" >
            <div data-step className="step-anchor" />
            <span>CODE</span><i /><span>DOCUMENTATION</span>
            <p>One change. One review. One standard.</p>
          </Reveal>
        </section>

        <section data-section="10" className="finale section-dark">
          <div className="finale-sticky-bg" aria-hidden="true">
            <Stars count={100} />
            <div className={`earth${lastLineInView ? " centered" : ""}`}>
              <div className="earth-riser">
                <img className="earth-photo" src={earthPhotoSrc} alt="" decoding="async" draggable={false} />
              </div>
              <div className="earth-light" aria-hidden="true" />
            </div>
          </div>
          <div className="finale-copy">
            <Reveal className="finale-beat">
              <div data-step className="step-anchor" />
              <p>Don’t write only for yourself today.</p>
              <h2>Write for the next person.</h2>
              <span>The new starter.<br />The engineer on call.<br />Future you, six months from now, without those three shots of espresso.</span>
            </Reveal>
            <Reveal className="finale-beat final-message">
              <div data-step className="step-anchor" />
              <p>One day, someone will rely on what you’ve written.</p>
              <h3>Make the problem<br />easier to solve.</h3>
            </Reveal>
            <div ref={lastLineRef}>
              <Reveal className="finale-beat last-line">
                <div data-step className="step-anchor" />
                <span>The easier it is to understand,<br />the faster they can solve the problem.</span>
              </Reveal>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
