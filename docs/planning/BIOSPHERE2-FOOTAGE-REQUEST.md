# Footage request — University of Arizona / Biosphere 2

**Status: DRAFTED 2026-09-03, NOT SENT.** Akshay to send. This is the one action
that would lift the episode's cold open from standard-definition archival to real
4K, and it is the only outstanding blocker on `biosphere2`.

**Send to:** John Adams, Deputy Director & COO, Biosphere 2 (the facility's named
media contact) — via the Biosphere 2 / UA Research communications office.
CC the UA Research communications team if a general press address is listed.

**Why this is a reasonable ask, and likely to land:** UA owns and operates the
facility, it is open to the public daily (~100,000 visitors/year), the research
office publishes a steady stream of press releases about LEO, the coral
reintroduction and SAM, and they hosted a ~50-person MrBeast production in
January 2026. A documentary b-roll request is ordinary business for them, and
most university facilities already keep a b-roll reel on hand.

---

## Draft email

**Subject:** B-roll request — documentary on the Biosphere 2 oxygen decline

Hello,

I make documentary videos about science and engineering history, and I'm
currently finishing a long-form piece on Biosphere 2 — specifically the oxygen
decline during Mission 1 and the Severinghaus and Broecker work that traced the
missing oxygen to soil respiration and concrete carbonation.

It's a serious treatment. The script is built on the primary literature rather
than the popular retellings: Dempster's engineering papers in *Ecological
Engineering* and *Advances in Space Research*, Severinghaus et al. in *Eos*,
Silverstone and Nelson on food and nutrition, Walford's PNAS and *J Gerontol*
papers, Wetterer on the ant displacement, and Cohen and Tilman in *Science* —
including the passage where they compare a retooled Biosphere 2 to the repaired
Hubble. The episode's closing section is about what the facility does now: LEO,
the cyanobacteria colonising the basalt slopes, the corals that went back into
the ocean in February, and SAM.

My problem is visual. The only footage of Biosphere 2 available under a free
licence is standard definition — the NASA eClips "Launchpad" piece on archive.org
and a 2001 Wikimedia clip. Both are 720-line, and my episodes are finished in 4K.

I'd like to ask whether you have, or would grant permission for:

1. **Existing b-roll** of the structure — the space frame and glazing, the West or
   South Lung, the biomes, the technosphere — that could be licensed or provided
   for documentary use, with on-screen credit to the University of Arizona and
   Biosphere 2.
2. Failing that, **permission to film** during a normal public visit with a
   camera, for documentary rather than commercial-advertising use.

I'm happy to work to whatever credit, review or attribution terms you'd want, and
to share the finished piece before publication.

Thank you for your time,
Akshay

---

## What to do with the answer

- **Footage granted →** replace the archival-window clips in
  `public/shorts/biosphere2/video/` with the 4K material, drop the window
  treatment for those beats, and re-run `audit_scene_relevance.py biosphere2`.
  Nothing in the script changes.
- **Declined or slow →** ship as-is. The cold open already passes on real
  public-domain motion of the real building in a deliberate archival window; this
  request is an upgrade path, not a dependency.
