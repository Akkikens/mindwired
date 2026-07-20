#!/usr/bin/env python3
"""
codewired #1 — "Claude Code Subagents, Finally Explained (animated)"

Cartesia-only VO builder (channel clone voice 00d3c951…, sonic-3.5). Idempotent
per clip: an existing non-estimated clip is never re-spent. Cartesia returns no
word timestamps, so word timing is distributed linearly across the MEASURED clip
duration (same approach as rogueplanet/fill_cartesia.py).

Every clip is ffprobe-validated: a duration under 1s = failed/empty TTS (the
leading-ellipsis gotcha) and aborts loudly instead of writing a broken manifest.

Run:  .venv-lipsync/bin/python scripts/codewired/build_audio.py
Out:  public/codewired/subagents/audio/<clip>.mp3 + manifest.json
"""
import json
import subprocess
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(REPO / "scripts" / "lib"))
import cartesia  # noqa: E402

SLUG = "codewired/subagents"
OUT = REPO / "public" / SLUG / "audio"
LEAD, TAIL = 0.35, 0.45

# tone vocabulary maps to cartesia.EMOTION_FOR_TONE
NARRATION = [
    {"id": "hook", "tone": "shock", "text": (
        "Right now, the AI agent in your terminal can clone itself, hand every "
        "clone a different job, and merge their work while you get coffee. Most "
        "developers using it every single day have no idea this exists. And the "
        "ones who do keep making one mistake that makes it worse than useless. "
        "That mistake is the last thing I'll show you."
    )},
    {"id": "problem", "tone": "curiosity", "text": (
        "First, the problem. A single agent has one context window. Think of it "
        "as a ring of memory around its brain. Every file it reads, every command "
        "it runs, every error it hits, fills that ring. And when the ring fills "
        "up, the agent starts forgetting. Your instructions from ten minutes ago "
        "don't just fade. They fall out."
    )},
    {"id": "delegate", "tone": "curiosity", "text": (
        "So instead of one agent grinding until its memory chokes, Claude Code "
        "does something stranger. It delegates. It spawns a subagent. A second, "
        "fresh copy of itself, with its own empty context window, and hands it "
        "exactly one job."
    )},
    {"id": "work", "tone": "confidence", "text": (
        "The clone goes away and does the dirty work. It reads twenty files. It "
        "runs the tests. It hits the dead ends. And then it returns one thing. "
        "The conclusion. Not the twenty files. Not the noise. One clean report."
    )},
    {"id": "memory", "tone": "awe", "text": (
        "Which means the parent's memory stays clean. And that's the real trick. "
        "Subagents aren't about speed first. They're about memory. Every messy "
        "job happens in someone else's head."
    )},
    {"id": "anatomy", "tone": "curiosity", "text": (
        "And here's the part nobody tells you. A subagent is just a markdown "
        "file. A name. A description. And a list of tools it's allowed to touch. "
        "Tools are the agent's hands. Reading files. Editing code. Running "
        "commands. Take the editing hand away, and you've built a reviewer that "
        "can look at everything, but never break anything."
    )},
    {"id": "team", "tone": "excitement", "text": (
        "Now scale it. A researcher. A coder. A reviewer. A tester. Each one a "
        "separate clone, with its own memory, its own permissions, its own job. "
        "Kick off a refactor across your codebase, one clone per module, and "
        "they all run at the same time. What used to take an afternoon takes "
        "minutes."
    )},
    {"id": "cost", "tone": "confidence", "text": (
        "One honest warning. Every clone burns its own tokens doing its own "
        "work, so a swarm is not free. Fan out when the parallel work pays for "
        "itself. Not for a one line fix."
    )},
    {"id": "mistake", "tone": "fear", "text": (
        "Now. The mistake. The clones are blind to each other. Send two of them "
        "into the same file, and they will happily overwrite each other's work. "
        "And they're blind to you, too. A clone never sees your conversation. It "
        "knows exactly one thing. The prompt it was handed. Hand it a vague "
        "prompt, and it returns confident garbage. And the parent merges that "
        "garbage straight into your code."
    )},
    {"id": "rule", "tone": "confidence", "text": (
        "So here's the rule. Fan out on isolated work, with self contained "
        "instructions. Keep anything shared in one pair of hands. That is the "
        "entire difference between developers who ship a week of work in a day, "
        "and the ones who let a swarm of clones wreck their codebase."
    )},
    {"id": "outro", "tone": "awe", "text": (
        "Delegation. Fresh memory. Tools as hands. Permissions as trust. You now "
        "understand AI agents better than most people building with them. But "
        "clones sharing one brain is only half the story. Because next, your "
        "agent needs to talk to the outside world. That's a protocol called "
        "MCP, and it's stranger than it sounds. Subscribe to codewired, and get "
        "wired in."
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
            print(f"  {cid:<10} exists ({entry['dur']:.1f}s) — skip")
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
        print(f"  {cid:<10} {d:6.1f}s  ({len(words)} words)")
    print("done — manifest at", man_path)


if __name__ == "__main__":
    main()
