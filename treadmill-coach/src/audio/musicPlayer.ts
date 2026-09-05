import type { Track } from "../types";

function resolveSrc(src: string): string {
  const base = import.meta.env.BASE_URL.endsWith("/")
    ? import.meta.env.BASE_URL
    : `${import.meta.env.BASE_URL}/`;
  return `${base}${src.replace(/^\//, "")}`;
}

export class MusicPlayer {
  private active = new Audio();
  private incoming = new Audio();
  private fadeTimer: number | null = null;

  constructor() {
    this.active.preload = "auto";
    this.incoming.preload = "auto";
    this.active.loop = false;
    this.incoming.loop = false;
  }

  get position(): number {
    return this.active.currentTime || 0;
  }

  get paused(): boolean {
    return this.active.paused;
  }

  async play(track: Track, offset = 0, fade = false): Promise<void> {
    const src = resolveSrc(track.src);
    if (!fade) {
      this.stopFade();
      this.incoming.pause();
      this.active.src = src;
      this.active.currentTime = offset;
      this.active.volume = 1;
      await this.active.play();
      return;
    }

    this.incoming.src = src;
    this.incoming.currentTime = offset;
    this.incoming.volume = 0;
    await this.incoming.play();
    this.crossfade(1.6);
  }

  pause(): void {
    this.active.pause();
    this.incoming.pause();
  }

  async resume(): Promise<void> {
    if (this.active.src) await this.active.play();
  }

  stop(): void {
    this.stopFade();
    this.active.pause();
    this.incoming.pause();
    this.active.removeAttribute("src");
    this.incoming.removeAttribute("src");
  }

  private crossfade(seconds: number): void {
    this.stopFade();
    const from = this.active;
    const to = this.incoming;
    const started = performance.now();
    const step = () => {
      const progress = Math.min(1, (performance.now() - started) / (seconds * 1000));
      from.volume = 1 - progress;
      to.volume = progress;
      if (progress < 1) {
        this.fadeTimer = window.setTimeout(step, 40);
        return;
      }
      from.pause();
      this.active = to;
      this.incoming = from;
      this.active.volume = 1;
    };
    step();
  }

  private stopFade(): void {
    if (this.fadeTimer != null) window.clearTimeout(this.fadeTimer);
    this.fadeTimer = null;
  }
}
