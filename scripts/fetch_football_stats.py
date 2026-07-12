#!/usr/bin/env python3
"""Fetch current World Cup 2026 data from football-data.org (free tier) for
the kickoffdaily90 periodic-refresh stats videos.

Free tier gives us standings, fixtures, and results — NOT player-level stats
(goal scorers, assists, cards). If a paid tier or a second provider is added
later for that data, extend this script rather than replacing it.

Respects the X-Requests-Available-Minute response header (free tier: 10/min)
per football-data.org's own guidance — backs off automatically if low rather
than hammering the rate limiter.

Usage:
  python3 scripts/fetch_football_stats.py standings
  python3 scripts/fetch_football_stats.py fixtures
  python3 scripts/fetch_football_stats.py results
"""
import json
import sys
import time
from pathlib import Path

import httpx

REPO = Path(__file__).resolve().parent.parent
BASE = "https://api.football-data.org/v4"
WORLD_CUP_ID = 2000
# Shared across every wc-* video — crests don't change per-video, no reason
# to redownload/duplicate them per slug.
CREST_DIR = REPO / "public/shorts/_wc-crests"


def crest_path(team_id: int | None, team_name: str = "") -> str | None:
    """Download a team's official crest (served by football-data.org as part
    of the same licensed data feed) and cache it locally, shared across all
    wc-* videos. Returns the path relative to public/ for compare.leftImg/
    rightImg, or None if the team has no id or the crest 404s (some teams
    have no hosted crest — callers should degrade gracefully, not error)."""
    if not team_id:
        return None
    CREST_DIR.mkdir(parents=True, exist_ok=True)
    dest = CREST_DIR / f"{team_id}.svg"
    if not dest.exists():
        url = f"https://crests.football-data.org/{team_id}.svg"
        try:
            r = httpx.get(url, timeout=15)
            r.raise_for_status()
            dest.write_bytes(r.content)
        except httpx.HTTPError as e:
            print(f"  [crest] failed for {team_name} ({team_id}): {e}")
            return None
    return f"shorts/_wc-crests/{team_id}.svg"


def load_key() -> str:
    import os
    if os.environ.get("FOOTBALL_DATA_ORG_KEY"):
        return os.environ["FOOTBALL_DATA_ORG_KEY"]
    env = REPO / ".env"
    if env.exists():
        for line in env.read_text().splitlines():
            if line.strip().startswith("FOOTBALL_DATA_ORG_KEY="):
                return line.split("=", 1)[1].strip().strip('"')
    sys.exit("FOOTBALL_DATA_ORG_KEY not set — add it to mindwired/.env")


def get(path: str, params: dict | None = None) -> dict:
    """GET with rate-limit backoff: if the API reports fewer than 2 requests
    left this minute, sleep until the minute rolls over before calling."""
    key = load_key()
    headers = {"X-Auth-Token": key}
    resp = httpx.get(f"{BASE}{path}", headers=headers, params=params or {}, timeout=30)
    remaining = resp.headers.get("X-Requests-Available-Minute")
    if remaining is not None and int(remaining) < 2:
        print(f"  [rate-limit] only {remaining} requests left this minute — waiting 60s")
        time.sleep(60)
    resp.raise_for_status()
    return resp.json()


def standings() -> dict:
    """Group tables / bracket standings for the World Cup."""
    data = get(f"/competitions/{WORLD_CUP_ID}/standings")
    out = []
    for group in data.get("standings", []):
        table = [{
            "position": t["position"],
            "team": t["team"]["name"],
            "played": t["playedGames"],
            "won": t["won"], "draw": t["draw"], "lost": t["lost"],
            "points": t["points"],
            "goalsFor": t["goalsFor"], "goalsAgainst": t["goalsAgainst"],
        } for t in group.get("table", [])]
        out.append({"group": group.get("group"), "type": group.get("type"), "table": table})
    return {"kind": "standings", "groups": out}


def fixtures(status: str = "SCHEDULED", limit: int = 10) -> dict:
    """Upcoming (or filter by status) World Cup matches. Later-round matches
    with teams not yet decided have homeTeam/awayTeam as null — passed
    through as None so callers can filter them out."""
    data = get(f"/competitions/{WORLD_CUP_ID}/matches", params={"status": status})
    matches = []
    for m in data.get("matches", [])[:limit]:
        home, away = m.get("homeTeam"), m.get("awayTeam")
        matches.append({
            "home": home["name"] if home else None,
            "away": away["name"] if away else None,
            "homeId": home["id"] if home else None,
            "awayId": away["id"] if away else None,
            "utcDate": m["utcDate"], "stage": m.get("stage"),
            "venue": m.get("venue"),
            "score": m.get("score", {}).get("fullTime"),
        })
    return {"kind": "fixtures", "status": status, "matches": matches}


def results(limit: int = 10) -> dict:
    return fixtures(status="FINISHED", limit=limit)


if __name__ == "__main__":
    if len(sys.argv) < 2 or sys.argv[1] not in ("standings", "fixtures", "results"):
        sys.exit("usage: fetch_football_stats.py <standings|fixtures|results>")
    fn = {"standings": standings, "fixtures": fixtures, "results": results}[sys.argv[1]]
    print(json.dumps(fn(), indent=2))
