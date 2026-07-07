#!/usr/bin/env python3
"""Hook lab — generate the narration for every hook variant of a plan so they
can be A/B scored before publishing. The hook (first 3-15s) decides whether the
click stays, which decides whether the platform keeps promoting the video, so
it is the single highest-leverage thing to test.

This does the expensive, automatable half: it synthesizes each candidate hook
line in the host's voice (Hume-first, same engine chain as build_short.py) with
real forced-aligned word timings, writing:
  public/shorts/<slug>/hooklab/<variantId>.mp3  (+ .words.json)
  public/shorts/<slug>/hooklab/hooks.json       (durations + text + rationale)

Then score each variant with the Higgsfield virality predictor (Hook Score +
Hold Rate) and promote the winner into the plan's first scene — see HOOK-LAB.md
for the loop (the scoring step is an MCP call the agent makes, not a paid call
this script fires on its own).

Plan authoring: add a "hookVariants" array to src/viral/plans/<slug>.json:
  "hookVariants": [
    {"id": "aging", "voiceover": "...", "mainText": "...", "emphasis": ["..."],
     "rationale": "personal-body angle"},
    {"id": "noclock", "voiceover": "...", "mainText": "...", "rationale": "cosmic angle"}
  ]

Usage: python3 scripts/hook_lab.py <slug> [--voice hume|eleven|...] [--no-align]
Idempotent per variant: an existing mp3 + hooks.json entry is kept.
"""
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent / "lib"))

REPO = Path(__file__).resolve().parent.parent

# reuse build_short's voice plumbing so the hook lab uses the exact same engine
import build_short as B  # noqa: E402


def main():
    if len(sys.argv) < 2:
        sys.exit("usage: hook_lab.py <slug> [--voice ...] [--no-align]")
    slug = sys.argv[1]
    pref = sys.argv[sys.argv.index("--voice") + 1] if "--voice" in sys.argv else "hume"
    chain = B.ENGINE_CHAINS.get(pref) or sys.exit(f"unknown --voice '{pref}'")
    do_align = pref != "hume-cartesia" and "--no-align" not in sys.argv
    if "--align" in sys.argv:
        do_align = True

    plan_path = REPO / "src" / "viral" / "plans" / f"{slug}.json"
    plan = json.loads(plan_path.read_text())
    variants = plan.get("hookVariants")
    if not variants:
        sys.exit(f"{slug}.json has no 'hookVariants' — add 2-3 to A/B. See HOOK-LAB.md.")

    outdir = REPO / "public" / "shorts" / slug / "hooklab"
    outdir.mkdir(parents=True, exist_ok=True)
    hooks_path = outdir / "hooks.json"
    hooks = json.loads(hooks_path.read_text()) if hooks_path.exists() else {"variants": {}}

    base_voice, eleven_voice = B.host_voice(plan)
    cartesia_voice = None
    host = plan.get("host")
    if host and "/" not in host:
        reg = json.loads((REPO / "src/viral/hosts.json").read_text()).get(host, {})
        cartesia_voice = reg.get("cartesiaVoice")

    # hooks are almost always the "shock" beat; direct Hume accordingly
    tone = "shock"
    print(f"[hook_lab] {slug}: {len(variants)} variant(s), voice chain {chain}")
    for v in variants:
        vid, text = v["id"], v["voiceover"]
        mp3 = outdir / f"{vid}.mp3"
        prev = hooks["variants"].get(vid, {})
        if mp3.exists() and prev.get("text") == text:
            print(f"  [skip] {vid}")
            continue

        audio, words, engine = None, None, None
        direction = f"{base_voice} {B.TONE_DIRECTION.get(tone, '')}"
        for step in chain:
            if audio is not None:
                break
            try:
                if step == "hume":
                    import hume
                    audio, _ = hume.tts(text, description=direction)
                elif step == "cartesia":
                    import cartesia
                    audio = cartesia.tts(text, voice=cartesia_voice, tone=tone)
                elif step == "eleven":
                    import eleven
                    audio, words = eleven.tts_aligned(text, voice=eleven_voice)
                engine = step
            except BaseException as e:
                print(f"  [{step} failed: {type(e).__name__}: {e}]")

        if audio is None:
            print(f"  [!] {vid}: no engine produced audio — skipped")
            continue
        if not words and do_align:
            try:
                import eleven
                words = eleven.forced_align(audio, text) or None
            except BaseException:
                words = None

        mp3.write_bytes(audio)
        dur = B.ffprobe_dur(mp3)
        (outdir / f"{vid}.words.json").write_text(json.dumps(words or B.estimate_words(text, dur)))
        hooks["variants"][vid] = {
            "dur": round(dur, 3), "text": text, "mainText": v.get("mainText", ""),
            "rationale": v.get("rationale", ""), "voice": engine,
            "timings": "real" if words else "estimated",
        }
        hooks_path.write_text(json.dumps(hooks, indent=2))
        print(f"  [{engine}] {vid}: {dur:.2f}s ({hooks['variants'][vid]['timings']} timings)")

    hooks_path.write_text(json.dumps(hooks, indent=2))
    print(f"[hook_lab] wrote {hooks_path}")
    print("Next: render each variant's hook scene, score with the virality "
          "predictor (Hook Score + Hold Rate), promote the winner. See HOOK-LAB.md.")


if __name__ == "__main__":
    main()
