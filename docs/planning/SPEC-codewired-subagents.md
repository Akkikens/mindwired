# SPEC — codewired #1: "Claude Code Subagents, Visualized"

**Channel:** codewired (NEW — channel #6, dev education). Handle target `@codewired`.
**Icahn basis:** clones Developers Digest "Claude Code NEW Sub Agents in 7 Minutes"
(262K views / 64K subs = 4:1) — see memory `icahn-claude-code-niche`.
**Differentiation:** nobody in the niche has cinematic R3F animation. We are the
3blue1brown of AI agents. Screen recordings appear only as textures inside 3D scenes.
**Channel thesis (Akshay, 2026-07-16):** coding itself is commoditized by AI — codewired
teaches BUILDING THE MACHINERY: Claude Code skills, plugins, hooks, subagents, MCP, and
ultimately building your own Claude Code on the Agent SDK. Curriculum arc:
1. Subagents Visualized (this spec) → 2. build a skill → 3. plugins/hooks/slash commands
→ 4. MCP explained → 5. FLAGSHIP "I Built My Own Claude Code From Scratch" (Agent SDK)
→ ongoing "I built an agent that does X" stories (incl. "I run 6 YouTube channels with
AI agents"). Packaging rule: never title with "harness/SDK" vocabulary (Icahn: unproven);
use "I built…", skills/plugins/subagents terms.
**Target length:** ~7 min. **Narrator:** cloned Cartesia channel voice (00d3c951…) for
v1 (new-brand voice decision can come later; don't block on it).
**Blocking before render:** channel branding (accent color, wordmark, outro) — needs
Akshay sign-off; NO outro exists yet for codewired (HARD RULE: don't generate one
without explicit approval — flag to Akshay that channel #6 needs its one-time outro).

## Working title (A/B in metadata file later)
- A: **Claude Code Subagents, Finally Explained (animated)**
- B: Your AI Agent Can Clone Itself — Almost Nobody Uses This

## Hook (0:00–0:15, hook-doctor structure)

| # | Narration (spoken form, TTS-lint safe) | Scene |
|---|---|---|
| h1 | "Right now, the AI agent in your terminal can clone itself sixteen times, put every clone on a different job, and merge the results — while you get coffee." | `agentcore` → burst-spawn 16 orbiting cores, camera pull-back |
| h2 | "Most developers using it every single day have no idea. And the ones who found it keep making one mistake that makes it worse than useless — that mistake is the last thing I'll show you." | clones flare red on "mistake" — loop OPENED, closes at c22 |
| h3 | *(wordmark)* "This is codewired." | `intro` — wordmark bloom, 2s max |
| h4 | "Subagents: what they actually are, when they make you faster, and when they quietly destroy your work." | `title` card |

Loop opened: "the mistake that makes subagents worse than useless" → paid off at c22
(context-blind fan-out / merge conflicts). Honest: the payoff is real and specific.

## Body (scene-by-scene; one idea per line; re-hook every ~45s)

**Chapter 1 — The problem (why one agent isn't enough)**
- c1: A single agent has one context window. Scene `contextring`: a glowing ring
  around the core, filling up as file-fragments fly in.
- c2: Every file it reads, every command it runs, fills that ring. Ring visibly fills,
  color shifts toward amber.
- c3: When it fills, the agent starts forgetting — your instructions from ten minutes
  ago literally fall out. Fragments crumble off the ring's tail. (TRUE + visceral.)
- c4: Re-hook: "So Anthropic gave it a strange ability: delegation."

**Chapter 2 — What a subagent actually is**
- c5: Word card `SUBAGENT`. Core spawns ONE child core with its own fresh ring.
- c6: A subagent is a second, fresh Claude with its own empty context window, given
  one job by the first.
- c7: It goes away, does the work — reads twenty files, runs the tests — and returns
  ONLY the conclusion. Visual: child's ring fills; a single distilled light-mote
  travels back to parent.
- c8: The parent's window stays clean. That's the entire trick — and it's why
  subagents aren't about speed first. They're about MEMORY. (counter-intuitive beat)
- c9: Terminal-texture scene: real `/agents` UI floating as a panel in 3D space —
  "here's what it looks like for real."

**Chapter 3 — The anatomy (harness concepts smuggled in)**
- c10: Each subagent is just a markdown file: a name, a description, the tools it's
  allowed to touch. Scene: file panel unfolds into the child core like a blueprint.
- c11: Tools = the agent's hands. Scene `toolflight`: Read/Edit/Bash glyphs orbiting.
- c12: Permissions = which hands each clone is allowed to use. A reviewer agent gets
  read-only — glyphs for Edit/Bash lock and grey out.
- c13: Re-hook: "And this is where people start building teams."

**Chapter 4 — Parallel fan-out (the money demo)**
- c14: Scene `teamorbit`: 4 named cores (researcher / coder / reviewer / tester)
  orbiting the parent, each with its own ring and tool glyphs.
- c15: Real use case narrated over the orbit: refactor sweep across a codebase —
  one clone per module.
- c16: They run at the same time. What took an afternoon takes minutes. Time-lapse
  visual: rings filling in parallel, motes streaming back.
- c17: Honest cost beat: every clone burns tokens. Sixteen clones ≈ sixteen times the
  spend. Use them where parallelism pays, not for a one-line fix. (Trust-builder.)

**Chapter 5 — The mistake (loop payoff)**
- c18: "Here's the mistake." Red flare recall of h2.
- c19: Subagents are BLIND to each other. Two clones editing the same file =
  collision. Scene: two clones' edit-beams hit one file panel, it shatters/conflicts.
- c20: And they're blind to your conversation — a clone knows only the one prompt it
  was handed. Vague prompt in → garbage mote back, parent merges garbage.
- c21: Rule: fan out on ISOLATED work with SELF-CONTAINED instructions; keep shared
  state in one pair of hands. (The actual lesson, stated plainly.)
- c22: "That's the whole difference between developers who ship a week of work in a
  day, and the ones who let sixteen clones wreck main." Loop CLOSED.

**Outro + bridge**
- c23: Recap in one breath over a slow orbit of the full team scene.
- c24: Verbal bridge (CLAUDE.md rule): "If clones sharing one brain surprised you,
  wait until you see what MCP actually does — that's the next video." (video #4 in
  the shortlist = MCP explainer; keeps the promise honest.)
- c25: codewired subscribe outro — **asset TBD, needs Akshay decision.**

## R3F scene vocabulary (build once, reuse channel-wide — Cosmos3D pattern)
`agentcore` (icosahedron core, emissive pulse) · `contextring` (fillable ring, the
channel's signature metaphor) · `spawn` (burst-clone) · `toolflight` (orbiting tool
glyphs, lockable) · `teamorbit` (named multi-core) · `merge` (motes returning) ·
`collision` (shatter) · `terminalpanel` (real UI as texture in 3D) · `word` (chapter
cards). New comp family `src/codewired/`; render with `--gl=angle`.

## Shorts funnel (drip 24h apart post-launch, per algorithm playbook)
1. "Your AI agent can clone itself" (h1 + spawn scene, 45s)
2. "Why your AI forgets your instructions" (contextring fill/crumble, c1–c3)
3. "The subagent mistake everyone makes" (c19–c21)

## Pre-production checklist
- [ ] Akshay: confirm channel name **codewired** + accent color + wordmark
- [ ] Akshay: codewired subscribe outro (one-time asset — needs explicit go-ahead)
- [ ] Fact-check pass against current Claude Code docs before TTS (concurrency cap,
  /agents flow, markdown agent format) — fact-check-before-TTS pattern
- [ ] `lint_tts_text.py` on all narration lines
- [ ] 2–3 stills per new scene before any full render; ONE full render at the end
- [ ] METADATA-codewired-subagents.md (full-SEO package) at packaging time
