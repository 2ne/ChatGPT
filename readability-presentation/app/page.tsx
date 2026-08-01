"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import {
  AnimatePresence,
  motion,
  useScroll,
} from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import {
  Check,
  Circle,
  X,
} from "lucide-react";

const earthPhotoSrc = `${import.meta.env.BASE_URL}images/earth-from-space.jpg`;
const missionControlSrc = `${import.meta.env.BASE_URL}images/mission-control.jpg`;

const sectionLabels = [
  "The call",
  "The mission changes",
  "Shared understanding",
  "NASA’s standard",
  "Readability",
  "Where it fails",
  "What helps",
  "A useful signal",
  "The code standard",
  "The PR check",
  "AI produces more",
  "AI reviews too",
  "A shared skill",
  "Test the result",
  "Example one",
  "Example two",
  "Example three",
  "The human test",
];

const speakerNotes = [
  {
    title: "The call",
    body: `Good morning.

It’s 9:08 p.m., 13 April 1970.

Apollo 13 is about 200,000 miles from Earth when the crew hear a bang.

Jack Swigert radios Mission Control:

“Houston, we’ve had a problem here.”

An oxygen tank has exploded.

Within minutes, the spacecraft is losing oxygen and electrical power.`,
  },
  {
    title: "The mission changes",
    body: `The mission has changed.

They’re no longer trying to land on the Moon.

They’re trying to get three people home.`,
  },
  {
    title: "Shared understanding",
    body: `And there’s another problem.

No single engineer understands every part of Apollo 13.

You’ve got people who understand electrical systems. People who understand propulsion. Life support. Guidance. The command module. The lunar module.

They need to work out what has happened, what still works and what they can safely do next.

And to do that, they need information they can understand.

Procedures. Checklists. Technical documentation. Information produced by other engineers.

There isn’t much room for ambiguity when you’re 200,000 miles from Earth.`,
  },
  {
    title: "NASA’s standard",
    body: `And I think there’s something interesting there for us.

NASA engineering guidance today talks explicitly about requirements being clear, unambiguous, concise and simple. NASA also distinguishes technical review from professional review, with professional review looking specifically at things such as readability, communication and suitability for the audience.

So readability isn’t just about making something sound nicer.

It affects whether somebody can actually use the information.`,
  },
  {
    title: "Readability",
    body: `Now, obviously, we’re not trying to get three astronauts home from space.

But we do have something in common with those engineers.

We write things that other people need to understand.

We write wiki pages. Technical documentation. Pull requests. Setup instructions. Architecture decisions. Requirements.

And increasingly, we have AI writing some of that for us as well.

So I want to talk about readability.

And by readability, I mean something quite simple:

How much effort does somebody have to put in to understand what we’ve written?`,
  },
  {
    title: "Where readability fails",
    body: `Because something can be completely accurate and still be difficult to use.

A sentence can be technically correct, but too long.

A paragraph can contain everything somebody needs, but bury the important bit halfway through it.

We can use an acronym everybody on our team understands, forgetting that the person joining next month has never heard it before.

We can assume knowledge that the reader simply doesn’t have.

And every time we do that, we’re giving the reader a little bit more work.`,
  },
  {
    title: "What makes it readable",
    body: `So what makes something readable?

There are some fairly straightforward things we can look for.

Shorter sentences. One idea at a time. Clear headings. Plain language where possible. Acronyms explained the first time they’re used. Instructions in a logical order. Important information easy to find. And assumptions made explicit rather than left for the reader to work out.`,
  },
  {
    title: "A useful signal",
    body: `But readability isn’t entirely subjective either.

We’ve actually been measuring aspects of it for decades.

One example is Flesch Reading Ease. It was developed by Rudolf Flesch in 1948.

It looks at things such as sentence length and the number of syllables in words, and produces a score. Higher scores generally indicate text that’s easier to read.

Now, I wouldn’t suggest that we put all of our documentation through a formula and declare that anything above a particular number is good documentation.

Technical documentation contains technical language. Sometimes a long word is exactly the right word.

A readability score can’t tell us whether the documentation is correct. It can’t tell us whether we’ve forgotten a step. And it certainly can’t tell us whether somebody can actually complete the task.

But it can give us a signal.`,
  },
  {
    title: "The code standard",
    body: `And that’s interesting because we already do this sort of thing somewhere else.

Code.

We put a lot of effort into making our code readable.

We have conventions. We lint it. We test it. We review it. Someone else looks at it before we merge it.

We don’t just ask, “Does this code work?”

We also care whether somebody else can understand it and maintain it.

So perhaps documentation deserves a similar level of attention.`,
  },
  {
    title: "The PR check",
    body: `And maybe that starts with something very small.

When we’re reviewing a change, we add another question:

Does this change introduce something that requires new or updated documentation?

If it does, has that documentation been written?

And has somebody actually checked whether it’s readable?

Not just: “Yep, there’s a wiki page.”

Actually read it. Could you follow it? Does it make sense if you don’t already know what the author knows? Could somebody use it to complete the task?`,
  },
  {
    title: "AI produces more",
    body: `And then there’s AI.

Because AI changes this slightly.

AI means we can produce documentation incredibly quickly.

We can give an agent some code and ask it to document it. We can ask it to rewrite something. Summarise something. Create instructions. Turn notes into a wiki page.

That’s useful.

But producing more documentation doesn’t necessarily mean we’re producing better documentation.

Ultimately, a human still has to read it.`,
  },
  {
    title: "AI can review",
    body: `So perhaps AI can help us with both sides of the problem.

We can give an AI agent a documentation skill that helps it write readable documentation in the first place.

And that skill can be based on established techniques.

Use Flesch Reading Ease as one signal. Look at sentence length. Identify overly complicated language. Look for large blocks of text. Check whether acronyms are introduced. Look for ambiguous instructions. Identify assumptions. Check whether steps are in a sensible order. Ask whether headings help somebody scan the page.

And perhaps most importantly:

Can you tell what you’re supposed to do?

Then we can use essentially the same skill as a reviewer.

So even if a human wrote the documentation, or another AI agent wrote it, we can say:

Review this for readability. Tell me where somebody might struggle. Explain why. And suggest an improvement.`,
  },
  {
    title: "A shared skill",
    body: `That last part matters.

I don’t want a tool that just gives somebody 62 out of 100. That’s not particularly useful.

I want something that teaches us.

“This paragraph is difficult to scan because it contains three separate ideas.”

“This acronym hasn’t been explained.”

“This instruction assumes the reader has already configured X.”

“This sentence is 43 words long. Consider splitting it here.”

Now we’re not just measuring readability. We’re helping people learn how to improve it.

And the skill itself doesn’t have to be finished. It can belong to the team.

We use it. We find something it doesn’t catch. We add that. Someone discovers a better rule. We add that. Our documentation changes. The skill changes with it.

So over time, we’re effectively building our own shared definition of readable technical documentation.`,
  },
  {
    title: "Test the result",
    body: `And we can test whether any of this actually works.

We could take some of our existing wiki pages and run them through it.

Here’s the page before. Here’s the page afterwards.

How many words did we remove? What happened to the average sentence length? What happened to the readability score? Is it easier to scan?

But ultimately, there’s a much simpler test.

Do we think it’s actually better?

So let’s try that.`,
  },
  {
    title: "Example one",
    body: `I’ve got three examples from documentation.

For each one, I’m going to show you two versions. A and B.

I’m not going to tell you which one has the better readability score. I’m not going to tell you which one AI prefers.

Just read them.

Hands up for A.

Hands up for B.

Interesting. Why? What made that one easier?

Take one or two responses.`,
  },
  {
    title: "Example two",
    body: `Okay. Number two.

Same again.

Hands up for A.

Hands up for B.

Why?

Take one or two responses.`,
  },
  {
    title: "Example three",
    body: `And one more.

A?

B?

Why?

Take one or two responses.`,
  },
  {
    title: "Write for the reader",
    body: `And that’s really what I want us to become more conscious of.

Not a score for the sake of having a score.

Not a rule saying every sentence must contain fewer than a certain number of words.

And definitely not AI deciding what good writing is for us.

It’s about the person who eventually has to read what we’ve written.

So when you write documentation, think about who you’re writing it for.

Write it for the new starter who’s on their first week and is slightly anxious about breaking something.

Write it for the engineer who knows the system next door to yours, but doesn’t know yours.

Write it for someone trying to fix a problem quickly.

Write it for yourself in ten years’ time, when you’ve completely forgotten why you made that decision.`,
  },
  {
    title: "Future you",
    body: `Actually, forget ten years.

Write it for yourself tomorrow night at 11 o’clock…

when the espresso has run out…

and you’re wondering what on earth the person who wrote this documentation was thinking.

Because occasionally…

that person is you.`,
  },
  {
    title: "The human test",
    body: `If we can make that person’s job slightly easier, then we’ve written better documentation.

And if AI can help us get there faster, great.

But whether a human writes it or an AI writes it, the test is still the same:

Can another human understand it?`,
  },
];

const transcript = [
  ["55:55:20", "SWIGERT", "Okay, Houston, we’ve had a problem here."],
  ["55:55:28", "CAPCOM", "This is Houston. Say again, please."],
  ["55:55:35", "LOVELL", "Houston, we’ve had a problem. We’ve had a Main B Bus Undervolt."],
];

function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.72, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function Stars({ count = 80 }: { count?: number }) {
  return (
    <div className="stars" aria-hidden="true">
      {Array.from({ length: count }, (_, index) => (
        <i
          key={index}
          style={{
            left: `${(index * 47.13) % 100}%`,
            top: `${(index * 31.77) % 100}%`,
            width: index % 11 === 0 ? 2 : 1,
            height: index % 11 === 0 ? 2 : 1,
            animationDelay: `${(index % 13) * 0.28}s`,
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
        <motion.div animate={{ height: `${((active + 1) / sectionLabels.length) * 100}%` }} />
      </div>
      <span className="nav-label">{sectionLabels[active]}</span>
    </aside>
  );
}

function SourceLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a className="source-link" href={href} target="_blank" rel="noreferrer">
      {children}
    </a>
  );
}

function PresenterNotes({
  activeStep,
  open,
  onClose,
}: {
  activeStep: number;
  open: boolean;
  onClose: () => void;
}) {
  const note = speakerNotes[activeStep] ?? speakerNotes[0];

  return (
    <AnimatePresence>
      {open && (
        <motion.aside
          className="presenter-notes"
          initial={{ opacity: 0, x: 32 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 32 }}
          aria-label="Speaker notes"
        >
          <header>
            <div>
              <span>Speaker notes</span>
              <strong>{note.title}</strong>
            </div>
            <button type="button" onClick={onClose} aria-label="Close speaker notes">
              <X size={18} />
            </button>
          </header>
          <div className="notes-scroll">
            {note.body.split(/\n\n+/).map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <footer>
            <span>{activeStep + 1} / {speakerNotes.length}</span>
            <span>Press N to close</span>
          </footer>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}

function ApolloTranscript() {
  const [visible, setVisible] = useState(1);

  useEffect(() => {
    if (visible >= transcript.length) return;
    const timer = window.setTimeout(() => setVisible((value) => value + 1), 1650);
    return () => window.clearTimeout(timer);
  }, [visible]);

  return (
    <div className="apollo-transcript" aria-hidden="true">
      <div className="transcript-title">
        <span>Air-to-ground</span>
        <span>Apollo 13 · GET</span>
      </div>
      <AnimatePresence initial={false}>
        {transcript.slice(0, visible).map(([time, speaker, line], index) => (
          <motion.div
            key={time}
            className={index === visible - 1 ? "transcript-line is-current" : "transcript-line"}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: index === visible - 1 ? 1 : 0.38, y: 0 }}
          >
            <span>{speaker}</span>
            <time>{time}</time>
            <p>{line}</p>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

function MissionShift() {
  return (
    <div className="mission-shift">
      <div className="mission-before">
        <span>Original mission</span>
        <s>Land on the Moon</s>
      </div>
      <div className="mission-after">
        <span>New mission</span>
        <strong>Get three people home</strong>
      </div>
      <p>Oxygen and electrical power are falling.</p>
    </div>
  );
}

const specialists = [
  "Electrical",
  "Propulsion",
  "Life support",
  "Guidance",
  "Command module",
  "Lunar module",
];

function SpecialistNetwork() {
  return (
    <div className="specialist-network" aria-label="Apollo engineering specialisms">
      <div className="network-orbit network-orbit-one" />
      <div className="network-orbit network-orbit-two" />
      <div className="network-core"><span>APOLLO 13</span><strong>What still works?</strong></div>
      {specialists.map((specialist, index) => (
        <div
          key={specialist}
          className="specialist-node"
          style={{ offsetDistance: `${(76 + (index / specialists.length) * 100) % 100}%` }}
        >
          <i />
          <span>{specialist}</span>
        </div>
      ))}
    </div>
  );
}

function NASAReview() {
  return (
    <div className="nasa-review">
      <div className="review-types">
        <Reveal className="review-type">
          <span>Technical review</span>
          <h3>Is it correct?</h3>
        </Reveal>
        <Reveal delay={0.1} className="review-type">
          <span>Professional review</span>
          <h3>Can the audience use it?</h3>
        </Reveal>
      </div>
      <Reveal className="nasa-takeaway">
        <p>Readability affects whether somebody can use the information.</p>
      </Reveal>
      <div className="nasa-sources">
        <SourceLink href="https://www.nasa.gov/reference/appendix-c-how-to-write-a-good-requirement/">
          NASA requirements guidance
        </SourceLink>
        <SourceLink href="https://nodis3.gsfc.nasa.gov/displayCA.cfm?Internal_ID=N_PR_2200_002C_&page_name=Chapter4">
          NASA review guidance
        </SourceLink>
      </div>
    </div>
  );
}

const ourDocuments = [
  "Wiki pages",
  "Technical documentation",
  "Pull requests",
  "Setup instructions",
  "Architecture decisions",
  "Requirements",
];

function OurWork() {
  return (
    <div className="our-work-layout">
      <Reveal className="our-work-copy">
        <span className="eyebrow">OUR WORK</span>
        <h2>We write things other people need to understand.</h2>
      </Reveal>
      <Reveal delay={0.08} className="document-list">
        {ourDocuments.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </Reveal>
      <Reveal delay={0.16} className="definition-card">
        <span>READABILITY</span>
        <p>How much effort does somebody have to put in to understand what we’ve written?</p>
      </Reveal>
    </div>
  );
}

const failureModes = [
  {
    number: "01",
    title: "Technically correct.",
    body: "But the sentence is too long to hold in working memory.",
    sample: "One sentence · four separate ideas · no pause",
  },
  {
    number: "02",
    title: "Everything is there.",
    body: "But the action is buried halfway through the paragraph.",
    sample: "Context · context · context · action",
  },
  {
    number: "03",
    title: "The team understands.",
    body: "But the acronym means nothing to the new starter.",
    sample: "RAG · MCP · ACL · DAA",
  },
  {
    number: "04",
    title: "The author knows.",
    body: "But the reader is expected to infer a missing step.",
    sample: "Configure it as usual, then continue",
  },
];

function FailureModes() {
  return (
    <div className="failure-grid">
      {failureModes.map((item, index) => (
        <Reveal key={item.number} delay={index * 0.07}>
          <article>
            <span className="failure-number">{item.number}</span>
            <div>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </div>
            <code>{item.sample}</code>
          </article>
        </Reveal>
      ))}
    </div>
  );
}

const readabilityRules = [
  ["Shorter sentences", "Reduce the amount a reader has to hold at once."],
  ["One idea at a time", "Split explanation, instruction and rationale."],
  ["Clear headings", "Let somebody scan before they read."],
  ["Plain language", "Use the familiar word when it is still accurate."],
  ["Explain acronyms", "Introduce them the first time they appear."],
  ["Logical order", "Put instructions in the order they happen."],
  ["Visible information", "Do not bury the action inside context."],
  ["Explicit assumptions", "Say what must already be true."],
];

function ReadabilityRules() {
  return (
    <div className="rules-layout">
      <Reveal className="rules-intro">
        <span className="eyebrow">WHAT HELPS</span>
        <h2>Reduce the reader’s work.</h2>
        <p>Readable writing is not simplistic. It is organised around the person who needs to use it.</p>
      </Reveal>
      <div className="rules-list">
        {readabilityRules.map(([title, description], index) => (
          <Reveal key={title} delay={index * 0.04}>
            <article>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div><h3>{title}</h3><p>{description}</p></div>
            </article>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

function countSyllables(value: string) {
  const word = value.toLowerCase().replace(/[^a-z]/g, "");
  if (!word) return 0;
  if (word.length <= 3) return 1;
  const trimmed = word
    .replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, "")
    .replace(/^y/, "");
  return Math.max(1, trimmed.match(/[aeiouy]{1,2}/g)?.length ?? 1);
}

function readingMetrics(text: string) {
  const words = text.match(/[A-Za-z]+(?:'[A-Za-z]+)?/g) ?? [];
  const sentences = Math.max(1, text.match(/[.!?]+/g)?.length ?? 1);
  const syllables = words.reduce((total, word) => total + countSyllables(word), 0);
  const averageSentence = words.length / sentences;
  const score = words.length
    ? 206.835 - 1.015 * averageSentence - 84.6 * (syllables / words.length)
    : 0;

  return {
    words: words.length,
    averageSentence: Math.round(averageSentence * 10) / 10,
    score: Math.round(score),
  };
}

const fleschSamples = {
  dense: "The implementation of the documentation validation functionality should be undertaken subsequent to completion of configuration and prior to the initiation of deployment activities.",
  clear: "Configure the service first. Then validate the documentation. Deploy only when both checks pass.",
};

function FleschDemo() {
  const [version, setVersion] = useState<keyof typeof fleschSamples>("dense");
  const text = fleschSamples[version];
  const metrics = useMemo(() => readingMetrics(text), [text]);
  const gaugePosition = Math.max(4, Math.min(96, metrics.score));

  return (
    <div className="flesch-layout">
      <Reveal className="flesch-copy">
        <span className="eyebrow">FLESCH READING EASE · 1948</span>
        <h2>A signal.<br />Not a verdict.</h2>
        <p>It combines sentence length and syllables per word. A higher score generally means easier reading.</p>
        <p className="formula">Sentence length + word complexity</p>
        <SourceLink href="https://doi.org/10.1037/h0057532">
          Rudolf Flesch · A New Readability Yardstick
        </SourceLink>
      </Reveal>
      <Reveal delay={0.1} className="flesch-demo">
        <div className="sample-toggle" role="group" aria-label="Readability sample">
          <button type="button" className={version === "dense" ? "active" : ""} onClick={() => setVersion("dense")}>Dense</button>
          <button type="button" className={version === "clear" ? "active" : ""} onClick={() => setVersion("clear")}>Clear</button>
        </div>
        <AnimatePresence mode="wait">
          <motion.p key={version} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>{text}</motion.p>
        </AnimatePresence>
        <div className="score-readout">
          <div className="score-heading"><span>Illustrative score</span><strong>{metrics.score}</strong></div>
          <div className="score-scale">
            <span>Harder</span><span>Easier</span>
            <i style={{ left: `${gaugePosition}%` }} />
          </div>
          <div className="score-details">
            <span>{metrics.averageSentence} words per sentence</span>
            <span>{metrics.words} words</span>
          </div>
        </div>
        <p className="score-limits">It cannot check accuracy, find missing steps or test the task.</p>
      </Reveal>
    </div>
  );
}

function CodeWindow() {
  return (
    <div className="code-window">
      <div className="window-bar">
        <span>searchDeals.ts</span>
      </div>
      <pre>
        <span className="syntax-violet">export const</span>{" "}
        <span className="syntax-blue">searchDeals</span> = tool({"{\n  "}
        <span className="syntax-blue">name</span>: <span className="syntax-green">"search_deals"</span>,{"\n  "}
        <span className="syntax-blue">input</span>: DealQuerySchema,{"\n  "}
        <span className="syntax-blue">execute</span>: <span className="syntax-violet">async</span> (query) <span className="syntax-violet">=&gt;</span> {"{\n    "}
        assertMatterAccess(query.matterId);{"\n    "}
        <span className="syntax-violet">return</span> research.search({"{\n      "}
        ...query,{"\n      "}
        citeSources: <span className="syntax-violet">true</span>,{"\n    });\n  }\n});"}
      </pre>
    </div>
  );
}

function CodeStandard() {
  return (
    <div className="code-standard-layout">
      <Reveal className="code-standard-copy">
        <span className="eyebrow">WE ALREADY DO THIS</span>
        <h2>Readable code is part of the quality bar.</h2>
        <p>We do not stop at “does it work?”. We ask whether somebody else can understand and maintain it.</p>
        <div className="practice-line" aria-label="Code quality practices">
          {['Conventions', 'Lint', 'Tests', 'Review'].map((practice) => <span key={practice}>{practice}</span>)}
        </div>
        <strong>Documentation deserves similar attention.</strong>
      </Reveal>
      <Reveal delay={0.12} className="code-standard-window"><CodeWindow /></Reveal>
    </div>
  );
}

function PullRequestCheck() {
  const [checked, setChecked] = useState(false);
  return (
    <div className="pr-window">
      <div className="pr-header">
        <span>Pull request</span>
        <strong>agent: add cited deal comparison</strong>
      </div>
      <div className="pr-check">
        <span className="eyebrow">ONE REVIEW QUESTION</span>
        <button type="button" className={checked ? "is-checked" : ""} onClick={() => setChecked((value) => !value)}>
          <span>{checked ? <Check size={18} /> : <Circle size={18} />}</span>
          <div>
            <strong>Documentation checked</strong>
            <p>Updated and checked for readability, or no change needed is explained.</p>
          </div>
        </button>
      </div>
    </div>
  );
}

function AIDocumentFactory() {
  const files = ["README.md", "setup-guide.md", "architecture.md", "wiki-page.md"];
  return (
    <div className="ai-factory">
      <span className="small-label">Generated in seconds</span>
      <div className="generated-docs">
        {files.map((file, index) => (
          <motion.span
            key={file}
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.13 }}
          >
            {file}
          </motion.span>
        ))}
      </div>
      <p><strong>More documentation</strong> is not the same as <strong>better documentation.</strong></p>
    </div>
  );
}

const reviewCopy = "Where RAG results may be incomplete following MCP execution, engineers should validate the ACL configuration and ensure that the applicable matter context has previously been configured, after which the process can be retried and escalated as required.";

function AIReviewDemo() {
  const [reviewed, setReviewed] = useState(false);
  const wordCount = readingMetrics(reviewCopy).words;
  const comments = [
    [`${wordCount}-word sentence`, "Split the actions into ordered steps."],
    ["Unexplained acronyms", "Introduce RAG, MCP and ACL on first use."],
    ["Hidden assumption", "This assumes the matter context already exists."],
    ["Ambiguous escalation", "Name when to escalate and who owns it."],
  ];

  return (
    <div className="review-demo">
      <div className="review-toolbar">
        <span>incident-runbook.md</span>
        <button type="button" onClick={() => setReviewed((value) => !value)}>
          {reviewed ? "Hide review" : "Review for readability"}
        </button>
      </div>
      <div className="review-document">
        <span>Agent failure recovery</span>
        <p className={reviewed ? "is-reviewed" : ""}>{reviewCopy}</p>
      </div>
      <AnimatePresence>
        {reviewed && (
          <motion.div className="review-comments" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            {comments.map(([title, body], index) => (
              <motion.div key={title} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.09 }}>
                <span>{index + 1}</span>
                <p><strong>{title}</strong>{body}</p>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const skillRules = [
  "Lead with the reader’s task.",
  "Keep one idea in each sentence.",
  "Explain acronyms on first use.",
  "Make assumptions explicit.",
  "Put instructions in the order they happen.",
  "Flag ambiguity and suggest a specific edit.",
  "Use Flesch Reading Ease as a signal, not a target.",
  "Ask: can the reader tell what to do next?",
];

function SkillFile() {
  return (
    <div className="skill-file">
      <div className="skill-file-header">
        <span>documentation-readability/SKILL.md</span>
        <span>Team-owned</span>
      </div>
      <div className="skill-file-body">
        <span className="skill-heading">## Review rules</span>
        {skillRules.slice(0, 4).map((rule, index) => (
          <motion.div key={rule} initial={{ opacity: 0, x: -8 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <p>{rule}</p>
          </motion.div>
        ))}
      </div>
      <div className="skill-diff">
        <span>+ Add what we learn as a team.</span>
      </div>
    </div>
  );
}

const evidenceText = {
  before: "The service configuration process requires engineers to populate the necessary environment variables before running the application, and those values should be obtained from the Platform team because the application may otherwise fail during start-up. Once the variables have been added, the database migration should be executed and the development server may then be started. It is important to verify that the application is operating correctly before beginning any work.",
  after: "Ask Platform for the development environment values. Add them to .env. Run npm run migrate, then npm run dev. Open /health. A 200 response means the service is ready.",
};

function Metric({ label, before, after }: { label: string; before: string | number; after: string | number }) {
  return (
    <div className="metric">
      <span>{label}</span>
      <div><small>Before</small><s>{before}</s></div>
      <div><small>After</small><strong>{after}</strong></div>
    </div>
  );
}

function EvidenceComparison() {
  const before = readingMetrics(evidenceText.before);
  const after = readingMetrics(evidenceText.after);
  const [showAfter, setShowAfter] = useState(false);

  return (
    <div className="evidence-comparison">
      <div className="evidence-document">
        <div className="evidence-tabs">
          <button type="button" className={!showAfter ? "active" : ""} onClick={() => setShowAfter(false)}>Before</button>
          <button type="button" className={showAfter ? "active" : ""} onClick={() => setShowAfter(true)}>After</button>
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={showAfter ? "after" : "before"} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <span>Local setup</span>
            <p>{showAfter ? evidenceText.after : evidenceText.before}</p>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="metric-panel">
        <span className="eyebrow">WHAT CHANGED?</span>
        <Metric label="Words" before={before.words} after={after.words} />
        <Metric label="Average sentence" before={`${before.averageSentence} words`} after={`${after.averageSentence} words`} />
        <Metric label="Reading ease" before={before.score} after={after.score} />
        <div className="human-check">
          <p><span>THE USEFUL TEST</span><strong>Do we think it is actually better?</strong></p>
        </div>
      </div>
    </div>
  );
}

type ExampleVersion = {
  title: string;
  content: ReactNode;
};

type WorkshopExampleProps = {
  number: number;
  context: string;
  a: ExampleVersion;
  b: ExampleVersion;
  winner: "A" | "B";
  reasons: string[];
};

function WorkshopExample({ number, context, a, b, winner, reasons }: WorkshopExampleProps) {
  const [revealed, setRevealed] = useState(false);
  const versions = { A: a, B: b } as const;

  return (
    <div className="workshop-example">
      <Reveal className="example-heading">
        <span className="eyebrow">EXAMPLE {String(number).padStart(2, "0")} · READ BOTH</span>
        <h2>{context}</h2>
        <p>Hands up for A. Hands up for B.</p>
      </Reveal>
      <div className="version-grid">
        {(["A", "B"] as const).map((label, index) => {
          const version = versions[label];
          const isWinner = revealed && winner === label;
          return (
            <Reveal key={label} delay={index * 0.08}>
              <article className={`version-card${isWinner ? " is-winner" : ""}${revealed && !isWinner ? " is-muted" : ""}`}>
                <header>
                  <span>{label}</span>
                  {isWinner && <b>Easier to use</b>}
                </header>
                <h3>{version.title}</h3>
                <div className="version-content">{version.content}</div>
              </article>
            </Reveal>
          );
        })}
      </div>
      <div className="example-reveal">
        <button type="button" onClick={() => setRevealed((value) => !value)}>
          {revealed ? "Hide the difference" : "Reveal the difference"}
        </button>
        <AnimatePresence>
          {revealed && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <span>Why {winner} works better here</span>
              {reasons.map((reason) => <p key={reason}>{reason}</p>)}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function App() {
  const lenisRef = useRef<Lenis | null>(null);
  const activeStepRef = useRef(0);
  const [activeSection, setActiveSection] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const [hintVisible, setHintVisible] = useState(true);
  const [notesOpen, setNotesOpen] = useState(() => new URLSearchParams(window.location.search).get("notes") === "1");
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const lenis = new Lenis({ duration: 1.02, smoothWheel: true, anchors: false });
    lenisRef.current = lenis;
    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    const sections = gsap.utils.toArray<HTMLElement>("[data-section]");
    const sectionTriggers = sections.map((section, index) =>
      ScrollTrigger.create({
        trigger: section,
        start: "top 55%",
        end: "bottom 45%",
        onEnter: () => setActiveSection(index),
        onEnterBack: () => setActiveSection(index),
      }),
    );

    const steps = gsap.utils.toArray<HTMLElement>("[data-step]");
    const stepTriggers = steps.map((step, index) =>
      ScrollTrigger.create({
        trigger: step,
        start: "top 55%",
        end: "bottom 45%",
        onEnter: () => {
          activeStepRef.current = index;
          setActiveStep(index);
        },
        onEnterBack: () => {
          activeStepRef.current = index;
          setActiveStep(index);
        },
      }),
    );

    const hideHint = window.setTimeout(() => setHintVisible(false), 6500);

    return () => {
      window.clearTimeout(hideHint);
      sectionTriggers.forEach((trigger) => trigger.kill());
      stepTriggers.forEach((trigger) => trigger.kill());
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  useEffect(() => {
    const isInteractive = (target: EventTarget | null) =>
      target instanceof HTMLElement && Boolean(target.closest("button, a, input, textarea, select, [contenteditable='true']"));

    const go = (direction: 1 | -1) => {
      const steps = Array.from(document.querySelectorAll<HTMLElement>("[data-step]"));
      const current = steps.reduce(
        (closest, step, index) => {
          const distance = Math.abs(step.getBoundingClientRect().top);
          return distance < closest.distance ? { index, distance } : closest;
        },
        { index: activeStepRef.current, distance: Number.POSITIVE_INFINITY },
      );
      const next = Math.min(steps.length - 1, Math.max(0, current.index + direction));
      const target = steps[next];
      if (!target) return;
      setHintVisible(false);
      activeStepRef.current = next;
      setActiveStep(next);
      lenisRef.current?.scrollTo(target, { offset: 0, duration: 1.02 });
    };

    const jump = (position: "first" | "last") => {
      const steps = Array.from(document.querySelectorAll<HTMLElement>("[data-step]"));
      const index = position === "first" ? 0 : steps.length - 1;
      const target = steps[index];
      if (!target) return;
      activeStepRef.current = index;
      setActiveStep(index);
      lenisRef.current?.scrollTo(target, { offset: 0, duration: 1.02 });
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "n") {
        event.preventDefault();
        setNotesOpen((value) => !value);
        return;
      }
      if (event.key === "Escape" && notesOpen) {
        setNotesOpen(false);
        return;
      }
      if (isInteractive(event.target) || event.metaKey || event.ctrlKey || event.altKey) return;

      if (["ArrowDown", "ArrowRight", "PageDown", " "].includes(event.key)) {
        event.preventDefault();
        go(1);
      } else if (["ArrowUp", "ArrowLeft", "PageUp"].includes(event.key)) {
        event.preventDefault();
        go(-1);
      } else if (event.key === "Home") {
        event.preventDefault();
        jump("first");
      } else if (event.key === "End") {
        event.preventDefault();
        jump("last");
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [notesOpen]);

  return (
    <div className="presentation-root">
      <motion.div className="top-progress" style={{ scaleX: scrollYProgress }} />
      <Progress active={activeSection} />
      <div className={`presenter-hint${hintVisible ? " is-visible" : ""}`} aria-hidden={!hintVisible}>
        <kbd>←</kbd><kbd>→</kbd><span>navigate</span><i /><kbd>N</kbd><span>notes</span>
      </div>
      <PresenterNotes activeStep={activeStep} open={notesOpen} onClose={() => setNotesOpen(false)} />

      <main>
        <section id="the-call" data-section="0" data-step className="hero section-dark">
          <Stars count={72} />
          <div className="hero-layout">
            <div className="hero-copy">
              <motion.span className="eyebrow" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>APOLLO 13 · 13 APRIL 1970</motion.span>
              <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.9 }}>
                It’s <em>9:08 p.m.</em>
              </motion.h1>
              <motion.div className="hero-sequence" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.95 }}>
                <p>Apollo 13 is 200,000 miles from Earth.</p>
                <p>The crew hear a bang.</p>
              </motion.div>
              <motion.blockquote initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.55 }}>
                “Houston, we’ve had a problem here.”
                <cite>Jack Swigert</cite>
              </motion.blockquote>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.1 }} className="hero-consequence">Oxygen and electrical power begin to fall.</motion.p>
              <SourceLink href="https://www.nasa.gov/missions/apollo/apollo-13-mission-details/">NASA · Apollo 13 mission details</SourceLink>
            </div>
            <motion.div className="transcript-wrap" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8, duration: 1.1 }}>
              <ApolloTranscript />
            </motion.div>
          </div>
        </section>

        <section id="mission-changes" data-section="1" data-step className="mission-change section-dark">
          <div className="mission-bg" style={{ backgroundImage: `linear-gradient(90deg, rgba(9,9,11,.94), rgba(9,9,11,.45), rgba(9,9,11,.9)), url(${missionControlSrc})` }} />
          <div className="mission-change-layout">
            <Reveal className="mission-change-copy">
              <span className="eyebrow">THE MISSION HAS CHANGED</span>
              <h2>They’re no longer trying to land on the Moon.</h2>
              <p>They’re trying to get three people home.</p>
            </Reveal>
            <Reveal delay={0.12}><MissionShift /></Reveal>
          </div>
        </section>

        <section id="shared-understanding" data-section="2" data-step className="specialists section-light">
          <div className="specialists-layout">
            <Reveal className="specialists-copy">
              <span className="eyebrow">ANOTHER PROBLEM</span>
              <h2>No single engineer understands every part of Apollo 13.</h2>
              <p>They must work out what happened, what still works and what they can safely do next.</p>
            </Reveal>
            <Reveal delay={0.1}><SpecialistNetwork /></Reveal>
          </div>
          <Reveal className="specialist-footnote">
            <p>They rely on procedures, checklists and technical documentation written by other engineers.</p>
            <strong>There isn’t much room for ambiguity 200,000 miles from Earth.</strong>
          </Reveal>
        </section>

        <section id="nasa-standard" data-section="3" data-step className="nasa-standard section-light">
          <div className="nasa-standard-layout">
            <Reveal className="nasa-standard-heading">
              <span className="eyebrow">NASA’S STANDARD</span>
              <h2>
                <span>Clear. Unambiguous.</span>
                <span>Concise. Simple.</span>
              </h2>
            </Reveal>
            <NASAReview />
          </div>
        </section>

        <section id="readability" data-section="4" data-step className="our-work section-dark">
          <OurWork />
        </section>

        <section id="failure-modes" data-section="5" data-step className="failure-modes section-dark">
          <Reveal className="section-title">
            <span className="eyebrow">ACCURATE CAN STILL BE DIFFICULT</span>
            <h2>Every hidden decision gives<br />the reader more work.</h2>
          </Reveal>
          <FailureModes />
        </section>

        <section id="what-helps" data-section="6" data-step className="readability-rules section-light">
          <ReadabilityRules />
        </section>

        <section id="flesch" data-section="7" data-step className="flesch section-dark">
          <FleschDemo />
        </section>

        <section id="code-standard" data-section="8" data-step className="code-standard section-dark">
          <CodeStandard />
        </section>

        <section id="pr-check" data-section="9" data-step className="pr-section section-light">
          <div className="pr-layout">
            <Reveal className="pr-copy">
              <span className="eyebrow">START SMALL</span>
              <h2>Put documentation inside the review.</h2>
              <p>Not just “there’s a wiki page”. Read it. Could you follow it without already knowing what the author knows?</p>
            </Reveal>
            <Reveal delay={0.1}><PullRequestCheck /></Reveal>
          </div>
        </section>

        <section id="ai-output" data-section="10" data-step className="ai-output section-dark">
          <div className="ai-output-layout">
            <Reveal className="ai-output-copy">
              <span className="eyebrow">AI CHANGES THE VOLUME</span>
              <h2>Writing documentation is now fast.</h2>
              <p>Document code. Rewrite a page. Summarise notes. Create instructions.</p>
              <strong>Ultimately, a human still has to read it.</strong>
            </Reveal>
            <Reveal delay={0.1}><AIDocumentFactory /></Reveal>
          </div>
        </section>

        <section id="ai-review" data-section="11" data-step className="ai-review section-light">
          <div className="ai-review-layout">
            <Reveal className="ai-review-copy">
              <span className="eyebrow">USE AI ON BOTH SIDES</span>
              <h2>Draft with it.<br />Review with it.</h2>
              <p>A useful review names the problem, explains why it matters and suggests a specific edit.</p>
              <strong>Do not just give somebody 62 out of 100.</strong>
            </Reveal>
            <Reveal delay={0.1}><AIReviewDemo /></Reveal>
          </div>
        </section>

        <section id="shared-skill" data-section="12" data-step className="shared-skill section-dark">
          <div className="shared-skill-layout">
            <Reveal className="shared-skill-copy">
              <span className="eyebrow">A TEAM-OWNED SKILL</span>
              <h2>Build our shared definition of readable documentation.</h2>
              <p>Use it. Find what it misses. Add the rule. Let the skill change with the documentation.</p>
            </Reveal>
            <Reveal delay={0.1}><SkillFile /></Reveal>
          </div>
        </section>

        <section id="evidence" data-section="13" data-step className="evidence section-light">
          <Reveal className="section-title">
            <span className="eyebrow">TEST WHETHER IT WORKS</span>
            <h2>Measure the change.<br />Then make the human judgement.</h2>
          </Reveal>
          <EvidenceComparison />
        </section>

        <section id="example-one" data-section="14" data-step className="workshop-section section-dark">
          <WorkshopExample
            number={1}
            context="A new engineer is setting up the service."
            a={{
              title: "Local setup",
              content: <p>The configuration process requires the environment variables to be populated prior to the application being started and developers should ensure that the appropriate values have been obtained from the Platform team, after which the database migration command can be executed and the development server initiated.</p>,
            }}
            b={{
              title: "Start the service locally",
              content: <ol><li>Copy <code>.env.example</code> to <code>.env</code>.</li><li>Ask Platform for the development values.</li><li>Run <code>npm run migrate</code>.</li><li>Run <code>npm run dev</code>.</li><li>Check that <code>/health</code> returns 200.</li></ol>,
            }}
            winner="B"
            reasons={["The steps follow the order of the task.", "The prerequisite and success check are explicit.", "Each sentence carries one action."]}
          />
        </section>

        <section id="example-two" data-section="15" data-step className="workshop-section section-light">
          <WorkshopExample
            number={2}
            context="A lawyer opens a matter they cannot access."
            a={{
              title: "Access denied",
              content: <><p>You do not have permission to view this matter.</p><p>Request access from the matter team. Your search has not been saved.</p></>,
            }}
            b={{
              title: "Unable to complete request",
              content: <p>The system encountered an authorisation condition associated with the selected content. Appropriate access may be requested if required, after which the operation can be attempted again.</p>,
            }}
            winner="A"
            reasons={["It says what happened without hiding behind system language.", "It gives the next action.", "It explains what happened to the reader’s work."]}
          />
        </section>

        <section id="example-three" data-section="16" data-step className="workshop-section section-dark">
          <WorkshopExample
            number={3}
            context="An AI-generated deal summary is ready to share."
            a={{
              title: "Review guidance",
              content: <p>Review the AI output as appropriate and confirm that all relevant information has been included before use.</p>,
            }}
            b={{
              title: "Before sharing this summary",
              content: <ul><li>Check every quoted amount and date against its citation.</li><li>Confirm the governing law and notice period.</li><li>If a claim has no citation, remove it or mark it unverified.</li></ul>,
            }}
            winner="B"
            reasons={["The checks are specific to the task.", "It explains how to handle missing evidence.", "The reader can tell when the review is complete."]}
          />
        </section>

        <section id="human-test" data-section="17" className="finale section-dark">
          <div className="finale-background" aria-hidden="true">
            <Stars count={110} />
            <div className="earth">
              <img src={earthPhotoSrc} alt="" draggable={false} />
            </div>
          </div>
          <div className="finale-beats">
            <div id="write-for-the-reader" data-step className="finale-beat readers-beat">
              <Reveal>
                <span className="eyebrow">WRITE FOR THE PERSON WHO READS IT</span>
                <h2>The new starter.<br />The adjacent engineer.<br />Someone fixing a problem.<br />Future you.</h2>
              </Reveal>
            </div>
            <div id="future-you" data-step className="finale-beat coffee-beat">
              <Reveal>
                <span>Actually, forget ten years.</span>
                <h2>Write it for yourself<br />tomorrow night at 11.</h2>
                <p>When the espresso has run out and you’re wondering what the person who wrote this was thinking.</p>
                <strong>Because occasionally, that person is you.</strong>
              </Reveal>
            </div>
            <div id="final-question" data-step className="finale-beat final-question">
              <Reveal>
                <p>Whether a human writes it or an AI writes it,<br />the test is still the same.</p>
                <h2>Can another human<br /><em>understand it?</em></h2>
              </Reveal>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
