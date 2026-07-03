# Lip-sync service — SadTalker (still image + audio -> talking head) on a CUDA GPU.
# Built to run on a GCP Compute Engine GPU VM (L4/T4). NOT for Apple Silicon.
# SadTalker: https://github.com/OpenTalker/SadTalker (single-image talking head + head motion)
FROM pytorch/pytorch:2.2.0-cuda12.1-cudnn8-runtime

ENV DEBIAN_FRONTEND=noninteractive
RUN apt-get update && apt-get install -y --no-install-recommends \
    git ffmpeg libgl1 libglib2.0-0 wget && rm -rf /var/lib/apt/lists/*

WORKDIR /app
RUN git clone https://github.com/OpenTalker/SadTalker.git . && \
    pip install --no-cache-dir -r requirements.txt && \
    pip install --no-cache-dir fastapi "uvicorn[standard]" python-multipart

# Model weights (~2GB) — SadTalker's own downloader
RUN bash scripts/download_models.sh

COPY server.py /app/server.py
EXPOSE 8080
CMD ["uvicorn", "server:app", "--host", "0.0.0.0", "--port", "8080"]
