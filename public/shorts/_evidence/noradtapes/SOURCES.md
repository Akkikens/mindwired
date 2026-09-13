# Evidence — noradtapes (Black Box Breakdown)

Fetched 2026-09-12. Every file below is a US government recording released under FOIA
and mirrored by the National Security Archive. Licence on the archive.org items:
**Public Domain Mark 1.0**; the underlying basis is that these are works of the US
government (NORAD / USNORTHCOM / NEADS).

> ⚠ **One human confirmation owed before this audio carries the cold open.** The PD mark
> on archive.org is uploader-asserted. The substantive basis (US-government work,
> FOIA-released via governmentattic.org) is sound, but confirm it the same way the NASA
> eClips check was owed on biosphere2 — two minutes, once, before ship.

## Source item

**`NORAD-USNORTHCOM_09_11_01_Tapes_governmentattic.org_Released_Apr_9_2008`**
https://archive.org/details/NORAD-USNORTHCOM_09_11_01_Tapes_governmentattic.org_Released_Apr_9_2008
Collections: `nsia-911`, `nationalsecurityarchive`, `usgovernmentmirrors`,
`government-documents`. Licence: http://creativecommons.org/publicdomain/mark/1.0/
Full item: 21 MP3 channel recordings + the FOIA release letter.

Related item, not yet downloaded: **`RDOD_NEADS_AUDIO`** (3.7 GB ZIP, same collections,
same PD mark) — a second copy/cut of the NEADS audio.

## Downloaded (public/shorts/_evidence/noradtapes/)

| File | Position | Duration | Size |
|---|---|---|---|
| `audio/DRM1_DAT2_Channel_2_MCC_Op.mp3` | Mission Crew Commander (officer position) | 6h 35m | 138 MB |
| `audio/DRM1_DAT2_Channel_3_MCC_TK.mp3` | Mission Crew Commander — Technician | 6h 40m | 192 MB |
| `audio/DRM1_DAT2_Channel_4_ID_Op.mp3` | Identification section — officer position | 6h 26m | 185 MB |
| `audio/DRM1_DAT2_Channel_9_TT_Op.mp3` | Tracking/weapons-director position | 6h 40m | 192 MB |
| `audio/DRM1_DAT2_Channel_19_SD2_OP.mp3` | Senior Director 2 (second SD console) | 4h 39m | 125 MB |
| `audio/DRM1_DAT2_Channel_24_AICC.mp3` | air-intercept radio net (do not expand the acronym) | 1h 55m | 52 MB |
| `NORAD-USNORTHCOM_9-11_Tapes_FOIA.pdf` | FOIA release letter — on-screen exhibit | — | 120 KB |

~32 hours of audio on disk. Verified 2026-09-12: real content, 8 kHz mono MP3 (radio /
telephony bandwidth), loud at sampled offsets — not silence, not a corrupt download.

**The 2008 release is PARTIAL:** channels 1, 6, 22 and 23 were never released, and only
one DRM2 file and one DRM3 file are in it — essentially DRM1/DAT2 plus two strays. Per
the Commission (Ch.1 note 120) there are **no recordings at all** of the senior weapons
director and weapons director technician who controlled the Otis scramble. Also note the
Dictaphone-recovered "Freedom files" carry a documented **20-minute clock error**.

Remaining channels in the item, not pulled (mostly duplicate TT/ID/SD positions):
5_ID_TK, 7_ID2_OP, 8_ID2_TK, 10/14/18_TT_TK, 11_ACWO_OP, 12_ACWO_TK, 13/17/21_TT_Op,
15_AST_Op, 16_AST_TK, 20_SD2_TK, 24_Emerg-AICC. Pull on demand — the download script is
`scratchpad/dl_norad.sh` in this session's scratchpad.

## ⛔ TRAP — do not use, despite where it lives

The same archive.org collections (`nsia-911`, filed under `government-documents`) contain
**network broadcast dubs**: CNN, ABC, CBS, NBC, FOX, HBO *In Memoriam*, PBS, History
Channel, NOVA. Those are copyrighted and Content-ID fingerprinted. Being mirrored inside
a government-documents collection changes nothing. CLAUDE.md's ban on news-broadcast
footage applies in full. Take the audio and the primary documents; never the broadcasts.

## Honesty labels (Evidence Engine rule)

Audio from these files is **"ACTUAL NORAD/NEADS RECORDING"** — it is real docket audio.
Anything voiced by Cartesia is **"RECREATION"**, labeled on screen. No victim audio, no
Flight 93 CVR (never publicly released), no phone-call audio from victims.

## Footage probe (2026-09-12)

`scripts/fetch_footage.py "air traffic control center 2001 FAA radar operations"
--niche briefing --kind video` returned **1 usable file** (`atc_1.mp4`, NASA/PD, 20s,
modern UTM b-roll — weak), with the vision check correctly rejecting five wrong-subject
NASA clips. Notably it also rejected an archive.org item titled **"AIR SOVEREIGNTY ALERT
OPERATIONS"** as a mismatch *for the ATC query* — that item is worth a second look on its
own terms, since air-sovereignty alert operations is exactly this episode's subject.
The first-30s real-motion requirement is **not yet satisfied**; the archival scout's
report decides whether it can be, or whether the honest fallback is the tape itself
visualised (the 17.1M-view outlier on this subject is audio plus a clock).
