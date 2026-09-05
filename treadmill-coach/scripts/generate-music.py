#!/usr/bin/env python3
"""Generate original treadmill soundtrack stems with labelled musical sections."""

from __future__ import annotations

import math
import os
import struct
import subprocess
import tempfile
from dataclasses import dataclass


SR = 22050


@dataclass(frozen=True)
class Section:
    kind: str
    bars: int
    energy: float


@dataclass(frozen=True)
class TrackSpec:
    track_id: str
    title: str
    bpm: int
    root: float
    character: str
    sections: tuple[Section, ...]


TRACKS = (
    TrackSpec(
        "easy-miles",
        "Easy Miles",
        96,
        196.0,
        "warm",
        (
            Section("intro", 8, 0.22),
            Section("verse", 20, 0.30),
            Section("chorus", 12, 0.40),
            Section("verse", 16, 0.32),
            Section("chorus", 12, 0.42),
            Section("outro", 8, 0.20),
        ),
    ),
    TrackSpec(
        "steady-horizon",
        "Steady Horizon",
        108,
        220.0,
        "cruise",
        (
            Section("intro", 8, 0.28),
            Section("verse", 16, 0.40),
            Section("build", 8, 0.50),
            Section("chorus", 16, 0.58),
            Section("verse", 16, 0.42),
            Section("chorus", 12, 0.56),
            Section("outro", 8, 0.26),
        ),
    ),
    TrackSpec(
        "rising-cadence",
        "Rising Cadence",
        118,
        233.08,
        "lift",
        (
            Section("intro", 8, 0.32),
            Section("verse", 16, 0.44),
            Section("build", 8, 0.60),
            Section("chorus", 16, 0.74),
            Section("verse", 12, 0.46),
            Section("build", 8, 0.64),
            Section("chorus", 16, 0.78),
            Section("outro", 8, 0.30),
        ),
    ),
    TrackSpec(
        "night-stride",
        "Night Stride",
        122,
        246.94,
        "drive",
        (
            Section("intro", 8, 0.34),
            Section("verse", 16, 0.48),
            Section("build", 8, 0.62),
            Section("chorus", 16, 0.80),
            Section("breakdown", 8, 0.40),
            Section("build", 8, 0.66),
            Section("drop", 16, 0.86),
            Section("outro", 8, 0.32),
        ),
    ),
    TrackSpec(
        "push-window",
        "Push Window",
        128,
        261.63,
        "push",
        (
            Section("intro", 8, 0.40),
            Section("verse", 12, 0.54),
            Section("build", 8, 0.70),
            Section("drop", 16, 0.88),
            Section("breakdown", 8, 0.48),
            Section("build", 8, 0.74),
            Section("chorus", 16, 0.90),
            Section("outro", 8, 0.36),
        ),
    ),
    TrackSpec(
        "summit-drive",
        "Summit Drive",
        136,
        293.66,
        "peak",
        (
            Section("intro", 8, 0.46),
            Section("verse", 12, 0.60),
            Section("build", 8, 0.76),
            Section("drop", 16, 0.94),
            Section("breakdown", 8, 0.50),
            Section("build", 8, 0.80),
            Section("chorus", 16, 0.96),
            Section("outro", 8, 0.38),
        ),
    ),
    TrackSpec(
        "cool-current",
        "Cool Current",
        92,
        174.61,
        "calm",
        (
            Section("intro", 8, 0.18),
            Section("verse", 20, 0.28),
            Section("chorus", 12, 0.36),
            Section("verse", 16, 0.26),
            Section("breakdown", 12, 0.22),
            Section("outro", 8, 0.16),
        ),
    ),
)


def clamp(value: float, low: float = -1.0, high: float = 1.0) -> float:
    return max(low, min(high, value))


def midi(freq_ratio: float, root: float) -> float:
    return root * freq_ratio


def env(index: int, total: int, attack: float, release: float) -> float:
    if total <= 1:
        return 1.0
    position = index / (total - 1)
    if position < attack:
        return position / attack
    if position > 1 - release:
        return max(0.0, (1 - position) / release)
    return 1.0


def write_wav(path: str, samples: list[float]) -> None:
    with open(path, "wb") as handle:
        handle.write(b"RIFF")
        handle.write(struct.pack("<I", 36 + len(samples) * 2))
        handle.write(b"WAVEfmt ")
        handle.write(struct.pack("<IHHIIHH", 16, 1, 1, SR, SR * 2, 2, 16))
        handle.write(b"data")
        handle.write(struct.pack("<I", len(samples) * 2))
        for sample in samples:
            handle.write(struct.pack("<h", int(clamp(sample) * 32000)))


def render_bar(spec: TrackSpec, section: Section, bar_index: int) -> list[float]:
    seconds = 4 * 60 / spec.bpm
    count = int(seconds * SR)
    beat = seconds / 4
    samples = [0.0] * count
    energy = section.energy
    kind = section.kind

    progression = [
        (1.0, 1.25, 1.5),
        (1.125, 1.333, 1.687),
        (0.75, 1.0, 1.25),
        (0.889, 1.125, 1.333),
    ][bar_index % 4]

    bass_note = midi(progression[0], spec.root / 4)
    pad_notes = [midi(ratio, spec.root / 2) for ratio in progression]
    lead_note = midi(progression[2] if kind in {"chorus", "drop"} else progression[1], spec.root)

    for index in range(count):
        t = index / SR
        beat_pos = (t / beat) % 1
        bar_pos = t / seconds
        value = 0.0

        pad_gain = 0.10 + energy * 0.10
        if kind == "breakdown":
            pad_gain *= 0.55
        if kind == "outro":
            pad_gain *= 0.7 * (1 - bar_pos * 0.4)
        for harmonic, note in enumerate(pad_notes):
            value += pad_gain * 0.55 * math.sin(2 * math.pi * note * t) / (1 + harmonic * 0.35)
            value += pad_gain * 0.18 * math.sin(4 * math.pi * note * t + 0.2)

        bass_gain = 0.12 + energy * 0.16
        if kind in {"intro", "outro", "breakdown"}:
            bass_gain *= 0.55 if spec.character in {"warm", "calm"} else 0.7
        value += bass_gain * math.sin(2 * math.pi * bass_note * t) * (0.7 + 0.3 * math.sin(2 * math.pi * 0.5 * t))

        kick_hits = 4 if energy >= 0.45 or spec.character in {"push", "peak", "drive"} else 2
        kick_times = [i * beat * (4 / kick_hits) for i in range(kick_hits)]
        for kick_at in kick_times:
            age = t - kick_at
            if 0 <= age < 0.16:
                click = math.exp(-age * 28) * math.sin(2 * math.pi * (140 + spec.bpm * 0.2) * age)
                body = math.exp(-age * 14) * math.sin(2 * math.pi * (58 + energy * 10) * age)
                value += (0.22 + energy * 0.28) * (click * 0.35 + body)

        if energy >= 0.42 and kind not in {"intro", "outro"}:
            for hat_at in (beat * 0.5, beat * 1.5, beat * 2.5, beat * 3.5):
                age = t - hat_at
                if 0 <= age < 0.05:
                    noise = ((index * 1103515245 + bar_index * 12345) % 1000) / 500 - 1
                    value += (0.035 + energy * 0.05) * noise * math.exp(-age * 80)

        if kind in {"chorus", "drop", "build"} and energy >= 0.5:
            for snare_at in (beat, beat * 3):
                age = t - snare_at
                if 0 <= age < 0.12:
                    noise = ((index * 214013 + 2531011) % 1000) / 500 - 1
                    value += (0.10 + energy * 0.12) * noise * math.exp(-age * 22)

        if kind == "build":
            sweep = 0.04 + bar_pos * 0.10
            value += sweep * math.sin(2 * math.pi * (lead_note * (1 + bar_pos * 0.08)) * t)
            value += 0.04 * bar_pos * math.sin(2 * math.pi * (40 + bar_pos * 80) * t)

        if kind in {"chorus", "drop"}:
            lead_gain = 0.08 + energy * 0.10
            value += lead_gain * math.sin(2 * math.pi * lead_note * t + 0.4 * math.sin(2 * math.pi * 5 * t))
            if kind == "drop" and beat_pos < 0.12 and int(t / beat) % 2 == 0:
                value += 0.08 * math.sin(2 * math.pi * (spec.root * 2) * t)

        if kind == "verse" and spec.character in {"warm", "calm", "cruise"}:
            value += 0.04 * math.sin(2 * math.pi * (spec.root / 3) * t)

        samples[index] = clamp(value * env(index, count, 0.01, 0.03) * (0.82 + energy * 0.18))

    return samples


def render_track(spec: TrackSpec) -> tuple[list[float], list[dict]]:
    samples: list[float] = []
    metadata: list[dict] = []
    start = 0.0
    bar_index = 0
    seconds_per_bar = 4 * 60 / spec.bpm
    prototypes: dict[tuple[str, float], list[float]] = {}

    for section in spec.sections:
        key = (section.kind, section.energy)
        if key not in prototypes:
            prototypes[key] = render_bar(spec, section, bar_index)
        bar = prototypes[key]
        chunk: list[float] = []
        for repeat in range(section.bars):
            gain = 0.96 + (repeat % 4) * 0.015
            chunk.extend(sample * gain for sample in bar)
            bar_index += 1
        duration = section.bars * seconds_per_bar
        metadata.append(
            {
                "type": section.kind,
                "start": round(start, 3),
                "end": round(start + duration, 3),
                "energy": section.energy,
            }
        )
        samples.extend(chunk)
        start += duration

    fade = int(1.4 * SR)
    for index in range(fade):
        samples[-(index + 1)] *= index / fade

    peak = max(abs(sample) for sample in samples) or 1.0
    samples = [sample / peak * 0.92 for sample in samples]
    return samples, metadata


def encode_mp3(wav_path: str, mp3_path: str) -> None:
    subprocess.run(
        [
            "ffmpeg",
            "-y",
            "-i",
            wav_path,
            "-codec:a",
            "libmp3lame",
            "-b:a",
            "96k",
            "-ar",
            "22050",
            "-ac",
            "1",
            mp3_path,
        ],
        check=True,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )


def main() -> None:
    out_dir = os.path.join(os.path.dirname(__file__), "..", "public", "music")
    os.makedirs(out_dir, exist_ok=True)
    catalog = []

    with tempfile.TemporaryDirectory() as tmp:
        for spec in TRACKS:
            samples, sections = render_track(spec)
            wav_path = os.path.join(tmp, f"{spec.track_id}.wav")
            mp3_path = os.path.join(out_dir, f"{spec.track_id}.mp3")
            write_wav(wav_path, samples)
            encode_mp3(wav_path, mp3_path)
            duration = len(samples) / SR
            catalog.append(
                {
                    "id": spec.track_id,
                    "title": spec.title,
                    "bpm": spec.bpm,
                    "duration": round(duration, 3),
                    "baseEnergy": round(sum(section.energy for section in spec.sections) / len(spec.sections), 3),
                    "sections": sections,
                }
            )
            print(f"wrote {mp3_path} ({duration:.1f}s)")

    manifest_path = os.path.join(os.path.dirname(__file__), "..", "src", "data", "generated-manifest.json")
    os.makedirs(os.path.dirname(manifest_path), exist_ok=True)
    import json

    with open(manifest_path, "w", encoding="utf-8") as handle:
        json.dump(catalog, handle, indent=2)
        handle.write("\n")
    print(f"wrote {manifest_path}")


if __name__ == "__main__":
    main()
