"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import {
  ArrowDown,
  Check,
  ChevronLeft,
  ChevronRight,
  Circle,
  Code2,
  Command,
  GitPullRequest,
  Maximize2,
  Minimize2,
  Moon,
  Sparkles,
  X,
} from "lucide-react";

const sections = [
  "The call",
  "Mission Control",
  "The standard",
  "Complexity",
  "The contrast",
  "The review",
  "AI",
  "The principles",
  "The challenge",
  "The change",
  "The reason",
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
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
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
        <button onClick={() => setClean(!clean)}>
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
  const [checked, setChecked] = useState(checklist ? 2 : 0);
  return (
    <div className="pr-window">
      <div className="pr-top">
        <div><GitPullRequest size={21} /><span>docs: explain retry behaviour</span></div>
        <span className="open-pill">Open</span>
      </div>
      <div className="pr-tabs">
        <span className="active">Conversation</span><span>Commits <b>2</b></span><span>Files changed <b>3</b></span>
      </div>
      {checklist ? (
        <div className="review-checklist">
          <span className="eyebrow">PULL REQUEST CHECKLIST</span>
          {[
            "Does this change need documentation?",
            "Has the documentation been updated?",
            "Has it been reviewed for readability?",
          ].map((label, i) => (
            <button key={label} onClick={() => setChecked(i + 1)} className={checked > i ? "done" : ""}>
              <span>{checked > i ? <Check size={15} /> : <Circle size={15} />}</span>{label}
            </button>
          ))}
        </div>
      ) : (
        <div className="review-body">
          <div className="review-comment">
            <div className="avatar">AR</div>
            <div><b>Alex reviewed 2 minutes ago</b><p>Can we name the failure modes explicitly?</p></div>
          </div>
          <div className="review-comment">
            <div className="avatar gold">MK</div>
            <div><b>Maya approved these changes</b><p>Clear, tested and ready to merge.</p></div>
          </div>
          <button className="merge-button"><Check size={16} /> Merge pull request</button>
        </div>
      )}
    </div>
  );
}

const challengeOptions = [
  {
    title: "The knowledge dump",
    desc: "1,847 words · no headings · generated yesterday",
    preview: "This system has numerous important dependencies and in the event that the service becomes unavailable there are several actions which may be considered…",
  },
  {
    title: "The exhaustive wiki",
    desc: "14 pages · complete · last updated 2023",
    preview: "Background / Architecture / Historical decisions / Ownership / Operational model / Known limitations / Change log…",
  },
  {
    title: "The incident runbook",
    desc: "90-second summary · verified last week",
    preview: "1. Confirm impact  2. Check dependency health  3. Roll back latest deployment  4. Escalate to Payments on-call",
  },
];

function Challenge() {
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  return (
    <div className="challenge">
      <div className="challenge-options">
        {challengeOptions.map((option, i) => (
          <motion.button
            whileHover={{ y: -6 }}
            key={option.title}
            onClick={() => { setSelected(i); setRevealed(false); }}
            className={selected === i ? "selected" : ""}
          >
            <span className="option-number">0{i + 1}</span>
            <h3>{option.title}</h3>
            <small>{option.desc}</small>
            <p>{option.preview}</p>
            <span className="radio">{selected === i && <i />}</span>
          </motion.button>
        ))}
      </div>
      <button className="reveal-answer" disabled={selected === null} onClick={() => setRevealed(true)}>
        Reveal the best answer
      </button>
      <AnimatePresence>
        {revealed && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="answer">
            <div className="answer-icon"><Check /></div>
            <div>
              <span>THE INCIDENT RUNBOOK</span>
              <p>It answers the immediate question, orders the next actions and shows when to escalate. At 2:17 a.m., retrieval speed matters.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function App() {
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [presenting, setPresenting] = useState(false);
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.13], ["0%", "18%"]);

  async function toggleFullscreen() {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
      setPresenting(true);
    } else {
      await document.exitFullscreen();
      setPresenting(false);
    }
  }

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const lenis = new Lenis({ duration: 1.15, smoothWheel: true });
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

    const handleKey = (e: KeyboardEvent) => {
      if (["ArrowDown", "ArrowRight", "PageDown", " "].includes(e.key)) {
        e.preventDefault();
        document.querySelector(`[data-section="${Math.min(active + 1, sections.length - 1)}"]`)?.scrollIntoView({ behavior: "smooth" });
      }
      if (["ArrowUp", "ArrowLeft", "PageUp"].includes(e.key)) {
        e.preventDefault();
        document.querySelector(`[data-section="${Math.max(active - 1, 0)}"]`)?.scrollIntoView({ behavior: "smooth" });
      }
      if (e.key.toLowerCase() === "f") toggleFullscreen();
    };
    window.addEventListener("keydown", handleKey);
    return () => {
      window.removeEventListener("keydown", handleKey);
      triggers.forEach((t) => t.kill());
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, [active]);

  const move = (direction: number) => {
    const next = Math.max(0, Math.min(sections.length - 1, active + direction));
    document.querySelector(`[data-section="${next}"]`)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div ref={root}>
      <motion.div className="top-progress" style={{ scaleX: scrollYProgress }} />
      <Progress active={active} />
      <button className="present-button" onClick={toggleFullscreen} aria-label="Toggle presentation mode">
        {presenting ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
        <span>{presenting ? "Exit" : "Present"}</span>
      </button>

      <main>
        <section data-section="0" className="hero section-dark">
          <Stars count={90} />
          <motion.div className="hero-orbit" style={{ y: heroY }} aria-hidden="true">
            <div className="moon-glow" />
            <div className="rocket">
              <div className="rocket-tip" /><div className="rocket-body"><i /><i /></div><div className="rocket-flame" />
            </div>
          </motion.div>
          <div className="hero-copy">
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.3 }} className="mission-label">
              HOUSTON · 13 APRIL 1970
            </motion.p>
            <motion.h1 initial={{ opacity: 0, y: 35 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, delay: 0.8 }}>
              It’s <span>2:17 a.m.</span>
            </motion.h1>
            <div className="hero-sequence">
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.2, delay: 2.2 }}>Your phone rings.</motion.p>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.2, delay: 3.8 }}>There’s been an explosion on Apollo 13.</motion.p>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.2, delay: 5.5 }}>You’re needed in Mission Control.</motion.p>
            </div>
          </div>
          <div className="scroll-cue"><span>SCROLL TO ENTER</span><ArrowDown size={17} /></div>
        </section>

        <section data-section="1" className="mission-control section-dark">
          <div className="control-image">
            <div className="monitor-grid">{Array.from({ length: 18 }).map((_, i) => <i key={i} />)}</div>
            <div className="control-light" />
          </div>
          <div className="control-copy">
            <Reveal><span className="eyebrow">MISSION CONTROL</span><h2>You arrive.</h2></Reveal>
            <Reveal delay={0.15}><p>The room is full of brilliant engineers.</p><p>Each understands their own system.</p><p>No one understands everything.</p></Reveal>
          </div>
          <div className="read-reveal">
            <Reveal><p>So how do they help?</p><h2>READ.</h2></Reveal>
            <Reveal delay={0.2} className="read-list">
              {["Procedures.", "Schematics.", "Checklists.", "Knowledge captured by someone else."].map((x) => <span key={x}>{x}</span>)}
            </Reveal>
          </div>
        </section>

        <section data-section="2" className="standards section-dark">
          <Stars count={34} />
          <Reveal className="standards-intro"><span className="eyebrow">THE STANDARD</span><h2>Apollo was too complex<br />for one person.</h2></Reveal>
          <div className="standards-words">
            {["Unambiguous.", "Concise.", "Reviewed."].map((word, i) => (
              <Reveal key={word} delay={i * 0.12}><span>{word}</span></Reveal>
            ))}
          </div>
          <p className="standards-caption">Documentation had to work under pressure.</p>
        </section>

        <section data-section="3" className="complexity section-light">
          <div className="architecture" aria-hidden="true">
            <div className="arch-ring ring-one" /><div className="arch-ring ring-two" />
            {Array.from({ length: 14 }).map((_, i) => <i key={i} style={{ transform: `rotate(${i * 25.7}deg) translateY(-190px)` }} />)}
            <div className="arch-core"><Command /><span>SYSTEM</span></div>
          </div>
          <Reveal className="complexity-copy">
            <span className="eyebrow">1970 → TODAY</span>
            <div className="evolution"><span>Apollo</span><b>↓</b><span>Microservices</span><b>↓</b><span>Cloud</span><b>↓</b><span>Modern engineering</span></div>
            <h2>Our systems aren’t spacecraft.</h2>
            <p>They’re becoming just as complicated.</p>
          </Reveal>
        </section>

        <section data-section="4" className="contrast section-dark">
          <Reveal className="section-heading">
            <span className="eyebrow">THE CONTRAST</span>
            <h2>Same engineering.<br /><span>Different standards.</span></h2>
          </Reveal>
          <div className="contrast-grid">
            <Reveal><span className="panel-title"><Check size={14} /> THE CODE</span><CodeWindow /></Reveal>
            <Reveal delay={0.15}><span className="panel-title"><X size={14} /> THE DOCUMENTATION</span><DocumentationTransform /></Reveal>
          </div>
        </section>

        <section data-section="5" className="review section-light">
          <Reveal className="review-copy">
            <span className="eyebrow">THE REVIEW</span>
            <h2>We already write<br />great code.</h2>
            <p>We question it. Test it. Improve it.</p>
          </Reveal>
          <Reveal delay={0.18} className="pr-wrap"><PullRequest /></Reveal>
          <Reveal className="review-statement">
            <p>We already review code carefully.</p>
            <h3>Let’s hold our documentation<br />to the same standard.</h3>
          </Reveal>
        </section>

        <section data-section="6" className="ai-section section-dark">
          <div className="ai-halo" aria-hidden="true"><span /><span /><span /></div>
          <Reveal className="ai-heading">
            <span className="eyebrow">AI & DOCUMENTATION</span>
            <h2>AI helps us write <em>more.</em></h2>
            <p>But clarity is still our responsibility.</p>
          </Reveal>
          <div className="ownership-grid">
            <Reveal className="ownership-card ai-card">
              <Sparkles /><span>AI HELPS WITH</span>
              {["Structure", "Editing", "Consistency"].map((x) => <div key={x}><Check size={17} />{x}</div>)}
            </Reveal>
            <Reveal delay={0.15} className="ownership-card human-card">
              <Moon /><span>HUMANS OWN</span>
              {["Clarity", "Audience", "Judgement"].map((x) => <div key={x}><Check size={17} />{x}</div>)}
            </Reveal>
          </div>
        </section>

        <section data-section="7" className="principles section-dark">
          <Reveal className="principles-heading"><span className="eyebrow">THREE PRINCIPLES</span><h2>Make the next reader<br />your priority.</h2></Reveal>
          <div className="principle-list">
            {[
              ["01", "Remove ambiguity.", "Say what happens, when it happens and who owns the next action."],
              ["02", "Be concise.", "Make the answer easy to find before making the document complete."],
              ["03", "Review it like code.", "Accuracy is expected. Readability deserves the same attention."],
            ].map(([n, title, desc]) => (
              <motion.article key={n} whileHover={{ x: 10 }} transition={{ type: "spring", stiffness: 220 }}>
                <span>{n}</span><h3>{title}</h3><p>{desc}</p><ArrowDown />
              </motion.article>
            ))}
          </div>
        </section>

        <section data-section="8" className="challenge-section section-light">
          <Reveal className="challenge-heading">
            <span className="eyebrow">AUDIENCE CHALLENGE</span>
            <h2>Which document would you rather open at <span>2:17 a.m.</span> during a production incident?</h2>
            <p>Choose one, then reveal the answer.</p>
          </Reveal>
          <Challenge />
        </section>

        <section data-section="9" className="change section-dark">
          <Reveal className="change-heading"><span className="eyebrow">ONE PRACTICAL CHANGE</span><h2>Put documentation<br />inside the review.</h2></Reveal>
          <Reveal delay={0.15} className="change-pr"><PullRequest checklist /></Reveal>
          <Reveal className="change-statement"><span>CODE</span><i /><span>DOCUMENTATION</span><p>One change. One review. One standard.</p></Reveal>
        </section>

        <section data-section="10" className="finale section-dark">
          <Stars count={100} />
          <div className="earth" aria-hidden="true"><div className="earth-light" /><i /><i /><i /></div>
          <div className="finale-copy">
            <Reveal><p>Don’t write for yourself today.</p></Reveal>
            <Reveal><h2>Write for future you…</h2><span>…six months from now…</span><span>…when you haven’t had those three shots of espresso.</span></Reveal>
            <Reveal className="for-people"><p>Write for the new starter.</p><p>Write for the engineer on call.</p></Reveal>
            <Reveal className="reliance"><p>One day…</p><h3>Someone will rely on<br />what you’ve written.</h3></Reveal>
            <Reveal className="final-message"><p>The easier it is to understand,</p><h2>the faster they can<br />solve the problem.</h2></Reveal>
            <Reveal className="last-line"><span>That’s why readability matters.</span></Reveal>
          </div>
        </section>
      </main>

      <div className="keyboard-controls">
        <button onClick={() => move(-1)} aria-label="Previous section"><ChevronLeft /></button>
        <button onClick={() => move(1)} aria-label="Next section"><ChevronRight /></button>
        <span><kbd>F</kbd> Present</span>
      </div>
    </div>
  );
}

export default App;
