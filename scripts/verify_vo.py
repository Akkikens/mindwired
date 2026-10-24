#!/usr/bin/env python3
"""VO back-check: transcribe every scene clip and compare it to the script —
run after build_doc_vo.py (ship_doc step 3c), BEFORE the one render.

    python3 scripts/verify_vo.py <slug> [--only id1,id2] [--threshold 0.6]
                                 [--warn-ratio 0.85] [--model small.en] [--json]

Why (BLACKBOX-2027-REVAMP §4.2 / Phase 1 #4): nothing checked that a Cartesia
clip actually SAYS its scene text. The ear-check samples 3 clips of ~150; a
dropped or garbled sentence anywhere else ships, and the SRT/captions then
disagree with the audio. Transcription is local faster-whisper (the same path
scripts/whisper_srt.py uses — no new dependency, $0).

Per clip (public/shorts/<slug>/audio/<id>.mp3):
  - reference = scene text after lib/pronounce.respell() (what was SENT to
    TTS) — so "Haise" is expected as "Hayes"; [pause]/<tags> dropped
  - both sides normalized: lowercase, punctuation stripped, hyphens split,
    apostrophes removed, and every run of number words / digits ("ninety
    three", "93", "19th", "twenty fourteen", "2014") collapsed to ONE <n>
    token — whisper writes digits, our scripts spell them, both are right
  - difflib alignment of reference vs transcript tokens
BLOCK  - any scene sentence with < --threshold (default 0.6) of its words
         matched in the transcript alignment (the TTS dropped/garbled it) —
         the sentence is printed. Clip missing/empty also BLOCKs.
WARN   - whole-clip difflib ratio < --warn-ratio (default 0.85)
       - radio recreations (`speaker` + "CVR RECREATION"): sentence misses
         are WARN only — the radio EQ chain degrades whisper
       - phonetic leak: the transcript contains a spoken respelling of a
         written code the lint (lint_tts_text.PATTERNS) flags — e.g. "seven
         three seven" for 737, "fifteen forty nine" for 1549. Those words end
         up in the whisper SRT / auto-captions; the WARN names the written
         form so the uploaded .srt can be corrected. Candidates come from the
         doc's on-screen fields (cap/stat/mainText/chapter) plus a generic
         rule: 3+ consecutive single-digit words.
SKIPPED - scenes labelled "ACTUAL ATC RECORDING" (real docket audio, not TTS).

Idempotent: results cache in out/qa/<slug>_vo_check.json keyed by scene id
with sha(text) + sha(clip bytes); unchanged clips are not re-transcribed.
Exit 1 on any BLOCK, 3 if faster-whisper is unavailable (gate NOT run),
0 otherwise.
"""
from __future__ import annotations
import argparse, difflib, hashlib, json, os, re, sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE / "lib"))
sys.path.insert(0, str(HERE))
import pronounce  # noqa: E402
import lint_tts_text  # noqa: E402

REPO = HERE.parent
DOCS = REPO / "src" / "mindwired-doc" / "docs"
CACHE_VERSION = 1

# ── number normalization ────────────────────────────────────────────────────
_UNITS = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight",
          "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen",
          "sixteen", "seventeen", "eighteen", "nineteen"]
_TENS = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy",
         "eighty", "ninety"]
_ORD = {"first", "second", "third", "fourth", "fifth", "sixth", "seventh",
        "eighth", "ninth", "tenth", "eleventh", "twelfth", "thirteenth",
        "fourteenth", "fifteenth", "sixteenth", "seventeenth", "eighteenth",
        "nineteenth", "twentieth", "thirtieth", "fortieth", "fiftieth",
        "sixtieth", "seventieth", "eightieth", "ninetieth", "hundredth",
        "thousandth", "millionth", "billionth"}
NUM_WORDS = set(_UNITS) | set(_TENS[2:]) | _ORD | {
    "hundred", "thousand", "million", "billion", "trillion", "oh"}
DIGIT_WORDS = {w: str(i) for i, w in enumerate(_UNITS[:10])} | {"oh": "0"}
_DIGIT_TOK = re.compile(r"^\d[\d,.]*(st|nd|rd|th|s)?$")
NUM = "<n>"


def _is_num(tok: str) -> bool:
    return tok in NUM_WORDS or bool(_DIGIT_TOK.match(tok))


def tokens(text: str) -> list[str]:
    """Normalized word tokens; number runs collapse to a single <n>."""
    t = text.lower()
    t = re.sub(r"\[pause\]|<[^>]+>", " ", t)
    t = t.replace("%", " percent ").replace("&", " and ")
    t = re.sub(r"[’'`]", "", t)                       # don't -> dont
    t = re.sub(r"(?<=\d),(?=\d)", "", t)              # 35,000 -> 35000
    t = re.sub(r"[^a-z0-9.\s]|(?<!\d)\.|\.(?!\d)", " ", t)  # keep 121.5
    raw = t.split()
    out: list[str] = []
    for i, w in enumerate(raw):
        if _is_num(w) and not (w == "oh" and not (
                (i and _is_num(raw[i - 1])) or (i + 1 < len(raw) and _is_num(raw[i + 1])))):
            if out and out[-1] == NUM:
                continue
            out.append(NUM)
        elif w == "and" and out and out[-1] == NUM and i + 1 < len(raw) and _is_num(raw[i + 1]):
            continue                                   # "a hundred and forty"
        else:
            out.append(w)
    return out


_ABBR = re.compile(r"\b(Mr|Mrs|Ms|Dr|St|Capt|Lt|Gen|Col|Sgt|No|vs|U\.S|e\.g|i\.e)\.$")


def sentences(text: str) -> list[str]:
    parts, cur = [], ""
    for chunk in re.split(r"(?<=[.?!])\s+", text.strip()):
        cur = f"{cur} {chunk}".strip()
        if not _ABBR.search(cur):
            parts.append(cur)
            cur = ""
    if cur:
        parts.append(cur)
    return [p for p in parts if tokens(p)]


# ── phonetic-leak candidates (written code -> spoken respellings) ───────────
def _two(n: int) -> str:
    if n < 20:
        return _UNITS[n]
    return _TENS[n // 10] + ("" if n % 10 == 0 else " " + _UNITS[n % 10])


def spoken_variants(code: str) -> set[str]:
    """How a narrator (or a respelled script) says a written code: digit by
    digit ('seven three seven'), in pairs ('fifteen forty nine'), digit+pair
    ('seven thirty seven', 'three oh two'); letters spelled one by one."""
    out: set[str] = set()
    groups = re.findall(r"[A-Za-z]+|\d+", code)
    if not any(g.isdigit() for g in groups):
        return out
    per_group: list[set[str]] = []
    for g in groups:
        if not g.isdigit():
            alts = {g.lower()}
            if g.isupper() and len(g) <= 4:
                alts.add(" ".join(g.lower()))
            per_group.append(alts)
            continue
        alts = {" ".join(_UNITS[int(c)] for c in g),
                " ".join("oh" if c == "0" else _UNITS[int(c)] for c in g)}
        if len(g) == 3:
            for zero in ("oh", "zero"):
                alts.add(_UNITS[int(g[0])] + " " + (
                    f"{zero} {_UNITS[int(g[2])]}" if g[1] == "0" else _two(int(g[1:]))))
        if len(g) == 4 and g[2] != "0":
            alts.add(_two(int(g[:2])) + " " + _two(int(g[2:])))
        if len(g) == 2:
            alts.add(_two(int(g)))
        per_group.append(alts)
    combos = [""]
    for alts in per_group:
        combos = [f"{c} {a}".strip() for c in combos for a in alts]
    # the bare number part too ("seven three seven" without "MAX",
    # "fifteen forty nine" without "US") — 3+ digits only, so plain small
    # numbers never count as a leak
    for g, alts in zip(groups, per_group):
        if g.isdigit() and len(g) >= 3:
            combos += list(alts)
    # a leak needs 2+ number words: "no one" (No. 1) and "four day" (4-DAY)
    # are ordinary English, not a respelled code (SRT calibration 2026-10-24)
    return {c for c in combos if sum(w in NUM_WORDS for w in c.split()) >= 2}


def code_candidates(doc: dict) -> dict[str, str]:
    """spoken variant -> written form, from codes in the doc's on-screen text."""
    cands: dict[str, str] = {}
    for s in doc.get("scenes", []):
        for key in ("cap", "stat", "mainText", "chapter", "radioLabel"):
            v = s.get(key)
            if not isinstance(v, str):
                continue
            for pat, _why, *_g in lint_tts_text.PATTERNS:
                for m in pat.finditer(v):
                    written = m.group(0).strip()
                    for sp in spoken_variants(written):
                        cands.setdefault(sp, written)
    return cands


def phonetic_leaks(transcript: str, cands: dict[str, str]) -> list[tuple[str, str]]:
    """(spoken sequence found, written form) pairs in a whisper transcript."""
    t = " " + " ".join(re.sub(r"[^a-z0-9\s]", " ", transcript.lower().replace("-", " ")).split()) + " "
    hits: list[tuple[str, str]] = []
    for sp, written in sorted(cands.items(), key=lambda kv: -len(kv[0])):
        if f" {sp} " in t and not any(sp in h for h, _ in hits):
            hits.append((sp, written))
    # generic: 3+ single-digit words in a row is a code read digit by digit
    for m in re.finditer(r"(?:\b(?:zero|one|two|three|four|five|six|seven|eight|nine|oh)\b\s*){3,}", t):
        seq = m.group(0).strip()
        words = seq.split()
        if not any(w != "oh" for w in words) or any(seq in h or h in seq for h, _ in hits):
            continue
        hits.append((seq, "".join(DIGIT_WORDS[w] for w in words)))
    return hits


# ── compare one clip ────────────────────────────────────────────────────────
def compare(reference: str, transcript: str, threshold: float) -> dict:
    ref_sents = sentences(reference)
    ref_toks: list[str] = []
    spans: list[tuple[int, int]] = []
    for sent in ref_sents:
        a = len(ref_toks)
        ref_toks += tokens(sent)
        spans.append((a, len(ref_toks)))
    hyp = tokens(transcript)
    sm = difflib.SequenceMatcher(None, ref_toks, hyp, autojunk=False)
    matched = [False] * len(ref_toks)
    for blk in sm.get_matching_blocks():
        for k in range(blk.a, blk.a + blk.size):
            matched[k] = True
    missing = []
    for sent, (a, b) in zip(ref_sents, spans):
        cov = sum(matched[a:b]) / max(1, b - a)
        if cov < threshold:
            missing.append({"sentence": sent, "coverage": round(cov, 2)})
    return {"ratio": round(sm.ratio(), 3), "missing": missing}


def load_model(name: str):
    try:
        from faster_whisper import WhisperModel  # heavy, same path as whisper_srt.py
    except ImportError:
        return None
    print(f"[verify_vo] loading whisper {name}…", file=sys.stderr)
    return WhisperModel(name, device="cpu", compute_type="int8")


def transcribe(model, clip: Path) -> str:
    # decode with ffmpeg rather than faster-whisper's PyAV path: PyAV/faster-
    # whisper version skew breaks decode_audio (metadata_errors kwarg)
    import subprocess
    import numpy as np  # faster-whisper dependency
    pcm = subprocess.run(["ffmpeg", "-v", "error", "-i", str(clip), "-f", "f32le",
                          "-ac", "1", "-ar", "16000", "-"],
                         capture_output=True, check=True).stdout
    samples = np.frombuffer(pcm, dtype=np.float32)
    segs, _ = model.transcribe(samples, language="en", vad_filter=True,
                               condition_on_previous_text=False, beam_size=5)
    return " ".join(s.text.strip() for s in segs).strip()


def _sha(b: bytes) -> str:
    return hashlib.sha256(b).hexdigest()[:16]


def _reexec_with_whisper_venv() -> None:
    """faster-whisper lives in .venv-agent (whisper_srt.py's documented env),
    while ship_doc runs steps under .venv-lipsync — hop over once."""
    if os.environ.get("VERIFY_VO_REEXEC"):
        return
    for venv in (".venv-agent", ".venv-lipsync", ".venv"):
        py = REPO / venv / "bin" / "python"
        if py.exists() and Path(sys.executable).resolve() != py.resolve():
            os.environ["VERIFY_VO_REEXEC"] = "1"
            os.execv(str(py), [str(py), *sys.argv])


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("slug")
    ap.add_argument("--only", default="", help="comma-separated scene ids")
    ap.add_argument("--threshold", type=float, default=0.6,
                    help="min share of a sentence's words heard (BLOCK below)")
    ap.add_argument("--warn-ratio", type=float, default=0.85,
                    help="whole-clip difflib ratio below this WARNs")
    ap.add_argument("--model", default="small.en")
    ap.add_argument("--audio-dir", type=Path, default=None,
                    help="override public/shorts/<slug>/audio (testing)")
    ap.add_argument("--no-cache", action="store_true")
    ap.add_argument("--json", action="store_true", help="print results as JSON")
    args = ap.parse_args()

    doc = json.loads((DOCS / f"{args.slug}.json").read_text())
    audio = args.audio_dir or (REPO / "public" / "shorts" / args.slug / "audio")
    only = {s.strip() for s in args.only.split(",") if s.strip()}
    cache_p = REPO / "out" / "qa" / f"{args.slug}_vo_check.json"
    cache = {}
    if cache_p.exists() and not args.no_cache and not args.audio_dir:
        try:
            cache = json.loads(cache_p.read_text())
            if cache.get("_v") != CACHE_VERSION:
                cache = {}
        except Exception:
            cache = {}
    cands = code_candidates(doc)

    model = None
    results, blocks, warns, skipped = {}, [], [], []
    for s in doc.get("scenes", []):
        sid, text = s.get("id"), s.get("text")
        if not isinstance(text, str) or not text.strip() or (only and sid not in only):
            continue
        if s.get("radioLabel") == "ACTUAL ATC RECORDING":
            skipped.append(sid)
            continue
        clip = audio / f"{sid}.mp3"
        if not clip.exists() or clip.stat().st_size == 0:
            blocks.append(f"{sid}: clip missing/empty ({clip.relative_to(REPO) if clip.is_relative_to(REPO) else clip})")
            continue
        key = {"text": _sha(text.encode()), "clip": _sha(clip.read_bytes())}
        hit = cache.get(sid)
        if hit and hit.get("key") == key and hit.get("model") == args.model:
            transcript = hit["transcript"]
        else:
            if model is None:
                model = load_model(args.model)
                if model is None:
                    _reexec_with_whisper_venv()
                    print("verify_vo NOT RUN: faster-whisper not importable "
                          f"({sys.executable}); install it into .venv-agent — the env "
                          "scripts/whisper_srt.py documents", file=sys.stderr)
                    sys.exit(3)
            transcript = transcribe(model, clip)
            print(f"  {sid:10s} transcribed ({len(transcript.split())} words)", file=sys.stderr)
        cache[sid] = {"key": key, "model": args.model, "transcript": transcript}

        reference = pronounce.respell(text)
        r = compare(reference, transcript, args.threshold)
        r["transcript"] = transcript
        radio = bool(s.get("speaker"))
        for m in r["missing"]:
            msg = (f"{sid}: sentence {int(m['coverage'] * 100)}% heard — "
                   f"\"{m['sentence']}\"")
            (warns if radio else blocks).append(msg + (" [radio EQ: warn only]" if radio else ""))
        if r["ratio"] < args.warn_ratio and not r["missing"]:
            warns.append(f"{sid}: clip/script similarity {r['ratio']:.2f} < {args.warn_ratio} "
                         f"— heard: \"{transcript[:120]}\"")
        r["leaks"] = phonetic_leaks(transcript, cands)
        for sp, written in r["leaks"]:
            warns.append(f"{sid}: transcript reads \"{sp}\" — written form is \"{written}\" "
                         f"(fix it in the uploaded .srt / caption text)")
        results[sid] = r

    if not args.audio_dir:
        cache_p.parent.mkdir(parents=True, exist_ok=True)
        cache["_v"] = CACHE_VERSION
        cache_p.write_text(json.dumps(cache, indent=1))

    if args.json:
        print(json.dumps({"slug": args.slug, "blocks": blocks, "warns": warns,
                          "skipped": skipped, "scenes": results}, indent=1))
    else:
        ratios = [r["ratio"] for r in results.values()]
        mean = sum(ratios) / len(ratios) if ratios else 0
        print(f"\n[verify_vo] {args.slug}: {len(results)} clips checked, mean similarity "
              f"{mean:.3f}, {len(skipped)} real-audio skipped")
        for w in warns:
            print(f"  WARN  {w}")
        for b in blocks:
            print(f"  BLOCK {b}")
        if blocks:
            print(f"\n{len(blocks)} BLOCK(s): re-synth with build_doc_vo.py --only <ids> --force, "
                  f"then rerun verify_vo.py --only <ids>")
        else:
            print("  OK — every sentence heard")
    sys.exit(1 if blocks else 0)


if __name__ == "__main__":
    main()
