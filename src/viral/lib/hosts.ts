/** Host registry — the channel's recurring AI presenters, one per content lane.
 *  A plan's "host" field is either a registry id ("orion", "sterling", "rio",
 *  "vex") or a direct image path under public/ (legacy). Faces stay consistent
 *  forever: regenerate poses/angles from sourceImage with lipsync/gemini_host.py
 *  --ref, never from scratch. */
import REGISTRY_JSON from "../hosts.json";

export interface HostDef {
  name: string;
  niche: string;
  /** 4K master under public/, native 9:16 — the vertical Shorts render source */
  image: string;
  /** native-res Gemini original (9:16) — the identity reference for new poses */
  sourceImage: string;
  /** 4K master under public/, native 16:9 — the long-form render source.
   *  Falls back to `image` (pillarboxed) for hosts without a landscape shoot yet. */
  imageWide?: string;
  /** native-res Gemini original (16:9) — the identity reference for wide poses */
  sourceImageWide?: string;
  /** pinned ElevenLabs voice name for this host */
  elevenVoice?: string;
  /** Hume Octave voice/acting description for this host */
  voiceDescription?: string;
  /** Sonic movement intensity (1.0 calm docs, 1.1 energetic pundit) */
  dynamicScale?: number;
}

export const HOST_REGISTRY = REGISTRY_JSON as Record<string, HostDef>;

/** Resolve a plan's host field to an image path under public/.
 *  `wide` picks the native-16:9 master when the host has shot one — a portrait
 *  host pillarboxed into a landscape frame crops the mouth off, so a real
 *  landscape asset is the correct fix, not a fallback. */
export const resolveHostImage = (host: string, wide = false): string => {
  if (host.includes("/")) return host;
  const def = HOST_REGISTRY[host];
  if (!def) return host;
  return (wide && def.imageWide) || def.image;
};
