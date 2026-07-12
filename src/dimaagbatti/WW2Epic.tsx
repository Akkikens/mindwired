/** DimaagBatti — WW2 EPIC: "दूसरा विश्वयुद्ध — पूरी कहानी" (1-hour, 1920×1080).
 *  The full-war sequel to WW2Wide (causes). Same documentary language — archival
 *  photos + Gemini illustrations, Ken Burns, Devanagari overlays, chapter cards —
 *  built chapter by chapter (audio: public/shorts/ww2epic/audio, images:
 *  public/shorts/ww2epic/images). VO: scripts/build_ww2epic_vo.py.
 *
 *  Scenes append per chapter as they ship; the comp always renders the beats
 *  present in SCENES, so every chapter checkpoint is a full valid render. */
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

type Scene = {
  id: string; aud: number; cap?: string;
  img?: string; stat?: string; statColor?: string;
  chapter?: string; pan?: 1 | -1;
};

const SCENES: Scene[] = [
  // ── HOOK ──
  { id: "h1", aud: 5.799, img: "warhook", stat: "6–8 करोड़ मौतें", statColor: RED, cap: "सिर्फ़ छह साल में।", pan: 1 },
  { id: "h2", aud: 4.780, img: "sides", cap: "हर महाद्वीप, हर समुद्र, हर आसमान।", pan: -1 },
  { id: "h3", aud: 5.329, img: "indianarmy", stat: "25 लाख भारतीय सैनिक", statColor: YELLOW, cap: "इतिहास की सबसे बड़ी स्वयंसेवी सेना।", pan: 1 },
  { id: "h4", aud: 2.429, img: "reflect", cap: "ये कहानी हमें पूरी नहीं बताई गई।", pan: -1 },
  { id: "h5", aud: 5.590, img: "warhook", stat: "1939–1945 · पूरी कहानी", cap: "शुरुआत से अंत तक।", pan: -1 },
  { id: "h6", aud: 5.094, img: "map_expand", cap: "कौन, क्यों, कैसे — और भारत का क्या?", pan: 1 },
  { id: "h7", aud: 3.082, img: "reflect", cap: "ये सिर्फ़ इतिहास नहीं — चेतावनी है।", pan: 1 },
  { id: "h8", aud: 2.691, chapter: "💡\nदिमाग़ बत्ती ऑन" },

  // ── CH1 · बारूद कैसे जमा हुआ ──
  { id: "r_t", aud: 3.109, chapter: "अध्याय 1\nबारूद कैसे जमा हुआ" },
  { id: "r1", aud: 6.374, img: "treaty", stat: "वर्साय की संधि · 1919", cap: "दोष, कर्ज़ और अपमान।", pan: 1 },
  { id: "r2", aud: 4.780, img: "depression", stat: "1923 महँगाई · 1929 महामंदी", statColor: RED, cap: "अर्थव्यवस्था और उम्मीद — दोनों टूटीं।", pan: -1 },
  { id: "r3", aud: 5.407, img: "rally", stat: "अडोल्फ़ हिटलर", cap: "टूटे लोगों को मसीहा मिल गया।", pan: 1 },
  { id: "r4", aud: 4.441, img: "podium", stat: "चांसलर · जनवरी 1933", cap: "कुछ महीनों में लोकतंत्र ख़त्म।", pan: -1 },
  { id: "r5", aud: 4.362, img: "rearm", cap: "चुपके से सेना, फिर ज़मीनें।", pan: 1 },
  { id: "r6", aud: 3.709, img: "map_expand", stat: "राइनलैंड · ऑस्ट्रिया · चेकोस्लोवाकिया", cap: "एक-एक करके।", pan: -1 },
  { id: "r7", aud: 5.669, img: "munich", cap: "ब्रिटेन-फ़्रांस ने मनाया, रोका नहीं।", pan: 1 },
  { id: "r8", aud: 4.206, img: "munich", stat: "तुष्टिकरण — नाकाम", statColor: RED, cap: "इसने हिटलर की हिम्मत बढ़ाई।", pan: -1 },
  { id: "r9", aud: 5.590, img: "pact", stat: "नाज़ी–सोवियत समझौता · अगस्त 1939", cap: "पोलैंड बाँटने का गुप्त सौदा।", pan: 1 },
  { id: "r10", aud: 1.802, img: "map_poland", cap: "अब बस एक चिंगारी बाकी थी।", pan: -1 },

  // ── CH2 · ब्लिट्ज़क्रीग ──
  { id: "b_t", aud: 2.220, chapter: "अध्याय 2\nब्लिट्ज़क्रीग" },
  { id: "b1", aud: 5.642, img: "tanks", stat: "1 सितंबर 1939", statColor: RED, cap: "जर्मन टैंक पोलैंड में घुसे।", pan: 1 },
  { id: "b2", aud: 5.251, img: "blitz", stat: "ब्लिट्ज़क्रीग", cap: "बिजली जैसी जंग।", pan: -1 },
  { id: "b3", aud: 5.799, img: "blitz", cap: "हवाई हमला → टैंक → पैदल सेना।", pan: 1 },
  { id: "b4", aud: 4.780, img: "map_poland", cap: "घोड़ों से टैंक नहीं रुकते।", pan: -1 },
  { id: "b5", aud: 3.866, img: "wardeclare", stat: "3 सितंबर · युद्ध घोषित", cap: "ब्रिटेन और फ़्रांस मैदान में।", pan: 1 },
  { id: "b6", aud: 6.295, img: "map_poland", stat: "5 हफ़्ते · पोलैंड ख़त्म", statColor: RED, cap: "पश्चिम से जर्मनी, पूर्व से सोवियत।", pan: -1 },
  { id: "b7", aud: 6.557, img: "wardeclare", stat: "Phoney War · 8 महीने", cap: "जंग घोषित, लड़ाई ग़ायब।", pan: 1 },
  { id: "b8", aud: 4.780, img: "map_expand", stat: "अप्रैल 1940", cap: "डेनमार्क और नॉर्वे — कुछ दिनों में।", pan: -1 },
  { id: "b9", aud: 6.165, img: "map_expand", stat: "मई 1940 · निशाना फ़्रांस", statColor: RED, cap: "हॉलैंड, बेल्जियम... और फ़्रांस।", pan: 1 },
  { id: "b10", aud: 5.982, img: "maginot", stat: "मैजिनो लाइन", cap: "किलों की 'अभेद्य' दीवार।", pan: -1 },
  { id: "b11", aud: 4.911, img: "tanks", stat: "आर्देन का चक्कर", cap: "दीवार से लड़े नहीं — घूमकर निकल गए।", pan: 1 },
  { id: "b12", aud: 4.624, img: "dunkirk", stat: "डनकर्क · मई 1940", statColor: RED, cap: "समुद्र किनारे फँसी सेनाएँ।", pan: -1 },
  { id: "b13", aud: 6.687, img: "dunkirk", cap: "आम लोग, छोटी नावें — बचाने पहुँचे।", pan: 1 },
  { id: "b14", aud: 3.317, img: "dunkirk", stat: "3,38,000 सैनिक बचाए गए", statColor: YELLOW, cap: "नौ दिनों का चमत्कार।", pan: -1 },
  { id: "b15", aud: 5.251, img: "carriage", stat: "22 जून 1940", statColor: RED, cap: "फ़्रांस का आत्मसमर्पण।", pan: 1 },
  { id: "b16", aud: 6.949, img: "carriage", cap: "वही रेल डिब्बा — 1918 वाला। बदला पूरा।", pan: -1 },
  { id: "b17", aud: 4.127, img: "map_expand", stat: "10 महीने · पश्चिमी यूरोप फ़तह", statColor: RED, cap: "लगभग सब कुछ हिटलर के क़दमों में।", pan: 1 },
  { id: "b18", aud: 3.161, img: "warhook", cap: "अब सिर्फ़ एक देश खड़ा था। अकेला।", pan: -1 },

  // ── CH3 · अकेला ब्रिटेन ──
  { id: "g_t", aud: 2.847, chapter: "अध्याय 3\nअकेला ब्रिटेन" },
  { id: "g1", aud: 6.426, img: "map_expand", stat: "जून 1940", cap: "फ़्रांस गिरा। अमेरिका तटस्थ। सोवियत समझौते में।", pan: 1 },
  { id: "g2", aud: 5.904, img: "map_expand", cap: "नक्शे पर बचा सिर्फ़ ब्रिटेन।", pan: -1 },
  { id: "g3", aud: 4.232, img: "churchill", stat: "विंस्टन चर्चिल", cap: "लंदन में नया प्रधानमंत्री।", pan: 1 },
  { id: "g4", aud: 4.310, img: "churchill", cap: "समझौता नहीं होगा। चाहे कुछ भी हो।", pan: -1 },
  { id: "g5", aud: 4.702, img: "churchill", stat: "\"We shall never surrender\"", statColor: YELLOW, cap: "हम कभी हार नहीं मानेंगे।", pan: 1 },
  { id: "g6", aud: 6.400, img: "map_expand", stat: "ऑपरेशन सी-लायन", cap: "चैनल पार करके हमले की योजना।", pan: -1 },
  { id: "g7", aud: 3.709, img: "blitz", cap: "पहले आसमान जीतना ज़रूरी था।", pan: 1 },
  { id: "g8", aud: 6.374, img: "spitfire", stat: "Battle of Britain · 1940", cap: "इतिहास की पहली पूरी हवाई जंग।", pan: -1 },
  { id: "g9", aud: 3.892, img: "blitz", cap: "लुफ़्तवाफ़े — तादाद में कहीं बड़ी।", pan: 1 },
  { id: "g10", aud: 7.262, img: "spitfire", cap: "RAF के पास दो हथियार थे।", pan: -1 },
  { id: "g11", aud: 5.016, img: "spitfire", stat: "Spitfire · Hurricane", cap: "फुर्तीले, ख़तरनाक।", pan: 1 },
  { id: "g12", aud: 5.825, img: "blitz", stat: "RADAR", cap: "उड़ान भरते ही पकड़े जाते।", pan: -1 },
  { id: "g13", aud: 4.754, img: "blitz", cap: "हर दिन, सैकड़ों विमान आमने-सामने।", pan: 1 },
  { id: "g14", aud: 5.407, img: "spitfire", cap: "पायलटों की उम्र — 19-20 साल।", pan: -1 },
  { id: "g15", aud: 8.229, img: "blitzlondon", stat: "The Blitz · 57 रातें", statColor: RED, cap: "अब निशाना थे शहर।", pan: 1 },
  { id: "g16", aud: 6.922, img: "blitzlondon", cap: "हज़ारों मरे। पर ब्रिटेन झुका नहीं।", pan: -1 },
  { id: "g17", aud: 5.172, img: "churchill", stat: "सितंबर 1940 · हमला रद्द", statColor: YELLOW, cap: "हमेशा के लिए।", pan: 1 },
  { id: "g18", aud: 3.736, img: "churchill", cap: "हिटलर को रोका जा सकता है।", pan: -1 },
  { id: "g19", aud: 7.654, img: "spitfire", stat: "\"…owed by so many to so few\"", statColor: YELLOW, cap: "इतना बड़ा कर्ज़, इतने कम लोगों पर।", pan: 1 },

  // ── CH4 · सबसे बड़ी ग़लती ──
  { id: "s_t", aud: 2.691, chapter: "अध्याय 4\nसबसे बड़ी ग़लती" },
  { id: "s1", aud: 3.814, img: "dictator", cap: "हिटलर ने पूर्व की ओर देखा।", pan: -1 },
  { id: "s2", aud: 4.989, img: "pact", stat: "दोस्ती का समझौता?", cap: "वही सोवियत संघ।", pan: 1 },
  { id: "s3", aud: 4.232, img: "pact", cap: "समझौता सिर्फ़ एक चाल था।", pan: -1 },
  { id: "s4", aud: 4.441, img: "map_expand", stat: "ज़मीन · अनाज · तेल", cap: "यही थी असली भूख।", pan: 1 },
  { id: "s5", aud: 5.669, img: "barbarossa", stat: "ऑपरेशन बारबरोसा · 22 जून 1941", statColor: RED, cap: "इतिहास का सबसे बड़ा हमला।", pan: -1 },
  { id: "s6", aud: 4.598, img: "barbarossa", stat: "38 लाख सैनिक", statColor: RED, cap: "एक ही सुबह में सीमा पार।", pan: 1 },
  { id: "s7", aud: 5.068, img: "dictator", cap: "स्टालिन को यक़ीन ही नहीं हुआ।", pan: -1 },
  { id: "s8", aud: 4.859, img: "tanks", cap: "लाखों सोवियत सैनिक बंदी।", pan: 1 },
  { id: "s9", aud: 4.780, img: "warhook", cap: "ये मिटा देने की जंग थी।", pan: -1 },
  { id: "s10", aud: 7.105, img: "warhook", stat: "Scorched Earth", cap: "पीछे हटो, सब जला दो।", pan: 1 },
  { id: "s11", aud: 3.474, img: "barbarossa", cap: "मॉस्को से बस कुछ किलोमीटर दूर।", pan: -1 },
  { id: "s12", aud: 4.049, img: "winter", stat: "रूसी सर्दी", cap: "सबसे पुराना हथियार।", pan: 1 },
  { id: "s13", aud: 5.068, img: "winter", stat: "−30° · −40°", statColor: RED, cap: "गर्म कपड़े तक नहीं थे।", pan: -1 },
  { id: "s14", aud: 4.833, img: "winter", cap: "टैंक जमे। बंदूकें रुकीं।", pan: 1 },
  { id: "s15", aud: 6.374, img: "winter", stat: "दिसंबर 1941 · सोवियत पलटवार", statColor: YELLOW, cap: "जर्मनी पहली बार पीछे हटा।", pan: -1 },
  { id: "s16", aud: 6.217, img: "map_expand", stat: "दो मोर्चों की जंग", statColor: RED, cap: "पहले विश्वयुद्ध वाली ही ग़लती।", pan: 1 },
  { id: "s17", aud: 4.754, img: "pearl", cap: "उसी हफ़्ते — दूसरे कोने पर तूफ़ान।", pan: -1 },

  // ── CH5 · सोता हुआ दानव (Pearl Harbor) ──
  { id: "j_t", aud: 3.187, chapter: "अध्याय 5\nसोता हुआ दानव" },
  { id: "j1", aud: 3.422, img: "map_asia", stat: "जापान", cap: "एशिया का फैलता साम्राज्य।", pan: 1 },
  { id: "j2", aud: 3.553, img: "map_asia", cap: "पहले चीन, फिर पूरा एशिया-प्रशांत।", pan: -1 },
  { id: "j3", aud: 3.814, img: "map_asia", stat: "तेल पर रोक", statColor: RED, cap: "अमेरिका ने जीवन-रेखा काट दी।", pan: 1 },
  { id: "j4", aud: 4.545, img: "sides", cap: "पीछे हटो — या वार करो।", pan: -1 },
  { id: "j5", aud: 5.590, img: "pearl", cap: "एक झटके में नौसेना ख़त्म करने की योजना।", pan: 1 },
  { id: "j6", aud: 5.329, img: "pearl", stat: "पर्ल हार्बर · 7 दिसंबर 1941", statColor: RED, cap: "रविवार की शांत सुबह।", pan: -1 },
  { id: "j7", aud: 2.926, img: "pearl", cap: "350+ विमान। बिना चेतावनी।", pan: 1 },
  { id: "j8", aud: 4.441, img: "pearl", stat: "8 युद्धपोत · 2,400 मौतें", statColor: RED, cap: "सिर्फ़ दो घंटों में।", pan: -1 },
  { id: "j9", aud: 5.172, img: "pearl", stat: "\"a date which will live in infamy\"", statColor: YELLOW, cap: "— राष्ट्रपति रूज़वेल्ट", pan: 1 },
  { id: "j10", aud: 2.351, img: "wardeclare", cap: "अगले दिन अमेरिका जंग में।", pan: -1 },
  { id: "j11", aud: 4.859, img: "dictator", cap: "हिटलर की दूसरी सबसे बड़ी ग़लती।", pan: 1 },
  { id: "j12", aud: 5.512, img: "factory", stat: "दुनिया की सबसे बड़ी फ़ैक्टरी", cap: "अब मित्र राष्ट्रों के साथ।", pan: -1 },
  { id: "j13", aud: 4.127, img: "sides", stat: "धुरी बनाम मित्र राष्ट्र", cap: "अब सचमुच विश्वयुद्ध।", pan: 1 },

  // ── CH6 · सबसे काला अध्याय (Holocaust — sombre) ──
  { id: "o_t", aud: 2.847, chapter: "अध्याय 6\nसबसे काला अध्याय" },
  { id: "o1", aud: 5.329, img: "suppress", cap: "युद्ध के पीछे — एक और अपराध, योजना से।", pan: -1 },
  { id: "o2", aud: 4.937, img: "suppress", cap: "नाज़ी विचारधारा की नींव ही नफ़रत थी।", pan: 1 },
  { id: "o3", aud: 5.512, img: "ghetto", stat: "पीला सितारा", cap: "नागरिकता छिनी, पहचान दागी गई।", pan: -1 },
  { id: "o4", aud: 5.407, img: "ghetto", stat: "घेटो", cap: "दीवारों से घिरे, बंद इलाक़े।", pan: 1 },
  { id: "o5", aud: 7.340, img: "dictator", stat: "1942 · 'अंतिम समाधान'", cap: "नाज़ी नेतृत्व की मंज़ूरी।", pan: -1 },
  { id: "o6", aud: 7.105, img: "auschwitz", stat: "आउशवित्ज़ · ट्रेब्लिंका", cap: "पूरे यूरोप से ट्रेनें।", pan: 1 },
  { id: "o7", aud: 4.049, img: "auschwitz", cap: "इतिहास का सबसे संगठित अपराध।", pan: -1 },
  { id: "o8", aud: 1.959, img: "auschwitz", stat: "60 लाख", cap: "यहूदी मारे गए।", pan: 1 },
  { id: "o9", aud: 7.262, img: "reflect", cap: "और लाखों और — हर आवाज़ जो अलग थी।", pan: -1 },
  { id: "o10", aud: 2.952, img: "auschwitz", stat: "होलोकॉस्ट", cap: "इतिहास ने इसे यही नाम दिया।", pan: 1 },
  { id: "o11", aud: 5.407, img: "reflect", cap: "हर संख्या एक नाम थी। एक चेहरा। एक परिवार।", pan: -1 },
  { id: "o12", aud: 3.187, img: "reflect", stat: "Never Again", cap: "फिर कभी नहीं।", pan: 1 },
  { id: "o13", aud: 4.833, img: "reflect", cap: "जो भूल जाते हैं, वो दोहराते हैं।", pan: -1 },

  // ── CH7 · रेगिस्तान की जंग ──
  { id: "n_t", aud: 3.265, chapter: "अध्याय 7\nरेगिस्तान की जंग" },
  { id: "n1", aud: 5.747, img: "afrikakorps", stat: "उत्तरी अफ़्रीका", cap: "एक और मैदान सुलग रहा था।", pan: 1 },
  { id: "n2", aud: 5.982, img: "map_expand", stat: "स्वेज़ नहर · तेल", cap: "साम्राज्य की जीवन-रेखा।", pan: -1 },
  { id: "n3", aud: 3.109, img: "afrikakorps", cap: "पहले इटली आया — और पिटा।", pan: 1 },
  { id: "n4", aud: 6.792, img: "rommel", stat: "एरविन रोमेल · 'रेगिस्तान की लोमड़ी'", cap: "हिटलर का सबसे चालाक जनरल।", pan: -1 },
  { id: "n5", aud: 3.709, img: "afrikakorps", cap: "ब्रिटिश सेना समुद्र तक धकेली गई।", pan: 1 },
  { id: "n6", aud: 4.127, img: "indianarmy", stat: "भारत की एंट्री", statColor: YELLOW, cap: "यहीं भारत की कहानी जुड़ी।", pan: -1 },
  { id: "n7", aud: 7.993, img: "indianarmy", stat: "4th · 5th Indian Division", cap: "पंजाब से मद्रास तक के जवान।", pan: 1 },
  { id: "n8", aud: 4.911, img: "indianarmy", cap: "तोब्रुक। सिदी बर्रानी। हर मोर्चा।", pan: -1 },
  { id: "n9", aud: 5.251, img: "alamein", stat: "अल अलामीन", statColor: RED, cap: "मिस्र का आख़िरी दरवाज़ा।", pan: 1 },
  { id: "n10", aud: 5.825, img: "alamein", stat: "अक्टूबर 1942 · 12 दिन", cap: "मोंटगोमरी का पलटवार।", pan: -1 },
  { id: "n11", aud: 4.389, img: "afrikakorps", cap: "रोमेल फिर कभी नहीं लौटा।", pan: 1 },
  { id: "n12", aud: 4.232, img: "churchill", stat: "\"the end of the beginning\"", statColor: YELLOW, cap: "शायद, ये शुरुआत का अंत है।", pan: -1 },
  { id: "n13", aud: 3.396, img: "indianarmy", cap: "उस जीत में हज़ारों नाम भारतीय थे।", pan: 1 },

  // ── CH8 · भारत और ये जंग ──
  { id: "i_t", aud: 2.847, chapter: "अध्याय 8\nभारत और ये जंग" },
  { id: "i1", aud: 3.239, img: "indianarmy", cap: "किताबों में सिर्फ़ एक पन्ना।", pan: -1 },
  { id: "i2", aud: 4.780, stat: "1939 · वायसराय का ऐलान", cap: "भारत युद्ध में है।", pan: 1 },
  { id: "i3", aud: 5.642, cap: "30 करोड़ का फ़ैसला — एक दस्तख़त से।", pan: -1 },
  { id: "i4", aud: 3.396, img: "angrycrowd", cap: "कांग्रेस के इस्तीफ़े। देश में ग़ुस्सा।", pan: 1 },
  { id: "i5", aud: 5.825, img: "indianarmy", stat: "25 लाख वालंटियर", statColor: YELLOW, cap: "कोई ज़बरदस्ती नहीं।", pan: -1 },
  { id: "i6", aud: 2.586, img: "indianarmy", cap: "सबसे बड़ी स्वयंसेवी सेना।", pan: 1 },
  { id: "i7", aud: 6.295, img: "indianarmy", cap: "अफ़्रीका · इटली · बर्मा।", pan: -1 },
  { id: "i8", aud: 8.150, img: "alamein", cap: "मोंटे कैसिनो से सिंगापुर तक।", pan: 1 },
  { id: "i9", aud: 5.930, img: "indianarmy", stat: "30+ विक्टोरिया क्रॉस", statColor: YELLOW, cap: "बहादुरी का सबसे बड़ा सम्मान।", pan: -1 },
  { id: "i10", aud: 2.273, cap: "पर घर पर, कहानी अंधेरी थी।", pan: 1 },
  { id: "i11", aud: 5.329, stat: "बंगाल · 1943", cap: "चावल जंग के लिए जा रहा था।", pan: -1 },
  { id: "i12", aud: 5.590, cap: "क़ीमतें आसमान पर। गोदाम खाली।", pan: 1 },
  { id: "i13", aud: 4.780, stat: "20–30 लाख मौतें", cap: "बंगाल का अकाल।", pan: -1 },
  { id: "i14", aud: 6.870, img: "reflect", cap: "मरने वाले बहस नहीं करते।", pan: 1 },
  { id: "i15", aud: 3.971, img: "bose", stat: "सुभाष चंद्र बोस", cap: "एक और रास्ता।", pan: -1 },
  { id: "i16", aud: 4.545, img: "bose", cap: "अंग्रेज़ों का दुश्मन — भारत का दोस्त?", pan: 1 },
  { id: "i17", aud: 6.374, img: "bose", stat: "आज़ाद हिंद फ़ौज · ~40,000", cap: "जापान के साथ मिलकर।", pan: -1 },
  { id: "i18", aud: 3.971, img: "bose", stat: "\"तुम मुझे ख़ून दो…\"", statColor: YELLOW, cap: "…मैं तुम्हें आज़ादी दूँगा।", pan: 1 },
  { id: "i19", aud: 5.669, img: "map_asia", cap: "जापानी सेना + INA — भारत की सीमा तक।", pan: -1 },
  { id: "i20", aud: 6.374, img: "kohima", stat: "कोहिमा · इम्फाल · 1944", statColor: RED, cap: "पूर्व का स्टालिनग्राद।", pan: 1 },
  { id: "i21", aud: 4.049, img: "kohima", cap: "टेनिस कोर्ट जितनी दूरी पर खाइयाँ।", pan: -1 },
  { id: "i22", aud: 5.172, img: "kohima", cap: "और रोका किसने? भारतीय सैनिकों ने।", pan: 1 },
  { id: "i23", aud: 4.833, img: "kohima", cap: "भारतीय — दोनों तरफ़। अजीब त्रासदी।", pan: -1 },
  { id: "i24", aud: 4.127, img: "kohima", stat: "जापान की सबसे बड़ी ज़मीनी हार", statColor: YELLOW, cap: "यहीं, भारत की धरती पर।", pan: 1 },
  { id: "i25", aud: 2.586, img: "indianarmy", cap: "जंग ख़त्म — भारत बदल चुका था।", pan: -1 },
  { id: "i26", aud: 4.676, img: "indianarmy", cap: "ये हाथ अब ग़ुलामी नहीं सहते।", pan: 1 },
  { id: "i27", aud: 4.441, img: "angrycrowd", stat: "INA मुक़दमे · नौसेना बग़ावत", cap: "देश एक हो गया।", pan: -1 },
  { id: "i28", aud: 5.904, cap: "फ़ौज के बिना, राज नहीं चलता।", pan: 1 },
  { id: "i29", aud: 4.467, stat: "15 अगस्त 1947", statColor: YELLOW, cap: "सिर्फ़ दो साल बाद।", pan: -1 },
  { id: "i30", aud: 2.926, img: "reflect", cap: "आज़ादी की कहानी का छुपा अध्याय।", pan: 1 },

  // ── CH9 · स्टालिनग्राद ──
  { id: "t_t", aud: 2.377, chapter: "अध्याय 9\nस्टालिनग्राद" },
  { id: "t1", aud: 4.206, img: "dictator", cap: "मॉस्को से कोई सबक नहीं।", pan: -1 },
  { id: "t2", aud: 4.937, img: "map_expand", stat: "काकेशस का तेल", cap: "और रास्ते में — एक शहर।", pan: 1 },
  { id: "t3", aud: 2.691, img: "stalingrad", stat: "स्टालिनग्राद", statColor: RED, cap: "स्टालिन के नाम का शहर।", pan: -1 },
  { id: "t4", aud: 4.989, img: "dictator", cap: "दो तानाशाहों के ईगो की जंग।", pan: 1 },
  { id: "t5", aud: 4.624, img: "stalingrad", stat: "आदेश №227", cap: "एक क़दम भी पीछे नहीं।", pan: -1 },
  { id: "t6", aud: 4.859, img: "warhook", stat: "अगस्त 1942", cap: "पूरा शहर मलबे में।", pan: 1 },
  { id: "t7", aud: 3.082, img: "stalingrad", cap: "वही मलबा किला बन गया।", pan: -1 },
  { id: "t8", aud: 4.519, img: "stalingrad", cap: "घर-घर। कमरे-कमरे। सीढ़ी-सीढ़ी।", pan: 1 },
  { id: "t9", aud: 4.310, img: "stalingrad", stat: "Rattenkrieg", statColor: RED, cap: "चूहों की जंग।", pan: -1 },
  { id: "t10", aud: 4.441, img: "stalingrad", stat: "रेलवे स्टेशन · 14 बार", cap: "हाथ बदलता रहा।", pan: 1 },
  { id: "t11", aud: 5.747, img: "stalingrad", stat: "पावलोव का घर · 58 दिन", statColor: YELLOW, cap: "मुट्ठी भर सैनिक, एक इमारत।", pan: -1 },
  { id: "t12", aud: 2.691, img: "stalingrad", cap: "हर खिड़की मौत थी।", pan: 1 },
  { id: "t13", aud: 5.433, img: "stalingrad", stat: "वासिली ज़ैतसेव · 225", cap: "एक चरवाहे का बेटा।", pan: -1 },
  { id: "t14", aud: 4.362, img: "winter", cap: "वोल्गा जमने लगी। रसद टूटने लगी।", pan: 1 },
  { id: "t15", aud: 4.127, img: "map_expand", stat: "ऑपरेशन यूरेनस · ज़ुकोव", cap: "जाल खुला।", pan: -1 },
  { id: "t16", aud: 4.885, img: "map_expand", cap: "दो सेनाएँ, दोनों ओर से घूमीं…", pan: 1 },
  { id: "t17", aud: 5.407, img: "map_expand", stat: "छठी सेना घिरी · 2.5 लाख+", statColor: RED, cap: "अंदर बंद।", pan: -1 },
  { id: "t18", aud: 3.814, img: "dictator", cap: "हिटलर: पीछे हटना मना है।", pan: 1 },
  { id: "t19", aud: 4.780, img: "blitz", cap: "हवा से रसद — झूठा वादा।", pan: -1 },
  { id: "t20", aud: 5.433, img: "winter", cap: "भूख। माइनस 30। चूहे... घोड़े...", pan: 1 },
  { id: "t21", aud: 5.251, img: "paulus", stat: "31 जनवरी 1943 · आत्मसमर्पण", statColor: YELLOW, cap: "फील्ड मार्शल पाउलुस।", pan: -1 },
  { id: "t22", aud: 6.452, img: "paulus", cap: "एक दिन पहले ही फील्ड मार्शल बना था।", pan: 1 },
  { id: "t23", aud: 4.049, img: "paulus", cap: "इशारा था — ख़ुदकुशी। उसने मना कर दिया।", pan: -1 },
  { id: "t24", aud: 4.676, img: "warhook", stat: "~20 लाख मौतें", statColor: RED, cap: "एक शहर के लिए।", pan: 1 },
  { id: "t25", aud: 2.429, img: "stalingrad", cap: "सबसे ख़ूनी युद्धक्षेत्र।", pan: -1 },
  { id: "t26", aud: 4.206, img: "stalingrad", stat: "जंग का रुख़ पलटा", statColor: YELLOW, cap: "अब जर्मनी सिर्फ़ पीछे जाएगा।", pan: 1 },
  { id: "t27", aud: 1.149, img: "map_expand", cap: "बर्लिन तक।", pan: -1 },

  // ── CH10 · प्रशांत का पलटवार ──
  { id: "m_t", aud: 2.691, chapter: "अध्याय 10\nप्रशांत का पलटवार" },
  { id: "m1", aud: 2.847, img: "map_asia", cap: "प्रशांत में जापान अजेय लग रहा था।", pan: 1 },
  { id: "m2", aud: 6.687, img: "map_asia", stat: "6 महीने · सब गिरा", statColor: RED, cap: "फिलीपींस · मलाया · सिंगापुर · बर्मा।", pan: -1 },
  { id: "m3", aud: 4.702, img: "map_asia", cap: "'ब्रिटिश इतिहास की सबसे बड़ी आपदा।'", pan: 1 },
  { id: "m4", aud: 4.049, img: "factory", cap: "पर अमेरिका के पास एक अनदेखा हथियार था।", pan: -1 },
  { id: "m5", aud: 4.545, img: "factory", stat: "कोडब्रेकर", statColor: YELLOW, cap: "गुप्त संदेश अब गुप्त नहीं थे।", pan: 1 },
  { id: "m6", aud: 4.467, img: "akagi", stat: "मिडवे · जून 1942", cap: "जापान की घात की योजना।", pan: -1 },
  { id: "m7", aud: 2.038, img: "akagi", cap: "घात में ख़ुद अमेरिका बैठा था।", pan: 1 },
  { id: "m8", aud: 6.609, img: "midway", stat: "5 मिनट · 3 विमानवाहक", statColor: RED, cap: "इतिहास के सबसे क़ीमती पाँच मिनट।", pan: -1 },
  { id: "m9", aud: 1.959, img: "midway", cap: "चौथा शाम तक डूबा।", pan: 1 },
  { id: "m10", aud: 3.422, img: "akagi", cap: "नौसेना की रीढ़ — एक दिन में टूटी।", pan: -1 },
  { id: "m11", aud: 2.926, img: "map_asia", cap: "साम्राज्य सिकुड़ने लगा।", pan: 1 },
  { id: "m12", aud: 5.094, img: "map_asia", stat: "Island Hopping", cap: "एक-एक द्वीप, जापान की ओर।", pan: -1 },
  { id: "m13", aud: 5.512, img: "alamein", cap: "अल अलामीन · स्टालिनग्राद · मिडवे।", pan: 1 },
  { id: "m14", aud: 4.127, img: "sides", stat: "3 महाद्वीप · 3 हारें", statColor: YELLOW, cap: "धुरी की बढ़त ख़त्म।", pan: -1 },
  { id: "m15", aud: 3.657, img: "warhook", cap: "अब कहानी बदलती है — बचाव से हमले तक।", pan: 1 },

  // ── CH11 · आख़िरी दांव (Kursk + Italy) ──
  { id: "k_t", aud: 2.847, chapter: "अध्याय 11\nआख़िरी दांव" },
  { id: "k1", aud: 4.127, img: "dictator", cap: "हिटलर को बड़ी जीत चाहिए थी।", pan: -1 },
  { id: "k2", aud: 4.049, img: "map_expand", stat: "कुर्स्क", cap: "मोर्चे का एक उभार।", pan: 1 },
  { id: "k3", aud: 4.127, img: "kursk", stat: "जुलाई 1943", statColor: RED, cap: "सबसे बड़ी टैंक लड़ाई।", pan: -1 },
  { id: "k4", aud: 3.004, img: "kursk", stat: "~6,000 टैंक · 20 लाख सैनिक", cap: "आमने-सामने।", pan: 1 },
  { id: "k5", aud: 3.004, img: "kursk", cap: "पर प्लान पहले से लीक था।", pan: -1 },
  { id: "k6", aud: 5.172, img: "kursk", cap: "किले जैसी रक्षा — सुरंगें, खाइयाँ, तोपें।", pan: 1 },
  { id: "k7", aud: 3.265, img: "kursk", cap: "हमला टकराया — और टूट गया।", pan: -1 },
  { id: "k8", aud: 3.788, img: "kursk", stat: "पूर्व में आख़िरी जर्मन हमला", statColor: YELLOW, cap: "फिर कभी नहीं।", pan: 1 },
  { id: "k9", aud: 2.586, img: "map_expand", cap: "उसी महीने — सिसिली में लैंडिंग।", pan: -1 },
  { id: "k10", aud: 5.851, img: "podium", stat: "मुसोलिनी गिरफ़्तार", statColor: RED, cap: "20 साल का तानाशाह — अपनों के हाथों।", pan: 1 },
  { id: "k11", aud: 1.489, img: "sides", cap: "इटली ने पाला बदल लिया।", pan: -1 },
  { id: "k12", aud: 2.691, img: "sides", stat: "धुरी: 3 → 2", cap: "तिकड़ी टूट गई।", pan: 1 },
  { id: "k13", aud: 4.284, img: "warhook", cap: "पर सबसे बड़ा वार अभी बाकी था।", pan: -1 },
  { id: "k14", aud: 1.881, img: "dunkirk", cap: "फ़्रांस के समुद्र तट पर।", pan: 1 },

  // ── CH12 · डी-डे ──
  { id: "q_t", aud: 2.455, chapter: "अध्याय 12\nडी-डे" },
  { id: "q1", aud: 6.949, img: "map_expand", cap: "सवाल था — कहाँ, और कब?", pan: -1 },
  { id: "q2", aud: 3.814, img: "maginot", stat: "अटलांटिक वॉल", cap: "पूरा तट — एक किला।", pan: 1 },
  { id: "q3", aud: 3.265, img: "pact", cap: "मित्र राष्ट्रों का हथियार — झूठ।", pan: -1 },
  { id: "q4", aud: 5.825, img: "pact", stat: "ऑपरेशन फ़ोर्टिट्यूड", statColor: YELLOW, cap: "नक़ली सेना। रबर के टैंक।", pan: 1 },
  { id: "q5", aud: 5.172, img: "map_expand", cap: "जर्मनी कैले पर टकटकी लगाए बैठा रहा।", pan: -1 },
  { id: "q6", aud: 3.317, img: "dday", stat: "6 जून 1944", statColor: RED, cap: "सुबह से पहले का अंधेरा।", pan: 1 },
  { id: "q7", aud: 7.419, img: "dday", stat: "7,000 जहाज़ · 1,56,000 सैनिक", cap: "सबसे बड़ा समुद्री हमला।", pan: -1 },
  { id: "q8", aud: 4.232, img: "dday", cap: "पाँच समुद्र तटों पर, एक साथ।", pan: 1 },
  { id: "q9", aud: 3.788, img: "dday", stat: "यूटा · ओमाहा · गोल्ड · जूनो · स्वोर्ड", cap: "पाँच नाम, एक सुबह।", pan: -1 },
  { id: "q10", aud: 3.971, img: "dday", cap: "ओमाहा पर क़यामत थी।", pan: 1 },
  { id: "q11", aud: 3.317, img: "dday", cap: "कई दस्तों में आधे से ज़्यादा गिर गए।", pan: -1 },
  { id: "q12", aud: 3.736, img: "dday", stat: "शाम तक — पाँचों तट फ़तह", statColor: YELLOW, cap: "क़दम जम गए।", pan: 1 },
  { id: "q13", aud: 5.407, img: "dictator", cap: "और हिटलर? घंटों सोता रहा।", pan: -1 },
  { id: "q14", aud: 4.937, img: "map_expand", cap: "जर्मनी हफ़्तों कैले का इंतज़ार करता रहा।", pan: 1 },
  { id: "q15", aud: 2.351, img: "tanks", cap: "नॉरमैंडी से सेनाएँ फूट पड़ीं।", pan: -1 },
  { id: "q16", aud: 2.847, img: "paris", stat: "25 अगस्त 1944 · पेरिस आज़ाद", statColor: YELLOW, cap: "चार साल बाद।", pan: 1 },
  { id: "q17", aud: 4.284, img: "paris", cap: "जश्न, आँसू, और झंडे।", pan: -1 },
  { id: "q18", aud: 5.251, img: "map_expand", stat: "दो पाटों के बीच", statColor: RED, cap: "पश्चिम से मित्र, पूर्व से सोवियत।", pan: 1 },
  { id: "q19", aud: 3.344, img: "warhook", cap: "दोनों की मंज़िल — बर्लिन।", pan: -1 },

  // ── CH13 · पतन ──
  { id: "u_t", aud: 2.142, chapter: "अध्याय 13\nपतन" },
  { id: "u1", aud: 6.792, img: "map_expand", stat: "ऑपरेशन बागरातिओन", statColor: RED, cap: "पूरा आर्मी ग्रुप मिटा दिया गया।", pan: 1 },
  { id: "u2", aud: 3.004, img: "map_expand", cap: "पश्चिम से — राइन की ओर।", pan: -1 },
  { id: "u3", aud: 5.512, img: "winter", stat: "दिसंबर 1944 · आर्देन", cap: "हिटलर का आख़िरी जुआ।", pan: 1 },
  { id: "u4", aud: 3.892, img: "winter", stat: "Battle of the Bulge", statColor: RED, cap: "सबसे ख़ूनी अमेरिकी लड़ाई।", pan: -1 },
  { id: "u5", aud: 4.049, img: "tanks", cap: "जुआ फेल — ईंधन ही नहीं था।", pan: 1 },
  { id: "u6", aud: 4.937, img: "warhook", cap: "न सैनिक, न तेल, न वक़्त।", pan: -1 },
  { id: "u7", aud: 2.351, img: "angrycrowd", cap: "बूढ़े और बच्चे मोर्चे पर।", pan: 1 },
  { id: "u8", aud: 2.351, img: "warhook", cap: "शहर दर शहर — मलबा।", pan: -1 },
  { id: "u9", aud: 5.329, img: "map_expand", stat: "बर्लिन के दरवाज़े पर · 25 लाख", statColor: RED, cap: "अप्रैल 1945।", pan: 1 },

  // ── CH14 · बंकर ──
  { id: "v_t", aud: 2.377, chapter: "अध्याय 14\nबंकर" },
  { id: "v1", aud: 3.187, img: "dictator", cap: "हिटलर अब ज़मीन के नीचे था।", pan: -1 },
  { id: "v2", aud: 3.971, img: "dictator", cap: "ऐसी सेनाओं को आदेश — जो थीं ही नहीं।", pan: 1 },
  { id: "v3", aud: 5.329, img: "warhook", stat: "20 अप्रैल · 56वाँ जन्मदिन", cap: "ऊपर गोले बरस रहे थे।", pan: -1 },
  { id: "v4", aud: 4.963, img: "warhook", stat: "30 अप्रैल 1945", statColor: RED, cap: "सोवियत सैनिक कुछ सौ मीटर दूर…", pan: 1 },
  { id: "v5", aud: 2.038, cap: "हिटलर ने ख़ुद को गोली मार ली।", pan: -1 },
  { id: "v6", aud: 5.825, img: "reflect", cap: "बिना मुक़दमे। बिना जवाब दिए।", pan: 1 },
  { id: "v7", aud: 3.239, img: "warhook", stat: "रैहस्टाग पर लाल झंडा", cap: "दो दिन बाद।", pan: -1 },
  { id: "v8", aud: 5.590, img: "veday", stat: "8 मई 1945 · VE Day", statColor: YELLOW, cap: "यूरोप में जंग ख़त्म।", pan: 1 },
  { id: "v9", aud: 4.467, img: "veday", cap: "लंदन से मॉस्को तक जश्न।", pan: -1 },
  { id: "v10", aud: 3.239, img: "map_asia", cap: "पर प्रशांत में जंग ज़िंदा थी।", pan: 1 },

  // ── CH15 · सूरज से भी तेज़ रोशनी ──
  { id: "x_t", aud: 3.265, chapter: "अध्याय 15\nसूरज से भी तेज़ रोशनी" },
  { id: "x1", aud: 3.422, img: "map_asia", cap: "जापान हार रहा था — मान नहीं रहा था।", pan: -1 },
  { id: "x2", aud: 4.049, img: "midway", cap: "इवो जीमा। ओकिनावा। आख़िरी आदमी तक।", pan: 1 },
  { id: "x3", aud: 4.545, img: "map_asia", cap: "सीधे हमले में — लाखों और मरते।", pan: -1 },
  { id: "x4", aud: 5.172, stat: "मैनहट्टन प्रोजेक्ट", cap: "रेगिस्तान में एक गुप्त परीक्षण।", pan: 1 },
  { id: "x5", aud: 2.194, img: "mushroom", cap: "इंसान ने परमाणु तोड़ना सीख लिया।", pan: -1 },
  { id: "x6", aud: 4.049, img: "mushroom", stat: "हिरोशिमा · 6 अगस्त 1945", statColor: RED, cap: "सुबह सवा आठ बजे।", pan: 1 },
  { id: "x7", aud: 6.295, img: "mushroom", stat: "~1,40,000 मौतें", cap: "एक बम। एक शहर।", pan: -1 },
  { id: "x8", aud: 2.534, img: "mushroom", stat: "नागासाकी · 9 अगस्त", cap: "तीन दिन बाद।", pan: 1 },
  { id: "x9", aud: 5.512, cap: "सम्राट की आवाज़ — पहली बार रेडियो पर।", pan: -1 },
  { id: "x10", aud: 6.792, img: "missouri", stat: "2 सितंबर 1945", statColor: YELLOW, cap: "दूसरा विश्वयुद्ध समाप्त।", pan: 1 },
  { id: "x11", aud: 3.004, img: "reflect", stat: "6–8 करोड़", cap: "छह साल की क़ीमत।", pan: -1 },
  { id: "x12", aud: 4.389, img: "mushroom", cap: "क्या बम गिराना ज़रूरी था?", pan: 1 },
  { id: "x13", aud: 2.926, img: "reflect", cap: "इतिहास सिर्फ़ चेतावनी देता है।", pan: -1 },

  // ── CH16 · राख से नई दुनिया ──
  { id: "y_t", aud: 2.691, chapter: "अध्याय 16\nराख से नई दुनिया" },
  { id: "y1", aud: 3.814, img: "sides", cap: "नक्शा नहीं — ढांचा बदला।", pan: 1 },
  { id: "y2", aud: 2.586, img: "warhook", cap: "पुरानी महाशक्तियाँ कंगाल।", pan: -1 },
  { id: "y3", aud: 4.389, img: "sides", stat: "USA · USSR", cap: "दो नई महाशक्तियाँ।", pan: 1 },
  { id: "y4", aud: 3.736, img: "sides", stat: "शीत युद्ध", statColor: RED, cap: "दोस्ती जल्दी तन गई।", pan: -1 },
  { id: "y5", aud: 3.814, stat: "संयुक्त राष्ट्र · 1945", cap: "फिर कभी नहीं — इस उम्मीद में।", pan: 1 },
  { id: "y6", aud: 4.441, img: "treaty", stat: "नूर्नबर्ग मुक़दमे", cap: "पहली बार — नेताओं पर मुक़दमा।", pan: -1 },
  { id: "y7", aud: 3.788, img: "map_expand", cap: "साम्राज्यों की पकड़ टूट गई।", pan: 1 },
  { id: "y8", aud: 3.396, img: "indianarmy", cap: "उपनिवेशों ने हिसाब माँगा।", pan: -1 },
  { id: "y9", aud: 5.094, img: "indianarmy", stat: "1947 · भारत आज़ाद", statColor: YELLOW, cap: "फिर पूरा एशिया और अफ़्रीका।", pan: 1 },
  { id: "y10", aud: 4.859, img: "reflect", cap: "साम्राज्य बचाने की जंग ने साम्राज्य ख़त्म किए।", pan: -1 },

  // ── CH17 · सबक + CTA ──
  { id: "z_t", aud: 2.455, chapter: "आख़िरी अध्याय\nसबक" },
  { id: "z1", aud: 2.116, img: "reflect", cap: "ये जंग हमें क्या सिखाती है?", pan: 1 },
  { id: "z2", aud: 3.004, img: "angrycrowd", cap: "अपमान और ग़रीबी से नफ़रत उगती है।", pan: -1 },
  { id: "z3", aud: 3.082, img: "rally", cap: "नफ़रत को नेता मिले, तो वो नीति बनती है।", pan: 1 },
  { id: "z4", aud: 3.004, img: "munich", cap: "ख़तरे को नज़रअंदाज़ करना उसे बड़ा करता है।", pan: -1 },
  { id: "z5", aud: 3.892, img: "warhook", cap: "जंग शुरू करना आसान है। रोकना नहीं।", pan: 1 },
  { id: "z6", aud: 3.396, img: "reflect", stat: "6 करोड़", cap: "हर संख्या एक नाम थी।", pan: -1 },
  { id: "z7", aud: 4.780, img: "reflect", cap: "इतिहास दोहराता नहीं — पर तुक मिलाता है।", pan: 1 },
  { id: "z8", aud: 3.004, chapter: "💡\nदिमाग़ की बत्ती" },
  { id: "z9", aud: 5.590, img: "reflect", cap: "Subscribe करें — हर मुद्दा, आसान भाषा में। 💡", pan: -1 },
  { id: "z10", aud: 6.792, stat: "अगली कहानी: ईस्ट इंडिया कंपनी", statColor: YELLOW, cap: "एक कंपनी, जिसने पूरा देश ग़ुलाम बना लिया।", pan: 1 },
];

const AVAILABLE = new Set<string>([
  "warhook", "treaty", "hyperinflation", "depression", "breadline", "rally",
  "podium", "dictator", "suppress", "rearm", "map_expand", "munich", "tanks",
  "pact", "map_poland", "blitz", "wardeclare", "sides", "reflect", "angrycrowd",
  "dunkirk", "carriage", "maginot", "indianarmy",
  "churchill", "spitfire", "blitzlondon", "barbarossa", "winter", "pearl",
  "map_asia", "factory", "auschwitz", "ghetto",
  "rommel", "afrikakorps", "alamein", "bose", "kohima",
  "stalingrad", "paulus", "midway", "akagi",
  "kursk", "dday", "paris", "mushroom", "missouri", "veday",
]);

const LEAD = 10, HOLD = 18;
const sceneFrames = (s: Scene) => LEAD + Math.round(s.aud * FPS) + HOLD;
export const ww2EpicTotalFrames = () => SCENES.reduce((a, s) => a + sceneFrames(s), 0);

const img = (id: string) => staticFile(`shorts/ww2epic/images/${id}.png`);
const aud = (id: string) => staticFile(`shorts/ww2epic/audio/${id}.mp3`);

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
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(14,17,22,0.62) 0%, transparent 24%, transparent 58%, rgba(14,17,22,0.92) 100%)", pointerEvents: "none" }} />

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

export const WW2Epic: React.FC = () => {
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
