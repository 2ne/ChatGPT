import { useEffect, useMemo, useRef, useState } from "react";
import { MusicPlayer } from "./audio/musicPlayer";
import { defaultSpeechProvider, speakCoach } from "./audio/speech";
import { TRACKS, openingTrackFor } from "./data/catalog";
import { hypeLevel } from "./engine/hype";
import { SessionEngine } from "./engine/session";
import { getTargetMusicEnergy } from "./engine/targetEnergy";
import { getVoiceDirection } from "./engine/voiceDirection";
import { generateWorkout, workoutLabel } from "./engine/workout";
import type {
  CoachDebugEvent,
  MusicDecision,
  SessionSnapshot,
  SpeechProvider,
  WorkoutEventType,
  WorkoutPhase,
} from "./types";
import { formatClock, formatPhase, formatSpeed } from "./ui/format";

const DURATIONS = [8, 16, 24] as const;

export function App() {
  const [hype, setHype] = useState(62);
  const [duration, setDuration] = useState<(typeof DURATIONS)[number]>(16);
  const [debug, setDebug] = useState(false);
  const [running, setRunning] = useState(false);
  const [snapshot, setSnapshot] = useState<SessionSnapshot | null>(null);
  const [decisions, setDecisions] = useState<MusicDecision[]>([]);
  const [coachLog, setCoachLog] = useState<CoachDebugEvent[]>([]);
  const [speechNote, setSpeechNote] = useState("");
  const [previewing, setPreviewing] = useState(false);
  const engineRef = useRef<SessionEngine | null>(null);
  const musicRef = useRef(new MusicPlayer());
  const providerRef = useRef<SpeechProvider>(defaultSpeechProvider());

  useEffect(() => {
    return () => musicRef.current.stop();
  }, []);

  useEffect(() => {
    if (!running) return;
    let frame = 0;
    let last = performance.now();
    const loop = (now: number) => {
      const engine = engineRef.current;
      if (engine) {
        const result = engine.tick((now - last) / 1000);
        last = now;
        setSnapshot(result.snapshot);
        setDecisions([...engine.decisions]);
        setCoachLog([...engine.coachLog]);
        void applyCommands(engine, result.commands);
      }
      frame = window.requestAnimationFrame(loop);
    };
    frame = window.requestAnimationFrame(loop);
    return () => window.cancelAnimationFrame(frame);
  }, [running]);

  const preview = useMemo(() => generateWorkout(hype, duration), [hype, duration]);
  const level = hypeLevel(hype);

  async function startSession() {
    const plan = generateWorkout(hype, duration);
    const openingEnergy = getTargetMusicEnergy({
      workoutIntensity: plan.sections[0].intensity,
      phase: plan.sections[0].phase,
      hype,
      upcomingIntensity: plan.sections[1]?.intensity,
      secondsUntilUpcoming: plan.sections[1]?.start ?? null,
    });
    const opening = openingTrackFor(openingEnergy);
    const provider = defaultSpeechProvider();
    providerRef.current = provider;
    const engine = new SessionEngine(plan, TRACKS, opening, provider);
    engineRef.current = engine;
    setSpeechNote(
      provider === "browser"
        ? "Public Pages build uses on-device speech. OpenAI voice stays on local development only."
        : "Local session will try the OpenAI speech endpoint, then fall back to the browser voice.",
    );
    setRunning(true);
    setSnapshot(engine.snapshot());
    await musicRef.current.play(opening, 0, false);
    engine.resume();
    const kicked = engine.tick(0.05);
    setSnapshot(kicked.snapshot);
    void applyCommands(engine, kicked.commands);
  }

  async function applyCommands(
    engine: SessionEngine,
    commands: ReturnType<SessionEngine["tick"]>["commands"],
  ) {
    for (const command of commands) {
      if (command.type === "play-track") {
        await musicRef.current.play(command.track, command.offset, command.fade);
      }
      if (command.type === "speak") {
        const used = await speakCoach({
          text: command.text,
          instructions: command.instructions,
          provider: providerRef.current,
          phase: command.phase,
          eventType: command.eventType,
          hype: engine.plan.hype,
        });
        if (used !== providerRef.current) {
          providerRef.current = used;
          engine.speechProvider = used;
          setSpeechNote("OpenAI speech was unavailable, so the browser voice is being used.");
        }
      }
    }
  }

  function togglePause() {
    const engine = engineRef.current;
    if (!engine || !snapshot) return;
    if (snapshot.paused) {
      engine.resume();
      void musicRef.current.resume();
      if (typeof window.speechSynthesis !== "undefined") window.speechSynthesis.resume();
    } else {
      engine.pause();
      musicRef.current.pause();
      if (typeof window.speechSynthesis !== "undefined") window.speechSynthesis.pause();
    }
    setSnapshot(engine.snapshot());
  }

  function endSession() {
    engineRef.current?.pause();
    musicRef.current.stop();
    if (typeof window.speechSynthesis !== "undefined") window.speechSynthesis.cancel();
    engineRef.current = null;
    setRunning(false);
    setSnapshot(null);
  }

  async function previewVoices() {
    setPreviewing(true);
    const clips: Array<{
      label: string;
      text: string;
      hype: number;
      phase: WorkoutPhase;
      eventType: WorkoutEventType;
      intensity: number;
      upcoming: number;
    }> = [
      {
        label: "Hyped peak",
        text: "Go. Eleven kilometres an hour.",
        hype: 92,
        phase: "peak",
        eventType: "peak",
        intensity: 0.94,
        upcoming: 0.94,
      },
      {
        label: "Hyped recovery",
        text: "Bring it back now. Nice and easy.",
        hype: 92,
        phase: "recovery",
        eventType: "recovery",
        intensity: 0.3,
        upcoming: 0.3,
      },
      {
        label: "Balanced warm-up",
        text: "Good. We are underway. Easy now, and get ready to work.",
        hype: 50,
        phase: "warm-up",
        eventType: "phase_start",
        intensity: 0.28,
        upcoming: 0.56,
      },
      {
        label: "Relaxed recovery",
        text: "Let your breathing settle.",
        hype: 18,
        phase: "recovery",
        eventType: "recovery",
        intensity: 0.28,
        upcoming: 0.28,
      },
    ];

    for (const clip of clips) {
      const instructions = getVoiceDirection({
        hype: clip.hype,
        phase: clip.phase,
        currentIntensity: clip.intensity,
        upcomingIntensity: clip.upcoming,
        eventType: clip.eventType,
      });
      setSpeechNote(`${clip.label}: ${instructions}`);
      await speakCoach({
        text: clip.text,
        instructions,
        provider: defaultSpeechProvider(),
        phase: clip.phase,
        eventType: clip.eventType,
        hype: clip.hype,
      });
      await wait(900);
    }
    setPreviewing(false);
  }

  if (!running || !snapshot) {
    return (
      <main className="safe mx-auto flex min-h-dvh max-w-md flex-col gap-6">
        <header className="pt-3">
          <p className="text-xs uppercase tracking-[0.28em] text-[var(--muted)]">Programmed session</p>
          <h1 className="display mt-2 text-6xl leading-none">Treadmill Coach</h1>
          <p className="mt-3 text-[var(--muted)]">
            Pace, music and coaching share one timeline. Songs stay put unless the next moment needs a different musical state.
          </p>
        </header>

        <section className="rounded-3xl border border-[var(--line)] bg-[var(--panel)] p-5">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">Hype</p>
              <p className="mt-1 text-2xl font-semibold">{workoutLabel(level)}</p>
            </div>
            <p className="text-sm text-[var(--muted)]">{hype}</p>
          </div>
          <input
            aria-label="Hype"
            className="mt-4 w-full accent-[var(--accent)]"
            max={100}
            min={0}
            type="range"
            value={hype}
            onChange={(event) => setHype(Number(event.target.value))}
          />
          <p className="mt-3 text-sm text-[var(--muted)]">
            {level === "relaxed" && "Longer songs, fewer lines, smaller speed changes."}
            {level === "balanced" && "Clear contrast, restrained coaching, deliberate transitions only."}
            {level === "hyped" && "Punchier intervals and more energy, without gratuitous track changes."}
          </p>
        </section>

        <section className="rounded-3xl border border-[var(--line)] bg-[var(--panel)] p-5">
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">Duration</p>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {DURATIONS.map((value) => (
              <button
                key={value}
                className={`rounded-2xl px-3 py-3 text-sm font-semibold ${
                  duration === value ? "bg-[var(--accent)] text-black" : "bg-[#1d232c]"
                }`}
                type="button"
                onClick={() => setDuration(value)}
              >
                {value} min
              </button>
            ))}
          </div>
          <ol className="mt-4 space-y-2 text-sm text-[var(--muted)]">
            {preview.sections.map((section) => (
              <li key={section.id} className="flex justify-between gap-3">
                <span className="capitalize">{formatPhase(section.phase)}</span>
                <span>
                  {formatSpeed(section.speedKph)} km/h · {formatClock(section.end - section.start)}
                </span>
              </li>
            ))}
          </ol>
        </section>

        <label className="flex items-center justify-between rounded-3xl border border-[var(--line)] bg-[var(--panel)] px-5 py-4">
          <span>
            <span className="block font-semibold">Debug mode</span>
            <span className="text-sm text-[var(--muted)]">Show music and coaching decisions</span>
          </span>
          <input
            checked={debug}
            className="h-5 w-5 accent-[var(--accent)]"
            type="checkbox"
            onChange={(event) => setDebug(event.target.checked)}
          />
        </label>

        <button
          className="rounded-full bg-[var(--accent)] px-5 py-4 text-lg font-semibold text-black"
          type="button"
          onClick={() => void startSession()}
        >
          Start session
        </button>
        <button
          className="rounded-full border border-[var(--line)] px-5 py-3 text-sm text-[var(--muted)]"
          disabled={previewing}
          type="button"
          onClick={() => void previewVoices()}
        >
          {previewing ? "Playing voice clips…" : "Preview four coaching deliveries"}
        </button>
        {speechNote ? <p className="text-sm text-[var(--muted)]">{speechNote}</p> : null}
      </main>
    );
  }

  const music = snapshot.music;
  const track = TRACKS.find((item) => item.id === music?.trackId);

  return (
    <main className="safe mx-auto flex min-h-dvh max-w-md flex-col">
      <div className="flex items-center justify-between text-sm text-[var(--muted)]">
        <span className="capitalize">{formatPhase(snapshot.section.phase)}</span>
        <span>{formatClock(snapshot.duration - snapshot.elapsed)}</span>
      </div>

      <section className="mt-6 text-center">
        <p className="text-xs uppercase tracking-[0.28em] text-[var(--muted)]">Treadmill</p>
        <p className="display mt-1 text-[8.4rem] leading-none">{formatSpeed(snapshot.speedKph)}</p>
        <p className="text-xl text-[var(--muted)]">km/h</p>
        <p className="mt-2 text-sm text-[var(--muted)]">{snapshot.section.label}</p>
      </section>

      <section className="mt-6 rounded-3xl border border-[var(--line)] bg-[var(--panel)] p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">Now playing</p>
            <p className="mt-1 text-lg font-semibold">{track?.title ?? "Waiting"}</p>
          </div>
          <p className="capitalize text-sm text-[var(--good)]">{music?.sectionType}</p>
        </div>
        <p className="mt-2 text-sm text-[var(--muted)]">
          {track ? `${formatClock(music?.trackPosition ?? 0)} / ${formatClock(track.duration)}` : ""}
        </p>
        {track ? (
          <div className="mt-3 flex h-2 overflow-hidden rounded-full bg-[#1d232c]">
            {track.sections.map((section) => (
              <span
                key={`${section.type}-${section.start}`}
                className="h-full"
                style={{
                  width: `${((section.end - section.start) / track.duration) * 100}%`,
                  background: sectionColor(section.type, section.start <= (music?.trackPosition ?? 0) && section.end > (music?.trackPosition ?? 0)),
                }}
              />
            ))}
          </div>
        ) : null}
      </section>

      <section className="mt-4 min-h-24 rounded-3xl border border-[var(--line)] bg-[var(--panel)] p-4">
        <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">Coach</p>
        <p className="mt-2 text-xl font-semibold">{snapshot.lastCoach || "Listening to the session."}</p>
      </section>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <button
          className="rounded-full bg-[var(--accent)] px-5 py-4 font-semibold text-black"
          type="button"
          onClick={togglePause}
        >
          {snapshot.paused ? "Resume" : "Pause"}
        </button>
        <button
          className="rounded-full border border-[var(--line)] px-5 py-4"
          type="button"
          onClick={endSession}
        >
          End
        </button>
      </div>

      <p className="mt-4 text-center text-sm text-[var(--muted)]">
        {formatClock(snapshot.elapsed)} / {formatClock(snapshot.duration)} · {workoutLabel(level)}
      </p>
      {speechNote ? <p className="mt-2 text-center text-xs text-[var(--muted)]">{speechNote}</p> : null}

      {debug ? <DebugPanel snapshot={snapshot} decisions={decisions} coachLog={coachLog} /> : null}
    </main>
  );
}

function DebugPanel({
  snapshot,
  decisions,
  coachLog,
}: {
  snapshot: SessionSnapshot;
  decisions: MusicDecision[];
  coachLog: CoachDebugEvent[];
}) {
  const latest = decisions[0];
  return (
    <section className="mt-6 space-y-4 rounded-3xl border border-[var(--line)] bg-[#10141a] p-4 text-sm">
      <h2 className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">Debug</h2>
      <dl className="grid grid-cols-2 gap-2">
        <DebugItem label="Track" value={snapshot.music?.trackId ?? "—"} />
        <DebugItem label="Position" value={formatClock(snapshot.music?.trackPosition ?? 0)} />
        <DebugItem label="Section" value={snapshot.music?.sectionType ?? "—"} />
        <DebugItem label="Current energy" value={snapshot.music?.currentEnergy.toFixed(2) ?? "—"} />
        <DebugItem label="Target energy" value={snapshot.targetMusicEnergy.toFixed(2)} />
        <DebugItem label="Speed" value={`${formatSpeed(snapshot.speedKph)} km/h`} />
        <DebugItem
          label="Upcoming speed"
          value={snapshot.nextSection ? `${formatSpeed(snapshot.nextSection.speedKph)} km/h` : "—"}
        />
        <DebugItem label="Until change" value={formatClock(snapshot.timeUntilNextSection)} />
        <DebugItem label="Considered" value={latest ? "yes" : "not yet"} />
        <DebugItem label="Accepted" value={latest ? String(latest.accepted) : "—"} />
        <DebugItem label="Reason" value={latest?.reason ?? "—"} />
        <DebugItem label="Speech" value={snapshot.speechProvider} />
      </dl>
      <div>
        <h3 className="mb-2 font-semibold">Music decisions</h3>
        <ul className="space-y-2">
          {decisions.slice(0, 6).map((decision, index) => (
            <li key={`${decision.reason}-${index}`} className="rounded-2xl bg-[#1a2028] p-3">
              <p>
                {decision.accepted ? "changed" : "kept"} · {decision.reason}
              </p>
              <p className="text-[var(--muted)]">
                {decision.currentTrackId} @ {formatClock(decision.currentTrackPosition)} · {decision.currentSection} · energy {decision.currentEnergy.toFixed(2)} → {decision.targetEnergy.toFixed(2)}
              </p>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="mb-2 font-semibold">Coaching</h3>
        <ul className="space-y-2">
          {coachLog.slice(0, 6).map((entry) => (
            <li key={`${entry.timestamp}-${entry.text}`} className="rounded-2xl bg-[#1a2028] p-3">
              <p className="font-medium">{entry.text}</p>
              <p className="text-[var(--muted)]">
                {entry.eventType} · {entry.hypeLevel} · {entry.phase} · intensity {entry.currentIntensity.toFixed(2)}
              </p>
              <p className="mt-1 text-xs text-[var(--muted)]">{entry.voiceInstructions}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function DebugItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-[#1a2028] px-3 py-2">
      <dt className="text-[10px] uppercase tracking-[0.18em] text-[var(--muted)]">{label}</dt>
      <dd className="mt-1 capitalize">{value}</dd>
    </div>
  );
}

function sectionColor(type: string, active: boolean): string {
  const colors: Record<string, string> = {
    intro: "#3d4754",
    verse: "#4f6d7a",
    build: "#d39b3a",
    chorus: "#ff6b2c",
    drop: "#ff3b3b",
    breakdown: "#5c7a63",
    outro: "#2f3540",
  };
  const color = colors[type] ?? "#667";
  return active ? color : `${color}99`;
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}
