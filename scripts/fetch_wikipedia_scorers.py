#!/usr/bin/env python3
"""Free, no-key top-scorers data for the 2026 World Cup, sourced from
Wikipedia's own live-maintained Lua data module (Module:Goalscorers/data/2026
FIFA World Cup) — the same structured table that feeds the article's
"Goalscorers" section and infobox. Editors update it after every match, so
it's a real per-player, per-goal ledger, not an LLM guess or a scrape of
rendered prose.

No assists equivalent exists on Wikipedia for this tournament — there is no
"Module:Assists" data page, so an assists video isn't buildable from this
free source. Don't fabricate assist numbers to fill that gap.

Usage: python3 -c "from fetch_wikipedia_scorers import top_scorers; print(top_scorers())"
"""
import re
import sys

import httpx

MODULE_PAGE = "Module:Goalscorers/data/2026 FIFA World Cup"
API_URL = "https://en.wikipedia.org/w/api.php"
HEADERS = {"User-Agent": "kickoffdaily90-bot/1.0 (contact: akshay@climbtogether.co)"}

# {"[[Link Target|Display Name]]", "TEAM", goals },  — display name optional
ENTRY_RE = re.compile(
    r'\{\s*"\[\[([^\]|]+)(?:\|([^\]]+))?\]\]"\s*,\s*"([A-Z]{2,3})"\s*,\s*(\d+)\s*\}'
)


def _clean(name: str) -> str:
    return name.replace("&nbsp;", " ").strip()


def top_scorers(limit: int = 15) -> list[dict]:
    resp = httpx.get(API_URL, params={
        "action": "parse", "page": MODULE_PAGE, "format": "json", "prop": "wikitext",
    }, headers=HEADERS, timeout=20)
    resp.raise_for_status()
    data = resp.json()
    if "error" in data:
        sys.exit(f"wikipedia fetch failed: {data['error']}")
    wikitext = data["parse"]["wikitext"]["*"]

    scorers = []
    for link_target, display, team, goals in ENTRY_RE.findall(wikitext):
        name = _clean(display) if display else _clean(link_target)
        scorers.append({"player": name, "team": team, "goals": int(goals)})

    scorers.sort(key=lambda s: -s["goals"])
    return scorers[:limit]


if __name__ == "__main__":
    for s in top_scorers():
        print(f"{s['goals']:2d}  {s['player']} ({s['team']})")
