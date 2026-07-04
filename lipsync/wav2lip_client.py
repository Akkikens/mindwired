#!/usr/bin/env python3
"""Free, local lip-sync fallback via Wav2Lip — same call signature as
sonic_client.run() so lipsync/batch.py can swap engines with one flag.

Setup (one-time, already done in this repo but documented for a fresh clone):
  python3 -m venv .venv-wav2lip
  .venv-wav2lip/bin/pip install torch torchvision numpy opencv-python librosa numba tqdm
  git clone --depth 1 https://github.com/Rudrabha/Wav2Lip lipsync/wav2lip/repo
  curl -L -o lipsync/wav2lip/repo/checkpoints/wav2lip_gan.pth \
    https://huggingface.co/camenduru/Wav2Lip/resolve/main/checkpoints/wav2lip_gan.pth
  curl -L -o lipsync/wav2lip/repo/face_detection/detection/sfd/s3fd.pth \
    https://huggingface.co/camenduru/Wav2Lip/resolve/main/face_detection/detection/sfd/s3fd.pth
  # patch for modern librosa (positional -> keyword args) — see audio.py diff in git log

Quality note: visibly softer around the mouth than Sonic (diffusion-based) —
this is the free/local option, not a drop-in replacement. Use Sonic when
Replicate credit is available; this is the no-credit fallback.

No GPU acceleration wired up (CPU inference) — still ~1-2x realtime on
Apple Silicon for short clips, which is fine for host cutaways.

Usage:
  .venv-wav2lip/bin/python lipsync/wav2lip_client.py \
      --image public/host/rio_wide.png --audio public/shorts/x/audio/a1.mp3 \
      --out lipsync/out/x/a1.mp4
"""
import argparse
import subprocess
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
WAV2LIP_REPO = REPO / "lipsync/wav2lip/repo"
WAV2LIP_VENV_PY = REPO / ".venv-wav2lip/bin/python"
CHECKPOINT = WAV2LIP_REPO / "checkpoints/wav2lip_gan.pth"


def run(image: Path, audio: Path, out: Path, dynamic_scale: float = 1.0):
    """Same signature as sonic_client.run (dynamic_scale accepted, ignored —
    Wav2Lip has no movement-intensity knob) so batch.py can swap engines freely."""
    if not WAV2LIP_VENV_PY.exists():
        sys.exit(f"{WAV2LIP_VENV_PY} missing — see setup steps in this file's docstring")
    if not CHECKPOINT.exists():
        sys.exit(f"{CHECKPOINT} missing — download it (see docstring)")
    out.parent.mkdir(parents=True, exist_ok=True)
    print(f"  lip-syncing {audio.name} onto {image.name} via local Wav2Lip (CPU)...")
    subprocess.run([
        str(WAV2LIP_VENV_PY), "inference.py",
        "--checkpoint_path", str(CHECKPOINT),
        "--face", str(image.resolve()),
        "--audio", str(audio.resolve()),
        "--outfile", str(out.resolve()),
    ], cwd=WAV2LIP_REPO, check=True, capture_output=True, text=True)
    print(f"  -> {out}")


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--image", required=True, type=Path)
    ap.add_argument("--audio", required=True, type=Path)
    ap.add_argument("--out", required=True, type=Path)
    args = ap.parse_args()
    run(args.image, args.audio, args.out)
