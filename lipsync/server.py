"""Tiny HTTP wrapper around SadTalker inference.
POST /lipsync  (multipart: image=<png/jpg>, audio=<wav/mp3>)  -> talking-head mp4.
Runs on the GCP GPU VM inside the Docker image. Called by scripts/lipsync_client.py.

Health: GET /  -> {"ok": true}. Keep the VM stopped when not in use (billed per hour).
"""
import subprocess
import tempfile
import uuid
from pathlib import Path

from fastapi import FastAPI, File, UploadFile
from fastapi.responses import FileResponse, JSONResponse

app = FastAPI()
RESULTS = Path("/app/results")
RESULTS.mkdir(exist_ok=True)


@app.get("/")
def health():
    return {"ok": True, "service": "sadtalker-lipsync"}


@app.post("/lipsync")
async def lipsync(image: UploadFile = File(...), audio: UploadFile = File(...),
                  still: bool = True, enhancer: str = "gfpgan", preprocess: str = "full"):
    job = uuid.uuid4().hex[:8]
    work = Path(tempfile.mkdtemp(prefix=f"ls_{job}_"))
    img_p = work / f"host{Path(image.filename).suffix or '.png'}"
    aud_p = work / f"voice{Path(audio.filename).suffix or '.wav'}"
    img_p.write_bytes(await image.read())
    aud_p.write_bytes(await audio.read())

    out_dir = RESULTS / job
    out_dir.mkdir(parents=True, exist_ok=True)
    cmd = [
        "python", "inference.py",
        "--source_image", str(img_p),
        "--driven_audio", str(aud_p),
        "--result_dir", str(out_dir),
        "--preprocess", preprocess,        # full = keep the whole studio framing
        "--enhancer", enhancer,            # gfpgan = sharper face
        "--cpu" if False else "--verbose",
    ]
    if still:
        cmd.append("--still")              # minimal head sway — cleaner for a host shot
    proc = subprocess.run(cmd, cwd="/app", capture_output=True, text=True)
    if proc.returncode != 0:
        return JSONResponse(status_code=500, content={"error": proc.stderr[-2000:]})

    mp4s = sorted(out_dir.rglob("*.mp4"), key=lambda p: p.stat().st_mtime)
    if not mp4s:
        return JSONResponse(status_code=500, content={"error": "no mp4 produced", "log": proc.stdout[-1500:]})
    return FileResponse(str(mp4s[-1]), media_type="video/mp4", filename=f"talking_{job}.mp4")
