"""Chunk-render-concat helper — works around a real, still-not-fully-diagnosed
intermittent Remotion instability that gets more likely the longer a single
continuous `npx remotion render` process runs, or the more parallel render
processes compete for CPU/IO at once (see memory
`starfishprime-video-10fps-bug`: first hit on the Starfish Prime episode,
2026-08-24 — a "Loading font Space Grotesk... was called but not cleared"
delayRender timeout at a different, effectively-random frame every attempt).

Fix, validated on that episode: split the whole timeline into small chunks,
each rendered as its OWN fresh `npx remotion render --frames=A-B` process
(fresh browser/compositor state every chunk), retry each chunk independently
on failure, then `ffmpeg -f concat -c copy` the chunks back together.

This module is the reusable version of that one-off fix — see
scripts/render_chunked_and_master.py for the CLI (drop-in replacement for
scripts/render_and_master.py's render step).

Design notes (added after the Swissair 111 episode hit two failure modes
this module didn't originally handle):
  - Chunks are written to a PERSISTENT directory the caller controls (not a
    tempfile.TemporaryDirectory) and already-rendered chunks are skipped —
    a crash or a Ctrl-C doesn't throw away completed work, and re-running
    the same command resumes instead of starting over.
  - On a chunk's final, unrecoverable failure, already-queued-but-not-yet-
    started chunks are cancelled immediately (`cancel_futures=True`) instead
    of quietly draining the entire remaining queue before reporting the
    error — a naive `with ThreadPoolExecutor(...)` would otherwise keep
    dispatching new work for several more minutes after the fatal error is
    already known, on the mistaken assumption that letting it "finish" is
    free.
"""
from __future__ import annotations
import concurrent.futures
import subprocess
import sys
from pathlib import Path


class ChunkRenderError(RuntimeError):
    pass


def get_total_frames(comp_id: str, entry: str = "src/index.ts") -> int:
    """Parse `npx remotion compositions` output for compId's frame count."""
    r = subprocess.run(
        ["npx", "remotion", "compositions", entry],
        capture_output=True, text=True, timeout=120,
    )
    if r.returncode != 0:
        sys.exit(f"remotion compositions failed: {r.stderr[-800:]}")
    for line in r.stdout.splitlines():
        parts = line.split()
        if parts and parts[0] == comp_id:
            # columns: id, fps, WxH, durationInFrames, (seconds)
            return int(parts[3])
    sys.exit(f"composition {comp_id!r} not found in `remotion compositions` output")


# upstream fatals that mask themselves behind a misleading delayRender-timeout
# stack trace (memory starfishprime-video-10fps-bug: "scroll UP past the stack
# trace" — now done mechanically)
KNOWN_FATALS = (
    "Could not extract frame from compositor",
    "Request closed",
    "out of memory",
    "Target closed",
    "Session closed",
)


def _triage(log: str) -> str:
    hits = [ln.strip() for ln in log.splitlines()
            if any(k.lower() in ln.lower() for k in KNOWN_FATALS)]
    if hits:
        return ("PROBABLE ROOT CAUSE (found upstream of the reported error):\n  "
                + "\n  ".join(dict.fromkeys(hits))[:800] + "\n--- reported error:\n")
    return ""


def _render_one_chunk(
    comp_id: str, out_path: Path, frame_range: str,
    extra_args: list[str], retries: int,
) -> Path:
    if out_path.exists():
        print(f"  [chunk {frame_range}] exists, skip", flush=True)
        return out_path
    cmd = ["npx", "remotion", "render", comp_id, str(out_path),
           f"--frames={frame_range}", *extra_args]
    last_err = ""
    for attempt in range(1, retries + 1):
        r = subprocess.run(cmd, capture_output=True, text=True)
        if r.returncode == 0 and out_path.exists():
            return out_path
        out_path.unlink(missing_ok=True)  # never leave a partial/corrupt chunk file behind
        full = r.stdout + r.stderr
        last_err = _triage(full) + full[-600:]
        print(f"  [chunk {frame_range}] attempt {attempt}/{retries} failed"
              + (", retrying…" if attempt < retries else ""), flush=True)
    raise ChunkRenderError(f"chunk {frame_range} failed after {retries} tries:\n{last_err}")


def render_chunked(
    comp_id: str,
    final_raw_path: Path,
    tmp_dir: Path,
    chunk_size: int = 250,
    parallel_chunks: int = 5,
    retries: int = 6,
    total_frames: int | None = None,
    extra_args: list[str] | None = None,
) -> Path:
    """Render comp_id in chunk_size-frame pieces (each a fresh remotion
    process), concat losslessly into final_raw_path. Returns final_raw_path.

    tmp_dir should be a PERSISTENT directory (survives a crash) so a re-run
    after a failure resumes from whatever chunks already rendered instead of
    starting over — see module docstring."""
    extra_args = extra_args or []
    if total_frames is None:
        total_frames = get_total_frames(comp_id)

    bounds = []
    start = 0
    while start < total_frames:
        end = min(total_frames - 1, start + chunk_size - 1)
        bounds.append((start, end))
        start = end + 1

    tmp_dir.mkdir(parents=True, exist_ok=True)
    chunk_paths: list[Path] = [tmp_dir / f"chunk_{i:05d}.mp4" for i in range(len(bounds))]
    already = sum(1 for p in chunk_paths if p.exists())
    print(f"[chunked-render] {comp_id}: {total_frames} frames -> "
          f"{len(bounds)} chunks of ~{chunk_size}f, {parallel_chunks} parallel"
          + (f" ({already} already done, resuming)" if already else ""), flush=True)

    pool = concurrent.futures.ThreadPoolExecutor(max_workers=parallel_chunks)
    try:
        futures = {
            pool.submit(_render_one_chunk, comp_id, chunk_paths[i], f"{a}-{b}",
                        extra_args, retries): i
            for i, (a, b) in enumerate(bounds)
        }
        done = 0  # every submitted future (fresh render OR skip-existing) counts exactly once
        for fut in concurrent.futures.as_completed(futures):
            fut.result()  # raises ChunkRenderError on unrecoverable chunk failure
            done += 1
            print(f"[chunked-render] {done}/{len(bounds)} chunks done", flush=True)
    except ChunkRenderError as e:
        print(f"[chunked-render] FATAL: {e} — cancelling remaining queued chunks", flush=True)
        pool.shutdown(wait=True, cancel_futures=True)
        sys.exit(f"render failed: {e}")
    else:
        pool.shutdown(wait=True)

    concat_list = tmp_dir / "concat.txt"
    concat_list.write_text("".join(f"file '{p.resolve()}'\n" for p in chunk_paths))
    print("[chunked-render] concatenating…", flush=True)
    r = subprocess.run(
        ["ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", str(concat_list),
         "-c", "copy", str(final_raw_path)],
        capture_output=True, text=True,
    )
    if r.returncode != 0:
        sys.exit(f"ffmpeg concat failed:\n{r.stderr[-1200:]}")

    # verify exact frame count survived the concat, per the validated Starfish
    # Prime QA process (no silent frame loss/duplication at chunk boundaries)
    probe = subprocess.run(
        ["ffprobe", "-v", "error", "-count_frames", "-select_streams", "v:0",
         "-show_entries", "stream=nb_read_frames", "-of",
         "default=nokey=1:noprint_wrappers=1", str(final_raw_path)],
        capture_output=True, text=True,
    )
    got = probe.stdout.strip()
    if got != str(total_frames):
        print(f"[chunked-render] WARNING: expected {total_frames} frames, "
              f"ffprobe counted {got!r} — eyeball chunk boundaries before trusting this render",
              flush=True)
    else:
        print(f"[chunked-render] frame count verified: {got} == {total_frames}", flush=True)

    return final_raw_path
