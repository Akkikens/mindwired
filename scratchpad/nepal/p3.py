# -*- coding: utf-8 -*-
import json
S=[]
def s(**kw): S.append(kw)

# ---------- CH 4 — INDIA ----------
s(id="c4", chapter="4 — भारत तक\nसाढ़े सात घंटे", text="अध्याय चार। भारत तक साढ़े सात घंटे।",
  img="map_1", query="Nepal India border rivers map")
s(id="e1", text="अब वो हिस्सा, जो हम भारत में बैठे लोगों के लिए सबसे ज़रूरी है।",
  img="map_1", query="Nepal India map rivers", stock=True, tone="tension")
s(id="e2", text="आई सी आई एम ओ डी के सस्वत सान्याल के मुताबिक़, रसुवा से चला पानी का सबसे ऊँचा हिस्सा त्रिवेणी तक — यानी भारत की सीमा के पास — लगभग साढ़े सात घंटे में पहुँच गया।",
  img="triveni_1", query="river border India Nepal plains", stock=True,
  stat="7.5 घंटे", source="Saswata Sanyal, ICIMOD / BBC", cap="सीमा तक, साढ़े सात घंटे में।", extraHold=26, tone="dread")
s(id="e3", text="सुबह नौ बजे पहाड़ में जो टूटा, वो दोपहर के खाने से पहले भारत के दरवाज़े पर था।",
  kinetic={"words": ["दोपहर", "से", "पहले।"]},
  img="triveni_1", query="river plains border", stock=True, extraHold=24, tone="dread")
s(id="e4", text="भारतीय विदेश मंत्रालय के मुताबिक़ कम से कम तीन सौ बीस भारतीय नागरिक लापता बताए गए। भारत ने वायुसेना के विमान से लगभग पचास टन राहत सामग्री भेजी।",
  img="rescue_1", query="relief aid cargo aircraft", stock=True, tone="melancholy")
s(id="e5", text="लेकिन यहाँ मुझे एक बात ईमानदारी से कहनी है। हमें भारत के अंदर इस बाढ़ से हुई मौतों, या किसी बाँध से पानी छोड़े जाने की कोई पुष्ट रिपोर्ट नहीं मिली।",
  img="map_1", query="India Nepal map", stock=True, cap="ये पुष्ट नहीं है।", tone="unease")
s(id="e6", text="और एक और ग़लतफ़हमी ठीक कर देते हैं। इन दिनों उत्तर प्रदेश के इकतीस ज़िलों में बाढ़ है। वो नेपाल की इस घटना से नहीं आई। वो सामान्य मानसून की बाढ़ है — मंदाकिनी, पांडु और गंगा की।",
  img="up_flood_1", query="Uttar Pradesh monsoon flood village", stock=True,
  cap="ये अलग घटना है।", tone="unease")
s(id="e7", text="दो अलग घटनाओं को जोड़ देना आसान है। लेकिन सही नहीं है।",
  img="up_flood_1", query="monsoon flood India", stock=True, extraHold=20, tone="melancholy")

# ---------- CH 5 — THE STRUCTURAL STORY + DEBUNK ----------
s(id="c5", chapter="5 — “नेपाल पानी\nछोड़ देता है”", text="अध्याय पाँच। नेपाल पानी छोड़ देता है।",
  img="barrage_1", query="river barrage gates India")
s(id="f1", text="हर साल जब बिहार में बाढ़ आती है, एक बात ज़रूर सुनाई देती है। नेपाल ने पानी छोड़ दिया।",
  img="barrage_1", query="river barrage gates flood", stock=True, cap="“नेपाल ने पानी छोड़ा।”", tone="tension")
s(id="f2", text="ये बात ग़लत है। और इसकी वजह बहुत सीधी है।",
  kinetic={"words": ["ये", "बात", "ग़लत", "है।"]},
  img="barrage_1", query="river barrage gates", stock=True, extraHold=24, tone="dread")
s(id="f3", text="पानी छोड़ने के लिए पहले पानी रोकना पड़ता है। और नेपाल के पास रोकने के लिए बड़े बाँध हैं ही नहीं। नेपाल का सबसे बड़ा जलाशय कुलेखानी है — उसकी क्षमता शून्य दशमलव एक घन किलोमीटर से भी कम है।",
  img="dam_1", query="small hydropower dam reservoir mountains", stock=True,
  stat="कुलेखानी < 0.1 km³", source="Saswata Sanyal, ICIMOD", tone="curiosity")
s(id="f4", text="सान्याल के शब्दों में — छोड़ने के लिए कुछ है ही नहीं।",
  img="dam_1", query="small dam reservoir", stock=True, cap="“छोड़ने के लिए कुछ है ही नहीं।”", extraHold=22, tone="awe")
s(id="f5", text="और कोसी और गंडक बैराज — जिनके गेट खुलने की तस्वीरें हर साल वायरल होती हैं — वो नेपाल नहीं चलाता। वो भारत चलाता है।",
  kinetic={"words": ["वो", "बैराज", "भारत", "चलाता", "है।"]},
  img="barrage_1", query="barrage gates open river", stock=True, extraHold=28, tone="awe")
s(id="f6", text="तो फिर बिहार में बाढ़ आती क्यों है? क्योंकि भूगोल ऐसा है। गंगा के सालाना बहाव का लगभग चालीस प्रतिशत नेपाल से आता है।",
  img="map_1", query="Ganges river basin map", stock=True, stat="गंगा का ~40% बहाव", tone="curiosity")
s(id="f7", text="कोसी, गंडक, बागमती, कमला — ये सब नेपाल से निकलती हैं। और उत्तरी बिहार का लगभग तीन-चौथाई हिस्सा आधिकारिक तौर पर बाढ़-प्रवण घोषित है।",
  img="bihar_1", query="Bihar flood plains village water", stock=True,
  stat="उत्तरी बिहार का ¾ हिस्सा", tone="dread")
s(id="f8", text="और दो हज़ार आठ की कोसी त्रासदी याद कीजिए। लगभग चार सौ लोग मारे गए थे। लेकिन आई आई टी कानपुर के राजीव सिन्हा बताते हैं कि उस दिन नदी में उसकी क्षमता का सिर्फ़ दसवाँ हिस्सा पानी था।",
  img="bihar_1", query="Bihar flood embankment breach", stock=True, tone="dread")
s(id="f9", text="बाँध इसलिए नहीं टूटा कि पानी ज़्यादा था। वो इसलिए टूटा क्योंकि पचास और साठ के दशक में बना तटबंध ठीक से संभाला नहीं गया था। सिन्हा के शब्दों में — ये ढाँचागत नाकामी थी, पानी की नहीं।",
  kinetic={"words": ["ढाँचागत", "नाकामी।", "पानी", "की", "नहीं।"]},
  img="bihar_1", query="embankment breach flood", stock=True,
  source="Rajiv Sinha, IIT Kanpur", extraHold=28, tone="melancholy")
json.dump(S, open('scratchpad/nepal/part3.json','w'), ensure_ascii=False, indent=1)
print("part3:", len(S), "scenes,", sum(len(x.get('text','').split()) for x in S), "words")
