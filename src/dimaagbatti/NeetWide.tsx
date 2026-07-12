/** DimaagBatti — "NEET लीक → Telegram बैन → विरोध" 16:9 long-form (1920×1080).
 *  Whiteboard hand-drawing b-roll (Higgsfield, generic doodles, NO text/symbols)
 *  as backdrop; ALL facts/numbers/quotes/Hindi overlaid crisply in Remotion
 *  (Noto Sans Devanagari). Rohan Hindi narration per beat.
 *
 *  Accuracy rule (HINDI-CHANNEL-BRIEF): the AI never draws a symbol/number/word —
 *  every fact here is a Remotion overlay. Neutral & attributed throughout;
 *  suicides handled sombrely + a Tele-MANAS 14416 helpline card.
 *
 *  Clips → public/shorts/neet16/broll-video/<clip>.mp4 (add ids to AVAILABLE as
 *  they download; scenes without a clip yet render a clean whiteboard bg).
 *  Audio  → public/shorts/neet16/audio/<id>.mp3 (built by scripts/build_neet_vo.py). */
import React from "react";
import {
  AbsoluteFill, Audio, OffthreadVideo, Sequence, interpolate, spring,
  staticFile, useCurrentFrame,
} from "remotion";

const FPS = 30;
const HI = "'Noto Sans Devanagari', sans-serif";
const EN = "'Space Grotesk', sans-serif";
const YELLOW = "#FFC53D";   // DimaagBatti bulb glow
const RED = "#FF4D4D";
const INK = "#141414";
const CREAM = "#F4F1EA";
const CLIP_LEN = 5.04;       // Higgsfield clip length (s)

// Overlay kinds: stat = accurate number/label; quote = verbatim (EN, verifiable);
// help = Tele-MANAS card; sombre = muted, no red/yellow (cost beats); brand = bulb-on.
type Overlay =
  | { kind: "stat"; text: string; color?: string }
  | { kind: "quote"; en: string; who?: string }
  | { kind: "help" }
  | { kind: "brand" }
  | { kind: "none" };

type Scene = {
  id: string; aud: number; cap: string;
  ov?: Overlay; clip?: string; sombre?: boolean;
};

// clip defaults to id; reuse a generic doodle by pointing clip at another id.
const SCENES: Scene[] = [
  { id: "hook",      aud: 5.956, cap: "बीस लाख+ छात्र। एक परीक्षा। एक लीक।", ov: { kind: "stat", text: "20 लाख+ छात्र", color: RED } },
  { id: "exam",      aud: 6.060, cap: "3 मई: NEET-UG परीक्षा", ov: { kind: "stat", text: "NEET-UG 2026 · 3 मई" } },
  { id: "leak",      aud: 5.512, cap: "परीक्षा से पहले सवाल Telegram पर", ov: { kind: "stat", text: "~120 सवाल · Telegram (राजस्थान)", color: RED } },
  { id: "match",     aud: 3.971, cap: "लीक पेपर से मैच — भरोसा टूटा", ov: { kind: "stat", text: "लीक ✓ मैच" } },
  { id: "cancel",    aud: 2.038, cap: "NTA ने परीक्षा रद्द की", ov: { kind: "stat", text: "NTA → परीक्षा रद्द", color: RED } },

  { id: "precedent", aud: 7.889, cap: "2024 में 80+ ने 720/720 पाए", ov: { kind: "stat", text: "2024: 80+ ने 720/720" } },
  { id: "rare",      aud: 4.833, cap: "2016–2024 में सिर्फ़ 7 ने ऐसा किया", ov: { kind: "stat", text: "2016–2024: सिर्फ़ 7", color: RED } },
  { id: "retest",    aud: 3.422, cap: "दोबारा परीक्षा: 21 जून", ov: { kind: "stat", text: "Re-NEET · 21 जून 2026" } },
  { id: "cost1",     aud: 3.239, cap: "इसकी कीमत सिर्फ़ नंबरों में नहीं थी।", ov: { kind: "none" }, sombre: true, clip: "cost2" },
  { id: "cost2",     aud: 4.911, cap: "देशभर में 13 छात्रों की आत्महत्या की ख़बरें।", ov: { kind: "stat", text: "13 छात्र · रिपोर्टेड" }, sombre: true },

  { id: "ban",       aud: 3.161, cap: "फिर एक बड़ा कदम उठाया गया", ov: { kind: "none" }, clip: "cancel" },
  { id: "bandate",   aud: 3.161, cap: "Telegram पर रोक", ov: { kind: "stat", text: "Telegram बैन · 16–22 जून", color: RED } },
  { id: "why1",      aud: 3.317, cap: "आरोप: चीटिंग रैकेट पेपर बेच रहे थे", ov: { kind: "stat", text: "आरोप: पेपर बिक्री" } },
  { id: "why2",      aud: 2.508, cap: "कीमत हज़ारों से लाखों तक", ov: { kind: "stat", text: "₹ हज़ारों–लाखों", color: RED } },
  { id: "why3",      aud: 4.206, cap: "मैसेज एडिट कर बैकडेटेड फ़र्ज़ी लीक", ov: { kind: "stat", text: "बैकडेटेड फ़र्ज़ी लीक" } },

  { id: "temp",      aud: 3.396, cap: "रोक अस्थायी और सिर्फ़ इसी परीक्षा से जुड़ी", ov: { kind: "stat", text: "अस्थायी · exam-specific" }, clip: "bandate" },
  { id: "durov1",    aud: 4.598, cap: "Telegram CEO पावेल दुरोव की प्रतिक्रिया", ov: { kind: "stat", text: "Pavel Durov · CEO, Telegram" } },
  { id: "durov2",    aud: 6.609, cap: "दुरोव के शब्दों में:", ov: { kind: "quote", en: "This punishes 150 million ordinary Telegram users in India — not the insiders who leaked the exam materials", who: "Pavel Durov" } },
  { id: "durov3",    aud: 3.082, cap: "उन्होंने ये भी कहा:", ov: { kind: "quote", en: "the leaks just moved to other apps", who: "Pavel Durov" } },
  { id: "durov4",    aud: 4.127, cap: "Telegram ने सैकड़ों चैनल हटाए", ov: { kind: "stat", text: "सैकड़ों चैनल हटाए · 'edited' लेबल" } },

  { id: "court",     aud: 3.161, cap: "टेलीग्राम ने बैन को हाई कोर्ट में चुनौती दी", ov: { kind: "stat", text: "दिल्ली हाई कोर्ट में चुनौती" } },
  { id: "verdict",   aud: 11.076, cap: "पर कोर्ट ने रोक बरकरार रखी", ov: { kind: "quote", en: "least restrictive and proportionate", who: "Justice Tejas Karia, Delhi HC" }, clip: "bandate" },
  { id: "pivot",     aud: 4.127, cap: "ग़ुस्सा सड़कों तक पहुँचा", ov: { kind: "none" }, clip: "hook" },
  { id: "wang1",     aud: 4.989, cap: "28 जून: सोनम वांगचुक भूख हड़ताल पर", ov: { kind: "stat", text: "सोनम वांगचुक · 28 जून · जंतर-मंतर" } },
  { id: "wang2",     aud: 3.161, cap: "साथ में CJP और छात्र संगठन", ov: { kind: "stat", text: "Cockroach Janta Party (CJP) + छात्र" } },
  { id: "cjporigin", aud: 9.247, cap: "CJP की शुरुआत अभिजीत डिपके ने की", ov: { kind: "stat", text: "CJP · संस्थापक: अभिजीत डिपके · मई 2026" } },
  { id: "wang3",     aud: 3.396, cap: "माँग: शिक्षा मंत्री का इस्तीफ़ा", ov: { kind: "stat", text: "माँग: धर्मेंद्र प्रधान का इस्तीफ़ा" } },
  { id: "broader",   aud: 7.471, cap: "माँग सिर्फ़ वांगचुक की नहीं थी", ov: { kind: "stat", text: "इस्तीफ़े की माँग: कांग्रेस · विपक्ष · 73 पूर्व अफसर" }, clip: "hook" },

  { id: "wang4",     aud: 2.847, cap: "और लद्दाख के लिए छठी अनुसूची", ov: { kind: "stat", text: "+ लद्दाख: छठी अनुसूची" } },
  { id: "wang5",     aud: 3.657, cap: "वांगचुक के शब्दों में", ov: { kind: "quote", en: "six weeks or death", who: "Sonam Wangchuk" } },
  { id: "cjp",       aud: 5.407, cap: "CJP: पीड़ित परिवारों को ₹1 करोड़ मुआवज़ा", ov: { kind: "stat", text: "CJP माँग: ₹1 करोड़ मुआवज़ा" } },
  { id: "follower",  aud: 6.426, cap: "आंदोलन तेज़ी से बढ़ा", ov: { kind: "stat", text: "CJP Instagram: 2 करोड़+ फॉलोअर्स" }, clip: "cjporigin" },
  { id: "appeal",    aud: 8.359, cap: "युवाओं से साथ आने की अपील", ov: { kind: "stat", text: "अपील: युवा साथ आएं · माँग: प्रधान का इस्तीफ़ा" }, clip: "wang1" },
  { id: "standup",   aud: 6.531, cap: "ये सवाल आपके भी हैं — आप क्या सोचते हैं?", ov: { kind: "none" }, clip: "hook" },
  { id: "neutral",   aud: 6.295, cap: "DimaagBatti आरोप नहीं लगाता — सिर्फ़ रिपोर्ट।", ov: { kind: "stat", text: "रिपोर्ट · निष्पक्ष" }, clip: "match" },
  { id: "results",   aud: 7.157, cap: "री-नीट हुई; नतीजे जल्द आएंगे", ov: { kind: "stat", text: "Re-NEET 21 जून · नतीजे ~20 जुलाई" }, clip: "exam" },
  { id: "recap",     aud: 4.911, cap: "लीक → बैन → हड़ताल", ov: { kind: "stat", text: "लीक  →  बैन  →  हड़ताल" }, clip: "leak" },

  { id: "help1",     aud: 5.329, cap: "तनाव या निराशा से जूझ रहे हैं? अकेले मत जूझिए।", ov: { kind: "none" }, sombre: true, clip: "cost2" },
  { id: "help2",     aud: 5.407, cap: "मानसिक स्वास्थ्य हेल्पलाइन — Tele-MANAS", ov: { kind: "help" }, sombre: true, clip: "cost2" },
  { id: "batti",     aud: 3.161, cap: "समझे? यही है दिमाग़ की बत्ती जलना।", ov: { kind: "brand" }, clip: "hook" },
  { id: "cta",       aud: 4.049, cap: "हर मुद्दा, आसान भाषा में। Subscribe 💡", ov: { kind: "brand" }, clip: "hook" },
];

// clip ids downloaded so far — a scene whose clip isn't here renders a clean
// whiteboard bg (so chunks render before all footage lands). Add as you download.
const AVAILABLE = new Set<string>([
  "hook", "exam", "leak", "match", "cancel", "bandate",
  "precedent", "rare", "retest", "cost2", "why1", "why2", "why3",
  "durov1", "durov2", "court", "wang1", "cjp", "cjporigin",
]);

const LEAD = 8, HOLD = 22; // frames
const sceneFrames = (s: Scene) => LEAD + Math.round(s.aud * FPS) + HOLD;
export const neetTotalFrames = () => SCENES.reduce((a, s) => a + sceneFrames(s), 0);

const clipPath = (id: string) => staticFile(`shorts/neet16/broll-video/${id}.mp4`);
const audioPath = (id: string) => staticFile(`shorts/neet16/audio/${id}.mp3`);
const clipId = (s: Scene) => s.clip ?? s.id;

const Brand: React.FC<{ dark?: boolean }> = ({ dark }) => (
  <div style={{ position: "absolute", top: 40, right: 52, display: "flex", alignItems: "center", gap: 10 }}>
    <span style={{ fontSize: 34 }}>💡</span>
    <span style={{ fontFamily: EN, fontWeight: 700, fontSize: 30, color: dark ? "#fff" : INK, letterSpacing: 0.5 }}>DimaagBatti</span>
  </div>
);

const StatCard: React.FC<{ s: Scene; ov: Extract<Overlay, { kind: "stat" }> }> = ({ s, ov }) => {
  const frame = useCurrentFrame();
  const appear = LEAD + Math.round(s.aud * 0.42 * FPS);
  const sp = spring({ frame: frame - appear, fps: FPS, config: { damping: 12, stiffness: 130 } });
  return (
    <div style={{
      position: "absolute", top: 150, left: 0, right: 0, textAlign: "center",
      transform: `scale(${interpolate(sp, [0, 1], [0.72, 1])})`,
      opacity: interpolate(frame - appear, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
    }}>
      <span style={{
        fontFamily: HI, fontWeight: 800, fontSize: 84, color: ov.color ?? INK,
        background: "#FFFFFFe6", padding: "14px 38px", borderRadius: 20,
        boxShadow: "0 10px 34px rgba(0,0,0,0.18)", lineHeight: 1.3,
      }}>{ov.text}</span>
    </div>
  );
};

const QuoteCard: React.FC<{ s: Scene; ov: Extract<Overlay, { kind: "quote" }> }> = ({ s, ov }) => {
  const frame = useCurrentFrame();
  const appear = LEAD + Math.round(s.aud * 0.20 * FPS);
  const op = interpolate(frame - appear, [0, 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const y = interpolate(frame - appear, [0, 12], [30, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", top: 190, left: 220, right: 220, opacity: op, transform: `translateY(${y}px)` }}>
      <div style={{
        background: INK, color: "#fff", fontFamily: EN, fontWeight: 500, fontSize: 46,
        lineHeight: 1.45, textAlign: "left", padding: "34px 44px", borderRadius: 22,
        borderLeft: `8px solid ${YELLOW}`, boxShadow: "0 14px 40px rgba(0,0,0,0.3)",
      }}>
        <span style={{ color: YELLOW, fontSize: 64, lineHeight: 0.2, verticalAlign: "-18px" }}>“</span>
        {ov.en}
        {ov.who && <div style={{ marginTop: 18, fontSize: 30, color: YELLOW, fontWeight: 700 }}>— {ov.who}</div>}
      </div>
    </div>
  );
};

const HelpCard: React.FC<{ s: Scene }> = ({ s }) => {
  const frame = useCurrentFrame();
  const appear = LEAD + Math.round(s.aud * 0.30 * FPS);
  const sp = spring({ frame: frame - appear, fps: FPS, config: { damping: 14 } });
  return (
    <div style={{
      position: "absolute", top: 150, left: 0, right: 0, textAlign: "center",
      opacity: interpolate(frame - appear, [0, 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
      transform: `scale(${interpolate(sp, [0, 1], [0.85, 1])})`,
    }}>
      <div style={{
        display: "inline-block", background: "#123", color: "#fff", borderRadius: 26,
        padding: "34px 60px", boxShadow: "0 14px 40px rgba(0,0,0,0.35)", border: `3px solid ${YELLOW}`,
      }}>
        <div style={{ fontFamily: HI, fontWeight: 700, fontSize: 40, color: "#cfe8ff" }}>मानसिक स्वास्थ्य हेल्पलाइन</div>
        <div style={{ fontFamily: EN, fontWeight: 800, fontSize: 96, letterSpacing: 2, marginTop: 8 }}>
          <span style={{ color: YELLOW }}>❤</span> Tele-MANAS · 14416
        </div>
        <div style={{ fontFamily: HI, fontSize: 30, color: "#9fc", marginTop: 6 }}>भारत सरकार · 24×7 · निःशुल्क</div>
      </div>
    </div>
  );
};

const BrandBurst: React.FC<{ s: Scene }> = ({ s }) => {
  const frame = useCurrentFrame();
  const appear = LEAD + Math.round(s.aud * 0.25 * FPS);
  const sp = spring({ frame: frame - appear, fps: FPS, config: { damping: 10, stiffness: 120 } });
  const glow = interpolate(sp, [0, 1], [0, 1]);
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", pointerEvents: "none" }}>
      <div style={{
        position: "absolute", width: 900, height: 900, borderRadius: "50%",
        background: `radial-gradient(circle, ${YELLOW}${Math.round(glow * 90).toString(16).padStart(2, "0")} 0%, transparent 62%)`,
      }} />
      <div style={{ transform: `scale(${interpolate(sp, [0, 1], [0.6, 1])})`, textAlign: "center" }}>
        <div style={{ fontSize: 150 }}>💡</div>
        <div style={{ fontFamily: EN, fontWeight: 800, fontSize: 76, color: INK }}>DimaagBatti</div>
      </div>
    </AbsoluteFill>
  );
};

const SceneView: React.FC<{ s: Scene }> = ({ s }) => {
  const frame = useCurrentFrame();
  const dur = sceneFrames(s);
  const clipSpan = dur / FPS;
  const rate = Math.max(0.5, Math.min(1.8, CLIP_LEN / clipSpan));
  const capIn = spring({ frame: frame - LEAD, fps: FPS, config: { damping: 16 } });
  const fadeOut = interpolate(frame, [dur - 10, dur], [1, 0], { extrapolateLeft: "clamp" });
  const hasClip = AVAILABLE.has(clipId(s));
  const ov = s.ov ?? { kind: "none" };
  const dark = ov.kind === "quote";

  return (
    <AbsoluteFill style={{ backgroundColor: s.sombre ? "#EAE7DF" : CREAM, opacity: fadeOut }}>
      {hasClip && (
        <AbsoluteFill style={{ opacity: s.sombre ? 0.5 : 1 }}>
          <OffthreadVideo src={clipPath(clipId(s))} muted playbackRate={rate}
            style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </AbsoluteFill>
      )}
      {/* brand bulb vignette — suppressed on sombre beats */}
      {!s.sombre && (
        <AbsoluteFill style={{ background: `radial-gradient(60% 50% at 50% 40%, ${YELLOW}22 0%, transparent 60%)`, mixBlendMode: "multiply", pointerEvents: "none" }} />
      )}

      {ov.kind === "stat" && <StatCard s={s} ov={ov} />}
      {ov.kind === "quote" && <QuoteCard s={s} ov={ov} />}
      {ov.kind === "help" && <HelpCard s={s} />}
      {ov.kind === "brand" && <BrandBurst s={s} />}

      <Brand dark={dark} />

      {/* Hindi caption plate (bottom) */}
      <div style={{
        position: "absolute", bottom: 90, left: 200, right: 200,
        transform: `translateY(${interpolate(capIn, [0, 1], [40, 0])}px)`, opacity: capIn,
      }}>
        <div style={{
          background: s.sombre ? "#2a2a2a" : INK, color: "#fff", fontFamily: HI, fontWeight: 700,
          fontSize: 46, lineHeight: 1.4, textAlign: "center", padding: "20px 40px", borderRadius: 20,
          boxShadow: "0 12px 36px rgba(0,0,0,0.28)",
          borderBottom: `6px solid ${s.sombre ? "#6b6b6b" : YELLOW}`,
        }}>{s.cap}</div>
      </div>

      <Sequence from={LEAD}><Audio src={audioPath(s.id)} /></Sequence>
    </AbsoluteFill>
  );
};

export const NeetWide: React.FC = () => {
  let cursor = 0;
  return (
    <AbsoluteFill style={{ backgroundColor: CREAM }}>
      {SCENES.map((s) => {
        const from = cursor; const dur = sceneFrames(s); cursor += dur;
        return (
          <Sequence key={s.id} from={from} durationInFrames={dur} name={s.id}>
            <SceneView s={s} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
