#!/usr/bin/env python3
"""Per-episode ORIGINAL music beds — plan, ingest, log provenance.

Status 2026-09-16 (probed, not assumed — see CLAUDE.md "Generated beds"):
  * Higgsfield MCP has exactly ONE music model, `sonilo_music` (FAL). Its own
    catalog labels it "Game pipeline only" and the generate_audio tool text says
    to decline standalone music. get_cost preflight nevertheless prices it at
    0.0625 credits/sec (30s=1.88, 180s=11.25, 600s=37.5) with no length ceiling
    surfaced. Whether a REAL submission is accepted is unproven: the account had
    0 credits (free plan) when this was built.
  * The MCP is only callable from a Claude session, never from Python. So this
    script does the three parts that ARE scriptable and provider-neutral:
      plan    -> windows from the manifest + the exact prompt + credit math
      ingest  -> download/normalize a finished generation into public/beds/generated/
                 and append the provenance row to public/beds/LICENSES.md
      windows -> just print the mix_music_windowed() windows for a slug
    The generation call itself is made by Claude with the printed params
    (get_cost:true first, per the higgsfield-broll-pipeline preflight rule).

HARD RULE: prompts describe instrumentation/tempo/mood only. Never name an
artist, song, album, soundtrack or "in the style of" — the guard below refuses.

Usage:
  python3 scripts/gen_music_bed.py plan sept11timeline tension
  python3 scripts/gen_music_bed.py windows sept11timeline
  python3 scripts/gen_music_bed.py ingest sept11timeline tension <rawUrl|file> \
      --model sonilo_music --prompt "<exact prompt used>" [--duration 45]
"""
from __future__ import annotations
import argparse, datetime as dt, re, subprocess, sys, tempfile, urllib.request
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(REPO / "scripts" / "lib"))
import doctiming  # noqa: E402
import master     # noqa: E402

GEN_DIR = REPO / "public" / "beds" / "generated"
LICENSES = REPO / "public" / "beds" / "LICENSES.md"
CREDITS_PER_SEC = 0.0625          # measured via get_cost 2026-09-16 (sonilo_music)
DEFAULT_MODEL = "sonilo_music"

# Tone families mirror the licensed bed_<tone>_* set so --music call sites don't
# change. Every prompt is instrumentation + tempo + mood, nothing nameable.
TONES: dict[str, str] = {
    "awe": ("Slow ambient orchestral score, sustained warm string pads, distant "
            "choir-like synth swells, soft mallet accents, wide reverb, no drums, "
            "no vocals, no melody hook, 55 bpm, sense of scale and cosmic wonder, "
            "instrumental only, seamless loop"),
    "tension": ("Low sustained drone with slow cello swells, sparse deep piano "
                "notes, subtle ticking pulse, quiet sub bass, restrained and "
                "uneasy, no drums, no vocals, no melody hook, 60 bpm, investigative "
                "documentary dread, instrumental only, seamless loop"),
    "somber": ("Soft solo piano with long sustained string pad underneath, very "
               "slow and spacious, minor key, gentle, reflective, memorial tone, "
               "no drums, no vocals, no melody hook, 50 bpm, instrumental only, "
               "seamless loop"),
}

_FORBIDDEN = re.compile(
    r"\b(in the style of|sounds? like|by [A-Z][a-z]+|soundtrack|theme from|"
    r"ost|cover of|remix|artist|band|singer|song|track by|album|billboard|chart)\b",
    re.I)


def guard_prompt(p: str) -> str:
    m = _FORBIDDEN.search(p)
    if m:
        sys.exit(f"prompt refused (Content-ID rule: no artist/song/style-of "
                 f"references) — matched {m.group(0)!r}. Describe instrumentation, "
                 f"tempo and mood instead.")
    return p


def windows_for(slug: str) -> tuple[list[tuple[float, float]], float]:
    doc, man = doctiming.load(slug)
    d = man["durations"]
    return doctiming.music_windows(doc, d), doctiming.body_seconds(doc, d)


def cmd_windows(a):
    wins, total = windows_for(a.slug)
    print(f"{a.slug}: body {total:.1f}s, {len(wins)} windows, "
          f"{sum(e - s for s, e in wins):.1f}s scored")
    for s, e in wins:
        print(f"  {s:8.2f} - {e:8.2f}  ({e - s:5.1f}s)")


def cmd_plan(a):
    wins, total = windows_for(a.slug)
    longest = max(e - s for s, e in wins)
    # mix_music_windowed loops the bed (-stream_loop -1), so one stem at least
    # as long as the longest window avoids a mid-window loop seam.
    dur = a.duration or int(-(-longest // 15) * 15)
    prompt = guard_prompt(a.prompt or TONES[a.tone])
    print(f"slug={a.slug} tone={a.tone} body={total:.1f}s windows={len(wins)} "
          f"longest_window={longest:.1f}s -> stem duration {dur}s")
    print(f"estimated cost @ {CREDITS_PER_SEC} cr/s: {dur * CREDITS_PER_SEC:.2f} credits "
          f"(verify with get_cost:true FIRST — balance was 0 on 2026-09-16)")
    print("\nMCP call for Claude (preflight, then real):")
    print(f'  generate_audio(params={{"model":"{a.model}","duration":{dur},'
          f'"get_cost":true,"prompt":{prompt!r}}})')
    print("\nthen: python3 scripts/gen_music_bed.py ingest", a.slug, a.tone,
          "<rawUrl>", f"--model {a.model} --duration {dur} --prompt '<same prompt>'")
    print("\nwindows:")
    for s, e in wins:
        print(f"  {s:8.2f} - {e:8.2f}")


def cmd_ingest(a):
    prompt = guard_prompt(a.prompt)
    GEN_DIR.mkdir(parents=True, exist_ok=True)
    n = 1 + len(list(GEN_DIR.glob(f"{a.slug}_{a.tone}_*.mp3")))
    out = GEN_DIR / f"{a.slug}_{a.tone}_{n}.mp3"
    with tempfile.TemporaryDirectory() as td:
        src = Path(td) / "src"
        if re.match(r"^https?://", a.source):
            urllib.request.urlretrieve(a.source, src)
        else:
            src = Path(a.source)
            if not src.exists():
                sys.exit(f"not found: {src}")
        # Match the licensed set's container: 44.1 kHz stereo 320k mp3.
        r = subprocess.run(["ffmpeg", "-y", "-i", str(src), "-vn", "-ac", "2",
                            "-ar", "44100", "-b:a", "320k", str(out)],
                           capture_output=True, text=True)
        if r.returncode != 0:
            sys.exit(r.stderr[-400:])
    dur = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries",
                                "format=duration", "-of", "csv=p=0", str(out)],
                               capture_output=True, text=True).stdout.strip())
    lufs = master.probe_loudness(out)
    today = dt.date.today().isoformat()
    row = (f"| `generated/{out.name}` | {a.model} | {today} | {a.tone} | {dur:.1f}s | "
           f"{lufs if lufs is None else f'{lufs:.1f} LUFS'} | {prompt.replace('|', '/')} |\n")
    text = LICENSES.read_text()
    if "## generated/ — original per-episode beds" not in text:
        sys.exit("LICENSES.md is missing the generated/ section — restore it before ingesting")
    LICENSES.write_text(text.rstrip("\n") + "\n" + row)
    print(f"wrote {out.relative_to(REPO)} ({dur:.1f}s, {lufs} LUFS); provenance row appended to "
          f"{LICENSES.relative_to(REPO)}")
    print(f"master with: render_and_master.py <Comp> out/x.mp4 --music {out.relative_to(REPO)} "
          f"--windows {a.slug}")


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = ap.add_subparsers(dest="cmd", required=True)
    w = sub.add_parser("windows"); w.add_argument("slug"); w.set_defaults(f=cmd_windows)
    p = sub.add_parser("plan"); p.add_argument("slug"); p.add_argument("tone", choices=TONES)
    p.add_argument("--duration", type=int); p.add_argument("--prompt")
    p.add_argument("--model", default=DEFAULT_MODEL); p.set_defaults(f=cmd_plan)
    i = sub.add_parser("ingest"); i.add_argument("slug"); i.add_argument("tone", choices=TONES)
    i.add_argument("source", help="rawUrl from job_display, or a local file")
    i.add_argument("--model", default=DEFAULT_MODEL); i.add_argument("--prompt", required=True)
    i.add_argument("--duration", type=int); i.set_defaults(f=cmd_ingest)
    a = ap.parse_args(); a.f(a)


if __name__ == "__main__":
    main()
