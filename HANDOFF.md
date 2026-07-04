# HANDOFF — paste this into a new Claude Code session (opened in mindwired repo)

Read CLAUDE.md first (the production manual), then continue from this state.

## Who/what
Akshay runs **Mindwired** (@mindwiredd on YT, display name "Mindwired") — a faceless
space/science channel. Two repos: **mindwired** (shorts engine `src/viral`, publishing
docs, lipsync kit) and **../singaloo** (cosmic 3D long-form engine `src/videos/cosmic`).
Both pushed to private GitHub (Akkikens/mindwired, Akkikens/singaloo). Persistent
memory also exists (auto-memory dir) — check MEMORY.md.

## DONE (don't redo)
- **13 long-forms rendered** (12 batch + apollo11 62min), 16:9, in mindwired repo root
  + out/. Upload kit: YOUTUBE-UPLOAD-KIT.md (titles/descriptions/15 hashtags/tags,
  🛑 draft-only until GPT thumbnails). Chapters: YOUTUBE-CHAPTERS.md. Subtitles:
  singaloo/subtitles/ (en for all; hi/es/pt/id done for scariestplaces + unsettlingaliens;
  remaining translations queued — priority apollo11, spacetheories).
- **6 kinetic shorts rendered** (out/mindwired_short_*.mp4) incl. host-mode neutronstar.
- **Code-review done**: 10 fixes committed both repos (wormhole z-sign, Motes uniforms,
  pads.json single source of truth, stale-audio guards, George voice pinned, word-sync).
- **Growth skills** in .claude/skills/: ctr-engine, hook-doctor, shorts-funnel.
- **PROMPT-SLEEP-2HR.md**: ready prompt for a 2-hr sleep video (run on his AMD PC clone).
- TTS chain: Hume "Nature Documentary Narrator" (voice_id 176a55b1, speed 0.95) →
  Cartesia → ElevenLabs George. Keys in .env (never commit). build_topic_multi.py.

## IN FLIGHT — the avatar host pipeline (continue HERE)
Goal: lip-synced talking-host Shorts. Progress:
1. Replicate token in .env, valid (account akkikens, $10 credit loaded, some spent).
2. SadTalker (cjwbw/sadtalker) tested → user said output "very bad, blurred, unreal".
3. Switched to **zf-kbot/sonic** (version c6d80220ce71d8df04d5dbf2b189b70b9f4937aea6a030de12cb46951b24d134)
   with keep_resolution=True → much sharper. Flux 1.1 Pro host image still "looks AI" per user.
4. **GEMINI_API_KEY added to .env** → generated a more natural host image with
   `gemini-2.5-flash-image` (google-genai SDK, venv: .venv-lipsync) →
   **public/host/orion_gemini.png** (candid, mixed lighting, less AI-looking).
5. Last completed action: Sonic lip-sync test of orion_gemini.png + neutronstar hook
   audio → **lipsync/out/hook_gemini_sonic.mp4** (1024x1024, 3.5s). Frame extracted and
   it looked good; USER HAS NOT YET GIVEN A VERDICT on this version.

## NEXT STEPS (in order)
1. Ask Akshay if lipsync/out/hook_gemini_sonic.mp4 passes (open it for him). If yes:
2. Update lipsync/replicate_client.py to default to Sonic (currently SadTalker) and
   set orion_gemini.png as the canonical host (plan field "host" in
   src/viral/plans/neutronstar.json currently points to host/orion.png — update).
3. Batch lip-sync all 7 neutronstar scene clips (public/shorts/neutronstar/audio/*.mp3)
   via Sonic, stitch (lipsync/batch.py pattern), and/or composite the talking clips into
   the Remotion HostLayer (src/viral/ShortEngine.tsx — swap <Img> for <OffthreadVideo>)
   so kinetic captions/progress bar overlay the talking host. Render ShortNeutronStar.
4. Commit + push. Keep host image consistent forever (recognizable face).
5. Standing asks: post 1 short/day + pinned funnel comments (SHORTS-SCRIPTS.md has 5
   avatar scripts); GPT thumbnails still pending (THUMBNAILS.md Workflow C = 2027
   editorial style); remaining subtitle translations; sleep 2-hr video on his PC.

## Key rules (from painful lessons)
- Honest, no hype: no "guaranteed viral" promises; user's real bottleneck is CTR +
  cold start (see .claude/skills). <50 views = normal pre-threshold.
- Never commit .env/media (gitignored: mp4/mp3/wav, .venv-lipsync, lipsync/out).
- Long-form convention: 0-10s teaser over content visuals → wordmark intro → title.
  Shorts: no logo. Pacing pads: singaloo pads.json (single source of truth).
- Verify renders with ffprobe + extracted frames before declaring done.
- WebGL renders need --gl=angle; viral shorts don't.
- User model-switches often (budget); background renders cost no tokens — use them.
