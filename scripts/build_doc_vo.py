#!/usr/bin/env python3
"""Generic VO + manifest builder for the mindwired archival-documentary system.

Reads a doc spec (src/mindwired-doc/docs/<slug>.json — scenes of
{id, text, img?, cap?, stat?, chapter?}), synthesizes one Cartesia clip per
scene into public/shorts/<slug>/audio/<id>.mp3, then writes
src/mindwired-doc/docs/<slug>.manifest.json with:

  durations: {id: seconds}            (ffprobe of the real clips)
  images:    {prefix: [filenames...]} (scan of public/shorts/<slug>/images)

The Remotion comp (src/mindwired-doc/DocWide.tsx) imports doc + manifest
statically, so ALWAYS run this before typecheck/render. Idempotent per clip —
re-runs never re-spend Cartesia quota on existing mp3s.

    .venv-lipsync/bin/python scripts/build_doc_vo.py <slug> [--only a1,b2] [--force] [--manifest-only]
"""
from __future__ import annotations
import argparse, hashlib, json, re, subprocess, sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent / "lib"))
import cartesia  # noqa: E402
import mouthtrack  # noqa: E402
import pronounce  # noqa: E402
import vopolish  # noqa: E402

REPO = Path(__file__).resolve().parent.parent
DOCS = REPO / "src" / "mindwired-doc" / "docs"


def duration(p: Path) -> float:
    r = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration",
        "-of", "default=noprint_wrappers=1:nokey=1", str(p)], capture_output=True, text=True)
    try: return float(r.stdout.strip())
    except ValueError: return 0.0


def scan_images(img_dir: Path) -> dict[str, list[str]]:
    groups: dict[str, list[str]] = {}
    for f in sorted(img_dir.glob("*")):
        if f.suffix.lower() not in {".jpg", ".jpeg", ".png", ".webp"}: continue
        m = re.match(r"(.+?)_\d+$", f.stem)
        groups.setdefault(m.group(1) if m else f.stem, []).append(f.name)
    return groups


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("slug")
    ap.add_argument("--only", default="")
    ap.add_argument("--force", action="store_true")
    ap.add_argument("--manifest-only", action="store_true")
    # 0.97 (was 0.94, 2026-07-19): global slowdown reads robotic per Cartesia's
    # own docs — keep the pace near-natural, let punctuation do the breathing.
    # A/B evidence: out/qa/vo_ab/ (scripts/vo_ab_test.py).
    ap.add_argument("--speed", type=float, default=None,
                    help="default: the speed this episode was built with (manifest), "
                         "else 0.97 — so --only re-synths can't splice a different "
                         "cadence between existing clips")
    ap.add_argument("--no-polish", action="store_true",
                    help="skip the broadcast polish chain (vopolish.py). Like --speed, "
                         "polish is sticky per episode via the manifest so --only "
                         "re-synths can't splice processed and raw clips together.")
    args = ap.parse_args()

    doc = json.loads((DOCS / f"{args.slug}.json").read_text())
    mpath_prev = DOCS / f"{args.slug}.manifest.json"
    prev_speed = None
    prev_polish = None
    prev_hash: dict[str, str] = {}
    if mpath_prev.exists():
        _prev = json.loads(mpath_prev.read_text())
        prev_speed = _prev.get("speed")
        prev_polish = _prev.get("polish")
        prev_hash = _prev.get("texthash", {})
    # polish: sticky per episode. A pre-existing manifest without the key means
    # the episode predates the polish chain — its clips are raw, so --only
    # re-synths must stay raw too (else one clip splices in sounding different).
    # Brand-new episodes default to polished; --force full re-synths may adopt it.
    episode_is_raw = mpath_prev.exists() and not prev_polish
    if args.no_polish:
        do_polish = False
    elif episode_is_raw and not args.force:
        if not args.manifest_only:
            print("NOTE: episode's existing clips are unpolished — keeping new "
                  "clips raw for consistency. Re-synth ALL with --force to adopt "
                  "the polish chain.")
        do_polish = False
    else:
        do_polish = True
    if args.speed is None:
        args.speed = prev_speed or 0.97
    elif prev_speed and abs(args.speed - prev_speed) > 0.001:
        print(f"NOTE: episode was built at speed {prev_speed}; you passed "
              f"{args.speed} — mixed clips will have an audible cadence jump. "
              f"Use --force to re-synth ALL clips at the new speed.")
    out = REPO / "public" / "shorts" / args.slug
    audio_dir = out / "audio"; audio_dir.mkdir(parents=True, exist_ok=True)
    only = {s.strip() for s in args.only.split(",") if s.strip()}

    durs: dict[str, float] = {}
    # per-scene sha256 of the SPOKEN source text at synth time — preflight
    # compares against the current doc text so a post-TTS text edit can never
    # ship a clip silently speaking the OLD words (audit 2026-08-26; the
    # dbcooper "--manifest-only after a text edit" near-miss class)
    texthash: dict[str, str] = {}
    synthed: set[str] = set()
    for s in doc["scenes"]:
        bid = s["id"]
        dst = audio_dir / f"{bid}.mp3"
        if not args.manifest_only and (not only or bid in only):
            if dst.exists() and not args.force:
                pass
            else:
                slow = "chapter" in s  # chapter cards land heavier
                # mascot cutaways can carry their OWN playful voice
                # (doc-level "mascotVoice"), distinct from the narrator
                voice = (doc.get("mascotVoice") or doc.get("voice")) \
                    if s.get("mascotFull") else doc.get("voice")
                # per-scene speed override (2026-07-21): a scene can set
                # "speed": 0.92 so the mascot lands his lines more deliberately
                # (mascotFull scenes read better slower). Falls back to the
                # chapter-card slowdown, then the episode default. Watch for a
                # cadence jump at the cut boundary — keep the delta small (~0.05).
                scene_speed = s.get("speed",
                    (args.speed - 0.02) if slow else args.speed)
                # spoken respellings (lib/pronounce.py) — synth-time only; the
                # doc JSON / on-screen text / whisper SRT keep written forms
                spoken = pronounce.respell(s["text"])
                audio = cartesia.tts(spoken, voice=voice,
                                     language=doc.get("language", "en"),
                                     tone=s.get("tone"),  # scene emotion (EMOTION_FOR_TONE)
                                     speed=scene_speed)
                if do_polish:
                    try:
                        audio = vopolish.polish(audio)
                    except Exception as e:  # never lose a paid clip to ffmpeg
                        print(f"    !! polish failed for {bid} ({e}) — keeping raw")
                dst.write_bytes(audio)
                synthed.add(bid)
                print(f"->  {bid}.mp3 ({len(audio)}b{', polished' if do_polish else ''})")
        if dst.exists():
            durs[bid] = round(duration(dst), 3)
            cur = hashlib.sha256(s["text"].encode()).hexdigest()[:16]
            if bid in synthed:
                texthash[bid] = cur          # freshly synthesized from this text
            elif bid in prev_hash:
                texthash[bid] = prev_hash[bid]  # carry the synth-time record forward
            # else: legacy clip with no record — leave unhashed (preflight skips)

    # cartoon lip-sync tracks for scenes where the mascot speaks the narration
    # ("speak": true) — cheap enough to compute for every clip (see mouthtrack.py)
    mouths: dict[str, str] = {}
    for s in doc["scenes"]:
        clip = audio_dir / f"{s['id']}.mp3"
        if s.get("speak") and clip.exists():
            mouths[s["id"]] = mouthtrack.mouth_track(clip)

    missing = [s["id"] for s in doc["scenes"] if s["id"] not in durs]
    manifest = {"durations": durs, "images": scan_images(out / "images"),
                "missing": missing, "speed": args.speed, "polish": do_polish,
                "mouth": mouths, "texthash": texthash}
    mpath = DOCS / f"{args.slug}.manifest.json"
    mpath.write_text(json.dumps(manifest, indent=1))
    total = sum(durs.values())
    print(f"\n{len(durs)} clips · narration {total/60:.1f} min · manifest -> {mpath.name}")
    if missing:
        print(f"MISSING AUDIO ({len(missing)}): {','.join(missing[:20])}{'...' if len(missing) > 20 else ''}")


if __name__ == "__main__":
    main()
