#!/usr/bin/env python3
"""
codewired #3 — "Claude Skills, Finally Explained: Teach Your AI Things It
Wasn't Born With". Cartesia VO builder, same contract as build_audio.py.

Run:  .venv-lipsync/bin/python scripts/codewired/build_audio_skills.py
Out:  public/codewired/skills/audio/<clip>.mp3 + manifest.json
"""
import json
import subprocess
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(REPO / "scripts" / "lib"))
import cartesia  # noqa: E402

SLUG = "codewired/skills"
OUT = REPO / "public" / SLUG / "audio"
LEAD, TAIL = 0.35, 0.45

NARRATION = [
    {"id": "hook", "tone": "shock", "text": (
        "Every morning, your AI wakes up brilliant, and blank. It has read "
        "more than any human who ever lived. But it has never met you. It "
        "doesn't know your style guide, your codebase rules, or the way your "
        "team writes reports. So Anthropic built a way to teach it. Not "
        "retraining. Not fine tuning. A folder. And by the end of this video, "
        "you'll know how to teach an AI things it was never trained on."
    )},
    {"id": "problem", "tone": "curiosity", "text": (
        "Here's the problem skills exist to solve. Every conversation starts "
        "from zero. So you paste the same instructions. Again. And again. "
        "Follow our brand colors. Use our report format. Never touch the "
        "legacy folder. You are re-teaching a genius the same lesson every "
        "single day, like it's stuck in a time loop. There had to be a better "
        "way to make knowledge stick."
    )},
    {"id": "whatis", "tone": "confidence", "text": (
        "A skill is that better way, and it's almost embarrassingly simple. "
        "It's a folder. Inside, one file called SKILL dot M D. At the top, a "
        "name, and one sentence describing when to use it. Below that, the "
        "actual expertise, written exactly like you'd train a new employee. "
        "Step one. Step two. Watch out for this. And that's it. No code "
        "required. If you can write instructions, you can teach an AI."
    )},
    {"id": "trigger", "tone": "awe", "text": (
        "But here's the part that makes skills genuinely clever. The agent "
        "doesn't read all your skills. It reads a shelf of labels. Just each "
        "skill's name, and that one line description. A few words each. Then, "
        "when your request matches one of those labels, it pulls the whole "
        "book down and reads it, right at that moment. It's called progressive "
        "disclosure. You can install a hundred skills, and they cost almost "
        "nothing, until the exact second one is needed."
    )},
    {"id": "anatomy", "tone": "curiosity", "text": (
        "And a skill can carry more than words. Drop reference files next to "
        "the instructions. Your full brand book. A template. Example outputs. "
        "Even runnable scripts. Which means a skill isn't just advice. It can "
        "hand the agent an actual tool, and the instructions for using it, in "
        "one package. Knowledge and machinery, zipped together."
    )},
    {"id": "build", "tone": "excitement", "text": (
        "Let's build one, right now. Say your team keeps shipping documents "
        "that break brand rules. Create a folder called brand guardian. In "
        "SKILL dot M D, the description reads, use this whenever creating or "
        "reviewing any customer facing document. Below it, the rules. Colors. "
        "Fonts. Tone. The words we never use. Save the file. That's the whole "
        "install. Now watch. Ask the agent to draft a landing page, and it "
        "checks the shelf, sees brand guardian, matches, loads it, and every "
        "rule you wrote is suddenly just how it works."
    )},
    {"id": "everywhere", "tone": "confidence", "text": (
        "And that same folder format works everywhere Claude runs. In Claude "
        "Code, drop it in your project, and your whole team inherits it with "
        "a git pull. In the Claude apps, upload the same folder and it works "
        "in your chats. And through the A P I, your production agents can "
        "load it too. One format, written once, installed wherever you need "
        "it."
    )},
    {"id": "bigpicture", "tone": "awe", "text": (
        "Step back, and you can see the machine we've been assembling across "
        "this series. Subagents gave your AI more brains. M C P gave it hands "
        "on the real world. And skills give it crafts. Trained, specific, "
        "expert crafts. One agent, spawning helpers, reaching real systems, "
        "carrying your team's entire playbook. That's not a chatbot anymore. "
        "That's a colleague."
    )},
    {"id": "danger", "tone": "fear", "text": (
        "One warning before you go skill shopping. A skill is instructions "
        "your agent will trust, and code it may run. Install one from a "
        "stranger, and you've handed them the keys. A poisoned skill can "
        "quietly rewrite how your agent behaves. So treat skills like you "
        "treat software. Read them before you install them. They're just "
        "text. Open the folder. It takes one minute."
    )},
    {"id": "outro", "tone": "awe", "text": (
        "A folder. A label on a shelf. Expertise that loads at the exact "
        "moment it's needed. That's skills, and your AI is no longer just "
        "smart. It's trained. Now, everything you've learned in this series "
        "has been leading somewhere. Next time, we take all of it, the loop, "
        "the tools, the permissions, and we build our own Claude Code, from "
        "scratch. The whole machine, one video. Subscribe to codewired, and "
        "get wired in."
    )},
]


def dur_of(path: Path) -> float:
    out = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of",
         "csv=p=0", str(path)], capture_output=True, text=True).stdout.strip()
    return round(float(out), 3)


def timings(words, dur):
    n = len(words)
    usable = max(0.1, dur - LEAD - TAIL)
    step = usable / max(n, 1)
    return [{"word": w, "start": round(LEAD + i * step, 3),
             "end": round(LEAD + i * step + step * 0.9, 3)} for i, w in enumerate(words)]


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    man_path = OUT / "manifest.json"
    manifest = {"clips": {}}
    if man_path.exists():
        manifest = json.loads(man_path.read_text())
    for c in NARRATION:
        cid = c["id"]
        mp3 = OUT / f"{cid}.mp3"
        entry = manifest["clips"].get(cid, {})
        if mp3.exists() and entry and not entry.get("estimated"):
            print(f"  {cid:<11} exists ({entry['dur']:.1f}s) — skip")
            continue
        audio = cartesia.tts(c["text"], tone=c.get("tone"), speed=0.92)
        mp3.write_bytes(audio)
        d = dur_of(mp3)
        if d < 1.0:
            sys.exit(f"FATAL: {cid} rendered {d}s — empty/failed TTS, aborting")
        words = timings(c["text"].split(), d)
        manifest["clips"][cid] = {"kind": "spoken", "dur": d, "words": words,
                                  "provider": "cartesia"}
        man_path.write_text(json.dumps(manifest, indent=2))
        print(f"  {cid:<11} {d:6.1f}s  ({len(words)} words)")
    print("done — manifest at", man_path)


if __name__ == "__main__":
    main()
