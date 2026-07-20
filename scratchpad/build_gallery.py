#!/usr/bin/env python3
import base64, os
TH = "/tmp/thumbs"

def uri(p):
    with open(p, "rb") as f:
        return "data:image/jpeg;base64," + base64.b64encode(f.read()).decode()

# side: fr / es / neu
land = [
 ("fifteen-touches","fr","HOOK","10 SHOTS. 0 ON TARGET.","“Kylian Mbappé had ten shots against Spain. Not one of them hit the target.”","Mbappé, isolated — France v Senegal, Jun 2026"),
 ("fewest-on-pitch","fr","STAT","FEWEST TOUCHES ON THE PITCH","“In the first half he touched the ball just fifteen times — the fewest of any player on the pitch. 0.08 xG.”","Mbappé heading — France v Norway"),
 ("unplugged","neu","SCORE","SPAIN 2–0 FRANCE","“Spain didn’t just beat France two-nil in Dallas. They unplugged them.”","AT&T Stadium, Dallas"),
 ("zero-saves","es","STAT","10 SHOTS → CLEAN SHEET","“France threw ten shots at Spain. Unai Simón made just three saves — and never looked like conceding.”","Unai Simón, Spain GK"),
 ("dembele-vanished","fr","STAT","DEMBÉLÉ: SMOTHERED","“Dembélé — five goals coming in — was smothered by Cucurella all night.”","Dembélé loses the duel — France v Senegal"),
 ("xg-massacre","es","DATA","xG · 1.63 vs 0.30","“Spain’s expected goals: one point six three. France, from ten shots — zero point three.”","Rodri, Spain (animated bar chart over this)"),
 ("yamal-terror","es","GOAL","YAMAL WINS IT","“Lamine Yamal terrorised Digne and won the penalty on twenty-two minutes —”","Yamal #19 driving forward"),
 ("oyarzabal-buries","es","GOAL","OYARZABAL 22' · 1–0","“And Oyarzabal buried it. One-nil.”","Oyarzabal #21"),
 ("disallowed","es","BEAT","DISALLOWED. DIDN’T MATTER.","“Yamal even had a goal ruled out for offside. It didn’t matter.”","Yamal #19"),
 ("porro-dagger","es","GOAL","PORRO 58' · 2–0","“Porro traded passes with Olmo and made it two. Game over.”","Spain’s XI"),
 ("france-crumbles","fr","BEAT","FRANCE: UNRAVELLING","“Saliba injured on the half hour. Rabiot, on a yellow, hooked at half-time.”","Deschamps, concerned — NEW upgrade"),
 ("golden-boot-silenced","fr","STAT","GOLDEN BOOT · 0 ON TARGET","“The Golden Boot leader — eight goals — ended his night with ten shots, none on target, and a booking.”","Mbappé, isolated (bookend)"),
 ("total-control","es","DATA","51–49 BALL · ONE-WAY GAME","“Possession was almost even — but Spain turned control into goals.”","Cucurella, Spain"),
 ("spain-final","es","PAYOFF","SPAIN ARE IN THE FINAL","“Spain are in the World Cup final — their first since twenty-ten.”","Spain celebration, confetti"),
 ("final-debate","neu","CTA","WHO WINS SUNDAY?","“England or Argentina awaits. Who lifts it Sunday?”","World Cup trophy — NEW upgrade"),
]
short = [
 ("hook","fr","HOOK","10 SHOTS. 0 ON TARGET.","“Kylian Mbappé had ten shots against Spain. Not one was on target.”","Mbappé, isolated"),
 ("ghost","fr","STAT","15 TOUCHES · FEWEST ON PITCH","“In the first half he touched it just fifteen times — the fewest of anyone. A ghost.”","Mbappé heading"),
 ("score","neu","SCORE","SPAIN 2–0 FRANCE","“The score isn’t the story. The silence is.”","AT&T Stadium"),
 ("dembele","fr","STAT","DEMBÉLÉ: SMOTHERED","“Dembélé — five goals this tournament — smothered by Cucurella.”","Dembélé loses the duel"),
 ("xg","es","DATA","xG: 1.63 vs 0.30","“Full-match expected goals — Spain 1.63, France 0.30.”","Yamal (bar chart over this)"),
 ("simon","es","STAT","SIMÓN: CLEAN SHEET","“France had ten shots. Simón made three saves and kept a clean sheet.”","Unai Simón"),
 ("goals","es","GOALS","22' OYARZABAL · 58' PORRO","“Oyarzabal penalty. Porro second half. Spain are in the final.”","Oyarzabal #21"),
 ("cta","neu","CTA","DESERVED IT?","“Did France’s superstars deserve this? Follow for every World Cup breakdown.”","Spain fans celebrating"),
]

def card(n, prefix, row):
    sid, side, role, ost, vo, cred = row
    img = uri(f"{TH}/{prefix}_{sid}.jpg")
    newbadge = ' <span class="new">NEW</span>' if "NEW" in cred else ""
    return f'''<figure class="card {side}">
  <div class="imgwrap"><img src="{img}" alt="{cred}" loading="lazy"><span class="num">{n:02d}</span><span class="role">{role}</span></div>
  <figcaption>
    <p class="ost">{ost}</p>
    <p class="vo">{vo}</p>
    <p class="cred">{cred}{newbadge}</p>
  </figcaption>
</figure>'''

land_html = "\n".join(card(i+1,"L",r) for i,r in enumerate(land))
short_html = "\n".join(card(i+1,"S",r) for i,r in enumerate(short))

html = f'''<title>France 0–2 Spain — Image Board</title>
<style>
:root{{
  --bg:#0b0e14; --panel:#151a24; --panel2:#1b2130; --ink:#eef1f6; --mut:#9aa6b8;
  --line:#273041; --amber:#ffb020; --fr:#3b6dff; --es:#e2382e; --neu:#7f8aa0;
}}
:root[data-theme=light]{{ --bg:#f2f4f8; --panel:#ffffff; --panel2:#f7f9fc; --ink:#141821; --mut:#5a6577; --line:#dbe1ea; }}
@media (prefers-color-scheme: light){{ :root:not([data-theme=dark]){{ --bg:#f2f4f8; --panel:#fff; --panel2:#f7f9fc; --ink:#141821; --mut:#5a6577; --line:#dbe1ea; }} }}
*{{box-sizing:border-box}}
body{{margin:0;background:var(--bg);color:var(--ink);font-family:system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif;line-height:1.5;}}
.wrap{{max-width:1180px;margin:0 auto;padding:32px 20px 72px}}
header.top{{border-bottom:1px solid var(--line);padding-bottom:22px;margin-bottom:8px}}
.kick{{font-size:12px;letter-spacing:.22em;text-transform:uppercase;color:var(--amber);font-weight:700}}
h1{{font-size:clamp(28px,5vw,46px);margin:.15em 0 .1em;font-weight:800;letter-spacing:-.02em;text-wrap:balance;text-transform:uppercase}}
.score{{display:inline-flex;align-items:center;gap:14px;font-weight:800;font-size:20px;margin-top:6px}}
.score .es{{color:var(--es)}} .score .fr{{color:var(--fr)}}
.sub{{color:var(--mut);max-width:64ch;margin:10px 0 0}}
.legend{{display:flex;gap:18px;flex-wrap:wrap;margin:18px 0 0;font-size:13px;color:var(--mut)}}
.legend span{{display:inline-flex;align-items:center;gap:7px}}
.dot{{width:11px;height:11px;border-radius:3px;display:inline-block}}
.dot.fr{{background:var(--fr)}} .dot.es{{background:var(--es)}} .dot.neu{{background:var(--neu)}}
h2.sec{{font-size:14px;letter-spacing:.16em;text-transform:uppercase;color:var(--mut);margin:44px 0 4px;font-weight:700}}
h2.sec b{{color:var(--ink)}}
.grid{{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:16px;margin-top:16px}}
.card{{background:var(--panel);border:1px solid var(--line);border-radius:14px;overflow:hidden;display:flex;flex-direction:column;border-top:3px solid var(--neu)}}
.card.fr{{border-top-color:var(--fr)}} .card.es{{border-top-color:var(--es)}} .card.neu{{border-top-color:var(--neu)}}
.imgwrap{{position:relative;aspect-ratio:16/10;background:#000;overflow:hidden}}
.short .imgwrap{{aspect-ratio:3/4}}
.imgwrap img{{width:100%;height:100%;object-fit:cover;display:block;filter:brightness(.62)}}
.num{{position:absolute;top:8px;left:10px;font-weight:800;font-size:13px;color:#fff;text-shadow:0 1px 3px #000;font-variant-numeric:tabular-nums}}
.role{{position:absolute;top:8px;right:10px;font-size:10px;letter-spacing:.12em;font-weight:700;background:rgba(0,0,0,.55);color:#fff;padding:3px 7px;border-radius:20px}}
figcaption{{padding:12px 13px 14px;display:flex;flex-direction:column;gap:6px}}
.ost{{margin:0;font-weight:800;font-size:15px;letter-spacing:-.01em;text-transform:uppercase;color:var(--ink)}}
.vo{{margin:0;font-size:13px;color:var(--mut);font-style:italic;line-height:1.45}}
.cred{{margin:2px 0 0;font-size:11px;color:var(--mut);opacity:.85}}
.new{{background:var(--amber);color:#000;font-weight:800;font-size:9px;letter-spacing:.08em;padding:2px 6px;border-radius:10px;margin-left:4px}}
.note{{margin-top:40px;padding:16px 18px;background:var(--panel2);border:1px solid var(--line);border-left:3px solid var(--amber);border-radius:10px;font-size:13.5px;color:var(--mut)}}
.note b{{color:var(--ink)}}
</style>
<div class="wrap">
<header class="top">
  <div class="kick">KickOffDaily90 · Image Board · Review before render</div>
  <h1>The Night Spain Silenced France</h1>
  <div class="score"><span class="es">SPAIN 2</span><span style="color:var(--mut)">–</span><span class="fr">0 FRANCE</span></div>
  <p class="sub">Every image wired into the two videos, in scene order. All photos are Creative-Commons / public-domain (monetization-safe) — real players from recent 2026 World Cup matches, shown darkened as backdrops behind the kinetic stats. No AI-generated footage.</p>
  <div class="legend">
    <span><i class="dot es"></i> Spain scene</span>
    <span><i class="dot fr"></i> France scene</span>
    <span><i class="dot neu"></i> Neutral / context</span>
    <span><i class="dot" style="background:var(--amber)"></i> NEW = fresh upgrade photo</span>
  </div>
</header>

<h2 class="sec">16:9 Landscape — <b>15 scenes · ~1:50</b></h2>
<div class="grid">
{land_html}
</div>

<h2 class="sec short-label">9:16 Short — <b>8 scenes · ~0:50</b></h2>
<div class="grid short">
{short_html}
</div>

<div class="note"><b>Note on the imagery:</b> these are real photos of the real players, but from other 2026 World Cup / recent matches — <b>not</b> last night’s action frames, which are agency-owned (Getty/AP) and can’t be used on a monetized channel. The stats carry what happened; the photos carry who. Two shots are fresh upgrades pulled after the first cut: a concerned <b>Deschamps</b> for “France unravelling,” and the <b>World Cup trophy</b> for the closing “who wins Sunday?”. Attribution for every image is logged in <code>public/shorts/_evidence/fra-spa-semi/ATTRIBUTION.md</code> — paste it into the descriptions (CC-BY requires credit).</div>
</div>'''

out = "/Users/akshay/Documents/GitHub/mindwired/scratchpad/fra-spa-image-board.html"
with open(out, "w") as f:
    f.write(html)
print("wrote", out, os.path.getsize(out)//1024, "KB")
