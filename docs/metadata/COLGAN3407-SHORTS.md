# Colgan Air 3407 — SHORTS package (Black Box Breakdown)

3 vertical Shorts (1080×1920, −14 LUFS, Reid subscribe outro baked on). Each reuses
the long-form's real audio (labeled ACTUAL ATC RECORDING / CVR RECREATION). English only.
Comps: `ColganShort1/2/3` (src/blackbox/BlackBoxShort.tsx). Files at repo root.

**Publishing notes (all 3):**
- Set **#Shorts** in the title or first line so YouTube files it as a Short.
- Category: **Education**. Language: English.
- Each links back to the full doc → drives the funnel. Paste the real long-form URL where marked.
- Post 1 every 2–3 days (not all at once) to keep the channel active and funnel steadily.

---

## SHORT 1 — `blackbox_colgan3407_short1.mp4` (39s) · "$16,000 A YEAR"
**Title**
```
She earned $16,000 a year to fly you 😰 #shorts
```
Alts: `The pilot flying you made $16,000 a year` · `$16,000 a year — the pay behind a plane crash`

**Description**
```
The first officer of Colgan Air 3407 earned $15,800 a year and flew overnight across the country, unpaid, just to get to work — exhausted, before a single passenger boarded. This is the pay behind one of America's deadliest crashes.

Full breakdown (real ATC audio + the NTSB reconstruction): https://youtu.be/Oh8YpgbudHQ
▶ Subscribe: https://www.youtube.com/@Watch-BlackBox?sub_confirmation=1

Cockpit line is a labeled recreation from the NTSB public transcript.

#Shorts #ColganAir #PilotPay #Aviation #PlaneCrash #FlyingCheap #PilotFatigue #NTSB #BlackBox #TrueStory
```
**Search-query cluster:** how much do regional pilots make · pilot pay · why are pilots underpaid · colgan air pilot salary · pilot fatigue crash

---

## SHORT 2 — `blackbox_colgan3407_short2.mp4` (62s) · "The last 27 seconds"
**Title**
```
A working plane fell out of the sky in 27 seconds ✈️ #shorts
```
Alts: `The 27 seconds that doomed Colgan 3407` · `He did the OPPOSITE of the stall recovery`

**Description**
```
When the stall warning fired, the recovery is the first thing every pilot learns — push down, add power. The captain of Colgan Air 3407 did the exact opposite, and fought the system trying to save the plane. 27 seconds later it was over. This is the actual NTSB reconstruction.

Full breakdown: https://youtu.be/Oh8YpgbudHQ
▶ Subscribe: https://www.youtube.com/@Watch-BlackBox?sub_confirmation=1

Footage: NTSB reconstruction (public domain).

#Shorts #ColganAir #PlaneCrash #Aviation #AerodynamicStall #AirCrashInvestigation #NTSB #Flight3407 #BlackBox #Q400
```
**Search-query cluster:** aerodynamic stall · stick shaker stick pusher · how planes stall · colgan 3407 crash · what caused flight 3407

---

## SHORT 3 — `blackbox_colgan3407_short3.mp4` (66s) · "They blamed the ice"
**Title**
```
Everyone blamed the ice. The NTSB found something worse. #shorts
```
Alts: `The icing red herring that hid the real cause` · `It wasn't the ice that crashed Flight 3407`

**Description**
```
Winter storm, icy wings, a turboprop down on approach to Buffalo — the ice seemed obvious. But when the NTSB read the black boxes, the ice story fell apart. The plane was fully controllable. The real cause was far more uncomfortable.

Full breakdown: https://youtu.be/Oh8YpgbudHQ
▶ Subscribe: https://www.youtube.com/@Watch-BlackBox?sub_confirmation=1

Everything grounded in NTSB report AAR-10/01.

#Shorts #ColganAir #PlaneCrash #Aviation #AirCrashInvestigation #Icing #NTSB #Flight3407 #BlackBox #Buffalo
```
**Search-query cluster:** did ice cause colgan 3407 · aircraft icing crash · buffalo plane crash cause · ntsb flight 3407 findings · was it the ice

---

## Tags (~500 chars each) + 15 hashtags each

### SHORT 1 — "$16,000 A YEAR"
Tags:
```
colgan air 3407,pilot pay,regional pilot salary,how much do pilots make,first officer salary,pilot fatigue,flying cheap,underpaid pilots,rebecca shaw,colgan air flight 3407,buffalo plane crash,aviation disaster,plane crash,pilot life,regional airline,commuter pilot,airline pilot pay,pilot shortage,1500 hour rule,aviation safety,ntsb,air crash investigation,pilot fatigue crash,continental connection,exhausted pilots,black box breakdown,flight 3407,aviation shorts
```
Hashtags (15):
```
#Shorts #ColganAir #PilotPay #Aviation #PlaneCrash #FlyingCheap #PilotFatigue #NTSB #BlackBox #TrueStory #Flight3407 #AviationSafety #Pilot #AirCrashInvestigation #Documentary
```

### SHORT 2 — "The last 27 seconds"
Tags:
```
colgan air 3407,aerodynamic stall,stick shaker,stick pusher,how planes stall,stall recovery,plane crash 27 seconds,colgan air flight 3407,buffalo plane crash,ntsb reconstruction,air crash investigation,aviation disaster,plane crash,loss of control,q400,dash 8 q400,bombardier q400,pilot error,flight 3407,aviation safety,ntsb,black box breakdown,how flight 3407 crashed,stall warning,turboprop crash,aviation shorts
```
Hashtags (15):
```
#Shorts #ColganAir #PlaneCrash #Aviation #AerodynamicStall #AirCrashInvestigation #NTSB #Flight3407 #BlackBox #Q400 #StickShaker #AviationSafety #Documentary #TrueStory #PlaneCrashInvestigation
```

### SHORT 3 — "They blamed the ice"
Tags:
```
colgan air 3407,aircraft icing,did ice cause colgan 3407,buffalo plane crash,plane crash cause,icing crash,ntsb aar 10 01,red herring,air crash investigation,aviation disaster,plane crash,winter aviation,flight 3407,colgan air flight 3407,q400,dash 8,ntsb findings,aviation safety,what caused flight 3407,stall,pilot error,black box breakdown,buffalo crash,icing conditions,aviation shorts
```
Hashtags (15):
```
#Shorts #ColganAir #PlaneCrash #Aviation #AirCrashInvestigation #Icing #NTSB #Flight3407 #BlackBox #Buffalo #AviationSafety #Documentary #TrueStory #PlaneCrashInvestigation #WinterFlying
```

## Rebuild / re-render
```bash
# comps registered in src/Root.tsx (ColganShort1/2/3); engine src/blackbox/BlackBoxShort.tsx
python3 scripts/render_and_master.py ColganShort1 blackbox_colgan3407_short1.mp4
python3 scripts/render_and_master.py ColganShort2 blackbox_colgan3407_short2.mp4
python3 scripts/render_and_master.py ColganShort3 blackbox_colgan3407_short3.mp4
```
Engine is doc-agnostic: future Black Box Shorts = 3 lines in Root
(`blackBoxShortFrames({startId,endId,doc,manifest})` + a `<Composition>` with
`defaultProps={{startId,endId,hook,slug,doc,manifest}}`). Vertical Reid outro
(`public/outro/subscribe_blackbox_short.mp4`) auto-bakes on the end.
```
