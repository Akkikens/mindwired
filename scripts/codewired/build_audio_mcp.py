#!/usr/bin/env python3
"""
codewired #2 — "MCP Explained: The Port That Plugs AI Into Everything"
Cartesia VO builder (channel clone voice). Same contract as build_audio.py.

Run:  .venv-lipsync/bin/python scripts/codewired/build_audio_mcp.py
Out:  public/codewired/mcp/audio/<clip>.mp3 + manifest.json
"""
import json
import subprocess
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(REPO / "scripts" / "lib"))
import cartesia  # noqa: E402

SLUG = "codewired/mcp"
OUT = REPO / "public" / SLUG / "audio"
LEAD, TAIL = 0.35, 0.45

NARRATION = [
    {"id": "hook", "tone": "shock", "text": (
        "Your AI agent is a genius locked in an empty room. It can't read your "
        "email. It can't touch your database. It can't even check the weather. "
        "Everything impressive you've ever watched it do came through one small "
        "hole in the wall. In late twenty twenty-four, that hole got a universal standard."
        "It's called MCP. And by the end of this video, you'll know how to plug "
        "your AI into almost anything."
    )},
    {"id": "chaos", "tone": "curiosity", "text": (
        "First, the mess it replaced. Say you have four AI apps, and five tools "
        "you want them to use. Email. Slack. GitHub. A database. A browser. "
        "Before MCP, every connection was custom code. Four apps times five "
        "tools. Twenty integrations, written by hand, each one breaking in its "
        "own special way. Every new tool meant rebuilding the same bridge, "
        "again and again."
    )},
    {"id": "port", "tone": "confidence", "text": (
        "MCP kills that multiplication. It's one standard port. The tool builds "
        "one MCP server. The AI app builds one MCP client. And now anything can "
        "talk to anything. Four plus five instead of four times five. People "
        "call it the USB port for AI, and for once, the nickname is accurate."
    )},
    {"id": "anatomy", "tone": "curiosity", "text": (
        "Here's the actual architecture, and it's simpler than it sounds. Your "
        "AI app, like Claude Code, is called the host. For every outside system "
        "it wants to reach, the host opens a client. Each client holds one "
        "connection to one MCP server. And the server is just a small program "
        "sitting in front of a real system, translating."
    )},
    {"id": "menu", "tone": "awe", "text": (
        "And this is the beautiful part. When the agent connects, the server "
        "hands over a menu. Here are my tools. Here's what each one does. "
        "Here's what each one needs. The agent reads that menu at runtime. "
        "Which means you can hand your AI a brand new ability, and nobody "
        "rewrites the app. You just plug in another server."
    )},
    {"id": "flow", "tone": "curiosity", "text": (
        "Watch one real call, end to end. You ask your agent to check open "
        "issues. The model picks the right tool from the menu. The client "
        "wraps it in a message. The server calls the actual GitHub API. And "
        "the result flows all the way back into the model's context. To you, "
        "it just looks like your AI can suddenly see GitHub. Under the hood, "
        "it's this exact relay, every single time."
    )},
    {"id": "ecosystem", "tone": "excitement", "text": (
        "And because the port is standard, an entire ecosystem exploded around "
        "it. Thousands of servers. Databases. Browsers. Payment systems. Design "
        "tools. Even other AI companies adopted the same standard. Build one "
        "server for your product, and every AI app on earth can suddenly use "
        "it. That's why MCP won."
    )},
    {"id": "danger", "tone": "fear", "text": (
        "But one warning, and it's serious. That menu the server hands over? "
        "The model trusts it. A malicious server can hide instructions inside "
        "tool descriptions, poison your agent's behavior, or quietly walk your "
        "data out the door. So treat MCP servers like browser extensions. Only "
        "plug in what you trust. Never point your agent at a random server "
        "just because a list on the internet said it was cool."
    )},
    {"id": "outro", "tone": "awe", "text": (
        "One port. A menu of tools. Plug in anything. That's MCP, and now you "
        "understand the wiring behind every AI agent demo you've ever seen. "
        "Subagents gave your AI more brains. MCP gave it hands on the real "
        "world. Next time, we go further: we teach an agent brand new skills "
        "it wasn't born with. Subscribe to codewired, and get wired in."
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
