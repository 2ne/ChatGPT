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
  { time: "55:55:35", speaker: "LOVELL", line: "Houston, we've had a problem. We've had a Main B Bus Undervolt." },
  { time: "55:55:42", speaker: "CAPCOM", line: "Roger. Main B Undervolt." },
  {
    time: "55:56:10",
    speaker: "HAISE",
    line: "Okay. Right now, Houston, the voltage is looking good. And we had a pretty large bang associated with the caution and warning there.",
  },
  { time: "55:56:30", speaker: "CAPCOM", line: "Roger, Fred." },
  {
    time: "55:56:54",
    speaker: "HAISE",
    line: "In the interim here, we're starting to go ahead and button up the tunnel again.",
  },
  {
    time: "55:57:04",
    speaker: "HAISE",
    line: "That jolt must have rocked the sensor on oxygen quantity 2. It was oscillating down around 20 to 60 percent. Now it's full-scale high.",
  },
  { time: "55:58:07", speaker: "HAISE", line: "AC 2 is showing zip." },
  {
    time: "55:58:25",
    speaker: "HAISE",
    line: "Yes, we got a Main Bus A Undervolt now, too. It's reading about 25 and a half. Main B is reading zip right now.",
  },
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
  "Our systems",
  "Our quality bar",
  "The contrast",
  "Three habits",
  "A real choice",
  "AI",
  "The change",
  "Why it matters",
];

const systemNodes = [
  "Research",
  "Agents",
  "MCPs",
  "Models",
  "Permissions",
  "Documents",
  "Citations",
  "Search",
  "Evals",
  "APIs",
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
    line: "The exact steps to follow when a system fails, written so trained people can execute them consistently.",
  },
  {
    title: "Schematics.",
    line: "Where systems connect, so you can find the fault without knowing every subsystem.",
  },
  {
    title: "Checklists.",
    line: "What must be true before the next move, not left to memory under pressure.",
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
        <span>searchDeals.ts</span>
        <Code2 size={14} />
      </div>
      <pre>
        <span className="violet">export const</span>{" "}
        <span className="blue">searchDeals</span> = tool({"{\n  "}
        <span className="blue">name</span>: <span className="gold">"search_deals"</span>,{"\n  "}
        <span className="blue">input</span>: DealQuerySchema,{"\n  "}
        <span className="blue">execute</span>: <span className="violet">async</span> (query) <span className="violet">=&gt;</span> {"{\n    "}
        assertMatterAccess(query.matterId);{"\n    "}
        <span className="violet">return</span> research.search({"{\n      "}
        ...query,{"\n      "}
        citeSources: <span className="violet">true</span>,{"\n    "}});
        {"\n  }\n"}});
      </pre>
    </div>
  );
}

function DocumentationTransform() {
  const [clean, setClean] = useState(false);
  return (
    <div className="docs-demo">
      <div className="demo-label">
        <span>deal-research-agent.md</span>
        <button type="button" onClick={() => setClean(!clean)}>
          {clean ? "Show original" : "Make it readable"}
          <Sparkles size={14} />
        </button>
      </div>
      <AnimatePresence mode="wait">
        {!clean ? (
          <motion.div key="dense" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, filter: "blur(10px)" }} className="dense-doc">
            <p>
              The deal research agent can be used where a user needs information
              about a transaction and it uses the research platform together
              with available tools to produce an answer, although results may
              vary depending on the query, documents and permissions and users
              should review the output as appropriate…
            </p>
          </motion.div>
        ) : (
          <motion.div key="clean" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="clean-doc">
            <span className="eyebrow">M&amp;A RESEARCH AGENT</span>
            <h3>Compare deal points across authorised documents</h3>
            <p>Returns a cited comparison for one matter and deal point.</p>
            <div className="doc-grid">
              <div><b>Inputs</b><span>Matter number and deal point</span></div>
              <div><b>Checks</b><span>Access, source coverage and citations</span></div>
            </div>
            <code>Flag conflicting or missing evidence. Never infer it.</code>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function PullRequest({ checklist = false }: { checklist?: boolean }) {
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!checklist) return;
    setChecked(false);
    const tick = setTimeout(() => setChecked(true), 900);
    return () => clearTimeout(tick);
  }, [checklist]);

  return (
    <div className="pr-window">
      <div className="pr-top">
        <div><GitPullRequest size={21} /><span>agent: add cited deal-point comparison</span></div>
        <span className="open-pill">Open</span>
      </div>
      <div className="pr-tabs">
        <span className="active">Conversation</span><span>Commits <b>2</b></span><span>Files changed <b>3</b></span>
      </div>
      <AnimatePresence mode="wait" initial={false}>
        {checklist ? (
          <motion.div key="checklist" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }} className="review-checklist">
            <span className="eyebrow">ONE REVIEWER CHECK</span>
            <button type="button" onClick={() => setChecked((value) => !value)} className={checked ? "done" : ""}>
              <span>{checked ? <Check size={15} /> : <Circle size={15} />}</span>
              <div className="check-label">
                Documentation checked
                <small>Updated and readable, or no change needed is explained.</small>
              </div>
            </button>
          </motion.div>
        ) : (
          <motion.div key="review" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }} className="review-body">
            <div className="review-comment">
              <div className="avatar">AR</div>
              <div><b>Alex reviewed 2 minutes ago</b><p>Can we document permission failures and missing evidence?</p></div>
            </div>
            <div className="review-comment">
              <div className="avatar gold">MK</div>
              <div><b>Maya approved these changes</b><p>Clear owner, limits and recovery path.</p></div>
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
    id: "architecture",
    title: "The architecture overview",
    meta: "Current · clear system map",
    body: "Explains search, models, MCPs and data flow. It does not show where this request failed.",
    good: false,
    why: "Useful context, but not a diagnosis path.",
  },
  {
    id: "specification",
    title: "The agent specification",
    meta: "Reviewed yesterday · named owner",
    body: "Defines inputs, outputs and expected behaviour. It does not show what happened in this run.",
    good: false,
    why: "Good for expected behaviour, not the live failure.",
  },
  {
    id: "diagnosis",
    title: "The diagnosis runbook",
    meta: "Tested last week · named owner",
    body: "Check matter access, retrieval logs, source coverage and citations, then escalate with the query ID.",
    good: true,
    why: "It turns the symptom into an ordered, verifiable next action.",
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
          Readable documentation gets you to the next useful action.
        </p>
      )}
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
              HOUSTON · 13 APRIL 1970
            </motion.p>
            <motion.h1 initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.5 }}>
              It’s <span>9:08 p.m.</span>
            </motion.h1>
            <div className="hero-sequence">
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.9, delay: 1.4 }}>A routine tank stir is followed by a bang aboard Apollo 13.</motion.p>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.9, delay: 2.4 }}>Mission Control sees several conflicting failures.</motion.p>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.9, delay: 3.4 }}>No one yet knows what has happened.</motion.p>
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
              <h2>Our systems are built for legal work.</h2>
              <p>Research, permissions, agents, models and MCPs have to work together. No one person holds the whole system.</p>
              <div className="evolution"><span>M&amp;A research</span><b>→</b><span>Agents</span><b>→</b><span>Lawyers</span></div>
            </Reveal>
          </div>
          <Reveal delay={0.15} className="reader-bridge">
            <span>THE COST OF UNCLEAR DOCS</span>
            <p>A vague page slows debugging, repeats decisions and makes the next engineer guess.</p>
            <div>
              <b>New starter</b>
              <b>On call</b>
              <b>Another team</b>
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
            <span className="eyebrow">THE SAME QUALITY BAR</span>
            <h2>The code explains itself.<br /><span>The documentation should too.</span></h2>
          </Reveal>
          <div className="contrast-grid">
            <Reveal><span className="panel-title"><Check size={14} /> THE CODE</span><CodeWindow /></Reveal>
            <Reveal delay={0.12}><span className="panel-title"><X size={14} /> THE WIKI PAGE</span><DocumentationTransform /></Reveal>
          </div>
        </section>

        <section data-section="5" data-step className="principles section-dark">
          <Reveal className="principles-heading">
            <span className="eyebrow">THREE HABITS</span>
            <h2>Three habits.<br />That’s enough.</h2>
            <p className="principles-lead">Use them when you write. Use them when you review.</p>
          </Reveal>
          <div className="principle-list">
            {[
              ["01", "Be clear.", "Name the purpose, inputs, limits and owner."],
              ["02", "Be concise.", "Put the next action first. Link to deeper context."],
              ["03", "Check it.", "Verify facts, links and examples before merge."],
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
            <h2>The M&amp;A research agent missed a clause. What do you open first?</h2>
            <p>A lawyer is waiting. Search ran, but the answer has no supporting citation.</p>
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
              {["Structure", "First draft", "Plain-language alternatives"].map((x) => <div key={x}><Check size={17} />{x}</div>)}
            </Reveal>
            <Reveal delay={0.12} className="ownership-card human-card">
              <Moon /><span>YOU STILL OWN</span>
              {["Technical truth", "Missing detail", "Final edit"].map((x) => <div key={x}><Check size={17} />{x}</div>)}
            </Reveal>
          </div>
          <Reveal delay={0.18} className="ai-note">
            <p>If a fact is missing, write <code>[NEEDS CONFIRMATION]</code>. Never let AI fill the gap.</p>
          </Reveal>
        </section>

        <section data-section="8" className="change section-dark">
          <div className="change-scroll">
            <div className="change-beats">
              <div data-step className="change-beat" ref={checklistBeatRef}>
                <Reveal className="review-copy">
                  <span className="eyebrow">ONE PRACTICAL CHANGE</span>
                  <h2>One documentation check<br />in every PR.</h2>
                  <p>Not another checklist. Update the docs, or explain why nothing changed.</p>
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
            <p>Same change. Same review. Same standard.</p>
          </Reveal>
        </section>

        <section data-section="9" className="finale section-dark">
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
                <p>The easier it is to understand,<br />the faster they can solve the problem.</p>
                <h2>That’s why<br />readability matters.</h2>
              </Reveal>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
