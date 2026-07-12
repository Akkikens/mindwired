/** DimaagBatti — "दूसरा विश्वयुद्ध कैसे शुरू हुआ?" (16:9, 1920×1080).
 *  Nitish-Rajput-style causal deep-dive: Gemini period illustrations + maps
 *  (public/shorts/ww2/images/*.png) with Ken-Burns motion, crisp Devanagari
 *  overlays (facts/dates/quotes — AI never draws text), chapter title cards,
 *  and Rohan Hindi narration per beat (public/shorts/ww2/audio/*.mp3).
 *
 *  VO built by scripts/build_ww2_vo.py. Add image ids to AVAILABLE as generated;
 *  a beat with no image renders on the dark base (so chapters render early). */
import React from "react";
import {
  AbsoluteFill, Audio, Img, Sequence, interpolate, spring,
  staticFile, useCurrentFrame,
} from "remotion";
import "../lib/fonts";

const FPS = 30;
const HI = "'Noto Sans Devanagari', sans-serif";
const EN = "'Space Grotesk', sans-serif";
const YELLOW = "#FFC53D";
const RED = "#FF4D4D";
const BASE = "#0E1116";

// kind: illus = image + caption; chapter = full-screen title card; (stat via `stat`)
type Scene = {
  id: string; aud: number; cap?: string;
  img?: string; stat?: string; statColor?: string;
  chapter?: string; pan?: 1 | -1;
};

const SCENES: Scene[] = [
  { id: "hook1", aud: 4.989, img: "warhook", stat: "6–8 करोड़ मौतें", statColor: RED, cap: "इतिहास का सबसे ख़ूनी युद्ध।", pan: 1 },
  { id: "hook2", aud: 4.545, img: "warhook", cap: "पर ये युद्ध शुरू कैसे हुआ?", pan: -1 },
  { id: "hook3", aud: 3.866, img: "treaty", cap: "इसकी नींव 20 साल पहले पड़ी थी।", pan: 1 },

  { id: "c2_t",  aud: 2.847, chapter: "अध्याय 1\nवर्साय की संधि" },
  { id: "v1", aud: 4.206, img: "warhook", stat: "प्रथम विश्वयुद्ध · 1918", cap: "जर्मनी युद्ध हार चुका था।", pan: -1 },
  { id: "v2", aud: 4.362, img: "treaty", stat: "वर्साय की संधि · 1919", cap: "विजेताओं ने शर्तें तय कीं।", pan: 1 },
  { id: "v3", aud: 3.239, img: "treaty", cap: "पूरे युद्ध का दोष अकेले जर्मनी पर।", pan: -1 },
  { id: "v4", aud: 4.049, img: "reparations", stat: "भारी हर्जाना (reparations)", statColor: RED, cap: "जर्मनी पर कर्ज़ का पहाड़।", pan: 1 },
  { id: "v5", aud: 5.016, img: "armylimit", stat: "सेना पर सख़्त पाबंदी", cap: "टैंक, पनडुब्बी, वायुसेना पर रोक।", pan: -1 },
  { id: "v6", aud: 3.082, img: "mapshrink", stat: "इलाक़ा और उपनिवेश छिने", cap: "जर्मनी का नक्शा सिकुड़ गया।", pan: 1 },
  { id: "v7", aud: 3.892, img: "angrycrowd", cap: "लोगों के लिए ये हार नहीं — अपमान था।", pan: -1 },
  { id: "v8", aud: 3.788, img: "angrycrowd", cap: "इसी गुस्से ने एक ख़तरनाक चिंगारी को हवा दी।", pan: 1 },

  // ── CH2 · आर्थिक तबाही ──
  { id: "c3_t", aud: 2.612, chapter: "अध्याय 2\nआर्थिक तबाही" },
  { id: "e1", aud: 3.396, img: "hyperinflation", cap: "हर्जाने ने अर्थव्यवस्था तोड़ दी।", pan: 1 },
  { id: "e2", aud: 3.553, img: "hyperinflation", stat: "महँगाई · 1923", statColor: RED, cap: "पैसा कागज़ बन गया।", pan: -1 },
  { id: "e3", aud: 3.317, img: "hyperinflation", cap: "रोटी के लिए नोटों के ढेर लगते थे।", pan: 1 },
  { id: "e4", aud: 3.788, img: "depression", cap: "फिर 1929 में एक और झटका आया।", pan: -1 },
  { id: "e5", aud: 4.127, img: "depression", stat: "Great Depression · 1929", statColor: RED, cap: "अमेरिकी बाज़ार धड़ाम से गिरा।", pan: 1 },
  { id: "e6", aud: 4.519, img: "depression", cap: "दुनिया भर में व्यापार ठप, बेरोज़गारी।", pan: -1 },
  { id: "e7", aud: 3.396, img: "breadline", cap: "जर्मनी में न नौकरी, न उम्मीद।", pan: 1 },
  { id: "e8", aud: 4.049, img: "breadline", cap: "निराश लोग एक मसीहा ढूँढने लगे।", pan: -1 },

  // ── CH3 · हिटलर का उदय ──
  { id: "c4_t", aud: 2.534, chapter: "अध्याय 3\nहिटलर का उदय" },
  { id: "h1", aud: 4.389, img: "rally", stat: "अडोल्फ़ हिटलर · नाज़ी पार्टी", cap: "यहीं एक नया नाम उभरा।", pan: 1 },
  { id: "h2", aud: 3.317, img: "speaker", cap: "जो टूटे लोग सुनना चाहते थे, वही बोला।", pan: -1 },
  { id: "h3", aud: 3.004, img: "speaker", cap: "वर्साय की संधि फाड़ने का वादा।", pan: 1 },
  { id: "h4", aud: 2.769, img: "rally", cap: "जर्मनी को फिर महान बनाने का सपना।", pan: -1 },
  { id: "h5", aud: 3.004, img: "rally", cap: "मुसीबतों का दोष दूसरों पर मढ़ा।", pan: 1 },
  { id: "h6", aud: 4.206, img: "speaker", cap: "जोश, गुस्सा और झूठे वादों की भरमार।", pan: -1 },
  { id: "h7", aud: 3.631, img: "rally", cap: "संकट गहराया, नाज़ी पार्टी बढ़ी।", pan: 1 },
  { id: "h8", aud: 3.239, img: "podium", stat: "चांसलर · जनवरी 1933", cap: "हिटलर जर्मनी का चांसलर बना।", pan: -1 },
  { id: "h9", aud: 4.310, img: "podium", cap: "सत्ता व्यवस्था के भीतर से मिली।", pan: 1 },

  // ── CH4 · तानाशाही ──
  { id: "c5_t", aud: 2.691, chapter: "अध्याय 4\nतानाशाही" },
  { id: "d1", aud: 3.317, img: "dictator", cap: "आते ही लोकतंत्र ख़त्म करना शुरू किया।", pan: -1 },
  { id: "d2", aud: 4.441, img: "suppress", cap: "विरोधी दल, प्रेस — हर आवाज़ दबा दी।", pan: 1 },
  { id: "d3", aud: 4.754, img: "dictator", stat: "फ़्यूरर · 1934", cap: "ख़ुद को सर्वोच्च नेता घोषित किया।", pan: -1 },
  { id: "d4", aud: 3.082, img: "rearm", cap: "चुपके से सेना दोबारा खड़ी की।", pan: 1 },
  { id: "d5", aud: 2.586, img: "rearm", cap: "ये वर्साय संधि का सीधा उल्लंघन था।", pan: -1 },
  { id: "d6", aud: 2.769, img: "suppress", cap: "पर बड़ी ताक़तों ने आँखें मूँद लीं।", pan: 1 },

  // ── CH5 · तुष्टिकरण ──
  { id: "c6_t", aud: 2.691, chapter: "अध्याय 5\nतुष्टिकरण" },
  { id: "a1", aud: 3.317, img: "map_expand", stat: "राइनलैंड · 1936", cap: "हिटलर ने राइनलैंड में सेना भेजी।", pan: 1 },
  { id: "a2", aud: 2.926, img: "map_expand", stat: "ऑस्ट्रिया · 1938", cap: "ऑस्ट्रिया को जर्मनी में मिला लिया।", pan: -1 },
  { id: "a3", aud: 3.317, img: "map_expand", cap: "फिर सुडेटनलैंड की माँग की।", pan: 1 },
  { id: "a4", aud: 2.429, img: "munich", cap: "ब्रिटेन-फ़्रांस युद्ध से बचना चाहते थे।", pan: -1 },
  { id: "a5", aud: 3.004, img: "munich", stat: "म्यूनिख समझौता · 1938", cap: "वो इलाक़ा हिटलर को दे दिया।", pan: 1 },
  { id: "a6", aud: 5.016, img: "munich", cap: "तुष्टिकरण — खुश करके शांति ख़रीदना।", pan: -1 },
  { id: "a7", aud: 2.926, img: "tanks", cap: "वादा: अब और ज़मीन नहीं माँगूँगा।", pan: 1 },
  { id: "a8", aud: 3.317, img: "tanks", cap: "छह महीने बाद पूरा चेकोस्लोवाकिया हड़पा।", pan: -1 },
  { id: "a9", aud: 4.937, img: "tanks", cap: "तुष्टिकरण ने रोका नहीं, हिम्मत दी।", pan: 1 },

  // ── CH6 · गुप्त समझौता ──
  { id: "c7_t", aud: 2.377, chapter: "अध्याय 6\nगुप्त समझौता" },
  { id: "p1", aud: 2.273, img: "map_poland", cap: "अगली नज़र — पोलैंड पर।", pan: -1 },
  { id: "p2", aud: 2.847, img: "map_poland", cap: "डर था कि सोवियत संघ न आ जाए।", pan: 1 },
  { id: "p3", aud: 3.474, img: "pact", stat: "नाज़ी–सोवियत समझौता · अगस्त 1939", cap: "दोनों ने समझौता कर लिया।", pan: -1 },
  { id: "p4", aud: 3.474, img: "pact", cap: "गुप्त शर्त: पोलैंड को आपस में बाँटना।", pan: 1 },
  { id: "p5", aud: 1.959, img: "map_poland", cap: "अब हिटलर का रास्ता साफ़ था।", pan: -1 },

  // ── CH7 · युद्ध शुरू ──
  { id: "c8_t", aud: 2.847, chapter: "अध्याय 7\nयुद्ध शुरू" },
  { id: "w1", aud: 4.467, img: "blitz", stat: "1 सितंबर 1939", statColor: RED, cap: "जर्मनी ने पोलैंड पर हमला बोला।", pan: 1 },
  { id: "w2", aud: 4.127, img: "blitz", stat: "ब्लिट्ज़क्रीग", cap: "तेज़ टैंक और हवाई हमलों की रणनीति।", pan: -1 },
  { id: "w3", aud: 1.881, img: "wardeclare", cap: "इस बार दुनिया चुप नहीं रही।", pan: 1 },
  { id: "w4", aud: 3.788, img: "wardeclare", stat: "3 सितंबर 1939", cap: "ब्रिटेन-फ़्रांस ने युद्ध घोषित किया।", pan: -1 },
  { id: "w5", aud: 2.926, img: "warhook", cap: "और दूसरा विश्वयुद्ध शुरू हो गया।", pan: 1 },

  // ── CH8 · पूरी दुनिया की जंग ──
  { id: "c9_t", aud: 3.265, chapter: "अध्याय 8\nपूरी दुनिया की जंग" },
  { id: "g1", aud: 2.586, img: "warhook", cap: "ये युद्ध सिर्फ़ यूरोप तक नहीं रहा।", pan: -1 },
  { id: "g2", aud: 3.161, img: "map_asia", cap: "एशिया में जापान साम्राज्य फैला रहा था।", pan: 1 },
  { id: "g3", aud: 3.553, img: "pearl", stat: "पर्ल हार्बर · दिसंबर 1941", statColor: RED, cap: "जापान ने पर्ल हार्बर पर हमला किया।", pan: -1 },
  { id: "g4", aud: 2.273, img: "pearl", cap: "इसके साथ अमेरिका भी कूद पड़ा।", pan: 1 },
  { id: "g5", aud: 4.127, img: "sides", stat: "धुरी: जर्मनी · इटली · जापान", cap: "एक तरफ़ थे धुरी राष्ट्र।", pan: -1 },
  { id: "g6", aud: 5.251, img: "sides", stat: "मित्र: ब्रिटेन · सोवियत · अमेरिका", cap: "दूसरी तरफ़ थे मित्र राष्ट्र।", pan: 1 },
  { id: "g7", aud: 2.508, img: "sides", cap: "अब ये सचमुच पूरी दुनिया का युद्ध था।", pan: -1 },

  // ── CH9 · निष्कर्ष ──
  { id: "c10_t", aud: 2.952, chapter: "निष्कर्ष\nहम क्या सीखें?" },
  { id: "l1", aud: 3.317, img: "reflect", cap: "ये किसी एक दिन या इंसान से नहीं हुआ।", pan: 1 },
  { id: "l2", aud: 5.251, img: "reflect", cap: "अपमानजनक संधि + आर्थिक तबाही + नफ़रत।", pan: -1 },
  { id: "l3", aud: 4.519, img: "rally", cap: "निराशा में सख़्त नेता आकर्षक लगते हैं।", pan: 1 },
  { id: "l4", aud: 3.971, img: "munich", cap: "ख़तरे को नज़रअंदाज़ करना उसे बढ़ाता है।", pan: -1 },
  { id: "l5", aud: 4.859, img: "reflect", cap: "इतिहास हमें यही चेतावनी देता है।", pan: 1 },
  { id: "l6", aud: 3.161, chapter: "💡\nदिमाग़ की बत्ती" },
  { id: "cta", aud: 4.206, img: "reflect", cap: "हर मुद्दा, आसान भाषा में — Subscribe 💡", pan: -1 },
];

// image ids present in public/shorts/ww2/images/ (add as generated)
const AVAILABLE = new Set<string>([
  "warhook", "treaty", "reparations", "armylimit", "mapshrink", "angrycrowd",
  "hyperinflation", "depression", "breadline", "rally", "speaker", "podium",
  "suppress", "dictator", "rearm", "map_expand", "munich", "tanks",
  "pact", "map_poland", "blitz", "wardeclare", "map_asia", "pearl", "sides", "reflect",
]);

const LEAD = 10, HOLD = 18;
const sceneFrames = (s: Scene) => LEAD + Math.round(s.aud * FPS) + HOLD;
export const ww2TotalFrames = () => SCENES.reduce((a, s) => a + sceneFrames(s), 0);

const img = (id: string) => staticFile(`shorts/ww2/images/${id}.png`);
const aud = (id: string) => staticFile(`shorts/ww2/audio/${id}.mp3`);

const Brand: React.FC = () => (
  <div style={{ position: "absolute", top: 40, right: 50, display: "flex", alignItems: "center", gap: 9, opacity: 0.92 }}>
    <span style={{ fontSize: 30 }}>💡</span>
    <span style={{ fontFamily: EN, fontWeight: 700, fontSize: 28, color: "#fff" }}>DimaagBatti</span>
  </div>
);

const ChapterCard: React.FC<{ s: Scene }> = ({ s }) => {
  const frame = useCurrentFrame();
  const sp = spring({ frame, fps: FPS, config: { damping: 16 } });
  const lines = (s.chapter ?? "").split("\n");
  return (
    <AbsoluteFill style={{ backgroundColor: BASE, justifyContent: "center", alignItems: "center" }}>
      <div style={{ position: "absolute", width: 700, height: 700, borderRadius: "50%",
        background: `radial-gradient(circle, ${YELLOW}18 0%, transparent 62%)` }} />
      <div style={{ textAlign: "center", transform: `translateY(${interpolate(sp, [0, 1], [26, 0])}px)`, opacity: sp }}>
        <div style={{ fontFamily: EN, fontWeight: 700, fontSize: 34, color: YELLOW, letterSpacing: 4, marginBottom: 14 }}>
          {lines[0]}
        </div>
        <div style={{ fontFamily: HI, fontWeight: 800, fontSize: 96, color: "#fff", lineHeight: 1.1 }}>
          {lines[1]}
        </div>
        <div style={{ width: 120, height: 8, background: YELLOW, borderRadius: 5, margin: "28px auto 0" }} />
      </div>
      <Sequence from={LEAD}><Audio src={aud(s.id)} /></Sequence>
    </AbsoluteFill>
  );
};

const IllusScene: React.FC<{ s: Scene }> = ({ s }) => {
  const frame = useCurrentFrame();
  const dur = sceneFrames(s);
  const t = frame / dur;
  const scale = interpolate(t, [0, 1], [1.05, 1.14]);
  const driftX = interpolate(t, [0, 1], [0, (s.pan ?? 1) * 24]);
  const fadeIn = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [dur - 10, dur], [1, 0], { extrapolateLeft: "clamp" });
  const has = s.img && AVAILABLE.has(s.img);
  const capIn = spring({ frame: frame - LEAD, fps: FPS, config: { damping: 18 } });
  const statAt = LEAD + Math.round(s.aud * 0.4 * FPS);
  const statSp = spring({ frame: frame - statAt, fps: FPS, config: { damping: 12, stiffness: 130 } });

  return (
    <AbsoluteFill style={{ backgroundColor: BASE, opacity: fadeOut }}>
      {has && (
        <AbsoluteFill style={{ opacity: fadeIn }}>
          <Img src={img(s.img!)} style={{ width: "100%", height: "100%", objectFit: "cover",
            transform: `scale(${scale}) translateX(${driftX}px)` }} />
        </AbsoluteFill>
      )}
      {/* cinematic scrims */}
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(14,17,22,0.62) 0%, transparent 24%, transparent 58%, rgba(14,17,22,0.92) 100%)", pointerEvents: "none" }} />

      {/* stat chip (top-left) */}
      {s.stat && (
        <div style={{ position: "absolute", top: 120, left: 96,
          transform: `translateY(${interpolate(statSp, [0, 1], [22, 0])}px) scale(${interpolate(statSp, [0, 1], [0.9, 1])})`,
          opacity: interpolate(frame - statAt, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
          <span style={{ fontFamily: HI, fontWeight: 800, fontSize: 62, color: s.statColor ?? "#fff",
            background: "rgba(14,17,22,0.66)", padding: "10px 26px", borderRadius: 14,
            borderLeft: `6px solid ${YELLOW}`, boxShadow: "0 8px 28px rgba(0,0,0,0.5)" }}>{s.stat}</span>
        </div>
      )}

      <Brand />

      {/* Hindi caption (bottom) */}
      {s.cap && (
        <div style={{ position: "absolute", bottom: 88, left: 96, right: 96,
          transform: `translateY(${interpolate(capIn, [0, 1], [30, 0])}px)`, opacity: capIn }}>
          <div style={{ fontFamily: HI, fontWeight: 700, fontSize: 52, color: "#fff", lineHeight: 1.32,
            textShadow: "0 3px 20px rgba(0,0,0,0.85)" }}>
            <span style={{ borderBottom: `5px solid ${YELLOW}`, paddingBottom: 4 }}>{s.cap}</span>
          </div>
        </div>
      )}

      <Sequence from={LEAD}><Audio src={aud(s.id)} /></Sequence>
    </AbsoluteFill>
  );
};

export const WW2Wide: React.FC = () => {
  let cursor = 0;
  return (
    <AbsoluteFill style={{ backgroundColor: BASE }}>
      {SCENES.map((s) => {
        const from = cursor; const dur = sceneFrames(s); cursor += dur;
        return (
          <Sequence key={s.id} from={from} durationInFrames={dur} name={s.id}>
            {s.chapter ? <ChapterCard s={s} /> : <IllusScene s={s} />}
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
