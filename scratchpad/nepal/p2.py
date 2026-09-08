# -*- coding: utf-8 -*-
import json
S=[]
def s(**kw): S.append(kw)

# ---------- CH 2 — THE WATER PUZZLE ----------
s(id="c2", chapter="2 — इतना पानी\nआया कहाँ से?", text="अध्याय दो। इतना पानी आया कहाँ से?",
  img="flood_1", query="himalayan river flood muddy water")
s(id="b1", text="अब वो सवाल, जिसने वैज्ञानिकों को सबसे ज़्यादा उलझाया।",
  img="glacier_1", query="Himalaya glacier ice", stock=True, tone="mystery")
s(id="b2", text="सोचिए — जो गिरा वो ज़्यादातर बर्फ़ और चट्टान थी। तो इतना सारा पानी बना कैसे? सीधा जवाब लगता है — रगड़ से बर्फ़ पिघल गई होगी।",
  img="glacier_2", query="ice melting water glacier", stock=True, tone="curiosity")
s(id="b3", text="चलिए इसका हिसाब लगाते हैं। ये गणित आसान है, और ये आपको जवाब के क़रीब ले जाएगा।",
  img="physics_1", query="physics equation chalkboard calculation", stock=True, tone="curiosity")
s(id="b4", text="बारह सौ मीटर की ऊँचाई से गिरने पर, हर किलोग्राम बर्फ़ को लगभग ग्यारह दशमलव आठ किलोजूल ऊर्जा मिलती है।",
  img="physics_1", query="physics equation chalkboard", stock=True, stat="11.8 kJ/kg", tone="curiosity")
s(id="b5", text="और एक किलोग्राम बर्फ़ को पिघलाने के लिए चाहिए — तीन सौ चौंतीस किलोजूल।",
  img="physics_1", query="physics equation chalkboard", stock=True, stat="334 kJ/kg चाहिए", tone="curiosity")
s(id="b6", text="मतलब अगर गिरने की सारी ऊर्जा, सौ प्रतिशत, सिर्फ़ बर्फ़ पिघलाने में लग जाती — तब भी सिर्फ़ साढ़े तीन प्रतिशत बर्फ़ पिघलती।",
  kinetic={"words": ["सिर्फ़", "साढ़े", "तीन", "प्रतिशत।"]},
  img="physics_1", query="physics equation chalkboard", stock=True,
  stat="अधिकतम ~3.5%", extraHold=28, tone="awe")
s(id="b7", text="और असल में तो ऊर्जा आवाज़ में, गर्मी में, चट्टान तोड़ने में भी जाती है। तो असली आँकड़ा इससे भी कम होगा।",
  img="physics_1", query="physics equation chalkboard", stock=True, tone="curiosity")
s(id="b8", text="ये हिसाब मेरा है, किसी वैज्ञानिक का बयान नहीं। लेकिन ये दिखाता है कि सवाल असली है — सिर्फ़ पिघलने से इतना पानी नहीं बन सकता।",
  img="physics_1", query="physics equation chalkboard", stock=True,
  cap="ये गणना है, दावा नहीं।", tone="unease")
s(id="b9", text="ब्रिटेन के भूवैज्ञानिक डेव पेटली ने पहले ही दिन लिखा — पानी का स्रोत इस घटना का सबसे दिलचस्प हिस्सा है। और उन्होंने साफ़ जोड़ा कि वो अनुमान लगा रहे हैं।",
  img="scientist_1", query="geologist scientist research desk", stock=True,
  source="Dave Petley, The Landslide Blog, 26 Aug 2026", tone="curiosity")
s(id="b10", text="तो जवाब क्या है? दो हिस्सों में है, और दोनों पिघलने से ज़्यादा दिलचस्प हैं।",
  img="flood_1", query="muddy flood water debris", stock=True, tone="tension")
s(id="b11", text="पहला — जो मलबा नीचे आया, उसमें पहले से पानी मौजूद था। मिट्टी में, चट्टानों के बीच, बर्फ़ के अंदर। शोधकर्ता सुनवी मास्के के मुताबिक़ रगड़ से कुछ बर्फ़ ज़रूर पिघली, पर साथ में ये फँसा हुआ पानी भी बहा।",
  img="debris_1", query="wet mud debris flow sediment", stock=True, tone="curiosity")
s(id="b12", text="और दूसरा, जो असली वजह है। कोलंबिया वॉटर सेंटर के निदेशक उपमन्यु लाल कहते हैं — पानी को कई गुना बढ़ाने वाली चीज़ पिघलना नहीं थी। वो था नदी का रुकना।",
  img="landslide_dam_1", query="landslide natural dam blocked river", stock=True,
  source="Upmanu Lall, Columbia Water Center", cap="असली वजह — नदी का रुकना।", tone="awe")
s(id="b13", text="नदी अपनी सामान्य रफ़्तार से बहती रही। बाँध के पीछे जमा होती रही। और जब बाँध टूटा, तो घंटों का जमा हुआ पानी — कुछ ही मिनटों में निकल गया।",
  kinetic={"words": ["घंटों", "का", "पानी।", "मिनटों", "में।"]},
  img="landslide_dam_1", query="dam burst water release", stock=True, extraHold=28, tone="dread")
s(id="b14", text="यानी रहस्य ये नहीं था कि पानी कहाँ से पैदा हुआ। पानी तो नदी का ही था। रहस्य ये था कि वो सारा पानी एक साथ कैसे आ गया।",
  img="flood_2", query="flash flood torrent", stock=True, extraHold=24, tone="awe")

# ---------- CH 3 — GLOF confusion ----------
s(id="c3", chapter="3 — ये वो बाढ़\nनहीं थी", text="अध्याय तीन। ये वो बाढ़ नहीं थी।",
  img="glacier_lake_1", query="glacial lake himalaya turquoise")
s(id="d1", text="यहाँ एक बहुत बड़ी ग़लतफ़हमी है, जो इंटरनेट पर तेज़ी से फैल रही है। और मैं चाहता हूँ कि आप इसे ठीक से समझ लें।",
  img="glacier_lake_1", query="glacial lake himalaya", stock=True, tone="unease")
s(id="d2", text="आपने शायद सुना हो कि ये ग्लेशियर झील फटने से आई बाढ़ थी। अंग्रेज़ी में इसे कहते हैं ग्लोफ़ — जब ऊपर बनी बर्फ़ की झील अचानक फूट पड़ती है।",
  img="glacier_lake_1", query="glacial lake himalaya", stock=True, cap="GLOF क्या है?", tone="curiosity")
s(id="d3", text="ठीक इसी जगह पर, ठीक चौदह महीने पहले — आठ जुलाई दो हज़ार पच्चीस को — बाढ़ आई थी। और वो सचमुच ग्लोफ़ थी। तिब्बत में ग्लेशियर के ऊपर बनी एक झील फूटी थी।",
  img="glacier_lake_1", query="glacial lake outburst himalaya", stock=True,
  stat="8 जुलाई 2025 — वो GLOF थी", source="DHM / ICIMOD", tone="tension")
s(id="d4", text="लेकिन दो हज़ार छब्बीस वाली ये घटना — वैज्ञानिकों के मुताबिक़ शायद ग्लोफ़ थी ही नहीं।",
  kinetic={"words": ["ये", "शायद", "GLOF", "थी", "ही", "नहीं।"]},
  img="glacier_2", query="rockfall ice avalanche", stock=True, extraHold=26, tone="dread")
s(id="d5", text="डेव पेटली के शब्दों में — इस बात का कोई सबूत नहीं है कि ये ग्लोफ़ थी। आई सी आई एम ओ डी और नेपाल का विभाग भी इसे चट्टान और बर्फ़ का हिमस्खलन मानते हैं, झील का फटना नहीं।",
  img="glacier_2", query="rock ice avalanche mountain", stock=True,
  source="Dave Petley, 26 Aug 2026", tone="unease")
s(id="d6", text="एक ही नदी। एक ही जगह। चौदह महीने का फ़ासला। और दो बिल्कुल अलग वजहें। जो चैनल इन दोनों को एक बता रहे हैं, वो आपको ग़लत जानकारी दे रहे हैं।",
  img="valley_1", query="himalayan river valley", stock=True, extraHold=24, tone="melancholy")
s(id="d7", text="और हाँ — एक बात साफ़ कर दूँ। नासा ने इस घटना पर अब तक कुछ भी प्रकाशित नहीं किया है। अगर कोई वीडियो कहता है नासा के वैज्ञानिकों ने ये कहा, तो वो बात गढ़ी हुई है।",
  img="scientist_1", query="satellite earth observation", stock=True,
  cap="नासा ने कुछ नहीं कहा।", extraHold=22, tone="unease")
json.dump(S, open('scratchpad/nepal/part2.json','w'), ensure_ascii=False, indent=1)
print("part2:", len(S), "scenes,", sum(len(x.get('text','').split()) for x in S), "words")
