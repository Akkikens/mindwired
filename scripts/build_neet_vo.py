#!/usr/bin/env python3
"""DimaagBatti — NEET-leak explainer: Rohan Hindi VO for all 34 beats.

Generates one mp3 per beat into public/shorts/neet16/audio/<id>.mp3 via Cartesia
(Rohan Hindi voice, language="hi"), then prints each clip's real duration so the
NeetWide comp scene list can be filled in accurately.

Idempotent: skips a beat whose mp3 already exists (never re-spends). Delete a file
to regenerate it. Run with the lipsync venv (has httpx):

    .venv-lipsync/bin/python scripts/build_neet_vo.py [--only hook,exam,...] [--force]
"""
from __future__ import annotations

import argparse
import subprocess
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent / "lib"))
import cartesia  # noqa: E402

REPO = Path(__file__).resolve().parent.parent
OUT = REPO / "public" / "shorts" / "neet16" / "audio"
ROHAN = "4877b818-c7fe-4c89-b1cf-eadf8e23da72"

# (id, Hindi VO). Facts/numbers/quotes are also overlaid crisply in the comp;
# Durov's verbatim English shows on-screen while Rohan reads a faithful Hindi
# rendering framed as a translation ("दुरोव के शब्दों में").
BEATS: list[tuple[str, str]] = [
    ("hook", "बीस लाख से ज़्यादा बच्चे। एक परीक्षा। और एक लीक जिसने सब कुछ हिला दिया।"),
    ("exam", "तीन मई की NEET-UG — भारत की सबसे बड़ी मेडिकल प्रवेश परीक्षा।"),
    ("leak", "परीक्षा से पहले, करीब एक सौ बीस सवाल टेलीग्राम पर घूमने लगे — राजस्थान से।"),
    ("match", "ये सवाल लीक हुए गेस पेपर से मैच कर गए। भरोसा टूट गया।"),
    ("cancel", "एन-टी-ए ने परीक्षा रद्द कर दी।"),
    ("precedent", "शक की एक वजह पुरानी भी थी। बीस चौबीस में अस्सी से ज़्यादा बच्चों ने पूरे सात सौ बीस में से सात सौ बीस नंबर पाए थे।"),
    ("rare", "जबकि दो हज़ार सोलह से बीस चौबीस तक, सिर्फ़ सात बच्चों ने ऐसा किया था।"),
    ("retest", "आख़िरकार दोबारा परीक्षा हुई — इक्कीस जून को।"),
    ("cost1", "लेकिन इस पूरे संकट की कीमत सिर्फ़ नंबरों में नहीं थी।"),
    ("cost2", "देशभर में तेरह छात्रों की आत्महत्या की ख़बरें आईं। हर आँकड़ा एक परिवार है।"),
    ("ban", "इसके बाद सरकार और एन-टी-ए ने एक बड़ा कदम उठाया।"),
    ("bandate", "सोलह से बाईस जून तक टेलीग्राम पर रोक लगा दी गई।"),
    ("why1", "आरोप था कि चीटिंग रैकेट यहाँ लीक पेपर बेच रहे थे।"),
    ("why2", "कीमत हज़ारों से लेकर लाखों रुपये तक।"),
    ("why3", "और मैसेज एडिट करके, पुरानी तारीख़ के फ़र्ज़ी लीक भी दिखाए जाते थे।"),
    ("temp", "ये रोक अस्थायी थी और सिर्फ़ इसी परीक्षा से जुड़ी हुई।"),
    ("durov1", "टेलीग्राम के सी-ई-ओ पावेल दुरोव ने इस पर प्रतिक्रिया दी। उनके शब्दों में:"),
    ("durov2", "ये भारत के पंद्रह करोड़ आम टेलीग्राम यूज़र्स को सज़ा देता है — उन अंदरूनी लोगों को नहीं जिन्होंने पेपर लीक किया।"),
    ("durov3", "उन्होंने ये भी कहा कि लीक बस दूसरे ऐप्स पर चले गए।"),
    ("durov4", "टेलीग्राम ने सैकड़ों चैनल हटाए और एडिटेड लेबल को और साफ़ दिखाया।"),
    ("court", "टेलीग्राम ने इस बैन को दिल्ली हाई कोर्ट में चुनौती दी।"),
    ("verdict", "लेकिन कोर्ट ने रोक बरकरार रखी। जज तेजस करिया के मुताबिक ये कदम सबसे कम प्रतिबंधात्मक और आनुपातिक था। मैसेज एडिट करने की सुविधा तीस जून तक बंद रखी गई।"),
    ("pivot", "लेकिन ग़ुस्सा सिर्फ़ ऐप तक सीमित नहीं रहा। ये सड़कों तक पहुँचा।"),
    ("wang1", "अट्ठाईस जून से, जंतर-मंतर पर सोनम वांगचुक भूख हड़ताल पर बैठे।"),
    ("wang2", "उनके साथ थी कॉकरोच जनता पार्टी और छात्र संगठन।"),
    ("cjporigin", "इस आंदोलन का चेहरा बनी कॉकरोच जनता पार्टी। मई 2026 में अभिजीत डिपके ने इसे शुरू किया, और ये तेज़ी से युवाओं का ऑनलाइन आंदोलन बन गई।"),
    ("wang3", "उनकी माँग: शिक्षा मंत्री धर्मेंद्र प्रधान का इस्तीफ़ा।"),
    ("broader", "माँग सिर्फ़ वांगचुक की नहीं थी। कांग्रेस, विपक्षी नेताओं और तिहत्तर पूर्व नौकरशाहों ने भी प्रधान के इस्तीफ़े की माँग की।"),
    ("wang4", "और लद्दाख के लिए संविधान की छठी अनुसूची।"),
    ("wang5", "वांगचुक के शब्दों में — छह हफ़्ते, या मौत।"),
    ("cjp", "सी-जे-पी ने आत्महत्या पीड़ितों के परिवारों के लिए एक करोड़ रुपये मुआवज़े की माँग की।"),
    ("follower", "आज कॉकरोच जनता पार्टी के इंस्टाग्राम पर दो करोड़ से ज़्यादा फॉलोअर्स हैं। ये आंदोलन बहुत तेज़ी से बढ़ा है।"),
    ("appeal", "वांगचुक, अभिजीत डिपके और सी-जे-पी देश के युवाओं से साथ आने की अपील कर रहे हैं, और धर्मेंद्र प्रधान के इस्तीफ़े की माँग कर रहे हैं।"),
    ("standup", "जिन छात्रों ने अपनी जान गँवाई — ये सवाल उनके भी हैं, और आपके भी। आप क्या सोचते हैं?"),
    ("neutral", "दिमाग़बत्ती किसी पर आरोप नहीं लगाता। ये सिर्फ़ रिपोर्ट है — मांगें और बयान, जैसे कहे गए।"),
    ("results", "इक्कीस जून को दोबारा परीक्षा हुई। NTA ने नए लीक के दावों को फ़र्ज़ी बताया। नतीजे करीब बीस जुलाई तक आने की उम्मीद है।"),
    ("recap", "एक लीक। एक बैन। एक हड़ताल। और लाखों बच्चे जो जवाब चाहते हैं।"),
    ("help1", "अगर आप या आपका कोई अपना तनाव या निराशा से जूझ रहा है — अकेले मत जूझिए।"),
    ("help2", "भारत सरकार की मानसिक स्वास्थ्य हेल्पलाइन टेली-मानस पर कॉल करें — चौदह चार एक छह।"),
    ("batti", "समझे? यही है दिमाग़ की बत्ती जलना।"),
    ("cta", "हर मुद्दा, आसान भाषा में। सब्सक्राइब करना मत भूलिए।"),
]


def duration(path: Path) -> float:
    out = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration",
         "-of", "default=noprint_wrappers=1:nokey=1", str(path)],
        capture_output=True, text=True,
    )
    try:
        return float(out.stdout.strip())
    except ValueError:
        return 0.0


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--only", default="", help="comma-separated beat ids")
    ap.add_argument("--force", action="store_true")
    args = ap.parse_args()
    OUT.mkdir(parents=True, exist_ok=True)
    only = {s.strip() for s in args.only.split(",") if s.strip()}

    durations: list[tuple[str, float]] = []
    for bid, text in BEATS:
        if only and bid not in only:
            continue
        dst = OUT / f"{bid}.mp3"
        if dst.exists() and not args.force:
            print(f"skip {bid} (exists)")
        else:
            # help/cost beats read slower & sombre; keep others steady/deliberate.
            slow = bid in {"cost1", "cost2", "help1", "help2"}
            audio = cartesia.tts(text, voice=ROHAN, language="hi",
                                 speed=0.90 if slow else 0.95)
            dst.write_bytes(audio)
            print(f"->  {bid}.mp3  ({len(audio)} bytes)")
        durations.append((bid, duration(dst)))

    print("\n--- durations (paste into NeetWide SCENES) ---")
    for bid, d in durations:
        print(f'  {{ id: "{bid}", aud: {d:.3f} }},')


if __name__ == "__main__":
    main()
