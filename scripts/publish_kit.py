#!/usr/bin/env python3
"""Publish-kit validator (v0) — is this episode's upload package complete?
Runs as ship_doc.py step 9/9 and stand-alone before any upload.

    python3 scripts/publish_kit.py <slug>

Checks existence + parse of every deliverable the packaging standard
(CLAUDE.md "Packaging standard", publish-video section 2) demands:
  - docs/metadata/METADATA-<slug>.md with
      * locked title, 30-50 chars, + at least 2 A/B alternates
      * a CHAPTERS block (>=3 timestamps, first at 0:00, ascending;
        <10s gaps WARN — YouTube disables chapters on them)
      * a "MORE FROM" block carrying real URLs, and no "[paste URL]" anywhere
      * 3-5 hashtags on every hashtag line
      * a PINNED COMMENT section with content
      * an "AI use: YES|NO" line (BLACKBOX-2027-REVAMP §3.4 — the upload
        disclosure is read from it, never hard-coded)
  - root "<Title>.mp4" + "<Title>.srt", Title = the METADATA locked title
    made filename-safe (":" -> " -", "/" -> "-"; the mp4-filename-is-title
    rule). A "ships as `X.mp4`" line in METADATA overrides the derivation.
  - assets/thumbs/<slug>_A/B/C.png, PNG, >=1280x720. out/thumbs/ is accepted
    with a WARN this week only (out/ is bulk-cleared — move them).
  - docs/publishing/SHORTS-SCHEDULE-<slug>.md
  - docs/planning/<SLUG>-HANDOFF.md

Exit 0 when complete; exit 1 listing every missing/broken item.
"""
from __future__ import annotations
import json, re, shutil, struct, subprocess, sys
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
DOCS = REPO / "src" / "mindwired-doc" / "docs"

TS = re.compile(r"^\s*(?:[-*•]\s*)?((?:\d{1,2}:)?\d{1,2}:\d{2})\s+\S")
HASHLINE = re.compile(r"^\s*(?:#[^\s#]+\s*)+$")


def heading(line: str) -> str:
    """'## TITLE (primary)' -> 'title (primary)'; '' if not a heading."""
    m = re.match(r"^#{1,6}\s+(.*)$", line)
    return m.group(1).strip().lower() if m else ""


def clean(line: str) -> str:
    """Strip markdown dressing: bullets, bold, backticks, trailing (score)."""
    s = re.sub(r"^\s*(?:[-*•]|\d+[.)])\s+", "", line.strip())
    s = s.strip("*` ").strip()
    return re.sub(r"\s*\(\d+(?:\.\d+)?\)\s*$", "", s).strip("*` ").strip()


def ship_name(title: str) -> str:
    s = title.replace(":", " -").replace("/", "-")
    s = re.sub(r'[\\?*"<>|]', "", s)
    return re.sub(r"\s+", " ", s).strip()


def secs(ts: str) -> int:
    p = [int(x) for x in ts.split(":")]
    return p[0] * 3600 + p[1] * 60 + p[2] if len(p) == 3 else p[0] * 60 + p[1]


def parse_title(lines: list[str]) -> tuple[str | None, list[str]]:
    title, alts = None, []
    for i, ln in enumerate(lines):
        h = heading(ln)
        if title is None and h.startswith("title"):
            for nxt in lines[i + 1:]:
                c = clean(nxt)
                if heading(nxt) or "alternate" in c.lower():
                    break
                if c and not c.startswith("```"):
                    title = c
                    break
        if "alternate" in ln.lower() and (h or ln.strip().endswith(":")):
            for nxt in lines[i + 1:]:
                if heading(nxt) and alts:
                    break
                if re.match(r"^\s*\d+[.)]\s+\S", nxt):
                    alts.append(clean(nxt))
                elif alts and nxt.strip() and not nxt.strip().startswith("```"):
                    break
            if alts:
                break
    return title, alts


def png_size(p: Path) -> tuple[int, int] | None:
    b = p.read_bytes()[:24]
    if b[:8] != b"\x89PNG\r\n\x1a\n":
        return None
    return struct.unpack(">II", b[16:24])


def main() -> None:
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    slug = sys.argv[1]
    fails: list[str] = []
    warns: list[str] = []
    oks: list[str] = []

    meta = REPO / "docs" / "metadata" / f"METADATA-{slug}.md"
    title = name = None
    if not meta.exists():
        fails.append(f"{meta.relative_to(REPO)} missing")
        doc = DOCS / f"{slug}.json"
        if doc.exists():  # still check the mp4/srt pair off the doc's own title
            title = json.loads(doc.read_text()).get("title")
            if title:
                warns.append(f"no METADATA — checking root files against doc JSON title {title!r}")
    else:
        text = meta.read_text()
        lines = text.splitlines()
        title, alts = parse_title(lines)
        if not title:
            fails.append("METADATA: no locked title under a 'Title' heading")
        elif not 30 <= len(title) <= 50:
            fails.append(f"METADATA: title is {len(title)} chars (want 30-50): {title!r}")
        else:
            oks.append(f"title ({len(title)} chars): {title}")
        if len(alts) < 2:
            fails.append(f"METADATA: {len(alts)} A/B alternate title(s) (want 2)")
        else:
            oks.append(f"{len(alts)} alternates")

        # CHAPTERS
        stamps: list[str] = []
        for i, ln in enumerate(lines):
            if re.match(r"^\W*chapters\b", ln, re.I):
                for nxt in lines[i + 1:]:
                    if nxt.strip().startswith("```") or (not nxt.strip() and not stamps):
                        continue
                    m = TS.match(nxt)
                    if not m:
                        break
                    stamps.append(m.group(1))
                if stamps:
                    break
        if len(stamps) < 3:
            fails.append(f"METADATA: CHAPTERS block has {len(stamps)} timestamps (want >=3)")
        else:
            s = [secs(t) for t in stamps]
            if s[0] != 0:
                fails.append(f"METADATA: first chapter is {stamps[0]}, YouTube needs 0:00")
            elif any(b <= a for a, b in zip(s, s[1:])):
                fails.append("METADATA: chapter timestamps not ascending")
            else:
                oks.append(f"CHAPTERS ({len(stamps)})")
                short = [f"{stamps[k]}->{stamps[k + 1]}" for k in range(len(s) - 1)
                         if s[k + 1] - s[k] < 10]
                if short:
                    warns.append(f"chapters under 10s apart (YouTube drops ALL chapters): {', '.join(short)}")

        # MORE FROM
        if re.search(r"\[paste url\]", text, re.I):
            fails.append("METADATA: contains a '[paste URL]' placeholder")
        mf = [i for i, ln in enumerate(lines) if "MORE FROM" in ln.upper()]
        if not mf:
            fails.append("METADATA: no '▶ MORE FROM' block")
        elif not any(re.search(r"https?://", ln) for ln in lines[mf[0] + 1:mf[0] + 12]):
            fails.append("METADATA: MORE FROM block has no URLs")
        else:
            oks.append("MORE FROM block")

        # hashtags
        hl = [ln for ln in lines if HASHLINE.match(ln)]
        counts = [len(set(re.findall(r"#[^\s#]+", ln))) for ln in hl]
        if not hl:
            fails.append("METADATA: no hashtag line")
        elif any(not 3 <= c <= 5 for c in counts):
            fails.append(f"METADATA: hashtag line(s) with {counts} tags (want 3-5 each)")
        else:
            oks.append(f"hashtags ({max(counts)})")

        # pinned comment
        pin = [i for i, ln in enumerate(lines) if heading(ln).startswith("pinned")
               or re.match(r"^\W*pinned comment\W*$", ln, re.I)]
        body = []
        if pin:
            for nxt in lines[pin[0] + 1:]:
                if heading(nxt):
                    break
                if nxt.strip() and not nxt.strip().startswith("```"):
                    body.append(nxt)
        if not body:
            fails.append("METADATA: no PINNED COMMENT section with content")
        else:
            oks.append("pinned comment")

        # AI disclosure
        m = re.search(r"AI use:?\**\s*\**\s*(YES|NO)\b", text, re.I)
        if not m:
            fails.append("METADATA: no 'AI use: YES|NO + rationale' line")
        else:
            oks.append(f"AI use: {m.group(1).upper()}")

        ov = re.search(r"ships as `([^`]+)\.mp4`", text)
        if ov:
            name = ov.group(1)
    if name is None and title:
        name = ship_name(title)
    if name:
        mp4, srt = REPO / f"{name}.mp4", REPO / f"{name}.srt"
        if not mp4.exists() or mp4.stat().st_size == 0:
            fails.append(f"root mp4 missing: {mp4.name}")
        elif shutil.which("ffprobe"):
            r = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration",
                                "-of", "csv=p=0", str(mp4)], capture_output=True, text=True)
            try:
                oks.append(f"mp4 {float(r.stdout.strip()) / 60:.1f} min: {mp4.name}")
            except ValueError:
                fails.append(f"root mp4 unreadable by ffprobe: {mp4.name}")
        else:
            oks.append(f"mp4: {mp4.name}")
        if not srt.exists():
            fails.append(f"root srt missing: {srt.name}")
        else:
            cues = srt.read_text(errors="replace").count("-->")
            if cues:
                oks.append(f"srt ({cues} cues): {srt.name}")
            else:
                fails.append(f"root srt has no cues: {srt.name}")
    elif meta.exists():
        fails.append("root mp4/srt: cannot derive filename without a locked title")

    # thumbnails
    for v in "ABC":
        a = REPO / "assets" / "thumbs" / f"{slug}_{v}.png"
        o = REPO / "out" / "thumbs" / f"{slug}_{v}.png"
        p = a if a.exists() else o if o.exists() else None
        if p is None:
            fails.append(f"thumbnail missing: assets/thumbs/{slug}_{v}.png")
            continue
        sz = png_size(p)
        if sz is None:
            fails.append(f"thumbnail not a PNG: {p.relative_to(REPO)}")
        elif sz[0] < 1280 or sz[1] < 720:
            fails.append(f"thumbnail {sz[0]}x{sz[1]} under 1280x720 (Test & Compare rejects): {p.relative_to(REPO)}")
        elif p == o:
            warns.append(f"thumbnail in out/thumbs/ (bulk-cleared) — mv to assets/thumbs/: {p.name}")
        else:
            oks.append(f"thumb {v} {sz[0]}x{sz[1]}")

    for p in (REPO / "docs" / "publishing" / f"SHORTS-SCHEDULE-{slug}.md",
              REPO / "docs" / "planning" / f"{slug.upper()}-HANDOFF.md"):
        (oks.append(str(p.relative_to(REPO))) if p.exists()
         else fails.append(f"{p.relative_to(REPO)} missing"))

    print(f"publish_kit {slug}")
    for s in oks:
        print(f"  ok    {s}")
    for s in warns:
        print(f"  WARN  {s}")
    for s in fails:
        print(f"  MISSING {s}")
    if fails:
        print(f"PACKAGE INCOMPLETE: {len(fails)} item(s)")
        sys.exit(1)
    print("PACKAGE COMPLETE")


if __name__ == "__main__":
    main()
