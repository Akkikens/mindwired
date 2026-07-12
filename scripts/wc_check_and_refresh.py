#!/usr/bin/env python3
"""Cheap, frequent change-detector for the kickoffdaily90 World Cup stats
pipeline. Fetches current fixtures/results/standings (~3 free API calls),
compares against the last-seen snapshot, and ONLY triggers the expensive
narration-rebuild + Remotion render for whichever video's underlying data
actually changed. Safe to run every 1-2 minutes — the check itself is cheap;
the render only fires on real change, not on a fixed clock.

Usage: .venv-lipsync/bin/python3 scripts/wc_check_and_refresh.py
"""
import hashlib
import json
import subprocess
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(REPO / "scripts"))
from fetch_football_stats import fixtures, get, results, standings  # noqa: E402
from fetch_wikipedia_scorers import top_scorers  # noqa: E402

STATE_PATH = REPO / ".wc_state_cache.json"

TARGETS = {
    "wc-nextup": {
        "fetch": lambda: fixtures(status="SCHEDULED", limit=20),
        "build": "scripts/build_wc_nextup.py",
        "comp": "ShortWC-wc-nextup",
        "out": "out/wc_nextup.mp4",
    },
    "wc-results": {
        "fetch": lambda: results(limit=100),
        "build": "scripts/build_wc_results.py",
        "comp": "ShortWC-wc-results",
        "out": "out/wc_results.mp4",
    },
    "wc-groupwinners": {
        "fetch": lambda: standings(),
        "build": "scripts/build_wc_groupwinners.py",
        "comp": "ShortWC-wc-groupwinners",
        "out": "out/wc_groupwinners.mp4",
    },
    "wc-tournament-status": {
        "fetch": lambda: get("/competitions/2000/matches"),
        "build": "scripts/build_wc_tournament_status.py",
        "comp": "ShortWC-wc-tournament-status",
        "out": "out/wc_tournament_status.mp4",
    },
    "wc-topscorers-teams": {
        "fetch": lambda: standings(),
        "build": "scripts/build_wc_topscorers_teams.py",
        "comp": "ShortWC-wc-topscorers-teams",
        "out": "out/wc_topscorers_teams.mp4",
    },
    "wc-topscorers": {
        "fetch": lambda: {"scorers": top_scorers()},
        "build": "scripts/build_wc_topscorers.py",
        "comp": "ShortWC-wc-topscorers",
        "out": "out/wc_topscorers.mp4",
    },
}


def fingerprint(data: dict) -> str:
    return hashlib.sha256(json.dumps(data, sort_keys=True).encode()).hexdigest()


def load_state() -> dict:
    return json.loads(STATE_PATH.read_text()) if STATE_PATH.exists() else {}


def run(cmd: list[str]) -> None:
    print(f"  $ {' '.join(cmd)}")
    subprocess.run(cmd, cwd=REPO, check=True)


def main() -> None:
    state = load_state()
    changed = []

    for slug, target in TARGETS.items():
        data = target["fetch"]()
        fp = fingerprint(data)
        if state.get(slug) == fp:
            print(f"[{slug}] unchanged, skipping")
            continue
        print(f"[{slug}] CHANGED — rebuilding")
        run([".venv-lipsync/bin/python3", target["build"]])
        run(["python3", "scripts/build_short.py", slug, "--voice", "eleven"])
        run(["npx", "remotion", "render", target["comp"], target["out"]])
        # verify twice — a prior render silently corrupted despite exit 0
        for _ in range(2):
            probe = subprocess.run(
                ["ffprobe", "-v", "error", "-show_entries", "format=duration",
                 "-of", "default=noprint_wrappers=1", target["out"]],
                cwd=REPO, capture_output=True, text=True)
            if probe.returncode != 0 or probe.stderr.strip():
                sys.exit(f"[{slug}] ffprobe reported a problem — not marking as refreshed: {probe.stderr}")
        state[slug] = fp
        changed.append(slug)

    STATE_PATH.write_text(json.dumps(state, indent=2))
    if changed:
        print(f"\nRefreshed: {', '.join(changed)}")
        run(["python3", "scripts/wc_build_live_loop.py"])
    else:
        print("\nNo changes — nothing rebuilt this cycle.")


if __name__ == "__main__":
    main()
