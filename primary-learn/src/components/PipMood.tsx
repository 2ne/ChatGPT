import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { PipMood } from "./mascot/Pip";

type PipMoodContextValue = {
  mood: PipMood;
  setMood: (mood: PipMood) => void;
};

const PipMoodContext = createContext<PipMoodContextValue | null>(null);

export function PipMoodProvider({ children }: { children: ReactNode }) {
  const [mood, setMood] = useState<PipMood>("happy");
  const value = useMemo(() => ({ mood, setMood }), [mood]);
  return <PipMoodContext.Provider value={value}>{children}</PipMoodContext.Provider>;
}

export function usePipMood() {
  const value = useContext(PipMoodContext);
  if (!value) {
    throw new Error("usePipMood must be used within PipMoodProvider");
  }
  return value;
}
