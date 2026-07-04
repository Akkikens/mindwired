/** Host registry — the channel's recurring AI presenters, one per content lane.
 *  A plan's "host" field is either a registry id ("orion", "sterling", "rio",
 *  "vex") or a direct image path under public/ (legacy). Faces stay consistent
 *  forever: regenerate poses/angles from sourceImage with lipsync/gemini_host.py
 *  --ref, never from scratch. */
import REGISTRY_JSON from "../hosts.json";

export interface HostDef {
  name: string;
  niche: string;
  /** 4K master under public/ — the lip-sync + render source */
  image: string;
  /** native-res Gemini original — the identity reference for new poses */
  sourceImage: string;
  /** pinned ElevenLabs voice name for this host */
  elevenVoice?: string;
  /** Hume Octave voice/acting description for this host */
  voiceDescription?: string;
  /** Sonic movement intensity (1.0 calm docs, 1.1 energetic pundit) */
  dynamicScale?: number;
}

export const HOST_REGISTRY = REGISTRY_JSON as Record<string, HostDef>;

/** Resolve a plan's host field to an image path under public/. */
export const resolveHostImage = (host: string): string =>
  host.includes("/") ? host : (HOST_REGISTRY[host]?.image ?? host);
