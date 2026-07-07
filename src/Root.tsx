import "./index.css";
import "./lib/fonts";
import React from "react";
import { Composition, Still } from "remotion";
import { LostInOrbit, totalFrames } from "./Video";
import { Thumbnail } from "./Thumbnail";
import { ProofScene } from "./three/ProofScene";
import { GreatAttractor, attractorTotalFrames } from "./attractor/Video";
import { AttractorThumbnail } from "./attractor/Thumbnail";
import { GTAVIWeather, gtaviTotalFrames } from "./gtavi/Video";
import { GTAVIThumbnail } from "./gtavi/Thumbnail";
import { MotionEnergyDemo, MOTION_DEMO_FRAMES } from "./demo/MotionEnergyDemo";
import { ClipSceneDemo, CLIP_DEMO_FRAMES } from "./demo/ClipSceneDemo";
import { ScariestPlaces, scariestTotalFrames } from "./scariest/Video";
import { ScariestThumbnail } from "./scariest/Thumbnail";
import { ViralShort, viralShortFrames } from "./viral/ShortEngine";
import { HookProbe, HookProbeProps, hookProbeFrames, HOOK_PROBE_DEFAULT_FRAMES } from "./viral/HookProbe";
import { BrandIntro, BRAND_INTRO_FRAMES } from "./components/BrandIntro";
import { ShortManifest, VisualPlan } from "./viral/lib/types";
import roguebhPlanJson from "./viral/plans/roguebh.json";
import roguebhManifestJson from "../public/shorts/roguebh/audio/manifest.json";
import darkforestPlanJson from "./viral/plans/darkforest.json";
import darkforestManifestJson from "../public/shorts/darkforest/audio/manifest.json";
import bootesvoidPlanJson from "./viral/plans/bootesvoid.json";
import bootesvoidManifestJson from "../public/shorts/bootesvoid/audio/manifest.json";
import ton618PlanJson from "./viral/plans/ton618.json";
import ton618ManifestJson from "../public/shorts/ton618/audio/manifest.json";
import betelgeusePlanJson from "./viral/plans/betelgeuse.json";
import betelgeuseManifestJson from "../public/shorts/betelgeuse/audio/manifest.json";
import neutronstarPlanJson from "./viral/plans/neutronstar.json";
import neutronstarManifestJson from "../public/shorts/neutronstar/audio/manifest.json";
import worldcupPlanJson from "./viral/plans/worldcupr16.json";
import worldcupManifestJson from "../public/shorts/worldcupr16/audio/manifest.json";
import spacefactsPlanJson from "./viral/plans/spacefacts.json";
import spacefactsManifestJson from "../public/shorts/spacefacts/audio/manifest.json";
import worldcupCutsJson from "./viral/plans/worldcupr16.shorts.json";
import spacefactsCutsJson from "./viral/plans/spacefacts.shorts.json";
import moroccomarchPlanJson from "./viral/plans/moroccomarch.json";
import moroccomarchManifestJson from "../public/shorts/moroccomarch/audio/manifest.json";
import haalandbrazilPlanJson from "./viral/plans/haalandbrazil.json";
import haalandbrazilManifestJson from "../public/shorts/haalandbrazil/audio/manifest.json";
import francewallPlanJson from "./viral/plans/francewall.json";
import francewallManifestJson from "../public/shorts/francewall/audio/manifest.json";
import brazilnorwayhtPlanJson from "./viral/plans/brazilnorwayht.json";
import brazilnorwayhtManifestJson from "../public/shorts/brazilnorwayht/audio/manifest.json";
import wcNextupPlanJson from "./viral/plans/wc-nextup.json";
import wcNextupManifestJson from "../public/shorts/wc-nextup/audio/manifest.json";
import wcResultsPlanJson from "./viral/plans/wc-results.json";
import wcResultsManifestJson from "../public/shorts/wc-results/audio/manifest.json";
import wcGroupwinnersPlanJson from "./viral/plans/wc-groupwinners.json";
import wcGroupwinnersManifestJson from "../public/shorts/wc-groupwinners/audio/manifest.json";
import wcTopscorersTeamsPlanJson from "./viral/plans/wc-topscorers-teams.json";
import wcTopscorersTeamsManifestJson from "../public/shorts/wc-topscorers-teams/audio/manifest.json";
import wcTopscorersPlanJson from "./viral/plans/wc-topscorers.json";
import wcTopscorersManifestJson from "../public/shorts/wc-topscorers/audio/manifest.json";
import wcHaalandPlanJson from "./viral/plans/wc-haaland.json";
import wcHaalandManifestJson from "../public/shorts/wc-haaland/audio/manifest.json";
import wcNorwayRunPlanJson from "./viral/plans/wc-norway-run.json";
import wcNorwayRunManifestJson from "../public/shorts/wc-norway-run/audio/manifest.json";
import wcPortugalSpainPlanJson from "./viral/plans/wc-portugal-spain.json";
import wcPortugalSpainManifestJson from "../public/shorts/wc-portugal-spain/audio/manifest.json";
import wcGoldenbootTickerPlanJson from "./viral/plans/wc-goldenboot-ticker.json";
import wcGoldenbootTickerManifestJson from "../public/shorts/wc-goldenboot-ticker/audio/manifest.json";
import wcTournamentStatusPlanJson from "./viral/plans/wc-tournament-status.json";
import wcTournamentStatusManifestJson from "../public/shorts/wc-tournament-status/audio/manifest.json";
import wcRonaldoFreesePlanJson from "./viral/plans/wc-ronaldo-freese-analysis.json";
import wcRonaldoFreeseManifestJson from "../public/shorts/wc-ronaldo-freese-analysis/audio/manifest.json";
import wcNeymarLegacyPlanJson from "./viral/plans/wc-neymar-legacy.json";
import wcNeymarLegacyManifestJson from "../public/shorts/wc-neymar-legacy/audio/manifest.json";
import darkhorsePlanJson from "./viral/plans/darkhorse.json";
import darkhorseManifestJson from "../public/shorts/darkhorse/audio/manifest.json";
import darkhorseCutsJson from "./viral/plans/darkhorse.shorts.json";
import invisibleopponentPlanJson from "./viral/plans/invisibleopponent.json";
import invisibleopponentManifestJson from "../public/shorts/invisibleopponent/audio/manifest.json";
import invisibleopponentCutsJson from "./viral/plans/invisibleopponent.shorts.json";
import portugalspainPlanJson from "./viral/plans/portugalspain.json";
import portugalspainManifestJson from "../public/shorts/portugalspain/audio/manifest.json";
import portugalspainCutsJson from "./viral/plans/portugalspain.shorts.json";
import var5PlanJson from "./viral/plans/var5.json";
import var5ManifestJson from "../public/shorts/var5/audio/manifest.json";
import var5CutsJson from "./viral/plans/var5.shorts.json";
import brokentimePlanJson from "./viral/plans/brokentime.json";
import brokentimeManifestJson from "../public/shorts/brokentime/audio/manifest.json";
import brokentimeCutsJson from "./viral/plans/brokentime.shorts.json";
// ── Standing subscribe-outro assets — appended to every mindwired/kickoffdaily90
// video (see CLAUDE.md "Subscribe outro" section). Do not delete. ──
import subMwLongPlanJson from "./viral/plans/subscribe-mindwired-long.json";
import subMwLongManifestJson from "../public/shorts/subscribe-mindwired-long/audio/manifest.json";
import subMwShortPlanJson from "./viral/plans/subscribe-mindwired-short.json";
import subMwShortManifestJson from "../public/shorts/subscribe-mindwired-short/audio/manifest.json";
import subKoLongPlanJson from "./viral/plans/subscribe-kickoffdaily90-long.json";
import subKoLongManifestJson from "../public/shorts/subscribe-kickoffdaily90-long/audio/manifest.json";
import subKoShortPlanJson from "./viral/plans/subscribe-kickoffdaily90-short.json";
import subKoShortManifestJson from "../public/shorts/subscribe-kickoffdaily90-short/audio/manifest.json";

const roguebhPlan = roguebhPlanJson as unknown as VisualPlan;
const roguebhManifest = roguebhManifestJson as unknown as ShortManifest;

// ── World Cup host video: one master plan → 16:9 long-form + N vertical cuts ──
const worldcupPlan = worldcupPlanJson as unknown as VisualPlan;
const worldcupManifest = worldcupManifestJson as unknown as ShortManifest;
const worldcupCuts = worldcupCutsJson as unknown as Array<VisualPlan & { cutId: string }>;

const spacefactsPlan = spacefactsPlanJson as unknown as VisualPlan;
const spacefactsManifest = spacefactsManifestJson as unknown as ShortManifest;
const spacefactsCuts = spacefactsCutsJson as unknown as Array<VisualPlan & { cutId: string }>;

const subMwLongPlan = subMwLongPlanJson as unknown as VisualPlan;
const subMwLongManifest = subMwLongManifestJson as unknown as ShortManifest;
const subMwShortPlan = subMwShortPlanJson as unknown as VisualPlan;
const subMwShortManifest = subMwShortManifestJson as unknown as ShortManifest;
const subKoLongPlan = subKoLongPlanJson as unknown as VisualPlan;
const subKoLongManifest = subKoLongManifestJson as unknown as ShortManifest;
const subKoShortPlan = subKoShortPlanJson as unknown as VisualPlan;
const subKoShortManifest = subKoShortManifestJson as unknown as ShortManifest;

const darkhorsePlan = darkhorsePlanJson as unknown as VisualPlan;
const darkhorseManifest = darkhorseManifestJson as unknown as ShortManifest;
const darkhorseCuts = darkhorseCutsJson as unknown as Array<VisualPlan & { cutId: string }>;
const invisibleopponentPlan = invisibleopponentPlanJson as unknown as VisualPlan;
const invisibleopponentManifest = invisibleopponentManifestJson as unknown as ShortManifest;
const invisibleopponentCuts = invisibleopponentCutsJson as unknown as Array<VisualPlan & { cutId: string }>;
const portugalspainPlan = portugalspainPlanJson as unknown as VisualPlan;
const portugalspainManifest = portugalspainManifestJson as unknown as ShortManifest;
const portugalspainCuts = portugalspainCutsJson as unknown as Array<VisualPlan & { cutId: string }>;
const var5Plan = var5PlanJson as unknown as VisualPlan;
const var5Manifest = var5ManifestJson as unknown as ShortManifest;
const wcNeymarLegacyPlan = wcNeymarLegacyPlanJson as unknown as VisualPlan;
const wcNeymarLegacyManifest = wcNeymarLegacyManifestJson as unknown as ShortManifest;
const var5Cuts = var5CutsJson as unknown as Array<VisualPlan & { cutId: string }>;

const brokentimePlan = brokentimePlanJson as unknown as VisualPlan;
const brokentimeManifest = brokentimeManifestJson as unknown as ShortManifest;
const brokentimeCuts = brokentimeCutsJson as unknown as Array<VisualPlan & { cutId: string }>;

// ── kickoffdaily90 hot-topic reaction shorts (standalone, board-only) ──
const HOT_SHORTS: Array<{ id: string; plan: VisualPlan; manifest: ShortManifest }> = [
  { id: "ShortWC-moroccomarch", plan: moroccomarchPlanJson as unknown as VisualPlan, manifest: moroccomarchManifestJson as unknown as ShortManifest },
  { id: "ShortWC-haalandbrazil", plan: haalandbrazilPlanJson as unknown as VisualPlan, manifest: haalandbrazilManifestJson as unknown as ShortManifest },
  { id: "ShortWC-francewall", plan: francewallPlanJson as unknown as VisualPlan, manifest: francewallManifestJson as unknown as ShortManifest },
  { id: "ShortWC-brazilnorwayht", plan: brazilnorwayhtPlanJson as unknown as VisualPlan, manifest: brazilnorwayhtManifestJson as unknown as ShortManifest },
  { id: "ShortWC-wc-nextup", plan: wcNextupPlanJson as unknown as VisualPlan, manifest: wcNextupManifestJson as unknown as ShortManifest },
  { id: "ShortWC-wc-results", plan: wcResultsPlanJson as unknown as VisualPlan, manifest: wcResultsManifestJson as unknown as ShortManifest },
  { id: "ShortWC-wc-groupwinners", plan: wcGroupwinnersPlanJson as unknown as VisualPlan, manifest: wcGroupwinnersManifestJson as unknown as ShortManifest },
  { id: "ShortWC-wc-topscorers-teams", plan: wcTopscorersTeamsPlanJson as unknown as VisualPlan, manifest: wcTopscorersTeamsManifestJson as unknown as ShortManifest },
  { id: "ShortWC-wc-topscorers", plan: wcTopscorersPlanJson as unknown as VisualPlan, manifest: wcTopscorersManifestJson as unknown as ShortManifest },
  { id: "ShortWC-wc-haaland", plan: wcHaalandPlanJson as unknown as VisualPlan, manifest: wcHaalandManifestJson as unknown as ShortManifest },
  { id: "ShortWC-wc-norway-run", plan: wcNorwayRunPlanJson as unknown as VisualPlan, manifest: wcNorwayRunManifestJson as unknown as ShortManifest },
  { id: "ShortWC-wc-portugal-spain", plan: wcPortugalSpainPlanJson as unknown as VisualPlan, manifest: wcPortugalSpainManifestJson as unknown as ShortManifest },
  { id: "ShortWC-wc-goldenboot-ticker", plan: wcGoldenbootTickerPlanJson as unknown as VisualPlan, manifest: wcGoldenbootTickerManifestJson as unknown as ShortManifest },
  { id: "ShortWC-wc-tournament-status", plan: wcTournamentStatusPlanJson as unknown as VisualPlan, manifest: wcTournamentStatusManifestJson as unknown as ShortManifest },
  { id: "ShortWC-wc-ronaldo-freese-analysis", plan: wcRonaldoFreesePlanJson as unknown as VisualPlan, manifest: wcRonaldoFreeseManifestJson as unknown as ShortManifest },
];

// The 5 videos in the 24/7 live-loop stream, re-rendered at 1920x1080 for
// the second (widescreen) live stream. See WIDE_LOOP_SHORTS.map below.
const WIDE_LOOP_SHORTS: Array<{ id: string; plan: VisualPlan; manifest: ShortManifest }> = [
  { id: "ShortWC-wc-nextup", plan: wcNextupPlanJson as unknown as VisualPlan, manifest: wcNextupManifestJson as unknown as ShortManifest },
  { id: "ShortWC-wc-results", plan: wcResultsPlanJson as unknown as VisualPlan, manifest: wcResultsManifestJson as unknown as ShortManifest },
  { id: "ShortWC-wc-groupwinners", plan: wcGroupwinnersPlanJson as unknown as VisualPlan, manifest: wcGroupwinnersManifestJson as unknown as ShortManifest },
  { id: "ShortWC-wc-topscorers-teams", plan: wcTopscorersTeamsPlanJson as unknown as VisualPlan, manifest: wcTopscorersTeamsManifestJson as unknown as ShortManifest },
  { id: "ShortWC-wc-topscorers", plan: wcTopscorersPlanJson as unknown as VisualPlan, manifest: wcTopscorersManifestJson as unknown as ShortManifest },
];

const SHORTS: Array<{ id: string; plan: VisualPlan; manifest: ShortManifest }> = [
  { id: "ShortDarkForest", plan: darkforestPlanJson as unknown as VisualPlan, manifest: darkforestManifestJson as unknown as ShortManifest },
  { id: "ShortBootesVoid", plan: bootesvoidPlanJson as unknown as VisualPlan, manifest: bootesvoidManifestJson as unknown as ShortManifest },
  { id: "ShortTon618", plan: ton618PlanJson as unknown as VisualPlan, manifest: ton618ManifestJson as unknown as ShortManifest },
  { id: "ShortBetelgeuse", plan: betelgeusePlanJson as unknown as VisualPlan, manifest: betelgeuseManifestJson as unknown as ShortManifest },
  { id: "ShortNeutronStar", plan: neutronstarPlanJson as unknown as VisualPlan, manifest: neutronstarManifestJson as unknown as ShortManifest },
];

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* ── Standing subscribe-outro assets — see CLAUDE.md "Subscribe outro".
          Append these to the end of every future render: long-form outro
          (20s, 16:9) for long-forms, short outro (5s, 9:16) for Shorts. ── */}
      <Composition
        id="SubscribeMindwiredLong"
        component={ViralShort}
        defaultProps={{ plan: subMwLongPlan, manifest: subMwLongManifest }}
        durationInFrames={viralShortFrames(subMwLongPlan, subMwLongManifest)}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="SubscribeMindwiredShort"
        component={ViralShort}
        defaultProps={{ plan: subMwShortPlan, manifest: subMwShortManifest }}
        durationInFrames={viralShortFrames(subMwShortPlan, subMwShortManifest)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="SubscribeKickoffLong"
        component={ViralShort}
        defaultProps={{ plan: subKoLongPlan, manifest: subKoLongManifest }}
        durationInFrames={viralShortFrames(subKoLongPlan, subKoLongManifest)}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="SubscribeKickoffShort"
        component={ViralShort}
        defaultProps={{ plan: subKoShortPlan, manifest: subKoShortManifest }}
        durationInFrames={viralShortFrames(subKoShortPlan, subKoShortManifest)}
        fps={30}
        width={1080}
        height={1920}
      />

      {/* ── Standing brand-intro bumpers (Higgsfield plate + Remotion wordmark
          bloom) — see CLAUDE.md. Play ONCE per video, AFTER the ~10s hook,
          never before it. 3s each, 16:9. Source plates in
          public/brand-intros/<brand>.mp4. ── */}
      <Composition id="BrandIntroMindwired" component={BrandIntro} defaultProps={{ brand: "mindwired" }} durationInFrames={BRAND_INTRO_FRAMES} fps={30} width={1920} height={1080} />
      <Composition id="BrandIntroKickoff" component={BrandIntro} defaultProps={{ brand: "kickoffdaily90" }} durationInFrames={BRAND_INTRO_FRAMES} fps={30} width={1920} height={1080} />
      <Composition id="BrandIntroSingaloo" component={BrandIntro} defaultProps={{ brand: "singaloo" }} durationInFrames={BRAND_INTRO_FRAMES} fps={30} width={1920} height={1080} />

      {/* ── Viral shorts engine (src/viral) — data-driven, plan JSON per video ── */}
      <Composition
        id="ShortRogueBH"
        component={ViralShort}
        defaultProps={{ plan: roguebhPlan, manifest: roguebhManifest }}
        durationInFrames={viralShortFrames(roguebhPlan, roguebhManifest)}
        fps={30}
        width={1080}
        height={1920}
      />
      {/* ── HookProbe — render ONE hook variant standalone for scoring (see
          HOOK-LAB.md / scripts/hook_lab.py). Driven entirely by --props; the
          placeholder defaultProps only make the studio preview non-empty.
          durationInFrames comes from the passed props (hooks.json), falling
          back to 5s. ── */}
      <Composition
        id="HookProbe"
        component={HookProbe}
        defaultProps={{
          slug: "sample",
          variantId: "hook",
          mainText: "THE HOOK GOES HERE",
          emphasis: ["HOOK"],
          tone: "shock",
          words: [],
          durationInFrames: HOOK_PROBE_DEFAULT_FRAMES,
        } as HookProbeProps}
        calculateMetadata={({ props }) => ({ durationInFrames: hookProbeFrames(props) })}
        durationInFrames={HOOK_PROBE_DEFAULT_FRAMES}
        fps={30}
        width={1080}
        height={1920}
      />
      {SHORTS.map((s) => (
        <React.Fragment key={s.id}>
          <Composition
            id={s.id}
            component={ViralShort}
            defaultProps={{ plan: s.plan, manifest: s.manifest }}
            durationInFrames={viralShortFrames(s.plan, s.manifest)}
            fps={30}
            width={1080}
            height={1920}
          />
          <Composition
            id={`${s.id}Wide`}
            component={ViralShort}
            defaultProps={{ plan: s.plan, manifest: s.manifest }}
            durationInFrames={viralShortFrames(s.plan, s.manifest)}
            fps={30}
            width={1920}
            height={1080}
          />
        </React.Fragment>
      ))}
      {/* ── World Cup Round of 16 — Rio host long-form (16:9) + 10 vertical cuts ── */}
      <Composition
        id="WorldCupR16Wide"
        component={ViralShort}
        defaultProps={{ plan: worldcupPlan, manifest: worldcupManifest }}
        durationInFrames={viralShortFrames(worldcupPlan, worldcupManifest)}
        fps={30}
        width={1920}
        height={1080}
      />
      {/* ── Time Is Broken — Orion host, gravitational time dilation ── */}
      <Composition
        id="BrokenTimeWide"
        component={ViralShort}
        defaultProps={{ plan: brokentimePlan, manifest: brokentimeManifest }}
        durationInFrames={viralShortFrames(brokentimePlan, brokentimeManifest)}
        fps={30}
        width={1920}
        height={1080}
      />
      {brokentimeCuts.map((cut) => (
        <Composition
          key={cut.cutId}
          id={`ShortBT-${cut.cutId}`}
          component={ViralShort}
          defaultProps={{ plan: cut, manifest: brokentimeManifest }}
          durationInFrames={viralShortFrames(cut, brokentimeManifest)}
          fps={30}
          width={1080}
          height={1920}
        />
      ))}
      {/* ── Mindblowing space facts — Orion host, Hume/Cartesia narration ── */}
      <Composition
        id="SpaceFactsWide"
        component={ViralShort}
        defaultProps={{ plan: spacefactsPlan, manifest: spacefactsManifest }}
        durationInFrames={viralShortFrames(spacefactsPlan, spacefactsManifest)}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="SpaceFacts"
        component={ViralShort}
        defaultProps={{ plan: spacefactsPlan, manifest: spacefactsManifest }}
        durationInFrames={viralShortFrames(spacefactsPlan, spacefactsManifest)}
        fps={30}
        width={1080}
        height={1920}
      />
      {worldcupCuts.map((cut) => (
        <Composition
          key={cut.cutId}
          id={`ShortWC-${cut.cutId}`}
          component={ViralShort}
          defaultProps={{ plan: cut, manifest: worldcupManifest }}
          durationInFrames={viralShortFrames(cut, worldcupManifest)}
          fps={30}
          width={1080}
          height={1920}
        />
      ))}
      {/* ── The Invisible Opponent (altitude/heat): 16:9 long-form + 3 vertical cuts ── */}
      <Composition
        id="InvisibleOpponentWide"
        component={ViralShort}
        defaultProps={{ plan: invisibleopponentPlan, manifest: invisibleopponentManifest }}
        durationInFrames={viralShortFrames(invisibleopponentPlan, invisibleopponentManifest)}
        fps={30}
        width={1920}
        height={1080}
      />
      {invisibleopponentCuts.map((cut) => (
        <Composition
          key={cut.cutId}
          id={`ShortWC-${cut.cutId}`}
          component={ViralShort}
          defaultProps={{ plan: cut, manifest: invisibleopponentManifest }}
          durationInFrames={viralShortFrames(cut, invisibleopponentManifest)}
          fps={30}
          width={1080}
          height={1920}
        />
      ))}
      {/* ── Ronaldo's last World Cup + USA's Freese meltdown: 16:9 long-form ── */}
      <Composition
        id="RonaldoFreeseAnalysisWide"
        component={ViralShort}
        defaultProps={{ plan: wcRonaldoFreesePlanJson as unknown as VisualPlan, manifest: wcRonaldoFreeseManifestJson as unknown as ShortManifest }}
        durationInFrames={viralShortFrames(wcRonaldoFreesePlanJson as unknown as VisualPlan, wcRonaldoFreeseManifestJson as unknown as ShortManifest)}
        fps={30}
        width={1920}
        height={1080}
      />
      {/* ── Neymar's last match / Brazil's earliest exit since 1990: 16:9 long-form ── */}
      <Composition
        id="NeymarLegacyWide"
        component={ViralShort}
        defaultProps={{ plan: wcNeymarLegacyPlan, manifest: wcNeymarLegacyManifest }}
        durationInFrames={viralShortFrames(wcNeymarLegacyPlan, wcNeymarLegacyManifest)}
        fps={30}
        width={1920}
        height={1080}
      />
      {/* ── Portugal vs Spain preview: 16:9 long-form + 3 vertical cuts ── */}
      <Composition
        id="PortugalSpainWide"
        component={ViralShort}
        defaultProps={{ plan: portugalspainPlan, manifest: portugalspainManifest }}
        durationInFrames={viralShortFrames(portugalspainPlan, portugalspainManifest)}
        fps={30}
        width={1920}
        height={1080}
      />
      {portugalspainCuts.map((cut) => (
        <Composition
          key={cut.cutId}
          id={`ShortWC-${cut.cutId}`}
          component={ViralShort}
          defaultProps={{ plan: cut, manifest: portugalspainManifest }}
          durationInFrames={viralShortFrames(cut, portugalspainManifest)}
          fps={30}
          width={1080}
          height={1920}
        />
      ))}
      {/* ── VAR top-5: 16:9 mid-form + 2 vertical cuts ── */}
      <Composition
        id="Var5Wide"
        component={ViralShort}
        defaultProps={{ plan: var5Plan, manifest: var5Manifest }}
        durationInFrames={viralShortFrames(var5Plan, var5Manifest)}
        fps={30}
        width={1920}
        height={1080}
      />
      {var5Cuts.map((cut) => (
        <Composition
          key={cut.cutId}
          id={`ShortWC-${cut.cutId}`}
          component={ViralShort}
          defaultProps={{ plan: cut, manifest: var5Manifest }}
          durationInFrames={viralShortFrames(cut, var5Manifest)}
          fps={30}
          width={1080}
          height={1920}
        />
      ))}
      {/* ── Dark horse analysis: 16:9 mid-form + 2 vertical cuts ── */}
      <Composition
        id="DarkHorseWide"
        component={ViralShort}
        defaultProps={{ plan: darkhorsePlan, manifest: darkhorseManifest }}
        durationInFrames={viralShortFrames(darkhorsePlan, darkhorseManifest)}
        fps={30}
        width={1920}
        height={1080}
      />
      {darkhorseCuts.map((cut) => (
        <Composition
          key={cut.cutId}
          id={`ShortWC-${cut.cutId}`}
          component={ViralShort}
          defaultProps={{ plan: cut, manifest: darkhorseManifest }}
          durationInFrames={viralShortFrames(cut, darkhorseManifest)}
          fps={30}
          width={1080}
          height={1920}
        />
      ))}
      {HOT_SHORTS.map((s) => (
        <Composition
          key={s.id}
          id={s.id}
          component={ViralShort}
          defaultProps={{ plan: s.plan, manifest: s.manifest }}
          durationInFrames={viralShortFrames(s.plan, s.manifest)}
          fps={30}
          width={1080}
          height={1920}
        />
      ))}
      {/* ── 16:9 widescreen re-renders of the 5 kickoffdaily90 live-loop stat
          videos, for the second live stream. Same plan/manifest as the
          vertical versions — board:true scenes render identically at any
          aspect ratio, so no plan changes needed, just a wider canvas. ── */}
      {WIDE_LOOP_SHORTS.map((s) => (
        <Composition
          key={`${s.id}-wide`}
          id={`${s.id}-wide`}
          component={ViralShort}
          defaultProps={{ plan: s.plan, manifest: s.manifest }}
          durationInFrames={viralShortFrames(s.plan, s.manifest)}
          fps={30}
          width={1920}
          height={1080}
        />
      ))}
      {spacefactsCuts.map((cut) => (
        <Composition
          key={cut.cutId}
          id={`ShortSF-${cut.cutId}`}
          component={ViralShort}
          defaultProps={{ plan: cut, manifest: spacefactsManifest }}
          durationInFrames={viralShortFrames(cut, spacefactsManifest)}
          fps={30}
          width={1080}
          height={1920}
        />
      ))}

      <Composition
        id="ShortRogueBHWide"
        component={ViralShort}
        defaultProps={{ plan: roguebhPlan, manifest: roguebhManifest }}
        durationInFrames={viralShortFrames(roguebhPlan, roguebhManifest)}
        fps={30}
        width={1920}
        height={1080}
      />

      <Composition
        id="MotionEnergyDemo"
        component={MotionEnergyDemo}
        durationInFrames={MOTION_DEMO_FRAMES}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="ClipSceneDemo"
        component={ClipSceneDemo}
        durationInFrames={CLIP_DEMO_FRAMES}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* ── Mindwired #4 — The Scariest Places In The Universe ── */}
      <Composition
        id="ScariestPlaces"
        component={ScariestPlaces}
        durationInFrames={scariestTotalFrames()}
        fps={30}
        width={1920}
        height={1080}
      />
      <Still
        id="ScariestThumbnail"
        component={ScariestThumbnail}
        width={1280}
        height={720}
      />

      <Composition
        id="Proof3D"
        component={ProofScene}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="LostInOrbit"
        component={LostInOrbit}
        durationInFrames={totalFrames()}
        fps={30}
        width={1920}
        height={1080}
      />
      <Still
        id="Thumbnail"
        component={Thumbnail}
        width={1280}
        height={720}
      />

      {/* ── Mindwired #2 — The Great Attractor ── */}
      <Composition
        id="GreatAttractor"
        component={GreatAttractor}
        durationInFrames={attractorTotalFrames()}
        fps={30}
        width={1920}
        height={1080}
      />
      <Still
        id="AttractorThumbnail"
        component={AttractorThumbnail}
        width={1280}
        height={720}
      />

      {/* ── Mindwired (Digital Simulation) — GTA 6 Weather ── */}
      <Composition
        id="GTAVIWeather"
        component={GTAVIWeather}
        durationInFrames={gtaviTotalFrames()}
        fps={30}
        width={1920}
        height={1080}
      />
      <Still
        id="GTAVIThumbnail"
        component={GTAVIThumbnail}
        width={1280}
        height={720}
      />
    </>
  );
};
