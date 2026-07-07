#!/usr/bin/env python3
"""
Assemble "Time Is Breaking — And You Can't Feel It", the Higgsfield cinematic
re-cut of the brokentime facts (see research/BROKENTIME-FACTS-2026-07-04.md and
scripts/build_brokentime_cinematic_audio.py). Straight ffmpeg edit, no Remotion —
this repo's ffmpeg build has no libfreetype/libass (no drawtext/subtitles filter),
so text (wordmark card + burned captions) is rendered with Pillow to transparent
PNGs and composited with ffmpeg's overlay filter.

Per beat: the 5.04s Kling clip is time-stretched to fill its narration duration
via a blended slow-motion pass (minterpolate) for ~70% of the beat, then a slow
Ken-Burns hold (zoompan) on the last frame for the remainder — reads as
continued cinematography, not a stutter or a freeze-frame.

Order: hook -> wordmark (text card, no Higgsfield clip) -> labclock -> gps ->
core -> iss -> kelly -> s2 -> clockwall -> cta -> mandatory subscribe outro.

Run: python3 scripts/build_brokentime_cinematic.py
Writes out/mindwired_brokentime_cinematic.mp4.
"""
import json
import subprocess
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

REPO = Path(__file__).resolve().parent.parent
AUDIO = REPO / "public" / "brokentime-cinematic" / "audio"
CLIPS = REPO / "public" / "brokentime-cinematic" / "clips"
WORK = REPO / "public" / "brokentime-cinematic" / "_work"
OUT = REPO / "out"
OUTRO = REPO / "assets" / "subscribe-outro" / "subscribe_mindwired_long.mp4"

W, H, FPS = 1920, 1080, 30
FONT_BOLD = "/System/Library/Fonts/Supplemental/Arial Bold.ttf"
FONT_BLACK = "/System/Library/Fonts/Supplemental/Arial Black.ttf"

ORDER = ["hook", "wordmark", "labclock", "gps", "core", "iss", "kelly", "s2", "clockwall", "cta"]
CLIP_BEATS = [b for b in ORDER if b != "wordmark"]


def run(cmd):
    subprocess.run(cmd, check=True)


def ffprobe_dur(path: Path) -> float:
    out = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "default=nk=1:nw=1", str(path)],
        capture_output=True, text=True, check=True)
    return float(out.stdout.strip())


# ── caption rendering (Pillow, since this ffmpeg build lacks drawtext/libass) ──

def wrap_words(words: list[str], max_per_line: int = 4) -> list[str]:
    return [" ".join(words[i:i + max_per_line]) for i in range(0, len(words), max_per_line)]


def group_caption_chunks(words: list[dict], chunk_size: int = 4) -> list[dict]:
    """Group word-timing entries into short caption lines (~4 words), each with
    its own [start, end) window — burned as separate overlay PNGs."""
    chunks = []
    for i in range(0, len(words), chunk_size):
        grp = words[i:i + chunk_size]
        chunks.append({
            "text": " ".join(w["word"].strip() for w in grp),
            "start": grp[0]["start"],
            "end": grp[-1]["end"],
        })
    return chunks


def render_caption_png(text: str, path: Path):
    img = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    font = ImageFont.truetype(FONT_BOLD, 64)
    max_width = int(W * 0.82)
    words = text.split()
    lines, cur = [], ""
    for w in words:
        trial = (cur + " " + w).strip()
        if draw.textlength(trial, font=font) > max_width and cur:
            lines.append(cur)
            cur = w
        else:
            cur = trial
    if cur:
        lines.append(cur)

    line_h = 78
    total_h = line_h * len(lines)
    y = H - 260 - total_h
    for line in lines:
        tw = draw.textlength(line, font=font)
        x = (W - tw) / 2
        stroke = 6
        draw.text((x, y), line, font=font, fill=(255, 255, 255, 255),
                   stroke_width=stroke, stroke_fill=(0, 0, 0, 235))
        y += line_h
    img.save(path)


def render_wordmark_png(path: Path):
    img = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    title_font = ImageFont.truetype(FONT_BLACK, 128)
    tag_font = ImageFont.truetype(FONT_BOLD, 40)

    title = "MINDWIRED"
    tw = draw.textlength(title, font=title_font)
    cyan = (120, 220, 255, 255)
    draw.text(((W - tw) / 2, H / 2 - 110), title, font=title_font, fill=(255, 255, 255, 255),
               stroke_width=3, stroke_fill=cyan)

    tag = "TIME ITSELF IS BROKEN"
    letters = " ".join(list(tag))  # slight letterspace look
    tagw = draw.textlength(letters, font=tag_font)
    draw.text(((W - tagw) / 2, H / 2 + 40), letters, font=tag_font, fill=(190, 230, 245, 235))
    img.save(path)


# ── per-beat clip build ────────────────────────────────────────────────────

def build_stretched_clip(beat_id: str, target_dur: float, out_path: Path):
    src = CLIPS / f"{beat_id}.mp4"
    src_dur = ffprobe_dur(src)
    motion_factor = 2.2
    motion_dur = min(target_dur, src_dur * motion_factor)
    hold_dur = max(0.0, target_dur - motion_dur)

    if hold_dur < 0.08:
        vf = (f"scale={W}:{H}:force_original_aspect_ratio=increase,crop={W}:{H},setsar=1,fps={FPS},"
              f"minterpolate=fps={FPS}:mi_mode=blend,setpts={target_dur / src_dur:.6f}*PTS,"
              f"trim=duration={target_dur:.3f}")
        run(["ffmpeg", "-y", "-i", str(src), "-vf", vf, "-an", str(out_path)])
        return

    motion_path = WORK / f"{beat_id}_motion.mp4"
    hold_path = WORK / f"{beat_id}_hold.mp4"

    sf = motion_dur / src_dur
    vf_motion = (f"scale={W}:{H}:force_original_aspect_ratio=increase,crop={W}:{H},setsar=1,fps={FPS},"
                 f"minterpolate=fps={FPS}:mi_mode=blend,setpts={sf:.6f}*PTS,"
                 f"trim=duration={motion_dur:.3f}")
    run(["ffmpeg", "-y", "-i", str(src), "-vf", vf_motion, "-an", str(motion_path)])

    hold_frames = max(1, int(round(hold_dur * FPS)))
    vf_hold = (f"scale={W}:{H}:force_original_aspect_ratio=increase,crop={W}:{H},setsar=1,"
               f"zoompan=z='min(zoom+0.0007,1.14)':d={hold_frames}:s={W}x{H}:fps={FPS}")
    run(["ffmpeg", "-y", "-sseof", "-0.15", "-i", str(motion_path), "-frames:v", "1", "-vf",
         f"scale={W}:{H}", str(WORK / f"{beat_id}_lastframe.png")])
    run(["ffmpeg", "-y", "-loop", "1", "-i", str(WORK / f"{beat_id}_lastframe.png"),
         "-t", f"{hold_dur:.3f}", "-vf", vf_hold, "-an", str(hold_path)])

    concat_list = WORK / f"{beat_id}_concat.txt"
    concat_list.write_text(f"file '{motion_path.name}'\nfile '{hold_path.name}'\n")
    run(["ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", str(concat_list),
         "-c", "copy", str(out_path)])


def overlay_captions(video_path: Path, words: list[dict], out_path: Path):
    if not words:
        run(["ffmpeg", "-y", "-i", str(video_path), "-c", "copy", str(out_path)])
        return
    chunks = group_caption_chunks(words)
    inputs = ["-i", str(video_path)]
    filter_parts = []
    last = "0:v"
    for i, c in enumerate(chunks):
        png = WORK / f"cap_{video_path.stem}_{i}.png"
        render_caption_png(c["text"], png)
        inputs += ["-i", str(png)]
        nxt = f"v{i}"
        filter_parts.append(
            f"[{last}][{i+1}:v]overlay=0:0:enable='between(t,{c['start']:.3f},{c['end']:.3f})'[{nxt}]")
        last = nxt
    filter_complex = ";".join(filter_parts)
    run(["ffmpeg", "-y", *inputs, "-filter_complex", filter_complex, "-map", f"[{last}]",
         "-c:v", "libx264", "-pix_fmt", "yuv420p", str(out_path)])


def mux_audio(video_path: Path, audio_path: Path, out_path: Path):
    run(["ffmpeg", "-y", "-i", str(video_path), "-i", str(audio_path),
         "-map", "0:v", "-map", "1:a", "-c:v", "copy", "-c:a", "aac", "-b:a", "192k",
         "-shortest", str(out_path)])


def main():
    WORK.mkdir(parents=True, exist_ok=True)
    OUT.mkdir(parents=True, exist_ok=True)
    manifest = json.loads((AUDIO / "manifest.json").read_text())

    segment_paths = []
    for beat_id in ORDER:
        info = manifest["clips"][beat_id]
        target_dur = info["dur"]
        words = info["words"]
        print(f"[{beat_id}] target {target_dur:.2f}s", flush=True)

        if beat_id == "wordmark":
            png = WORK / "wordmark.png"
            render_wordmark_png(png)
            raw_v = WORK / "wordmark_v.mp4"
            vf = (f"zoompan=z='min(zoom+0.0009,1.08)':d={int(round(target_dur*FPS))}:s={W}x{H}:fps={FPS},"
                  f"fade=t=in:st=0:d=0.6:alpha=0,fade=t=out:st={target_dur-0.6:.3f}:d=0.6:alpha=0")
            run(["ffmpeg", "-y", "-loop", "1", "-i", str(png),
                 "-f", "lavfi", "-i", f"color=c=black:s={W}x{H}:r={FPS}",
                 "-filter_complex",
                 f"[0:v]{vf}[fg];[1:v]trim=duration={target_dur:.3f}[bg];[bg][fg]overlay=0:0:format=auto[v]",
                 "-map", "[v]", "-t", f"{target_dur:.3f}", str(raw_v)])
            stretched = raw_v
        else:
            stretched = WORK / f"{beat_id}_stretched.mp4"
            build_stretched_clip(beat_id, target_dur, stretched)

        captioned = WORK / f"{beat_id}_captioned.mp4"
        overlay_captions(stretched, words, captioned)

        final_seg = WORK / f"{beat_id}_final.mp4"
        mux_audio(captioned, AUDIO / f"{beat_id}.mp3", final_seg)
        segment_paths.append(final_seg)

    # normalize outro to same res/fps and re-encode audio for a clean concat
    outro_norm = WORK / "outro_norm.mp4"
    run(["ffmpeg", "-y", "-i", str(OUTRO), "-vf", f"scale={W}:{H},setsar=1,fps={FPS}",
         "-c:v", "libx264", "-c:a", "aac", "-b:a", "192k", str(outro_norm)])
    segment_paths.append(outro_norm)

    concat_list = WORK / "final_concat.txt"
    concat_list.write_text("".join(f"file '{p.resolve()}'\n" for p in segment_paths))
    final_out = OUT / "mindwired_brokentime_cinematic.mp4"
    run(["ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", str(concat_list),
         "-c:v", "libx264", "-preset", "medium", "-crf", "18",
         "-c:a", "aac", "-b:a", "192k", "-pix_fmt", "yuv420p", str(final_out)])

    dur = ffprobe_dur(final_out)
    print(f"\n[done] {final_out} — {dur:.1f}s")


if __name__ == "__main__":
    main()
