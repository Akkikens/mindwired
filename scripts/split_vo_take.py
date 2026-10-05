#!/usr/bin/env python3
"""Split ONE human-recorded narration take into per-scene doc-engine clips.

Built for appeal/host videos where the narrator is a real person reading the
doc spec's scene texts top-to-bottom in a single recording (first use:
mindwiredprocess — Akshay's own voice). The doc engine wants one mp3 per
scene id; this produces them WITHOUT any TTS.

  python3 scripts/split_vo_take.py <slug> <take.(m4a|mp3|wav)> [--dry-run]

How: faster-whisper word timestamps -> GLOBAL word-level alignment of the
whole expected script (all scene texts, in order) against the whole
transcript (difflib matching blocks, monotonic) -> each scene starts at its
first aligned word -> cut in the silence between scenes. Global alignment
survives ad-libs, dropped words, and accent-mangled transcription far better
than per-scene anchor search (which mis-cut 5 of 20 boundaries on the first
real take; a silence-snap heuristic then broke different ones — the narrator
pauses mid-phrase as often as between beats, so content is the only reliable
boundary signal). Then run:

  python3 scripts/build_doc_vo.py <slug> --manifest-only

Low-confidence scenes (few of their expected words matched) are printed
loudly — LISTEN to those clips before trusting them. Requires:
pip install faster-whisper; ffmpeg on PATH.
"""
import argparse
import json
import re
import subprocess
import sys
import tempfile
from difflib import SequenceMatcher
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
DOCS = REPO / "src" / "mindwired-doc" / "docs"

PAD = 0.08         # seconds kept before/after a scene inside the gap
MIN_COVER = 0.5    # below this fraction of matched scene words, flag it


def norm(t: str) -> list[str]:
    t = t.lower().replace("'", "'")
    t = re.sub(r"[^a-z0-9' ]+", " ", t)
    return [w for w in t.split() if w]


def transcribe(wav: Path):
    from faster_whisper import WhisperModel
    model = WhisperModel("small", device="cpu", compute_type="int8")
    segs, _ = model.transcribe(str(wav), word_timestamps=True, language="en")
    words = []
    for seg in segs:
        for w in seg.words or []:
            toks = norm(w.word)
            if toks:
                words.append((toks[0], w.start, w.end))
    return words


def align(scenes, words):
    """Map each scene to its first/last matched transcript-word index via one
    global alignment. Returns [(start_i, cover)] per scene; start_i of scene
    n+1 bounds scene n."""
    exp, owner = [], []
    for n, s in enumerate(scenes):
        for w in norm(s["text"]):
            exp.append(w)
            owner.append(n)
    hay = [w[0] for w in words]
    sm = SequenceMatcher(None, exp, hay, autojunk=False)
    # exp index -> transcript index, for every matched word
    emap: dict[int, int] = {}
    for a, b, size in sm.get_matching_blocks():
        for k in range(size):
            emap[a + k] = b + k
    starts, covers = [], []
    bound = 0
    for n in range(len(scenes)):
        idxs = [i for i in range(len(exp)) if owner[i] == n]
        hits = [emap[i] for i in idxs if i in emap]
        hits = [h for h in hits if h >= bound]
        if hits:
            start = min(hits)
            cover = len(hits) / len(idxs)
        else:
            start, cover = bound, 0.0
        starts.append(start)
        covers.append(cover)
        bound = max(bound, start + 1)
    return starts, covers


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("slug")
    ap.add_argument("take", type=Path)
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    doc = json.loads((DOCS / f"{args.slug}.json").read_text())
    scenes = doc["scenes"]
    if not args.take.exists():
        sys.exit(f"take not found: {args.take}")
    out_dir = REPO / "public" / "shorts" / args.slug / "audio"
    out_dir.mkdir(parents=True, exist_ok=True)

    with tempfile.TemporaryDirectory() as td:
        wav = Path(td) / "take.wav"
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(args.take),
                        "-ac", "1", "-ar", "16000", str(wav)], check=True)
        print("[split] transcribing (faster-whisper small, cpu)…")
        words = transcribe(wav)
    if not words:
        sys.exit("no words transcribed — is the take audible?")
    total = words[-1][2]
    print(f"[split] {len(words)} words, {total/60:.1f} min of audio")

    starts, covers = align(scenes, words)

    cuts, bad = [], []
    print(f"\n{'id':<8}{'start':>8}{'end':>8}{'dur':>7}  cover  clip edges")
    for n, s in enumerate(scenes):
        lo = starts[n]
        hi = starts[n + 1] if n + 1 < len(scenes) else len(words)
        w_start, w_end = words[lo][1], words[hi - 1][2]
        nxt = words[starts[n + 1]][1] if n + 1 < len(scenes) else total
        gap = max(0.0, nxt - w_end)
        t0 = max(0.0, w_start - PAD if n else 0.0)
        t1 = min(total, w_end + min(PAD, gap / 2) if n + 1 < len(scenes) else total)
        cuts.append((s["id"], t0, t1))
        seg = [w[0] for w in words[lo:hi]]
        mark = "OK " if covers[n] >= MIN_COVER else "?? "
        if covers[n] < MIN_COVER:
            bad.append(s["id"])
        edges = f"[{' '.join(seg[:3])} … {' '.join(seg[-3:])}]"
        print(f"{s['id']:<8}{t0:>8.2f}{t1:>8.2f}{t1-t0:>7.2f}  {mark}{covers[n]:.2f}  {edges}")
    if args.dry_run:
        return
    for sid, t0, t1 in cuts:
        dst = out_dir / f"{sid}.mp3"
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(args.take),
                        "-ss", f"{t0:.3f}", "-to", f"{t1:.3f}",
                        "-ar", "44100", "-b:a", "192k", str(dst)], check=True)
    print(f"\n[split] {len(cuts)} clips -> {out_dir}")
    if bad:
        print(f"[split] !! LISTEN before trusting (weak alignment): {', '.join(bad)}")
    print(f"[split] next: python3 scripts/build_doc_vo.py {args.slug} --manifest-only")


if __name__ == "__main__":
    main()
