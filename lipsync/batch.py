#!/usr/bin/env python3
"""Lip-sync scene clips of a viral-shorts plan with the plan's host via Sonic
(zf-kbot/sonic on Replicate), publish the talking clips where Remotion can see
them, and flag each scene so the engine plays video instead of the still.

The host field is a registry id from src/viral/hosts.json ("orion", "rio", ...)
or a legacy direct image path under public/.

Budget control: --only lets you lip-sync just the scenes that earn it (hook,
analysis moments, CTA) — every other scene falls back to the still host, which
costs nothing. A 10-min video only needs talking clips where the host carries
the moment.

Writes:
  lipsync/out/<slug>/<sceneId>.mp4              (Replicate output, gitignored)
  public/shorts/<slug>/host/<sceneId>.mp4       (copy for Remotion staticFile)
  plan JSON: scenes[i].hostClipExists = true    (engine switch)

Usage:
  .venv-lipsync/bin/python lipsync/batch.py <slug> [--only id1,id2] [--stitch]
Idempotent per clip: existing outputs are never re-generated (no re-spend).
"""
import argparse
import json
import shutil
import subprocess
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(Path(__file__).resolve().parent))
from sonic_client import run as sonic_run  # noqa: E402


SONIC_MAX_DIM = 1080  # Sonic input: final render is 1080p/1080x1920 — a 4K
# source only means a slower (and, in practice, flakier — the download of one
# 4K clip hung/truncated) Replicate job for zero visible quality gain.


def sonic_source(image: Path) -> Path:
    """Downscaled copy of a host master, cached next to it, sized for Sonic
    input only — the 4K master stays canonical for the still layer/re-poses."""
    cache = image.with_name(f"{image.stem}_sonic{image.suffix}")
    if cache.exists() and cache.stat().st_mtime >= image.stat().st_mtime:
        return cache
    subprocess.run([
        "ffmpeg", "-y", "-v", "error", "-i", str(image),
        "-vf", f"scale='if(gt(iw,ih),-2,{SONIC_MAX_DIM})':'if(gt(iw,ih),{SONIC_MAX_DIM},-2)'",
        str(cache),
    ], check=True)
    return cache


def resolve_host(plan: dict) -> tuple[Path, float]:
    """(sonic-ready image path, sonic dynamic_scale) from registry id or direct path."""
    host = plan.get("host")
    if not host:
        sys.exit("plan has no \"host\" field — add one (registry id or path)")
    if "/" in host:
        return sonic_source(REPO / "public" / host), 1.0
    registry = json.loads((REPO / "src/viral/hosts.json").read_text())
    entry = registry.get(host)
    if not entry:
        sys.exit(f"host '{host}' not in src/viral/hosts.json (have: {', '.join(registry)})")
    return sonic_source(REPO / "public" / entry["image"]), float(entry.get("dynamicScale", 1.0))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("slug")
    ap.add_argument("--only", default=None,
                    help="comma-separated scene ids to lip-sync (default: all voiced scenes)")
    ap.add_argument("--stitch", action="store_true",
                    help="also concat the talking clips into lipsync/out/<slug>_full.mp4")
    args = ap.parse_args()

    plan_path = REPO / "src/viral/plans" / f"{args.slug}.json"
    plan = json.loads(plan_path.read_text())
    image, dynamic_scale = resolve_host(plan)
    if not image.exists():
        sys.exit(f"host image missing: {image}")

    audio_dir = REPO / "public/shorts" / args.slug / "audio"
    manifest = json.loads((audio_dir / "manifest.json").read_text())
    out_dir = REPO / "lipsync/out" / args.slug
    pub_dir = REPO / "public/shorts" / args.slug / "host"
    out_dir.mkdir(parents=True, exist_ok=True)
    pub_dir.mkdir(parents=True, exist_ok=True)
    only = set(args.only.split(",")) if args.only else None

    clips, changed = [], False
    for sc in plan["scenes"]:
        cid = sc["id"]
        if only is not None and cid not in only:
            continue
        clip_meta = manifest["clips"].get(cid, {})
        if clip_meta.get("estimated"):
            print(f"[{cid}] skip — silent/estimated audio (run build_short.py with quota first)")
            continue
        mp3 = audio_dir / f"{cid}.mp3"
        if not mp3.exists():
            sys.exit(f"missing audio {mp3} — run scripts/build_short.py {args.slug} first")
        mp4 = out_dir / f"{cid}.mp4"
        if not mp4.exists():
            print(f"[{cid}] lip-syncing ({clip_meta.get('dur', '?')}s)...")
            sonic_run(image, mp3, mp4, dynamic_scale=dynamic_scale)
        else:
            print(f"[{cid}] skip (exists)")
        pub = pub_dir / f"{cid}.mp4"
        if not pub.exists() or pub.stat().st_mtime < mp4.stat().st_mtime:
            shutil.copy2(mp4, pub)
        if not sc.get("hostClipExists"):
            sc["hostClipExists"] = True
            changed = True
        clips.append(mp4)

    if changed:
        plan_path.write_text(json.dumps(plan, indent=2, ensure_ascii=False) + "\n")
        print(f"plan updated: hostClipExists set → {plan_path.name}")

    if args.stitch and clips:
        concat_file = out_dir / "concat.txt"
        concat_file.write_text("\n".join(f"file '{c.resolve()}'" for c in clips))
        full = REPO / "lipsync/out" / f"{args.slug}_full.mp4"
        subprocess.run(["ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", str(concat_file),
                        "-c:v", "libx264", "-c:a", "aac", "-r", "30", str(full)], check=True)
        print(f"stitched -> {full}")


if __name__ == "__main__":
    main()
