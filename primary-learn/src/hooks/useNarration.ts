import { useEffect, useRef, useState } from "react";
import { cancelSpeech, loadVoices, speak, speechSupported } from "../lib/speech";

export function useNarration(resetKey: string) {
  const [available, setAvailable] = useState(() => speechSupported());
  const [playing, setPlaying] = useState(false);
  const [charIndex, setCharIndex] = useState(-1);
  const generation = useRef(0);

  useEffect(() => {
    if (!speechSupported()) {
      setAvailable(false);
      return;
    }
    loadVoices();
    const timer = window.setTimeout(() => {
      loadVoices();
      setAvailable(speechSupported());
    }, 250);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    generation.current += 1;
    cancelSpeech();
    setPlaying(false);
    setCharIndex(-1);
  }, [resetKey]);

  useEffect(() => {
    return () => {
      generation.current += 1;
      cancelSpeech();
    };
  }, []);

  function play(text: string, extra?: string) {
    if (!speechSupported()) return;
    const ticket = (generation.current += 1);
    cancelSpeech();
    setPlaying(true);
    setCharIndex(-1);

    speak({
      text,
      onBoundary: (index) => {
        if (generation.current === ticket) setCharIndex(index);
      },
      onEnd: () => {
        if (generation.current !== ticket) return;
        if (extra?.trim()) {
          setCharIndex(-1);
          speak({
            text: extra,
            onEnd: () => {
              if (generation.current !== ticket) return;
              setPlaying(false);
              setCharIndex(-1);
            },
          });
          return;
        }
        setPlaying(false);
        setCharIndex(-1);
      },
    });
  }

  function stop() {
    generation.current += 1;
    cancelSpeech();
    setPlaying(false);
    setCharIndex(-1);
  }

  function toggle(text: string, extra?: string) {
    if (playing) stop();
    else play(text, extra);
  }

  return { available, playing, charIndex, play, stop, toggle };
}
