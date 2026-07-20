#!/usr/bin/env python3
"""
codewired #4 FLAGSHIP — "I Built My Own Claude Code From Scratch (It Made This Video)"
Cartesia VO builder, same contract as build_audio.py.

Run:  .venv-lipsync/bin/python scripts/codewired/build_audio_flagship.py
Out:  public/codewired/flagship/audio/<clip>.mp3 + manifest.json
"""
import json
import subprocess
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(REPO / "scripts" / "lib"))
import cartesia  # noqa: E402

SLUG = "codewired/flagship"
OUT = REPO / "public" / SLUG / "audio"
LEAD, TAIL = 0.35, 0.45

NARRATION = [
    {"id": "hook", "tone": "shock", "text": (
        "The machine at the heart of Claude Code, the agent that's quietly "
        "eating the software industry, is about one hundred lines of code. "
        "Not the model. The model is a giant. I mean the machine wrapped "
        "around it. The loop. And today, we build that machine from an empty "
        "file, into a real agent that hunts down a bug and fixes it, live, "
        "while we watch. Stay to the end, because I'll tell you a secret "
        "about this exact video that proves the machine works."
    )},
    {"id": "map", "tone": "confidence", "text": (
        "Here's the build plan. On the table, a skeleton. An agent with no "
        "parts. On the wall, everything it needs. A heartbeat, called the "
        "loop. Hands, called tools. A gate, called permissions. A memory, "
        "called context. We install them one by one. Then we bolt on the "
        "upgrades from this series, and switch it on."
    )},
    {"id": "loop1", "tone": "awe", "text": (
        "Start with the heartbeat. You send the model two things. Your "
        "request, and a list of tools it's allowed to ask for. The model "
        "replies with one of two things. An answer, or a request. Please run "
        "this tool, with these inputs. Your code runs the tool, appends the "
        "result to the conversation, and sends the whole thing back. Answer, "
        "or request. Again. And again. Until the model stops asking. That "
        "loop is the entire secret. Every AI agent on earth, including the "
        "ones that feel like magic, is this loop wearing different clothes."
    )},
    {"id": "loop2", "tone": "confidence", "text": (
        "And in real code, the heartbeat is embarrassingly small. One while "
        "loop. Call the model. If it asked for a tool, run it, append the "
        "result, and go around again. If it didn't, you're done. Anthropic's "
        "own tutorial builds this complete working loop in about eighty "
        "lines. You could read the whole thing over coffee."
    )},
    {"id": "tools", "tone": "curiosity", "text": (
        "Now the hands. A tool is three pieces of text. A name. A "
        "description, which is how the model decides when to reach for it. "
        "And a schema, describing exactly what inputs it takes. Notice what's "
        "missing. The model never executes anything. Ever. It writes a "
        "request, your harness does the deed, and hands back the result. The "
        "AI is the brain in the jar. You built its hands, so you decide what "
        "they can hold. Give it read file, list files, edit file, and run "
        "command, and congratulations. That's a coding agent."
    )},
    {"id": "permissions", "tone": "confidence", "text": (
        "But before you switch it on, the gate. Every tool request passes "
        "through a checkpoint you control. Reading a file? Fine, allowed "
        "automatically. Editing? Maybe auto approve inside the project "
        "folder. Deleting files, touching the network, installing software? "
        "Ask the human first. The model requests. The harness decides. "
        "That one sentence is the entire security model of every serious "
        "agent, and now it's yours."
    )},
    {"id": "context", "tone": "curiosity", "text": (
        "One more organ. Memory. Every tool result gets appended to the "
        "conversation, which means the context window, that ring from "
        "episode one, is filling the whole time the agent works. A real "
        "harness watches the ring, and when it gets close to full, it "
        "compacts. Summarizes the old, keeps the essentials, and keeps "
        "working. Install that, and your agent can grind for hours instead "
        "of minutes."
    )},
    {"id": "checkpoint", "tone": "awe", "text": (
        "Look at the table. A loop. Tools. A gate. A memory. Under two "
        "hundred lines, most of it plain text, and you have a genuine coding "
        "agent. This is the moment most tutorials end. But you didn't come "
        "here for a toy. So here's the professional's cheat code."
    )},
    {"id": "sdk", "tone": "excitement", "text": (
        "It's called the Claude Agent SDK, and it is literally Claude Code "
        "as a library. The same loop, the same tools, the same permission "
        "gate and context management that power the real product, "
        "programmable from Python or TypeScript. Everything we just built by "
        "hand, production grade, battle tested, in one import. You bring the "
        "part that matters. Who your agent is, and what it's allowed to do."
    )},
    {"id": "build", "tone": "confidence", "text": (
        "So let's build ours, for real. Meet wired. Our agent. Here is every "
        "line we wrote. A system prompt, ten lines. You are wired, a small, "
        "careful coding agent. Read before you edit. Verify after you "
        "change. Four allowed tools, and not one more. Read, edit, run, "
        "search. Auto approve edits, gate everything else. And its entire "
        "world is one demo folder, running on Claude Sonnet five. About "
        "fifty lines of our code, on top of the machine you now understand "
        "completely."
    )},
    {"id": "run1", "tone": "curiosity", "text": (
        "Time to switch it on. The task: run temps dot p y, find the bug, "
        "fix it, and verify. Watch the loop breathe. First heartbeat, it "
        "searches for the file. Second, it reads it. Third, it runs it, and "
        "sees the output is wrong. Thirty seven Celsius should be ninety "
        "eight point six Fahrenheit, and it's not. Then it spots the crime. "
        "The conversion formula is upside down. Five ninths, where it should "
        "be nine fifths."
    )},
    {"id": "run2", "tone": "excitement", "text": (
        "So it asks for the edit tool. The gate approves. One line changes. "
        "It runs the file again, and there it is. Thirty two. Two twelve. "
        "Ninety eight point six. Then it reports back in one sentence, "
        "exactly as its system prompt demands. And I want to be completely "
        "clear. Nothing here was staged. That was the actual transcript of "
        "our fifty line agent, doing real work."
    )},
    {"id": "upgrades", "tone": "awe", "text": (
        "Now bolt on everything this series gave you. Let it spawn subagents, "
        "and it has more brains. Plug in M C P servers, and it has hands on "
        "GitHub, your database, the web. Drop skill folders on its shelf, and "
        "it carries your team's crafts. Look at the table one more time. "
        "You're not looking at a demo anymore. You're looking at Claude Code, "
        "and for the first time, you can see every moving part."
    )},
    {"id": "reveal", "tone": "shock", "text": (
        "Which brings me to the secret I promised. Every video on this "
        "channel, the research, the script, the animations, the voice you "
        "are hearing right now, was produced end to end by an AI agent. A "
        "real one. With a loop, tools, permissions, subagents, skills. The "
        "same machine you just learned to build. Read that again. The "
        "machine made the video, about the machine. That's not a gimmick. "
        "That's the proof. This stuff works, today, and now you know how it "
        "works, all the way down."
    )},
    {"id": "outro", "tone": "awe", "text": (
        "A loop. Hands. A gate. A memory. And about fifty lines that make it "
        "yours. You didn't just watch this one. You crossed over. From "
        "someone who uses AI tools, to someone who can build them. Next "
        "time, the dark art nobody teaches. Context engineering. Why agents "
        "get dumber the longer they work, and how the pros keep them sharp. "
        "Subscribe to codewired, and get wired in."
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
