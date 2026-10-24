#!/usr/bin/env python3
"""Preflight validator for doc-engine episodes — run BEFORE the ONE render.
Exits non-zero on any BLOCK so a bad render can never start.

    python3 scripts/preflight_doc.py <slug>

BLOCKS (each has burned a render or shipped a defect before):
  - manifest missing, or stale vs public/shorts/<slug>/images (files added/
    removed after build_doc_vo.py — rerun it / --manifest-only)
  - scene img prefix not in manifest.images (renders a silent black frame)
  - dossier:true scene with no img prefix (renders chrome-only, no cutout)
  - scene video file missing from public/shorts/<slug>/video (render-time 404)
  - diagram name not in DIAGRAMS (renders a blank scene)
  - VO mp3 missing/empty/zero-duration (Cartesia leading-"..." bug)
  - scene id missing from manifest durations (estimate fallback -> SRT drift)
  - radio scene (speaker) without an honesty radioLabel
  - sfx cue name with no matching file in public/sfx/
  - lint_tts_text.py hits on spoken text
LESSON GATES (added 2026-08-26 — every one of these is a defect that actually
shipped or crashed a render before, each caught MANUALLY at the time; see the
memory files cited inline):
  - RETIRED narrator voice on the doc (TWA800 shipped with the old Veo clone
    2026-08-24 — nothing checked doc.voice against the current narrator)
  - duplicate scene ids (silent audio/Sequence collisions)
  - chapter field not a string (yellowstone render-crash bug)
  - chapter/kinetic scene with no img -> flat-black text card (banned,
    memory no-black-screen-text-scenes; ChapterCard reads ONLY img)
  - chapter/kinetic scene relying on `video` for its backdrop (ChapterCard/
    TextSceneBg ignore video — deepwaterhorizon bug: assigning video to a
    chapter card silently did nothing)
  - "invisible" scene: no visual field at all -> IllusScene renders black
  - numbered chapter cards out of sequence / duplicated chapter title text
    (swissair111 title-card bug — caught only by eyeballing the SRT chapters)
  - first ~25s of the episode containing a non-video, non-radio scene
    (FIRST 30 SECONDS = REAL VIDEO hard rule; warn-only for criminalrecord,
    the one documented exception)
  - video clip under 15fps (starfishprime 10fps archival clips crashed the
    OffthreadVideo compositor intermittently; !=30fps warns to conform)
  - image asset over 2600px on a side (otzi Remotion timeout) or in a
    non-RGB colorspace (recurring CMYK-JPEG ffmpeg bug, venera/otzi)
  - PORTRAIT photo (h>w) in a non-exhibit scene (2026-09-15). The portrait
    gate added for thegrounding checked scene["video"] only, so photos walked
    through: flight93/United 93 shipped 40 of 107 images portrait, back when
    DocWide still used objectFit:"cover", and the crew members' faces were
    cropped out of the finished film. Exhibits are exempt — ExhibitScene is
    built to present portrait document pages whole.
  - WARN: one img pool covering >40% of visual scenes with <5 distinct files
    (swissair111 sprawl: one 3-photo pool crept to 100+ of 179 scenes)
HYPERFRAMES GATES (2026-10-24, BLACKBOX-2027-REVAMP §3.1 / Phase 1 #2) — an
`hf` scene plays video/hf_<name>.mp4, a GENERATED data graphic that owns its
whole frame. Before these gates the kit clips were hand-copied `video` scenes:
they passed the hook rule as "real footage", rendered under DocWide's grade/
scrim/Brand (flattening the kit's own chrome), shipped in the wrong channel
accent (render-all.sh dropped --channel), and nothing noticed a data JSON
edited after its clip was rendered:
  - hf scene in the first ~25s (it is NOT real footage — treated as a still;
    warn-only for criminalrecord like the rest of the hook rule)
  - stat/cap/chapter/img/video on an hf scene (hf owns the frame; chapter
    stays ChapterCard's so chapter numbering + SRT CHAPTERS keep one source)
  - manifest.hf[name] missing, or doctiming.hf_sha (data json + template +
    theme + build.mjs + pinned CLI) drifted from manifest.hf[name].sha256
    (prints the build_hf_scenes.py --only rerun)
  - clip missing, shorter than the scene, not 3840x2160, or not 30fps
  - accent baked into hyperframes/scenes/<name>.html != THEMES[doc.channel]
  - WARN: data JSON cites no CLAIMS file (numbers on screen with no trace)
CLAIMS + SENSITIVITY GATES (2026-10-24, revamp Phase 1 #3 + #5, logic lives in
scripts/claims_lint.py so the CLI and the gate can't drift):
  - any claim-bearing number/time in hyperframes/data/<slug>/*.json missing
    from the CLAIMS file's `## ANCHORS` table (file + key path printed; a
    typo'd chart value rendered silently before — `_facts` was unchecked
    prose); unknown `claims` ids; WARN: data file with no `_facts`/`claims`,
    no ANCHORS table (falls back to the whole CLAIMS text), unclassified
    numeric key, figure tracing only to a DISPUTED/ALLEGED anchor
  - WARN-ONLY narration tracer: stat / kinetic.count / exhibit source
    figures not found anywhere in CLAIMS (calibrated false-positive rate is
    printed on every run — claims_lint.CALIBRATION)
  - sensitivity: a victim surname (CLAIMS `## SENSITIVITY` `victims:` list)
    in cap/stat/mainText/chapter without doc.sensitivity.victimsNamed: true;
    an unattributed "<living party> lied|knew|caused|is guilty…" sentence;
    malformed sensitivity block. WARN: blackbox doc with no sensitivity
    block (docs/guides/SENSITIVITY-GATE.md, publish-video §6 codified)
PROVENANCE GATES (2026-10-24, revamp §3.2 / Phase 2 #1, logic in
scripts/lib/provenance.py). Provenance is read from manifest.assets /
manifest.videos FIRST (build_doc_vo.py snapshots PROVENANCE.jsonl +
ATTRIBUTION.md there), live from those files for anything the manifest lacks:
  - UNSOURCED (no provenance at all) shown in the first ~30s hook or on an
    exhibit BLOCKS; elsewhere warns (emitted by audit_scene_relevance.py, so
    the audit CLI and this gate print the same line)
  - exhibit file whose provenance is generic stock (Pexels/Pixabay) while the
    scene cites a `source` (carlawalker false-provenance bug)
  - verify.status: a shown file that never passed the vision check
    (legacy-unverified = known only from ATTRIBUTION.md / provenance_backfill;
    skipped/error = fetched with --no-verify or a failed check) BLOCKS inside
    the first ~30s hook and WARNS elsewhere, one line listing each file + its
    source title. columbia's era-wrong pool (Kraft 2019 obituary, Apollo
    Digest, Orion MER, Starlink, Roman) is exactly this class — memory
    footage-era-identity-niche. Clear it by eyeballing frames 0/8/15s, then
    `provenance_backfill.py <slug> --verify video/<f> --note "..."`.
WARNS (hook checklist — see docs/guides/HOOK-CHECKLIST.md):
  - first scene over 30 words / greeting-style opener
  - no stat/chapter in the first 4 scenes
  - final scene missing the subscribe CTA or the verbal next-video bridge
"""
from __future__ import annotations
import argparse, collections, hashlib, json, re, subprocess, sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent / "lib"))
import doctiming  # noqa: E402
sys.path.insert(0, str(Path(__file__).resolve().parent))
import claims_lint  # noqa: E402
import audit_scene_relevance as relevance  # noqa: E402
import provenance  # noqa: E402

REPO = doctiming.REPO
BLOCK, WARN = [], []

# ── narrator roster (mirrors scripts/lib/cartesia.py + CLAUDE.md's channel
# table). RETIRED ids BLOCK on any preflight: the back-catalog keeps them on
# already-shipped docs, but a doc being preflighted is a doc about to render.
GRANT = "d46abd1d-2d02-43e8-819f-51fb652c1c61"   # current EN narrator (2026-08-22)
ROBYN = "8985388c-1332-4ce7-8d55-789628aa3df4"   # approved female-narrator override
RETIRED_VOICES = {
    "00d3c951-0474-4b48-814e-ef815f533e63":
        "Veo clone (retired 2026-08-22 after real viewer accent complaints)",
}
EN_CHANNELS = {"blackbox", "mindwired", "criminalrecord"}


def _norm_quote(t: str) -> str:
    """Lowercase, strip everything but letters/digits/spaces, collapse runs.

    Lets a scene line match its CLAIMS source across markdown bold, smart
    quotes, ellipses and the tyre/tire kind of spelling drift.
    """
    import unicodedata
    t = unicodedata.normalize("NFKD", t).lower()
    t = "".join(c if (c.isalnum() or c.isspace()) else " " for c in t)
    return " ".join(t.split())


def block(msg): BLOCK.append(msg)
def warn(msg): WARN.append(msg)


def ffprobe_dur(p: Path) -> float:
    r = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration",
                        "-of", "csv=p=0", str(p)], capture_output=True, text=True)
    try:
        return float(r.stdout.strip())
    except ValueError:
        return 0.0


def ffprobe_fps(p: Path) -> float:
    r = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0",
                        "-show_entries", "stream=r_frame_rate", "-of", "csv=p=0",
                        str(p)], capture_output=True, text=True)
    try:
        num, den = r.stdout.strip().split("/")
        return float(num) / float(den) if float(den) else 0.0
    except (ValueError, ZeroDivisionError):
        return 0.0


# fields that give a scene a visible plate — a scene with NONE of these hits
# IllusScene's no-file branch and renders black (memory: astronautsscared /
# ic814kandahar / starfishprime black-screen sweeps, all found post-render)
VISUAL_FIELDS = ("img", "video", "diagram", "dossier", "kinetic", "chapter",
                 "timeline", "route", "tree", "sting", "speaker", "sketch",
                 "mascotFull", "mascotAside", "exhibit", "hf")


def theme_accents() -> dict[str, str]:
    """channel -> accent hex, parsed from DocWide's THEMES table exactly the way
    hyperframes/scripts/build.mjs does, so the gate and the kit can't disagree."""
    src = (REPO / "src/mindwired-doc/DocWide.tsx").read_text()
    i = src.find("const THEMES")
    body = src[i:src.find("\n};", i)] if i >= 0 else ""
    return {m.group(1): m.group(2).upper() for m in re.finditer(
        r'^  (\w+): \{[\s\S]*?accent: "(#[0-9A-Fa-f]{6})"', body, re.M)}


def ffprobe_video(p: Path) -> tuple[int, int, float]:
    """(width, height, fps) of the first video stream; zeros when unreadable."""
    r = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0",
                        "-show_entries", "stream=width,height,r_frame_rate",
                        "-of", "csv=p=0", str(p)], capture_output=True, text=True)
    try:
        w, h, rate = r.stdout.strip().splitlines()[0].split(",")[:3]
        num, den = rate.split("/")
        return int(w), int(h), (float(num) / float(den) if float(den) else 0.0)
    except (ValueError, IndexError, ZeroDivisionError):
        return 0, 0, 0.0


def diagram_names() -> set[str]:
    src = (REPO / "src/mindwired-doc/Diagrams.tsx").read_text()
    m = re.search(r"export const DIAGRAMS[^=]*=\s*\{(.*?)\};", src, re.S)
    return set(re.findall(r"(\w+)\s*:", m.group(1))) if m else set()


# ── LICENSE GATE (2026-10-24, revamp §3.2 / Phase 2 #3) ───────────────────
# Self-contained: scripts/lib/licenses.py parses every on-screen file's
# license (PROVENANCE.jsonl, then ATTRIBUTION.md) into one class and applies
# the rules — news-broadcast / non-commercial BLOCK anywhere; Crown Copyright
# BLOCKs as an exhibit/dossier page (WARN as b-roll); unknown WARNs, BLOCKs in
# the first-25s hook; CC-BY/BY-SA/OGL lines without an author WARN.
# Calibrated over the catalog before enabling: docs/guides/LICENSES-GATE.md.
def license_gate(slug: str, doc: dict, man: dict) -> None:
    import licenses  # noqa: E402 — scripts/lib is already on sys.path
    try:
        b, w, _ = licenses.license_findings(slug, doc, man)
    except Exception as e:  # noqa: BLE001 — a parser crash must not hide other gates
        warn(f"license gate crashed ({type(e).__name__}: {e}) — licenses NOT checked")
        return
    for m in b:
        block(m)
    for m in w[:12]:
        warn(m)
    if len(w) > 12:
        warn(f"license: +{len(w) - 12} more — python3 scripts/lib/licenses.py {slug} -v")
# ── END LICENSE GATE ──────────────────────────────────────────────────────


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("slug")
    args = ap.parse_args()
    slug = args.slug

    doc_path = doctiming.DOCS / f"{slug}.json"
    man_path = doctiming.DOCS / f"{slug}.manifest.json"
    if not doc_path.exists():
        print(f"BLOCK: no doc spec {doc_path}"); return 1
    doc = json.loads(doc_path.read_text())
    if not man_path.exists():
        print(f"BLOCK: no manifest — run build_doc_vo.py {slug}"); return 1
    man = json.loads(man_path.read_text())
    scenes = doc["scenes"]
    durations = man.get("durations", {})

    # CLAIMS fact base, normalised once — backs the quoted-transcript gate below.
    # Absent CLAIMS file => empty string => the gate no-ops rather than blocking
    # every older episode that predates the convention.
    video_uses = collections.Counter(
        sc["video"] for sc in scenes if sc.get("video"))
    claims_path = REPO / "docs" / "planning" / f"CLAIMS-{slug}.md"
    claims_text = claims_path.read_text() if claims_path.exists() else ""
    claims_norm = _norm_quote(claims_text)
    cl_blocks, cl_warns = claims_lint.lint_data(slug, claims_text if claims_text else None)

    # manifest freshness vs images dir
    img_dir = REPO / "public" / "shorts" / slug / "images"
    IMG_EXT = {".jpg", ".jpeg", ".png", ".webp"}  # mirror build_doc_vo.scan_images
    disk = sorted(f.name for f in img_dir.glob("*")
                  if f.is_file() and f.suffix.lower() in IMG_EXT) if img_dir.exists() else []
    man_files = sorted(f for files in man.get("images", {}).values() for f in files)
    if disk != man_files:
        added = set(disk) - set(man_files); removed = set(man_files) - set(disk)
        block(f"manifest stale vs {img_dir.relative_to(REPO)} "
              f"(+{len(added)} on disk, -{len(removed)} missing) — rerun build_doc_vo.py {slug}")

    diagrams = diagram_names()
    sfx_names = {f.stem for f in (REPO / "public" / "sfx").glob("*.wav")}
    audio_dir = REPO / "public" / "shorts" / slug / "audio"
    video_dir = REPO / "public" / "shorts" / slug / "video"

    for s in scenes:
        sid = s["id"]
        if s.get("img") and s["img"] not in man.get("images", {}):
            block(f"{sid}: img prefix '{s['img']}' not in manifest.images (black frame)")
        if s.get("dossier") and not s.get("img"):
            block(f"{sid}: dossier:true with no img prefix — renders chrome-only, "
                  f"no hero cutout (gen_doc_dossier.py)")
        if s.get("video") and not (video_dir / s["video"]).exists():
            block(f"{sid}: video '{s['video']}' missing from {video_dir.relative_to(REPO)}")
        if s.get("diagram") and diagrams and s["diagram"] not in diagrams:
            block(f"{sid}: diagram '{s['diagram']}' not in DIAGRAMS (blank scene)")
        if s.get("speaker") and not s.get("radioLabel"):
            block(f"{sid}: radio scene without radioLabel — label ACTUAL vs RECREATION")
        # ── CAPTION-IDENTITY GATE (2026-09-16) ────────────────────────
        # columbia h1 captioned "Rodney Rocha, chief engineer, Thermal
        # Protection System." over a face — and the clip was NASA's Chris Kraft
        # obituary tribute, so we were labelling one real NASA figure as
        # another. The scene's own note already said "this is NOT footage of
        # him"; a viewer sees only a name under a face. The vision check
        # validates SUBJECT, never identity, so nothing caught it.
        # Heuristic: a cap that looks like "Firstname Lastname, role" over a
        # clip that is SHARED across scenes (i.e. generic pool b-roll, not
        # footage OF that person) is almost always a misidentification.
        cap_txt = s.get("cap") or ""
        if s.get("video") and re.match(r"^[A-Z][a-z]+ [A-Z][a-z]+,", cap_txt.strip()):
            if video_uses.get(s["video"], 0) > 1:
                warn(f"{sid}: cap names a person ({cap_txt[:34]!r}) over "
                     f"'{s['video']}', which {video_uses[s['video']]} scenes share — "
                     f"pool b-roll is not footage OF that person; move the name to a "
                     f"scene showing their real document (the columbia h1 catch)")

        # ── QUOTED-TRANSCRIPT GATE (2026-09-16) ───────────────────────
        # Viewer complaint, relayed by Akshay: "people are screaming saying
        # that actual transcripts exist and we should use that not ai
        # generated one." A `speaker` scene renders as a transcript beat with
        # a timestamp and an honesty label, so its text reads to the viewer as
        # THE RECORD. On columbia, four of seven radio lines had been quietly
        # reworded and two were plain narration wearing a RECREATION label
        # ("LeRoy Cain calls for the ground control officer") — invented
        # dialogue presented as a transcript. The label being honest about
        # the AUDIO does not make invented WORDS honest.
        # So: every quoted radio line must be traceable to the CLAIMS fact
        # base, which is where the verbatim official transcript lives.
        if s.get("speaker") and claims_norm:
            t = _norm_quote(s.get("text", ""))
            if len(t) >= 25 and t not in claims_norm:
                block(f"{sid}: radio line not found verbatim in CLAIMS-{slug}.md — "
                      f"quote the official transcript, never a reworded or "
                      f"model-written line (see the columbia catch, 2026-09-16)")
        if s.get("speaker") and "[pause]" in s.get("text", ""):
            block(f"{sid}: [pause] marker in a RADIO scene — RadioScene renders text "
                  f"verbatim on screen; the marker is for narration-only scenes")
        # sketch-brand fields (Sketch.tsx): a typo'd pose or missing mouth
        # track renders a blank corner / frozen mouth — block before the render
        mascot_dir = REPO / "public" / "mascot"
        if s.get("react") and not (mascot_dir / f"{s['react']}.png").exists():
            block(f"{sid}: react pose '{s['react']}' not in public/mascot/ "
                  f"(run gen_mascot.py + copy, or fix the pose name)")
        if s.get("speak"):
            missing_rig = [f"host_m{k}" for k in range(4)
                           if not (mascot_dir / f"host_m{k}.png").exists()]
            if missing_rig:
                block(f"{sid}: speak:true but talking rig missing "
                      f"({', '.join(missing_rig)}) — gen_mascot.py --only host")
            if not man.get("mouth", {}).get(sid):
                block(f"{sid}: speak:true but no mouth track in manifest — "
                      f"rerun build_doc_vo.py {slug} --manifest-only")
        for cue in s.get("sfx", []):
            if cue.get("name") not in sfx_names:
                block(f"{sid}: sfx '{cue.get('name')}' not in public/sfx/ "
                      f"(run gen_sfx_kit.py; valid: {', '.join(sorted(sfx_names))})")
        if sid not in durations:
            block(f"{sid}: no duration in manifest (estimate fallback -> drift) — rerun build_doc_vo.py")
        clip = audio_dir / f"{sid}.mp3"
        if not clip.exists():
            block(f"{sid}: VO clip missing {clip.relative_to(REPO)}")
        elif clip.stat().st_size < 500 or ffprobe_dur(clip) < 0.15:
            block(f"{sid}: VO clip empty/near-empty ({clip.name}) — Cartesia leading-'...' bug")

    # ---- lesson gates (2026-08-26): shipped-defect classes, automated ----

    # narrator voice lock — TWA800 shipped with the retired clone because
    # nothing compared doc.voice to the current narrator (memory twa800-episode)
    voice = doc.get("voice")
    channel = doc.get("channel", "mindwired")
    if voice in RETIRED_VOICES:
        block(f"doc voice {voice[:8]}… is RETIRED ({RETIRED_VOICES[voice]}) — "
              f"new renders use Grant {GRANT[:8]}…; back-catalog docs keep the old "
              f"voice only as a record of what shipped, never for a new render")
    elif channel in EN_CHANNELS and voice and voice not in (GRANT, ROBYN):
        warn(f"doc voice {voice[:8]}… is neither Grant nor Robyn — intentional?")

    # duplicate scene ids -> silent Sequence/audio collisions
    seen_ids: dict[str, int] = {}
    for s in scenes:
        seen_ids[s["id"]] = seen_ids.get(s["id"], 0) + 1
    for sid, n in seen_ids.items():
        if n > 1:
            block(f"duplicate scene id '{sid}' ({n}×) — Sequences and VO clips collide")

    chapters_in_order: list[tuple[str, str]] = []   # (scene id, chapter text)
    for s in scenes:
        sid = s["id"]
        ch = s.get("chapter")
        if ch is not None and not isinstance(ch, str):
            block(f"{sid}: chapter field is {type(ch).__name__}, not a string "
                  f"(yellowstone render-crash bug)")
            continue
        if ch:
            chapters_in_order.append((sid, ch))
        # chapter cards / kinetic reveals read ONLY img (TextSceneBg): no img =
        # flat black text card (banned); a video field on them silently does
        # NOTHING (deepwaterhorizon bug) — both block before the render
        if (ch or s.get("kinetic")) and not s.get("img"):
            block(f"{sid}: chapter/kinetic scene with no img — renders flat black "
                  f"text (banned; reuse the segment's established real photo)")
        if (ch or s.get("kinetic")) and s.get("video"):
            # with an img too it's a harmless no-op field; without one the
            # author THINKS the scene has a backdrop and it renders black
            (warn if s.get("img") else block)(
                f"{sid}: chapter/kinetic scene has a `video` field — ChapterCard/"
                f"TextSceneBg IGNORE video (deepwaterhorizon bug); "
                + ("img present, video field is dead weight" if s.get("img")
                   else "use img instead"))
        # a scene with no visual field at all hits IllusScene's no-file branch
        if not any(s.get(f) for f in VISUAL_FIELDS):
            block(f"{sid}: no visual field at all ({'/'.join(VISUAL_FIELDS[:4])}/…) "
                  f"— renders a black frame")

    # numbered chapter cards must be strictly sequential, and no two chapter
    # cards may carry the same title text (swissair111 title-card bug: the
    # title card silently duplicated chapter 6's text — caught only in the SRT)
    nums = []
    for sid, ch in chapters_in_order:
        m = re.match(r"\s*(\d+)\s*[—–-]", ch)
        if m:
            nums.append((sid, int(m.group(1))))
    for (sid_a, a), (sid_b, b) in zip(nums, nums[1:]):
        if b != a + 1:
            block(f"chapter numbering breaks at {sid_b}: {a} -> {b} "
                  f"(expected {a + 1}) — renumber the chapter fields")
    norm = {}
    for sid, ch in chapters_in_order:
        key = re.sub(r"\s+", " ", re.sub(r"^\s*\d+\s*[—–-]\s*", "", ch)).strip().upper()
        if key and key in norm:
            block(f"duplicate chapter title text on {norm[key]} and {sid} "
                  f"({key!r}) — the swissair111 title-card bug")
        norm.setdefault(key, sid)
    # the title card should echo the DOC's own title, not some chapter's
    title_scene = next((s for s in scenes if s["id"] == "title" and s.get("chapter")), None)
    if title_scene and doc.get("title"):
        card = re.sub(r"\s+", " ", title_scene["chapter"]).strip().upper()
        if card and card not in re.sub(r"\s+", " ", doc["title"]).upper():
            warn(f"title card text {card!r} is not a substring of the doc title "
                 f"{doc['title']!r} — intended? (the swissair111 title-card bug "
                 f"shipped exactly this way)")

    # stale-VO gate: text edited AFTER TTS means the clip speaks the OLD words
    # while doc/SRT claim the new ones — a silent honesty defect no other gate
    # can see (audit 2026-08-26). Hashes recorded by build_doc_vo at synth time.
    texthash = man.get("texthash", {})
    if texthash:
        for s in scenes:
            h = texthash.get(s["id"])
            if h and hashlib.sha256(s["text"].encode()).hexdigest()[:16] != h:
                block(f"{s['id']}: scene text edited AFTER its VO was synthesized — "
                      f"the clip speaks the OLD text; rerun build_doc_vo.py {slug} "
                      f"--only {s['id']} --force")
    else:
        warn("manifest has no texthash record (predates the stale-VO gate) — "
             "text-vs-audio staleness NOT checked; rerun build_doc_vo.py --manifest-only "
             "after the next synth to start recording")

    # author intended footage but none was ever fetched/assigned — the ic814
    # black-cold-open class (videoQuery set, video never filled in)
    for s in scenes:
        if s.get("videoQuery") and not s.get("video"):
            warn(f"{s['id']}: has videoQuery but no `video` file — footage was "
                 f"intended here and never landed (fetch_doc_footage.py, or drop the query)")

    # exhibit pinning + provenance (TWA800 ntsbcause fix, now enforced; the
    # carlawalker false-provenance lesson): an exhibit is a RECEIPT on screen —
    # its prefix must resolve deterministically, and its file must trace to a
    # real, non-stock provenance record. A file with NO record at all BLOCKS
    # via the relevance audit's UNSOURCED (exhibit rule, Phase 2 #1) — not
    # repeated here, so one defect prints one line.
    prov = provenance.Provenance(slug, man)
    for s in scenes:
        if not s.get("exhibit"):
            continue
        sid, pref = s["id"], s.get("img")
        files = man.get("images", {}).get(pref, []) if pref else []
        if len(files) > 1:
            # measured highlight coords are per-FILE — rotation guarantees the
            # box frames the wrong page (exhibit-highlight-discipline memory);
            # without a highlight, multiple photos of the same object are OK
            # but a pinned single-file prefix is still the discipline
            (block if s.get("highlight") else warn)(
                f"{sid}: exhibit prefix '{pref}' maps to {len(files)} files — "
                + ("its highlight coords WILL land on the wrong file under "
                   "rotation; " if s.get("highlight") else "rotation risk; ")
                + "give the exhibit its own single-file prefix")
        for f in files:
            if not s.get("source"):
                continue
            rec = prov.get("images", f)
            if rec:
                hay = " ".join(str(rec.get(k, "")) for k in
                               ("lic_key", "source", "license", "page", "url"))
            else:   # named in ATTRIBUTION.md in a shape the parser can't read
                hay = next((l for l in provenance.attribution_mentions(
                    REPO / "public" / "shorts" / slug / "images").splitlines()
                    if f in l), "")
            if re.search(r"pexels|pixabay", hay, re.I):
                block(f"{sid}: exhibit cites source {s['source']!r} but the file "
                      f"is generic stock ({f}) — the carlawalker false-provenance bug")

    # verify.status (revamp Phase 2 #1): every file actually SHOWN (DocWide's
    # rotation, via the relevance audit's resolver) that never passed the
    # vision check. Hook window = the audit's 30s walk, so UNSOURCED and this
    # gate agree on what "the hook" is.
    hook_ids = set(provenance.hook_scene_ids(doc, durations, 30.0))
    unverified: dict[tuple[str, str], list[str]] = {}
    for s_, fname, kind in relevance.resolve_visuals(doc, man.get("images", {})):
        if kind not in ("img", "video") or not fname or relevance.is_hf(fname):
            continue
        sub = "video" if kind == "video" else "images"
        st = prov.status(sub, fname)
        if st is None or st in (provenance.VERIFIED, provenance.GENERATED):
            continue   # None = UNSOURCED, reported by the relevance audit
        unverified.setdefault((sub, fname), []).append(s_["id"])
    exhibit_ids = {s_["id"] for s_ in scenes if s_.get("exhibit")}
    soft, soft_ex = [], 0
    for (sub, fname), ids in sorted(unverified.items()):
        st = prov.status(sub, fname)
        title = (prov.get(sub, fname) or {}).get("title", "")[:60]
        in_hook = [i for i in ids if i in hook_ids]
        if in_hook:
            what = "image" if sub == "images" else "video"
            block(f"{in_hook[0]}: hook {what} "
                  f"'{fname}' is {st} (“{title}”) inside the first ~30s — never "
                  f"vision-checked for subject/ERA. Eyeball frames 0/8/15s, then "
                  f"`provenance_backfill.py {slug} --verify {sub}/{fname} --note '...'`, "
                  f"or refetch it through fetch_doc_footage.py")
        if all(i in exhibit_ids for i in ids):
            soft_ex += 1
            continue
        soft.append(f"{fname}{' [hook: BLOCK]' if in_hook else ''} ({st}, "
                    f"{len(ids)} scene(s), “{title}”)")
    if soft:
        warn(f"provenance: {len(soft)} shown file(s) never vision-verified — check "
             f"subject AND era by eye (memory footage-era-identity-niche):")
        for line in soft:
            warn("  " + line)
    if prov.stale:
        warn(f"provenance: manifest.assets/videos predate PROVENANCE.jsonl for "
             f"{len(prov.stale)} file(s) ({', '.join(sorted(prov.stale)[:4])}"
             f"{'…' if len(prov.stale) > 4 else ''}) — gates used the newer rows; "
             f"rerun build_doc_vo.py {slug} --manifest-only to snapshot them")
    if soft_ex:
        warn(f"provenance: {soft_ex} exhibit page(s) carry no persisted verify verdict "
             f"(hand-cut report crops; the citation is the provenance) — "
             f"`provenance_backfill.py {slug} --verify images/<f>` once checked")

    # radio caps with hand-typed quote marks render visibly doubled (RadioScene
    # adds its own curly quotes)
    for s in scenes:
        cap = s.get("cap") or ""
        if s.get("speaker") and cap and (cap[0] in "\"'“‘" or cap[-1] in "\"'”’"):
            block(f"{s['id']}: radio cap starts/ends with a quote character — "
                  f"RadioScene adds its own quotes; strip them")

    # one img pool carrying most of the episode = the same few photos on
    # loop (swissair111 sprawl, memory idea-bank-and-asset-caps); a single
    # FILE on >20 scenes is the planetnine corrective-re-render class
    vis = [s for s in scenes if s.get("img") and not s.get("exhibit")]
    if vis:
        counts: dict[str, int] = {}
        for s in vis:
            counts[s["img"]] = counts.get(s["img"], 0) + 1
        top, n = max(counts.items(), key=lambda kv: kv[1])
        share = n / len(vis)
        files = len(man.get("images", {}).get(top, []))
        if share > 0.40 and files < 5:
            warn(f"img pool '{top}' covers {share:.0%} of {len(vis)} visual scenes "
                 f"with only {files} distinct files — cap pools at authoring time "
                 f"(CLAUDE.md 2026-08-25); full split: "
                 + ", ".join(f"{k}:{v}" for k, v in sorted(counts.items(), key=lambda kv: -kv[1])))
        for pref, cnt in counts.items():
            nfiles = max(1, len(man.get("images", {}).get(pref, [])))
            if nfiles <= 2 and cnt > 20:
                block(f"img pool '{pref}': {cnt} scenes on {nfiles} file(s) "
                      f"(~{cnt // nfiles}× per photo) — the planetnine 28×-repetition "
                      f"defect; fetch more variety or reassign scenes")

    # FIRST 30 SECONDS = REAL VIDEO (hard rule, memory hook-first-30s-real-video;
    # criminalrecord is the one documented exception -> warn there)
    t = 0.0
    for s in scenes:
        if t >= 25.0:
            break
        sid = s["id"]
        if s.get("hf"):
            # a HyperFrames clip moves, but it is a generated graphic, not real
            # footage — the hook rule counts it as a still (revamp §2)
            msg = (f"{sid}: hf scene '{s['hf']}' starting at {t:.0f}s — HyperFrames "
                   f"data scenes are NOT real footage and never sit in the first ~30s; "
                   f"move it after the real-video hook")
            (warn if channel == "criminalrecord" else block)(msg)
        elif not s.get("video") and not s.get("speaker"):
            msg = (f"{sid}: scene starting at {t:.0f}s has no `video` — first ~30s "
                   f"must be real motion footage, stills don't hold scrollers")
            (warn if channel == "criminalrecord" else block)(msg)
        t += durations.get(sid, 3.0)

    # ── HYPERFRAMES GATES (2026-10-24, revamp §3.1) ────────────────────────
    # see the docstring: frame ownership, freshness hash, clip shape, accent
    hf_man = man.get("hf", {}) or {}
    accents = theme_accents()
    want_accent = accents.get(channel)
    hf_root = doctiming.HF_ROOT
    for s in scenes:
        name = s.get("hf")
        if not name:
            continue
        sid = s["id"]
        for f in ("stat", "cap", "chapter", "img", "video"):
            if s.get(f):
                block(f"{sid}: hf scene carries `{f}` — HyperFrames owns the whole "
                      f"frame (no StatChip/CaptionBar/Brand on top; chapter cards stay "
                      f"ChapterCard's; img/video are ignored). Put the text in "
                      f"hyperframes/data/{slug}/{name}.json or split the scene")
        rerun = f"scripts/build_hf_scenes.py {slug} --only {sid}"
        data_path, tpl_path = doctiming.hf_paths(slug, name)
        if not data_path.exists():
            block(f"{sid}: hf '{name}' has no data file "
                  f"{data_path.relative_to(REPO)}")
            continue
        if tpl_path is None or not tpl_path.exists():
            block(f"{sid}: hf '{name}' data names no existing template "
                  f"({tpl_path.relative_to(REPO) if tpl_path else 'no `scene` field'})")
            continue
        entry = hf_man.get(name)
        if not isinstance(entry, dict):
            block(f"{sid}: hf '{name}' has no manifest.hf entry — clip never built "
                  f"(or built by hand); run `{rerun}`")
        else:
            sha_now = doctiming.hf_sha(slug, name) or ""
            sha_rec = str(entry.get("sha256") or entry.get("sha") or "")
            if len(sha_rec) < 16 or not sha_now.startswith(sha_rec.lower()):
                block(f"{sid}: hf '{name}' data/template changed AFTER its clip was "
                      f"rendered (sha {sha_rec[:16] or '—'} recorded, "
                      f"{sha_now[:16]} now) — the clip shows stale data; rerun `{rerun}`")
        clip = video_dir / f"hf_{name}.mp4"
        if not clip.exists():
            block(f"{sid}: hf clip {clip.relative_to(REPO)} missing — run `{rerun}`")
            continue
        need = doctiming.scene_frames(s, durations) / doctiming.FPS
        got = ffprobe_dur(clip)
        if got < need:
            block(f"{sid}: hf clip hf_{name}.mp4 is {got:.2f}s but the scene runs "
                  f"{need:.2f}s — it would freeze on its last frame; rerun `{rerun}`")
        w, h, fps = ffprobe_video(clip)
        if (w, h) != (3840, 2160) or abs(fps - 30) > 0.01:
            block(f"{sid}: hf clip hf_{name}.mp4 is {w}x{h}@{fps:.3g}fps — must be "
                  f"3840x2160@30 (landscape-4k, --fps 30); rerun `{rerun}`")
        # accent baked into the built scene HTML; scenes/ is rebuilt per episode,
        # so fall back to the build list build.mjs wrote for this slug
        baked = None
        scene_html = hf_root / "scenes" / f"{name}.html"
        built = hf_root / ".hyperframes" / f"built-{slug}.json"
        if scene_html.exists():
            m_acc = re.search(r"--accent:\s*(#[0-9A-Fa-f]{6})", scene_html.read_text())
            baked = m_acc.group(1).upper() if m_acc else None
        if baked is None and built.exists():
            try:
                b = json.loads(built.read_text())
                if name in b.get("scenes", []):
                    baked = str(b.get("accent", "")).upper() or None
            except ValueError:
                pass
        if want_accent is None:
            block(f"{sid}: doc channel {channel!r} has no THEMES accent in DocWide.tsx")
        elif baked is None:
            warn(f"{sid}: hf '{name}' accent not checkable (no hyperframes/scenes/"
                 f"{name}.html or built-{slug}.json) — rerun `{rerun}` to verify")
        elif baked != want_accent:
            block(f"{sid}: hf '{name}' baked accent {baked} != {channel} accent "
                  f"{want_accent} (THEMES) — wrong channel colour; rerun `{rerun}`")
        # the per-number claims trace runs once over every data file below
        # (claims_lint.lint_data); here only the cite-the-file check
        try:
            data_txt = data_path.read_text()
            data = json.loads(data_txt)
        except ValueError:
            block(f"{sid}: hf data {data_path.relative_to(REPO)} is not valid JSON")
            continue
        if data.get("_facts") and not data.get("claims") and "CLAIMS-" not in data_txt:
            warn(f"{sid}: hf data {name}.json cites no CLAIMS file in `_facts` "
                 f"— name CLAIMS-{slug}.md as the source")

    # ── HF DATA CLAIMS GATE (2026-10-24, revamp Phase 1 #3 / §4.1) ──────────
    # A data graphic prints numbers the viewer reads as THE RECORD — the same
    # reasoning as the quoted-transcript gate. `_facts` was prose nobody could
    # check, so a typo'd chart value would have rendered silently. Every
    # claim-bearing number/time in hyperframes/data/<slug>/*.json must match a
    # row of the CLAIMS file's `## ANCHORS` table (tolerances documented in
    # claims_lint.py). BLOCKs only for hf data; the narration tracer is WARN.
    for m in cl_blocks:
        block(f"claims: {m}")
    for m in cl_warns:
        warn(f"claims: {m}")

    # ── NARRATION TRACER (WARN-ONLY, revamp §4.1) ──────────────────────────
    # stat / kinetic.count / exhibit source figures traced to CLAIMS (any
    # section). Not a BLOCK until the measured false-positive rate allows it.
    if claims_text:
        tr = claims_lint.trace_figures(doc, claims_text)
        if tr["misses"]:
            warn(f"claims tracer: {len(tr['misses'])} of {tr['checked']} on-screen "
                 f"figures not found in CLAIMS-{slug}.md (WARN-only; "
                 f"`claims_lint.py {slug}` lists them) — "
                 + ", ".join(f"{sid}:{lit}" for sid, _, lit in tr["misses"][:8])
                 + (" …" if len(tr["misses"]) > 8 else ""))
        tracer_line = (f"claims tracer: {tr['hits']}/{tr['checked']} on-screen figures "
                       f"traced to CLAIMS · {claims_lint.CALIBRATION}")
    else:
        tracer_line = f"claims tracer: no CLAIMS-{slug}.md — not run"

    # ── SENSITIVITY GATE v1 (2026-10-24, revamp Phase 1 #5 / §4.4) ─────────
    # docs/guides/SENSITIVITY-GATE.md: victim surnames in on-screen text need
    # a declared victimsNamed decision; unattributed guilt assertions about
    # declared living parties BLOCK; a blackbox doc with no block WARNs.
    s_blocks, s_warns = claims_lint.sensitivity_gate(doc, claims_text)
    for m in s_blocks:
        block(f"sensitivity: {m}")
    for m in s_warns:
        warn(f"sensitivity: {m}")

    # clip fps sanity — 10fps archival cuts crashed the OffthreadVideo
    # compositor intermittently (memory starfishprime-video-10fps-bug)
    for s in scenes:
        if s.get("video"):
            vp = video_dir / s["video"]
            if vp.exists():
                fps = ffprobe_fps(vp)
                if 0 < fps < 15:
                    block(f"{s['id']}: video '{s['video']}' is {fps:.0f}fps — "
                          f"conform with `-vf fps=30` (starfishprime compositor crash)")
                elif fps and abs(fps - 30) > 0.51:
                    warn(f"{s['id']}: video '{s['video']}' is {fps:.3g}fps, comp is 30 "
                         f"— consider conforming with `-vf fps=30`")

    # image constraints — >2600px sides timed out Remotion (otzi); CMYK/odd
    # colorspaces break the ffmpeg steps (venera/otzi recurring bug)
    # files that sit BEHIND text (chapter/kinetic backdrops get dimmed ~60%
    # by TextSceneBg — a dark source photo becomes a functional black screen,
    # the voyager1 lesson: "bright-enough-after-dimming, not just img-present")
    text_bg_files: set[str] = set()
    for s in scenes:
        if (s.get("chapter") or s.get("kinetic")) and s.get("img"):
            text_bg_files.update(man.get("images", {}).get(s["img"], []))

    # files that render through the PHOTO scene, i.e. where the viewer is meant
    # to LOOK AT the image. Two exemptions, both deliberate:
    #   - exhibit scenes: ExhibitScene exists to present portrait document
    #     pages whole, so portrait is the correct shape there.
    #   - chapter/kinetic scenes: TextSceneBg uses the image as a blurred,
    #     heavily dimmed backdrop behind type (both the paper and photo
    #     branches), so a crop there loses nothing the viewer was to read.
    photo_files: set[str] = set()
    for s_ in scenes:
        if s_.get("img") and not (s_.get("exhibit") or s_.get("chapter")
                                  or s_.get("kinetic")):
            photo_files.update(man.get("images", {}).get(s_["img"], []))

    try:
        from PIL import Image, ImageStat
        for f in disk:
            fp = img_dir / f
            try:
                with Image.open(fp) as im:
                    if f in text_bg_files:
                        luma = ImageStat.Stat(im.convert("L")).mean[0]
                        if luma < 60:
                            warn(f"image {f} (used behind chapter/kinetic text) has "
                                 f"mean brightness {luma:.0f}/255 — after TextSceneBg "
                                 f"dimming it reads as black (voyager1 lesson)")
                    # otzi's >2600px Remotion timeout — but 2880px shipped fine
                    # on twa800, so warn 2600-4500 and block only clearly
                    # pathological sizes
                    if max(im.size) > 4500:
                        block(f"image {f} is {im.size[0]}x{im.size[1]} — oversize "
                              f"images time out Remotion (otzi); downscale it")
                    elif max(im.size) > 2600:
                        warn(f"image {f} is {im.size[0]}x{im.size[1]} — >2600px "
                             f"risked a Remotion timeout on otzi; consider downscaling")
                    # ── PORTRAIT-PHOTO GATE (2026-09-15) ──────────────────
                    # The companion to the portrait-VIDEO gate below, which
                    # only ever checked sc["video"] and let photos through.
                    # flight93 (United 93, published Jul 26) shipped with 40
                    # of its 107 images portrait. DocWide still used
                    # objectFit:"cover" then, so an 867x1300 source kept only
                    # its middle ~44% band — the crew members' faces were
                    # cropped out of the finished film. Akshay, 2026-09-15:
                    # "no crew member face was shown". DocWide pillarboxes
                    # now (the Aug 2 fix) so faces survive, but a portrait
                    # photo still leaves most of a 16:9 frame as blurred
                    # backdrop and reads cheap. Refetch landscape instead.
                    iw, ih = im.size
                    if f in photo_files and ih > iw:
                        waste = (1 - (iw / ih) / (16 / 9)) * 100
                        block(f"image {f} is PORTRAIT ({iw}x{ih}) in a non-exhibit "
                              f"scene — DocWide pillarboxes it and ~{waste:.0f}% of "
                              f"the 16:9 frame becomes blurred backdrop (and masters "
                              f"rendered before 2026-08-02 cropped the subject out "
                              f"entirely — the flight93 face bug). Refetch landscape, "
                              f'or set "exhibit": true if it really is a document page.')
                    if im.mode not in ("RGB", "RGBA", "L", "P"):
                        block(f"image {f} is mode {im.mode} — non-RGB JPEGs break "
                              f"the ffmpeg steps (venera/otzi); convert to RGB")
            except OSError as e:
                block(f"image {f} unreadable ({e}) — corrupt download?")
    except ImportError:
        warn("PIL not available — image size/colorspace gates SKIPPED "
             "(pip install pillow, or run under .venv-agent)")

    # spoken-text lint (numbers/codes read wrong by TTS)
    r = subprocess.run([sys.executable, str(REPO / "scripts/lint_tts_text.py"), str(doc_path)],
                       capture_output=True, text=True)
    if r.returncode != 0:
        block("lint_tts_text hits:\n" + (r.stdout or r.stderr).strip())

    # ── PORTRAIT-SOURCE GATE (2026-09-13) ──────────────────────────────────
    # A 608x1080 clip in a 1920x1080 comp renders as a narrow strip between
    # black bars. thegrounding put 16 of them into a finished 4K master, two
    # inside the cold open, and it took a frame-by-frame look to catch. The
    # fetcher now refuses portrait video; this catches anything already on disk.
    for sc in scenes:
        v = sc.get("video")
        if not v:
            continue
        vp = REPO / "public" / "shorts" / slug / "video" / v
        if not vp.exists():
            continue
        try:
            wh = subprocess.run(
                ["ffprobe", "-v", "error", "-select_streams", "v",
                 "-show_entries", "stream=width,height", "-of", "csv=p=0", str(vp)],
                capture_output=True, text=True, check=True).stdout.strip()
            vw, vh = (int(x) for x in wh.split(",")[:2])
        except Exception:
            continue
        if vw < vh:
            block(f"{sc['id']}: video '{v}' is PORTRAIT ({vw}x{vh}) — renders as a "
                  f"narrow strip between black bars in a 16:9 comp. Replace it.")

    # ── VISUAL MONOTONY GATE (2026-09-13) ──────────────────────────────────
    # Banked from noradtapes, which shipped with ONE clip carrying 32 of 123
    # scenes (26% of the film) and 23 scenes sitting back-to-back on the same
    # asset. Akshay: "i dont want u to repeat same stills same images... cuz
    # im losing subs cuz we are repeating too much". A doc that reuses two
    # clips for 40% of its runtime reads as cheap no matter how good the
    # script is. CLAUDE.md already said to cap pools BEFORE assigning scenes;
    # this makes it enforceable instead of aspirational.
    from collections import Counter
    vis_counts, consec, prev = Counter(), [], None
    for sc in scenes:
        v = sc.get("video") or sc.get("img")
        if not v:
            prev = None
            continue
        vis_counts[v] += 1
        # An EXHIBIT held across consecutive scenes while the highlight box moves
        # down the page is correct documentary grammar, not monotony — the rule
        # exists for a clip that silently replays from frame 0 (noradtapes, 23
        # times). Don't punish a document being read.
        if v == prev and not sc.get("exhibit"):
            consec.append(sc["id"])
        prev = v
    tot_vis = sum(vis_counts.values())
    if tot_vis:
        for asset, n in vis_counts.most_common():
            share = n / tot_vis
            if share > 0.12:
                block(f"visual monotony: '{asset}' carries {n}/{tot_vis} scenes "
                      f"({share:.0%}) — cap is 12%. Slice the clip into distinct "
                      f"shots or widen the pool; do not ship one room for a "
                      f"quarter of the film.")
            elif share > 0.08:
                warn(f"visual monotony: '{asset}' carries {n}/{tot_vis} scenes "
                     f"({share:.0%}) — approaching the 12% cap.")
        if consec:
            (block if len(consec) > 4 else warn)(
                f"visual monotony: {len(consec)} scene(s) repeat the previous "
                f"scene's visual back-to-back ({', '.join(consec[:8])}"
                f"{'...' if len(consec) > 8 else ''}) — vary the shot.")
        if len(vis_counts) < max(12, tot_vis // 6):
            warn(f"visual monotony: only {len(vis_counts)} distinct visuals across "
                 f"{tot_vis} scenes — aim for roughly one per six scenes.")

    # scene<->visual relevance + cross-video reuse (audit_scene_relevance.py):
    # hook footage recycled from another slug BLOCKS (new video = new hook,
    # 2026-07-19); mismatched/generic/overused visuals warn.
    r = subprocess.run([sys.executable, str(REPO / "scripts/audit_scene_relevance.py"), slug],
                       capture_output=True, text=True)
    rel_lines = [l for l in (r.stdout or "").splitlines() if l.strip()]
    if r.returncode == 2:
        block("relevance audit — hook footage reused from another video, or an "
              "UNSOURCED file in the hook / on an exhibit:\n" +
              "\n".join(l for l in rel_lines if l.startswith("BLOCK")))
    elif r.returncode != 0:
        # the audit CRASHED — never let the anti-slop gate vanish silently
        warn(f"relevance audit crashed (exit {r.returncode}) — gate did NOT run; "
             f"fix and rerun: {(r.stderr or r.stdout or '').strip()[-300:]}")
    rel_warns = [l for l in rel_lines if l.startswith("warn")]
    if rel_warns:
        warn(f"relevance audit: {len(rel_warns)} scene<->visual issues — run "
             f"`python3 scripts/audit_scene_relevance.py {slug}` for the full list; top hits:")
        for l in rel_warns[:8]:
            warn("  " + l[6:].strip())

    # ---- hook checklist (warnings) ----
    first = scenes[0]
    if len(first["text"].split()) > 30:
        warn("hook: first scene over 30 words — tighten to one shocking fact")
    if re.match(r"\s*(hi|hello|hey|welcome|in this video)\b", first["text"], re.I):
        warn("hook: greeting-style opener — open on the fact, not a greeting")
    if not any(s.get("stat") or s.get("chapter") for s in scenes[:4]):
        warn("hook: no stat chip or card in the first 4 scenes — front-load a concrete number")
    # scan the last THREE scenes, not just the final one — the Kursk episode
    # kept its bridge in a separate scene before the closer and false-warned
    tail_text = " ".join(s["text"].lower() for s in scenes[-3:])
    if "subscribe" not in tail_text:
        warn("outro: no subscribe CTA line in the last 3 scenes")
    if not re.search(r"(next|wait until|if .* shocked)", tail_text):
        warn("outro: no verbal next-video bridge in the last 3 scenes (CLAUDE.md 2026-07-14 rule)")

    license_gate(slug, doc, man)  # LICENSE GATE (see block above main)

    for m in BLOCK:
        print(f"BLOCK  {m}")
    for m in WARN:
        print(f"warn   {m}")
    # print the derived chapter list on EVERY run — the swissair111 title-card
    # bug was only ever visible in this list, previously printed post-render
    if chapters_in_order:
        print("\nCHAPTERS (eyeball these — they become the SRT/description chapter list):")
        for sid, ch in chapters_in_order:
            print(f"  {sid:8s} {ch.replace(chr(10), ' / ')}")
    print(f"\n{tracer_line}")
    print(f"\n{slug}: {len(BLOCK)} blocking, {len(WARN)} warnings "
          f"({len(scenes)} scenes, {doctiming.body_seconds(doc, durations):.0f}s body)")
    return 1 if BLOCK else 0


if __name__ == "__main__":
    sys.exit(main())
