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
import { FraSpaThumbnail } from "./fra-spa/Thumbnail";
import { ArgEngThumbnail } from "./fra-spa/ArgEngThumbnail";
import { MotionEnergyDemo, MOTION_DEMO_FRAMES } from "./demo/MotionEnergyDemo";
import { ClipSceneDemo, CLIP_DEMO_FRAMES } from "./demo/ClipSceneDemo";
import { ScariestPlaces, scariestTotalFrames } from "./scariest/Video";
import { ScariestThumbnail } from "./scariest/Thumbnail";
import { RoguePlanetVideo, rogueTotalFrames } from "./rogueplanet/Video";
import { RoguePlanetThumbnail } from "./rogueplanet/Thumbnail";
import { RupeeShort, rupeeTotalFrames } from "./dimaagbatti/RupeeShort";
import { SansadchaloShort, sansadchaloShortTotalFrames } from "./dimaagbatti/SansadchaloShort";
import { NeetWide, neetTotalFrames } from "./dimaagbatti/NeetWide";
import { NeetThumb } from "./dimaagbatti/NeetThumb";
import { WW2Wide, ww2TotalFrames } from "./dimaagbatti/WW2Wide";
import { makeDocComp, docTotalFrames } from "./mindwired-doc/DocWide";
import spaceDeathsDoc from "./mindwired-doc/docs/spacedeaths.json";
import spaceDeathsManifest from "./mindwired-doc/docs/spacedeaths.manifest.json";
import ww2EpicEnDoc from "./mindwired-doc/docs/ww2epic-en.json";
import ww2EpicEnManifest from "./mindwired-doc/docs/ww2epic-en.manifest.json";
import spaceDeathsHiDoc from "./mindwired-doc/docs/spacedeaths-hi.json";
import spaceDeathsHiManifest from "./mindwired-doc/docs/spacedeaths-hi.manifest.json";
import eastIndiaDoc from "./mindwired-doc/docs/eastindia.json";
import eastIndiaManifest from "./mindwired-doc/docs/eastindia.manifest.json";
import atomDeathsDoc from "./mindwired-doc/docs/atomdeaths.json";
import atomDeathsManifest from "./mindwired-doc/docs/atomdeaths.manifest.json";
import boeing737maxDoc from "./mindwired-doc/docs/boeing737max.json";
import boeing737maxManifest from "./mindwired-doc/docs/boeing737max.manifest.json";
import { SubscribeBlackBoxLong, subscribeBlackBoxFrames, SubscribeBlackBoxShort, subscribeBlackBoxShortFrames } from "./blackbox/SubscribeOutro";
import colgan3407Doc from "./mindwired-doc/docs/colgan3407.json";
import colgan3407Manifest from "./mindwired-doc/docs/colgan3407.manifest.json";
import af447Doc from "./mindwired-doc/docs/af447.json";
import af447Manifest from "./mindwired-doc/docs/af447.manifest.json";
import mh370Doc from "./mindwired-doc/docs/mh370.json";
import mh370Manifest from "./mindwired-doc/docs/mh370.manifest.json";
import mh370thDoc from "./mindwired-doc/docs/mh370theories.json";
import mh370thManifest from "./mindwired-doc/docs/mh370theories.manifest.json";
import moonSellerDoc from "./mindwired-doc/docs/moonseller.json";
import moonSellerManifest from "./mindwired-doc/docs/moonseller.manifest.json";
import marsOneDoc from "./mindwired-doc/docs/marsone.json";
import marsOneManifest from "./mindwired-doc/docs/marsone.manifest.json";
import oceanGateDoc from "./mindwired-doc/docs/oceangate.json";
import oceanGateManifest from "./mindwired-doc/docs/oceangate.manifest.json";
import concordeDoc from "./mindwired-doc/docs/concorde.json";
import concordeManifest from "./mindwired-doc/docs/concorde.manifest.json";
import spaceShuttleDoc from "./mindwired-doc/docs/spaceshuttle.json";
import spaceShuttleManifest from "./mindwired-doc/docs/spaceshuttle.manifest.json";
import flight93Doc from "./mindwired-doc/docs/flight93.json";
import flight93Manifest from "./mindwired-doc/docs/flight93.manifest.json";
// Subscribe outro baked into the render (ONE render, no ffmpeg concat). frames @30fps.
const BB_OUTRO = { file: "outro/subscribe_blackbox_long.mp4", frames: 483 };
const MW_OUTRO = { file: "outro/subscribe_mindwired_long.mp4", frames: 527 };
import lostCosmonautsDoc from "./mindwired-doc/docs/lostcosmonauts.json";
import lostCosmonautsManifest from "./mindwired-doc/docs/lostcosmonauts.manifest.json";
import spaceAnimalsDoc from "./mindwired-doc/docs/spaceanimals.json";
import spaceAnimalsManifest from "./mindwired-doc/docs/spaceanimals.manifest.json";
import blackHolesDoc from "./mindwired-doc/docs/blackholes.json";
import blackHolesManifest from "./mindwired-doc/docs/blackholes.manifest.json";
import tenerifeDoc from "./mindwired-doc/docs/tenerife.json";
import tenerifeManifest from "./mindwired-doc/docs/tenerife.manifest.json";
import blackboxAnatomyDoc from "./mindwired-doc/docs/blackboxanatomy.json";
import blackboxAnatomyManifest from "./mindwired-doc/docs/blackboxanatomy.manifest.json";
import ai171Doc from "./mindwired-doc/docs/ai171.json";
import ai171Manifest from "./mindwired-doc/docs/ai171.manifest.json";
import almostDiedHiDoc from "./mindwired-doc/docs/almostdied-hi.json";
import almostDiedHiManifest from "./mindwired-doc/docs/almostdied-hi.manifest.json";
import sansadchaloDoc from "./mindwired-doc/docs/sansadchalo.json";
import sansadchaloManifest from "./mindwired-doc/docs/sansadchalo.manifest.json";
import oppositiondetainedDoc from "./mindwired-doc/docs/oppositiondetained.json";
import oppositiondetainedManifest from "./mindwired-doc/docs/oppositiondetained.manifest.json";
import almostDiedDoc from "./mindwired-doc/docs/almostdied.json";
import almostDiedManifest from "./mindwired-doc/docs/almostdied.manifest.json";
import { FinalReview, finalReviewFrames } from "./finalreview/FinalReview";
import sketchDemoDoc from "./mindwired-doc/docs/sketchdemo.json";
import sketchDemoManifest from "./mindwired-doc/docs/sketchdemo.manifest.json";
import spaceSoundsDoc from "./mindwired-doc/docs/spacesounds.json";
import spaceSoundsManifest from "./mindwired-doc/docs/spacesounds.manifest.json";
import marianaDoc from "./mindwired-doc/docs/mariana.json";
import marianaManifest from "./mindwired-doc/docs/mariana.manifest.json";
import spaceSoundsHiDoc from "./mindwired-doc/docs/spacesounds-hi.json";
import spaceSoundsHiManifest from "./mindwired-doc/docs/spacesounds-hi.manifest.json";
import marianaHiDoc from "./mindwired-doc/docs/mariana-hi.json";
import marianaHiManifest from "./mindwired-doc/docs/mariana-hi.manifest.json";
import { MindwiredShort, mindwiredShortFrames } from "./mindwired-doc/MindwiredShort";

// Vertical Shorts cut from the two evidence docs (windows per docs/metadata/*).
const MW_SHORTS = [
  { id: "SpaceSoundsShort1", slug: "spacesounds", doc: spaceSoundsDoc, manifest: spaceSoundsManifest,
    startId: "h1", endId: "h4", hook: "A real black hole\nsounds like THIS" },
  { id: "SpaceSoundsShort2", slug: "spacesounds", doc: spaceSoundsDoc, manifest: spaceSoundsManifest,
    startId: "c1", endId: "l1", hook: "NASA called this\nsound \"eerie\"" },
  { id: "SpaceSoundsShort3", slug: "spacesounds", doc: spaceSoundsDoc, manifest: spaceSoundsManifest,
    startId: "w1", endId: "w3", hook: "Every \"Wow! Signal\"\naudio online is FAKE" },
  { id: "MarianaShort1", slug: "mariana", doc: marianaDoc, manifest: marianaManifest,
    startId: "myth1", endId: "myth2", hook: "You've been lied to\nabout the deep ocean" },
  { id: "MarianaShort2", slug: "mariana", doc: marianaDoc, manifest: marianaManifest,
    startId: "sound1", endId: "l_ship", hook: "This is the sound of\nthe bottom of the ocean" },
  { id: "MarianaShort3", slug: "mariana", doc: marianaDoc, manifest: marianaManifest,
    startId: "bottom1", endId: "bottom3", hook: "The deepest place on Earth.\nWe got there second." },
] as const;
import astronautBodiesDoc from "./mindwired-doc/docs/astronautbodies.json";
import astronautBodiesManifest from "./mindwired-doc/docs/astronautbodies.manifest.json";
import { EndOfTimeEpic, endOfTimeTotalFrames } from "./endoftime/EndOfTimeEpic";
import moonStrandedDoc from "./mindwired-doc/docs/moonstranded.json";
import moonStrandedManifest from "./mindwired-doc/docs/moonstranded.manifest.json";
import { WW2Thumb } from "./dimaagbatti/WW2Thumb";
import { WW2Epic, ww2EpicTotalFrames } from "./dimaagbatti/WW2Epic";
import { WW2EpicThumb } from "./dimaagbatti/WW2EpicThumb";
import { WW2EpicEnThumb, SpaceDeathsHiThumb, EastIndiaThumb, AtomDeathsThumb, EndOfTimeThumb } from "./mindwired-doc/RemakeThumbs";
import { BlackBoxShort, blackBoxShortFrames } from "./blackbox/BlackBoxShort";
import radioTestDoc from "./mindwired-doc/docs/radiotest.json";
import radioTestManifest from "./mindwired-doc/docs/radiotest.manifest.json";
import { HowAIVideo, aiVideoTotalFrames } from "./aivideo/HowAIVideo";
import { AnimeClash, animeClashFrames } from "./messivssalah/AnimeClash";
import { AnimeClashV, animeClashVFrames } from "./messivssalah/AnimeClashV";
import { ChangingGuard, changingGuardFrames } from "./guard/ChangingGuard";
import { ChangingGuardV, changingGuardVFrames } from "./guard/ChangingGuardV";
import { WhatIfArgentina, whatIfArgentinaFrames } from "./argentinawc/WhatIfArgentina";
import { WhatIfArgentinaShort, whatIfArgShortFrames } from "./argentinawc/WhatIfArgentinaShort";
import { QFReview, qfReviewFrames } from "./qfreview/QFReview";
import { Sixty3, sixty3Frames } from "./bvb63/Sixty3";
import { Sixty3Short, sixty3ShortFrames } from "./bvb63/Sixty3Short";
import { QFReviewShort, qfShortFrames } from "./qfreview/QFReviewShort";
import { MvB, mvbFrames } from "./mvb/MvB";
import { MvBShort, mvbShortFrames } from "./mvb/MvBShort";
import { MessiYamal19, messiYamal19Frames } from "./messiyamal19/MessiYamal19";
import { MvBThumb } from "./mvb/MvBThumb";
import { ViralShort, viralShortFrames } from "./viral/ShortEngine";
import { HookProbe, HookProbeProps, hookProbeFrames, HOOK_PROBE_DEFAULT_FRAMES } from "./viral/HookProbe";
import { BrandIntro, BRAND_INTRO_FRAMES } from "./components/BrandIntro";
import { ShortManifest, VisualPlan } from "./viral/lib/types";
import roguebhPlanJson from "./viral/plans/roguebh.json";
import roguebhManifestJson from "../public/shorts/roguebh/audio/manifest.json";
import erasedmanPlanJson from "./viral/plans/erasedman.json";
import erasedmanManifestJson from "../public/shorts/erasedman/audio/manifest.json";
import marsOneS1PlanJson from "./viral/plans/marsone-short1.json";
import marsOneS1ManifestJson from "../public/shorts/marsone-short1/audio/manifest.json";
import marsOneS2PlanJson from "./viral/plans/marsone-short2.json";
import marsOneS2ManifestJson from "../public/shorts/marsone-short2/audio/manifest.json";
import marsOneS3PlanJson from "./viral/plans/marsone-short3.json";
import marsOneS3ManifestJson from "../public/shorts/marsone-short3/audio/manifest.json";
import marsOneS4PlanJson from "./viral/plans/marsone-short4.json";
import marsOneS4ManifestJson from "../public/shorts/marsone-short4/audio/manifest.json";
import oceanGateS1PlanJson from "./viral/plans/oceangate-short1.json";
import oceanGateS1ManifestJson from "../public/shorts/oceangate-short1/audio/manifest.json";
import oceanGateS2PlanJson from "./viral/plans/oceangate-short2.json";
import oceanGateS2ManifestJson from "../public/shorts/oceangate-short2/audio/manifest.json";
import oceanGateS3PlanJson from "./viral/plans/oceangate-short3.json";
import oceanGateS3ManifestJson from "../public/shorts/oceangate-short3/audio/manifest.json";
import oceanGateS4PlanJson from "./viral/plans/oceangate-short4.json";
import oceanGateS4ManifestJson from "../public/shorts/oceangate-short4/audio/manifest.json";
import almostS1PlanJson from "./viral/plans/almostdied-short1.json";
import almostS1ManifestJson from "../public/shorts/almostdied-short1/audio/manifest.json";
import almostS2PlanJson from "./viral/plans/almostdied-short2.json";
import almostS2ManifestJson from "../public/shorts/almostdied-short2/audio/manifest.json";
import almostS3PlanJson from "./viral/plans/almostdied-short3.json";
import almostS3ManifestJson from "../public/shorts/almostdied-short3/audio/manifest.json";
import almostS4PlanJson from "./viral/plans/almostdied-short4.json";
import almostS4ManifestJson from "../public/shorts/almostdied-short4/audio/manifest.json";
import womantapePlanJson from "./viral/plans/womantape.json";
import womantapeManifestJson from "../public/shorts/womantape/audio/manifest.json";
import marshalchairPlanJson from "./viral/plans/marshalchair.json";
import marshalchairManifestJson from "../public/shorts/marshalchair/audio/manifest.json";
import landeddeadPlanJson from "./viral/plans/landeddead.json";
import landeddeadManifestJson from "../public/shorts/landeddead/audio/manifest.json";
import saLaikaPlanJson from "./viral/plans/sa-laika.json";
import saLaikaManifestJson from "../public/shorts/sa-laika/audio/manifest.json";
import saFelicettePlanJson from "./viral/plans/sa-felicette.json";
import saFelicetteManifestJson from "../public/shorts/sa-felicette/audio/manifest.json";
import saEnosPlanJson from "./viral/plans/sa-enos.json";
import saEnosManifestJson from "../public/shorts/sa-enos/audio/manifest.json";
import saTortoisesPlanJson from "./viral/plans/sa-tortoises.json";
import saTortoisesManifestJson from "../public/shorts/sa-tortoises/audio/manifest.json";
import abKomarovPlanJson from "./viral/plans/ab-komarov.json";
import abKomarovManifestJson from "../public/shorts/ab-komarov/audio/manifest.json";
import abSoyuz11PlanJson from "./viral/plans/ab-soyuz11.json";
import abSoyuz11ManifestJson from "../public/shorts/ab-soyuz11/audio/manifest.json";
import abChallengerPlanJson from "./viral/plans/ab-challenger.json";
import abChallengerManifestJson from "../public/shorts/ab-challenger/audio/manifest.json";
import abApollo1PlanJson from "./viral/plans/ab-apollo1.json";
import abApollo1ManifestJson from "../public/shorts/ab-apollo1/audio/manifest.json";
import mwDoomtimePlanJson from "./viral/plans/mw-doomtime.json";
import mwDoomtimeManifestJson from "../public/shorts/mw-doomtime/audio/manifest.json";
import cosmicspeedPlanJson from "./viral/plans/cosmicspeed.json";
import cosmicspeedManifestJson from "../public/shorts/cosmicspeed/audio/manifest.json";
import biggeststarPlanJson from "./viral/plans/biggeststar.json";
import biggeststarManifestJson from "../public/shorts/biggeststar/audio/manifest.json";
import cosmicthreatsPlanJson from "./viral/plans/cosmicthreats.json";
import cosmicthreatsManifestJson from "../public/shorts/cosmicthreats/audio/manifest.json";
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
import wcArgEgyptPlanJson from "./viral/plans/wc-arg-egypt.json";
import wcArgEgyptManifestJson from "../public/shorts/wc-arg-egypt/audio/manifest.json";
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
import fraSpaSemiPlanJson from "./viral/plans/fra-spa-semi.json";
import fraSpaSemiManifestJson from "../public/shorts/fra-spa-semi/audio/manifest.json";
import fraSpaFinalPlanJson from "./viral/plans/fra-spa-final.json";
import fraSpaFinalManifestJson from "../public/shorts/fra-spa-final/audio/manifest.json";
import argEngSemiPlanJson from "./viral/plans/arg-eng-semi.json";
import argEngSemiManifestJson from "../public/shorts/arg-eng-semi/audio/manifest.json";
import argEngFinalPlanJson from "./viral/plans/arg-eng-final.json";
import argEngFinalManifestJson from "../public/shorts/arg-eng-final/audio/manifest.json";
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
import { CodewiredAvatar, CodewiredBanner } from "./codewired/Brand";
import { CodewiredSubagentsVideo, codewiredTotalFrames } from "./codewired/Video";
import { CodewiredSubagentsThumb, CodewiredMcpThumb, CodewiredSkillsThumb, CodewiredFlagshipThumb } from "./codewired/Thumbnail";
import { CodewiredMcpVideo, mcpTotalFrames } from "./codewired/mcp/Video";
import { CodewiredSkillsVideo, skillsTotalFrames } from "./codewired/skills/Video";
import { CodewiredFlagshipVideo, flagshipTotalFrames } from "./codewired/flagship/Video";

const roguebhPlan = roguebhPlanJson as unknown as VisualPlan;
const roguebhManifest = roguebhManifestJson as unknown as ShortManifest;
const erasedmanPlan = erasedmanPlanJson as unknown as VisualPlan;
const erasedmanManifest = erasedmanManifestJson as unknown as ShortManifest;
const marsOneS1Plan = marsOneS1PlanJson as unknown as VisualPlan;
const marsOneS1Manifest = marsOneS1ManifestJson as unknown as ShortManifest;
const marsOneS2Plan = marsOneS2PlanJson as unknown as VisualPlan;
const marsOneS2Manifest = marsOneS2ManifestJson as unknown as ShortManifest;
const marsOneS3Plan = marsOneS3PlanJson as unknown as VisualPlan;
const marsOneS3Manifest = marsOneS3ManifestJson as unknown as ShortManifest;
const marsOneS4Plan = marsOneS4PlanJson as unknown as VisualPlan;
const marsOneS4Manifest = marsOneS4ManifestJson as unknown as ShortManifest;
const oceanGateS1Plan = oceanGateS1PlanJson as unknown as VisualPlan;
const oceanGateS1Manifest = oceanGateS1ManifestJson as unknown as ShortManifest;
const oceanGateS2Plan = oceanGateS2PlanJson as unknown as VisualPlan;
const oceanGateS2Manifest = oceanGateS2ManifestJson as unknown as ShortManifest;
const oceanGateS3Plan = oceanGateS3PlanJson as unknown as VisualPlan;
const oceanGateS3Manifest = oceanGateS3ManifestJson as unknown as ShortManifest;
const oceanGateS4Plan = oceanGateS4PlanJson as unknown as VisualPlan;
const oceanGateS4Manifest = oceanGateS4ManifestJson as unknown as ShortManifest;
const almostS1Plan = almostS1PlanJson as unknown as VisualPlan;
const almostS1Manifest = almostS1ManifestJson as unknown as ShortManifest;
const almostS2Plan = almostS2PlanJson as unknown as VisualPlan;
const almostS2Manifest = almostS2ManifestJson as unknown as ShortManifest;
const almostS3Plan = almostS3PlanJson as unknown as VisualPlan;
const almostS3Manifest = almostS3ManifestJson as unknown as ShortManifest;
const almostS4Plan = almostS4PlanJson as unknown as VisualPlan;
const almostS4Manifest = almostS4ManifestJson as unknown as ShortManifest;
const womantapePlan = womantapePlanJson as unknown as VisualPlan;
const womantapeManifest = womantapeManifestJson as unknown as ShortManifest;
const marshalchairPlan = marshalchairPlanJson as unknown as VisualPlan;
const marshalchairManifest = marshalchairManifestJson as unknown as ShortManifest;
const landeddeadPlan = landeddeadPlanJson as unknown as VisualPlan;
const landeddeadManifest = landeddeadManifestJson as unknown as ShortManifest;
const saLaikaPlan = saLaikaPlanJson as unknown as VisualPlan;
const saLaikaManifest = saLaikaManifestJson as unknown as ShortManifest;
const saFelicettePlan = saFelicettePlanJson as unknown as VisualPlan;
const saFelicetteManifest = saFelicetteManifestJson as unknown as ShortManifest;
const saEnosPlan = saEnosPlanJson as unknown as VisualPlan;
const saEnosManifest = saEnosManifestJson as unknown as ShortManifest;
const saTortoisesPlan = saTortoisesPlanJson as unknown as VisualPlan;
const saTortoisesManifest = saTortoisesManifestJson as unknown as ShortManifest;
const abKomarovPlan = abKomarovPlanJson as unknown as VisualPlan;
const abKomarovManifest = abKomarovManifestJson as unknown as ShortManifest;
const abSoyuz11Plan = abSoyuz11PlanJson as unknown as VisualPlan;
const abSoyuz11Manifest = abSoyuz11ManifestJson as unknown as ShortManifest;
const abChallengerPlan = abChallengerPlanJson as unknown as VisualPlan;
const abChallengerManifest = abChallengerManifestJson as unknown as ShortManifest;
const abApollo1Plan = abApollo1PlanJson as unknown as VisualPlan;
const abApollo1Manifest = abApollo1ManifestJson as unknown as ShortManifest;
const mwDoomtimePlan = mwDoomtimePlanJson as unknown as VisualPlan;
const mwDoomtimeManifest = mwDoomtimeManifestJson as unknown as ShortManifest;

// ── Cosmic-speed Short (AstroKobi-style): Hume VO + Veo/Higgsfield b-roll ──
const cosmicspeedPlan = cosmicspeedPlanJson as unknown as VisualPlan;
const cosmicspeedManifest = cosmicspeedManifestJson as unknown as ShortManifest;

// ── Biggest-star Short: Orion host (Veo talking-head + wav2lip) + Veo b-roll ──
const biggeststarPlan = biggeststarPlanJson as unknown as VisualPlan;
const biggeststarManifest = biggeststarManifestJson as unknown as ShortManifest;

// ── Cosmic-threats Short: scary-space compilation reusing paid clips, cloned voice ──
const cosmicthreatsPlan = cosmicthreatsPlanJson as unknown as VisualPlan;
const cosmicthreatsManifest = cosmicthreatsManifestJson as unknown as ShortManifest;

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
const fraSpaSemiPlan = fraSpaSemiPlanJson as unknown as VisualPlan;
const fraSpaSemiManifest = fraSpaSemiManifestJson as unknown as ShortManifest;
const fraSpaFinalPlan = fraSpaFinalPlanJson as unknown as VisualPlan;
const fraSpaFinalManifest = fraSpaFinalManifestJson as unknown as ShortManifest;
const argEngSemiPlan = argEngSemiPlanJson as unknown as VisualPlan;
const argEngSemiManifest = argEngSemiManifestJson as unknown as ShortManifest;
const argEngFinalPlan = argEngFinalPlanJson as unknown as VisualPlan;
const argEngFinalManifest = argEngFinalManifestJson as unknown as ShortManifest;
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
  { id: "ShortWC-wc-arg-egypt", plan: wcArgEgyptPlanJson as unknown as VisualPlan, manifest: wcArgEgyptManifestJson as unknown as ShortManifest },
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
        id="ShortCosmicSpeed"
        component={ViralShort}
        defaultProps={{ plan: cosmicspeedPlan, manifest: cosmicspeedManifest }}
        durationInFrames={viralShortFrames(cosmicspeedPlan, cosmicspeedManifest)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="ShortBiggestStar"
        component={ViralShort}
        defaultProps={{ plan: biggeststarPlan, manifest: biggeststarManifest }}
        durationInFrames={viralShortFrames(biggeststarPlan, biggeststarManifest)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="ShortCosmicThreats"
        component={ViralShort}
        defaultProps={{ plan: cosmicthreatsPlan, manifest: cosmicthreatsManifest }}
        durationInFrames={viralShortFrames(cosmicthreatsPlan, cosmicthreatsManifest)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="ShortRogueBH"
        component={ViralShort}
        defaultProps={{ plan: roguebhPlan, manifest: roguebhManifest }}
        durationInFrames={viralShortFrames(roguebhPlan, roguebhManifest)}
        fps={30}
        width={1080}
        height={1920}
      />
      {/* ── Mars One Shorts funnel (real archival broll, cloned channel voice) ── */}
      <Composition
        id="ShortMarsOne1"
        component={ViralShort}
        defaultProps={{ plan: marsOneS1Plan, manifest: marsOneS1Manifest }}
        durationInFrames={viralShortFrames(marsOneS1Plan, marsOneS1Manifest)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="ShortMarsOne2"
        component={ViralShort}
        defaultProps={{ plan: marsOneS2Plan, manifest: marsOneS2Manifest }}
        durationInFrames={viralShortFrames(marsOneS2Plan, marsOneS2Manifest)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="ShortMarsOne3"
        component={ViralShort}
        defaultProps={{ plan: marsOneS3Plan, manifest: marsOneS3Manifest }}
        durationInFrames={viralShortFrames(marsOneS3Plan, marsOneS3Manifest)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="ShortMarsOne4"
        component={ViralShort}
        defaultProps={{ plan: marsOneS4Plan, manifest: marsOneS4Manifest }}
        durationInFrames={viralShortFrames(marsOneS4Plan, marsOneS4Manifest)}
        fps={30}
        width={1080}
        height={1920}
      />
      {/* ── OceanGate Shorts funnel (documentary pivot #2) ── */}
      <Composition
        id="ShortOceanGate1"
        component={ViralShort}
        defaultProps={{ plan: oceanGateS1Plan, manifest: oceanGateS1Manifest }}
        durationInFrames={viralShortFrames(oceanGateS1Plan, oceanGateS1Manifest)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="ShortOceanGate2"
        component={ViralShort}
        defaultProps={{ plan: oceanGateS2Plan, manifest: oceanGateS2Manifest }}
        durationInFrames={viralShortFrames(oceanGateS2Plan, oceanGateS2Manifest)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="ShortOceanGate3"
        component={ViralShort}
        defaultProps={{ plan: oceanGateS3Plan, manifest: oceanGateS3Manifest }}
        durationInFrames={viralShortFrames(oceanGateS3Plan, oceanGateS3Manifest)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="ShortOceanGate4"
        component={ViralShort}
        defaultProps={{ plan: oceanGateS4Plan, manifest: oceanGateS4Manifest }}
        durationInFrames={viralShortFrames(oceanGateS4Plan, oceanGateS4Manifest)}
        fps={30}
        width={1080}
        height={1920}
      />
      {/* ── "Almost Died in Space" Shorts funnel → rescue the low-traction long-form ── */}
      <Composition
        id="ShortAlmostDied1"
        component={ViralShort}
        defaultProps={{ plan: almostS1Plan, manifest: almostS1Manifest }}
        durationInFrames={viralShortFrames(almostS1Plan, almostS1Manifest)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="ShortAlmostDied2"
        component={ViralShort}
        defaultProps={{ plan: almostS2Plan, manifest: almostS2Manifest }}
        durationInFrames={viralShortFrames(almostS2Plan, almostS2Manifest)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="ShortAlmostDied3"
        component={ViralShort}
        defaultProps={{ plan: almostS3Plan, manifest: almostS3Manifest }}
        durationInFrames={viralShortFrames(almostS3Plan, almostS3Manifest)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="ShortAlmostDied4"
        component={ViralShort}
        defaultProps={{ plan: almostS4Plan, manifest: almostS4Manifest }}
        durationInFrames={viralShortFrames(almostS4Plan, almostS4Manifest)}
        fps={30}
        width={1080}
        height={1920}
      />
      {/* ── Lost Cosmonauts Shorts funnel (archival broll, cloned channel voice) ── */}
      <Composition
        id="ShortErasedMan"
        component={ViralShort}
        defaultProps={{ plan: erasedmanPlan, manifest: erasedmanManifest }}
        durationInFrames={viralShortFrames(erasedmanPlan, erasedmanManifest)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="ShortWomanTape"
        component={ViralShort}
        defaultProps={{ plan: womantapePlan, manifest: womantapeManifest }}
        durationInFrames={viralShortFrames(womantapePlan, womantapeManifest)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="ShortMarshalChair"
        component={ViralShort}
        defaultProps={{ plan: marshalchairPlan, manifest: marshalchairManifest }}
        durationInFrames={viralShortFrames(marshalchairPlan, marshalchairManifest)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="ShortLandedDead"
        component={ViralShort}
        defaultProps={{ plan: landeddeadPlan, manifest: landeddeadManifest }}
        durationInFrames={viralShortFrames(landeddeadPlan, landeddeadManifest)}
        fps={30}
        width={1080}
        height={1920}
      />
      {/* ── Space Animals Shorts funnel ── */}
      <Composition
        id="ShortSaLaika"
        component={ViralShort}
        defaultProps={{ plan: saLaikaPlan, manifest: saLaikaManifest }}
        durationInFrames={viralShortFrames(saLaikaPlan, saLaikaManifest)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="ShortSaFelicette"
        component={ViralShort}
        defaultProps={{ plan: saFelicettePlan, manifest: saFelicetteManifest }}
        durationInFrames={viralShortFrames(saFelicettePlan, saFelicetteManifest)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="ShortSaEnos"
        component={ViralShort}
        defaultProps={{ plan: saEnosPlan, manifest: saEnosManifest }}
        durationInFrames={viralShortFrames(saEnosPlan, saEnosManifest)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="ShortSaTortoises"
        component={ViralShort}
        defaultProps={{ plan: saTortoisesPlan, manifest: saTortoisesManifest }}
        durationInFrames={viralShortFrames(saTortoisesPlan, saTortoisesManifest)}
        fps={30}
        width={1080}
        height={1920}
      />
      {/* ── Astronaut Bodies Shorts funnel ── */}
      <Composition
        id="ShortAbKomarov"
        component={ViralShort}
        defaultProps={{ plan: abKomarovPlan, manifest: abKomarovManifest }}
        durationInFrames={viralShortFrames(abKomarovPlan, abKomarovManifest)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="ShortAbSoyuz11"
        component={ViralShort}
        defaultProps={{ plan: abSoyuz11Plan, manifest: abSoyuz11Manifest }}
        durationInFrames={viralShortFrames(abSoyuz11Plan, abSoyuz11Manifest)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="ShortAbChallenger"
        component={ViralShort}
        defaultProps={{ plan: abChallengerPlan, manifest: abChallengerManifest }}
        durationInFrames={viralShortFrames(abChallengerPlan, abChallengerManifest)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="ShortAbApollo1"
        component={ViralShort}
        defaultProps={{ plan: abApollo1Plan, manifest: abApollo1Manifest }}
        durationInFrames={viralShortFrames(abApollo1Plan, abApollo1Manifest)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="ShortMwDoomtime"
        component={ViralShort}
        defaultProps={{ plan: mwDoomtimePlan, manifest: mwDoomtimeManifest }}
        durationInFrames={viralShortFrames(mwDoomtimePlan, mwDoomtimeManifest)}
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
      {/* ── France 0-2 Spain WC semi-final (2026-07-14). Real-photo stat videos:
          the 9:16 "silent superstars" Short + the 16:9 "Spain in the final"
          landscape (Fable script). kickoffdaily90; append short/long outro. ── */}
      <Composition
        id="ShortFraSpaSemi"
        component={ViralShort}
        defaultProps={{ plan: fraSpaSemiPlan, manifest: fraSpaSemiManifest }}
        durationInFrames={viralShortFrames(fraSpaSemiPlan, fraSpaSemiManifest)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="FraSpaFinalWide"
        component={ViralShort}
        defaultProps={{ plan: fraSpaFinalPlan, manifest: fraSpaFinalManifest }}
        durationInFrames={viralShortFrames(fraSpaFinalPlan, fraSpaFinalManifest)}
        fps={30}
        width={1920}
        height={1080}
      />
      {/* ── Argentina 2-1 England WC semi-final (2026-07-15). Messi's late-show
          comeback: 16:9 landscape + 9:16 Short, real CC/PD photos. ── */}
      <Composition
        id="ShortArgEngSemi"
        component={ViralShort}
        defaultProps={{ plan: argEngSemiPlan, manifest: argEngSemiManifest }}
        durationInFrames={viralShortFrames(argEngSemiPlan, argEngSemiManifest)}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="ArgEngFinalWide"
        component={ViralShort}
        defaultProps={{ plan: argEngFinalPlan, manifest: argEngFinalManifest }}
        durationInFrames={viralShortFrames(argEngFinalPlan, argEngFinalManifest)}
        fps={30}
        width={1920}
        height={1080}
      />
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

      {/* ── DimaagBatti (Hindi explainer) — रुपया क्यों गिर रहा है ── */}
      <Composition
        id="DimaagBattiRupee"
        component={RupeeShort}
        durationInFrames={rupeeTotalFrames()}
        fps={30}
        width={1080}
        height={1920}
      />

      {/* ── DimaagBatti Short — 20 जुलाई: दिल्ली में क्या हुआ? (funnels to SansadchaloDoc) ── */}
      <Composition
        id="SansadchaloShort"
        component={SansadchaloShort}
        durationInFrames={sansadchaloShortTotalFrames()}
        fps={30}
        width={1080}
        height={1920}
      />

      {/* ── DimaagBatti — NEET लीक → Telegram बैन → विरोध (16:9 long-form) ── */}
      <Composition
        id="DimaagBattiNeet"
        component={NeetWide}
        durationInFrames={neetTotalFrames()}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* ── DimaagBatti (Hindi) — spacesounds + mariana (no outro; none exists yet) ── */}
      <Composition
        id="SpaceSoundsHiDoc"
        component={makeDocComp(spaceSoundsHiDoc, spaceSoundsHiManifest)}
        durationInFrames={docTotalFrames(spaceSoundsHiDoc, spaceSoundsHiManifest)}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="MarianaHiDoc"
        component={makeDocComp(marianaHiDoc, marianaHiManifest)}
        durationInFrames={docTotalFrames(marianaHiDoc, marianaHiManifest)}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* ── DimaagBatti — अंतरिक्ष में मरते-मरते बचे (Hindi twin of almostdied;
             batti mascot debut; no outro — none exists for the channel) ── */}
      <Composition
        id="AlmostDiedHiDoc"
        component={makeDocComp(almostDiedHiDoc, almostDiedHiManifest)}
        durationInFrames={docTotalFrames(almostDiedHiDoc, almostDiedHiManifest)}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* ── mindwired — Mars One (documentary pivot #1; MW subscribe outro baked) ── */}
      <Composition
        id="MarsOneDoc"
        component={makeDocComp(marsOneDoc, marsOneManifest, MW_OUTRO)}
        durationInFrames={docTotalFrames(marsOneDoc, marsOneManifest, MW_OUTRO)}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* ── mindwired — OceanGate (documentary pivot #2; MW subscribe outro baked) ── */}
      <Composition
        id="OceanGateDoc"
        component={makeDocComp(oceanGateDoc, oceanGateManifest, MW_OUTRO)}
        durationInFrames={docTotalFrames(oceanGateDoc, oceanGateManifest, MW_OUTRO)}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* ── mindwired — Concorde (documentary pivot #3; MW subscribe outro baked) ── */}
      <Composition
        id="ConcordeDoc"
        component={makeDocComp(concordeDoc, concordeManifest, MW_OUTRO)}
        durationInFrames={docTotalFrames(concordeDoc, concordeManifest, MW_OUTRO)}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* ── mindwired — Space Shuttle (documentary pivot #5; MW subscribe outro baked) ── */}
      <Composition
        id="SpaceShuttleDoc"
        component={makeDocComp(spaceShuttleDoc, spaceShuttleManifest, MW_OUTRO)}
        durationInFrames={docTotalFrames(spaceShuttleDoc, spaceShuttleManifest, MW_OUTRO)}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* ── mindwired — The Man Who Sold the Moon (documentary pivot #4; MW subscribe outro baked) ── */}
      <Composition
        id="MoonSellerDoc"
        component={makeDocComp(moonSellerDoc, moonSellerManifest, MW_OUTRO)}
        durationInFrames={docTotalFrames(moonSellerDoc, moonSellerManifest, MW_OUTRO)}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* ── Black Box Breakdown — United 93 (Evidence Engine: real Commission-Report
             exhibits + gender-matched phone-call/CVR voice recreations; BB subscribe
             outro baked) ── */}
      <Composition
        id="Flight93Doc"
        component={makeDocComp(flight93Doc, flight93Manifest, BB_OUTRO)}
        durationInFrames={docTotalFrames(flight93Doc, flight93Manifest, BB_OUTRO)}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* ── DimaagBatti — 20 जुलाई 2026: दिल्ली, वांगचुक और शांतिपूर्ण प्रदर्शन
             का सवाल (neutral news explainer; no outro — none exists for channel) ── */}
      <Composition
        id="SansadchaloDoc"
        component={makeDocComp(sansadchaloDoc, sansadchaloManifest)}
        durationInFrames={docTotalFrames(sansadchaloDoc, sansadchaloManifest)}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* ── DimaagBatti — 21 जुलाई 2026: राहुल गांधी और विपक्ष हिरासत में
             (neutral news explainer, 2-day arc; no outro) ── */}
      <Composition
        id="OppositionDetainedDoc"
        component={makeDocComp(oppositiondetainedDoc, oppositiondetainedManifest)}
        durationInFrames={docTotalFrames(oppositiondetainedDoc, oppositiondetainedManifest)}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* ── Black Box — Tenerife: deadliest crash in history (4K, robot host
             debut, GCE-rendered; BB outro baked) ── */}
      <Composition
        id="TenerifeDoc"
        component={makeDocComp(tenerifeDoc, tenerifeManifest, BB_OUTRO)}
        durationInFrames={docTotalFrames(tenerifeDoc, tenerifeManifest, BB_OUTRO)}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* ── Black Box — What's Actually Inside a Black Box? (4K, robot-as-FDR
             origin story, rig 2.0 blinks/gestures/aside; BB outro baked) ── */}
      <Composition
        id="BlackBoxAnatomyDoc"
        component={makeDocComp(blackboxAnatomyDoc, blackboxAnatomyManifest, BB_OUTRO)}
        durationInFrames={docTotalFrames(blackboxAnatomyDoc, blackboxAnatomyManifest, BB_OUTRO)}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* ── Black Box Breakdown — Air India 171 (BB subscribe outro baked) ── */}
      <Composition
        id="Ai171Doc"
        component={makeDocComp(ai171Doc, ai171Manifest, BB_OUTRO)}
        durationInFrames={docTotalFrames(ai171Doc, ai171Manifest, BB_OUTRO)}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* ── mindwired — Every Astronaut Who Almost Died in Space (4K, sequel
             to the 21-astronauts winner; outro baked) ── */}
      <Composition
        id="AlmostDiedDoc"
        component={makeDocComp(almostDiedDoc, almostDiedManifest, MW_OUTRO)}
        durationInFrames={docTotalFrames(almostDiedDoc, almostDiedManifest, MW_OUTRO)}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* ── STYLE TEST — hand-drawn sketch brand look (Sketch.tsx); not a
             publishable video: no outro, internal review only ── */}
      <Composition
        id="SketchDemo"
        component={makeDocComp(sketchDemoDoc, sketchDemoManifest)}
        durationInFrames={docTotalFrames(sketchDemoDoc, sketchDemoManifest)}
        fps={30}
        width={1920}
        height={1080}
      />


      {/* ── kickoffdaily90 — World Cup FINAL review (Jamie host-still + stat show) ── */}
      <Composition
        id="FinalReview"
        component={FinalReview}
        durationInFrames={finalReviewFrames()}
        fps={30}
        width={1920}
        height={1080}
      />


      {/* ── mindwired — evidence doc: The Place on Earth Scarier Than Space (Mariana) ── */}
      <Composition
        id="MarianaDoc"
        component={makeDocComp(marianaDoc, marianaManifest, MW_OUTRO)}
        durationInFrames={docTotalFrames(marianaDoc, marianaManifest, MW_OUTRO)}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* ── mindwired — evidence doc: The Scariest Real Sounds Ever Recorded in Space ── */}
      <Composition
        id="SpaceSoundsDoc"
        component={makeDocComp(spaceSoundsDoc, spaceSoundsManifest, MW_OUTRO)}
        durationInFrames={docTotalFrames(spaceSoundsDoc, spaceSoundsManifest, MW_OUTRO)}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* ── mindwired — archival documentary: What Happened to the Bodies ── */}
      <Composition
        id="AstronautBodiesDoc"
        component={makeDocComp(astronautBodiesDoc, astronautBodiesManifest, MW_OUTRO)}
        durationInFrames={docTotalFrames(astronautBodiesDoc, astronautBodiesManifest, MW_OUTRO)}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* ── mindwired — archival documentary: Every Animal We Sent to Space ── */}
      <Composition
        id="SpaceAnimalsDoc"
        component={makeDocComp(spaceAnimalsDoc, spaceAnimalsManifest, MW_OUTRO)}
        durationInFrames={docTotalFrames(spaceAnimalsDoc, spaceAnimalsManifest, MW_OUTRO)}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* ── mindwired — flat 2D icon-grid doc: Every Type of Black Hole, Explained ── */}
      <Composition
        id="BlackHolesDoc"
        component={makeDocComp(blackHolesDoc, blackHolesManifest, MW_OUTRO)}
        durationInFrames={docTotalFrames(blackHolesDoc, blackHolesManifest, MW_OUTRO)}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* ── mindwired — archival documentary: The Cosmonauts the Soviets Erased ── */}
      <Composition
        id="LostCosmonautsDoc"
        component={makeDocComp(lostCosmonautsDoc, lostCosmonautsManifest, MW_OUTRO)}
        durationInFrames={docTotalFrames(lostCosmonautsDoc, lostCosmonautsManifest, MW_OUTRO)}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* ── mindwired — archival documentary: Every Way Space Has Killed a Human ── */}
      <Composition
        id="SpaceDeathsDoc"
        component={makeDocComp(spaceDeathsDoc, spaceDeathsManifest)}
        durationInFrames={docTotalFrames(spaceDeathsDoc, spaceDeathsManifest)}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* ── mindwired — archival documentary: Apollo 11 stranding contingency ── */}
      <Composition
        id="MoonStrandedDoc"
        component={makeDocComp(moonStrandedDoc, moonStrandedManifest)}
        durationInFrames={docTotalFrames(moonStrandedDoc, moonStrandedManifest)}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* ── mindwired — FLAGSHIP: Timelapse of the End of the Universe ── */}
      <Composition
        id="EndOfTimeEpic"
        component={EndOfTimeEpic}
        durationInFrames={endOfTimeTotalFrames()}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* ── mindwired — archival documentary: Every Way the Atom Has Killed a Human ── */}
      <Composition
        id="AtomDeathsDoc"
        component={makeDocComp(atomDeathsDoc, atomDeathsManifest)}
        durationInFrames={docTotalFrames(atomDeathsDoc, atomDeathsManifest)}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* ── mindwired — archival documentary: How Boeing Killed 346 People (737 MAX) ── */}
      <Composition
        id="Boeing737MaxDoc"
        component={makeDocComp(boeing737maxDoc, boeing737maxManifest, BB_OUTRO)}
        durationInFrames={docTotalFrames(boeing737maxDoc, boeing737maxManifest, BB_OUTRO)}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* ── Black Box Breakdown — archival documentary: Colgan Air 3407 ── */}
      <Composition
        id="Colgan3407Doc"
        component={makeDocComp(colgan3407Doc, colgan3407Manifest, BB_OUTRO)}
        durationInFrames={docTotalFrames(colgan3407Doc, colgan3407Manifest, BB_OUTRO)}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* ── Black Box Breakdown — archival documentary: Air France 447 ── */}
      <Composition
        id="AF447Doc"
        component={makeDocComp(af447Doc, af447Manifest, BB_OUTRO)}
        durationInFrames={docTotalFrames(af447Doc, af447Manifest, BB_OUTRO)}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* ── Black Box Breakdown — flagship documentary: MH370 ── */}
      <Composition
        id="MH370Doc"
        component={makeDocComp(mh370Doc, mh370Manifest, BB_OUTRO)}
        durationInFrames={docTotalFrames(mh370Doc, mh370Manifest, BB_OUTRO)}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* ── Black Box Breakdown — MH370: Every Theory (follow-up) ── */}
      <Composition
        id="MH370TheoriesDoc"
        component={makeDocComp(mh370thDoc, mh370thManifest, BB_OUTRO)}
        durationInFrames={docTotalFrames(mh370thDoc, mh370thManifest, BB_OUTRO)}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* ── Black Box Breakdown — subscribe outro ── */}
      <Composition
        id="SubscribeBlackBoxLong"
        component={SubscribeBlackBoxLong}
        durationInFrames={subscribeBlackBoxFrames}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="SubscribeBlackBoxShort"
        component={SubscribeBlackBoxShort}
        durationInFrames={subscribeBlackBoxShortFrames}
        fps={30}
        width={1080}
        height={1920}
      />

      {/* ── DimaagBatti — archival documentary: East India Company ── */}
      <Composition
        id="EastIndiaDoc"
        component={makeDocComp(eastIndiaDoc, eastIndiaManifest)}
        durationInFrames={docTotalFrames(eastIndiaDoc, eastIndiaManifest)}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* ── DimaagBatti — archival documentary: spacedeaths Hindi remake ── */}
      <Composition
        id="SpaceDeathsHiDoc"
        component={makeDocComp(spaceDeathsHiDoc, spaceDeathsHiManifest)}
        durationInFrames={docTotalFrames(spaceDeathsHiDoc, spaceDeathsHiManifest)}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* ── mindwired — archival documentary: World War II — The Whole Story (EN remake) ── */}
      <Composition
        id="WW2EpicEnDoc"
        component={makeDocComp(ww2EpicEnDoc, ww2EpicEnManifest)}
        durationInFrames={docTotalFrames(ww2EpicEnDoc, ww2EpicEnManifest)}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* ── DimaagBatti — दूसरा विश्वयुद्ध कैसे शुरू हुआ (deep-dive, maps+illustrations) ── */}
      <Composition
        id="DimaagBattiWW2"
        component={WW2Wide}
        durationInFrames={ww2TotalFrames()}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* ── DimaagBatti — WW2 EPIC (1-hour, chapters ship incrementally) ── */}
      <Composition
        id="DimaagBattiWW2Epic"
        component={WW2Epic}
        durationInFrames={ww2EpicTotalFrames()}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* ── DimaagBatti WW2 Epic — thumbnails ── */}
      <Still id="DimaagBattiWW2EpicThumbHi" component={WW2EpicThumb} defaultProps={{ lang: "hi" as const }} width={1280} height={720} />
      <Still id="DimaagBattiWW2EpicThumbEn" component={WW2EpicThumb} defaultProps={{ lang: "en" as const }} width={1280} height={720} />
      <Still id="WW2EpicEnThumbMW" component={WW2EpicEnThumb} width={1280} height={720} />
      <Still id="FraSpaThumbnail" component={FraSpaThumbnail} width={1280} height={720} />
      <Still id="ArgEngThumbnail" component={ArgEngThumbnail} width={1280} height={720} />
      <Still id="SpaceDeathsHiThumbDB" component={SpaceDeathsHiThumb} width={1280} height={720} />
      <Still id="EastIndiaThumbDB" component={EastIndiaThumb} width={1280} height={720} />
      <Still id="AtomDeathsThumbMW" component={AtomDeathsThumb} width={1280} height={720} />
      <Still id="EndOfTimeThumbMW" component={EndOfTimeThumb} width={1280} height={720} />

      {/* ── codewired channel brand assets ── */}
      <Still id="CodewiredAvatar" component={CodewiredAvatar} width={800} height={800} />
      <Still id="CodewiredBanner" component={CodewiredBanner} width={2048} height={1152} />
      <Composition
        id="CodewiredSubagents"
        component={CodewiredSubagentsVideo}
        durationInFrames={codewiredTotalFrames()}
        fps={30} width={1920} height={1080}
      />
      <Still id="CodewiredSubagentsThumb" component={CodewiredSubagentsThumb} width={1280} height={720} />
      <Still id="CodewiredMcpThumb" component={CodewiredMcpThumb} width={1280} height={720} />
      <Still id="CodewiredSkillsThumb" component={CodewiredSkillsThumb} width={1280} height={720} />
      <Still id="CodewiredFlagshipThumb" component={CodewiredFlagshipThumb} width={1280} height={720} />
      <Composition
        id="CodewiredFlagship"
        component={CodewiredFlagshipVideo}
        durationInFrames={flagshipTotalFrames()}
        fps={30} width={1920} height={1080}
      />
      <Composition
        id="CodewiredSkills"
        component={CodewiredSkillsVideo}
        durationInFrames={skillsTotalFrames()}
        fps={30} width={1920} height={1080}
      />
      <Composition
        id="CodewiredMcp"
        component={CodewiredMcpVideo}
        durationInFrames={mcpTotalFrames()}
        fps={30} width={1920} height={1080}
      />
      <Composition
        id="RadioTest"
        component={makeDocComp(radioTestDoc, radioTestManifest)}
        durationInFrames={docTotalFrames(radioTestDoc, radioTestManifest)}
        fps={30} width={1920} height={1080}
      />
      <Composition
        id="BoeingShort1"
        component={BlackBoxShort}
        durationInFrames={blackBoxShortFrames({ startId: "h1", endId: "h4", hook: "189 people.\n13 minutes.\nTwice." })}
        fps={30} width={1080} height={1920}
        defaultProps={{ startId: "h1", endId: "h4", hook: "189 people.\n13 minutes.\nTwice.", cta: "How Boeing killed\n346 people" }}
      />
      <Composition
        id="BoeingShort2"
        component={BlackBoxShort}
        durationInFrames={blackBoxShortFrames({ startId: "b1", endId: "b5", hook: "Why the 737 MAX\nsecretly wanted\nto crash" })}
        fps={30} width={1080} height={1920}
        defaultProps={{ startId: "b1", endId: "b5", hook: "Why the 737 MAX\nsecretly wanted\nto crash", cta: "The full breakdown\nof the MAX disaster" }}
      />
      <Composition
        id="BoeingShort3"
        component={BlackBoxShort}
        durationInFrames={blackBoxShortFrames({ startId: "e3", endId: "e6", hook: "Boeing DELETED it\nfrom the manual" })}
        fps={30} width={1080} height={1920}
        defaultProps={{ startId: "e3", endId: "e6", hook: "Boeing DELETED it\nfrom the manual", cta: "How Boeing hid MCAS\nfrom its own pilots" }}
      />
      {/* ── Black Box Anatomy Shorts (contiguous self-contained windows) ── */}
      <Composition
        id="BbAnatomyShort1"
        component={BlackBoxShort}
        durationInFrames={blackBoxShortFrames({ startId: "a1", endId: "a5", doc: blackboxAnatomyDoc as any, manifest: blackboxAnatomyManifest as any })}
        fps={30} width={1080} height={1920}
        defaultProps={{ startId: "a1", endId: "a5", hook: "What's actually\nINSIDE a\nblack box?", cta: "The full anatomy\nof a black box", slug: "blackboxanatomy", doc: blackboxAnatomyDoc as any, manifest: blackboxAnatomyManifest as any }}
      />
      <Composition
        id="BbAnatomyShort2"
        component={BlackBoxShort}
        durationInFrames={blackBoxShortFrames({ startId: "a6", endId: "a10", doc: blackboxAnatomyDoc as any, manifest: blackboxAnatomyManifest as any })}
        fps={30} width={1080} height={1920}
        defaultProps={{ startId: "a6", endId: "a10", hook: "Crushed. Burned.\nDrowned.\nStill works.", cta: "How a black box\nsurvives anything", slug: "blackboxanatomy", doc: blackboxAnatomyDoc as any, manifest: blackboxAnatomyManifest as any }}
      />
      <Composition
        id="BbAnatomyShort3"
        component={BlackBoxShort}
        durationInFrames={blackBoxShortFrames({ startId: "p1", endId: "p5", doc: blackboxAnatomyDoc as any, manifest: blackboxAnatomyManifest as any })}
        fps={30} width={1080} height={1920}
        defaultProps={{ startId: "p1", endId: "p5", hook: "Why MH370 changed\nevery black box\non Earth", cta: "What's inside a\nblack box", slug: "blackboxanatomy", doc: blackboxAnatomyDoc as any, manifest: blackboxAnatomyManifest as any }}
      />
      <Composition
        id="BbAnatomyShort4"
        component={BlackBoxShort}
        durationInFrames={blackBoxShortFrames({ startId: "e1", endId: "e4", doc: blackboxAnatomyDoc as any, manifest: blackboxAnatomyManifest as any })}
        fps={30} width={1080} height={1920}
        defaultProps={{ startId: "e1", endId: "e4", hook: "2 years underwater.\nEvery byte\nsurvived.", cta: "The full black box\nbreakdown", slug: "blackboxanatomy", doc: blackboxAnatomyDoc as any, manifest: blackboxAnatomyManifest as any }}
      />
      <Composition
        id="ColganShort1"
        component={BlackBoxShort}
        durationInFrames={blackBoxShortFrames({ startId: "h4", endId: "h6", doc: colgan3407Doc as any, manifest: colgan3407Manifest as any })}
        fps={30} width={1080} height={1920}
        defaultProps={{ startId: "h4", endId: "h6", hook: "$16,000\nA YEAR\nto fly you", slug: "colgan3407", doc: colgan3407Doc as any, manifest: colgan3407Manifest as any }}
      />
      <Composition
        id="ColganShort2"
        component={BlackBoxShort}
        durationInFrames={blackBoxShortFrames({ startId: "g1", endId: "g4", doc: colgan3407Doc as any, manifest: colgan3407Manifest as any })}
        fps={30} width={1080} height={1920}
        defaultProps={{ startId: "g1", endId: "g4", hook: "The last\n27 seconds", slug: "colgan3407", doc: colgan3407Doc as any, manifest: colgan3407Manifest as any }}
      />
      <Composition
        id="ColganShort3"
        component={BlackBoxShort}
        durationInFrames={blackBoxShortFrames({ startId: "m1", endId: "m4", doc: colgan3407Doc as any, manifest: colgan3407Manifest as any })}
        fps={30} width={1080} height={1920}
        defaultProps={{ startId: "m1", endId: "m4", hook: "They blamed\nthe ice.\nThe NTSB didn't.", slug: "colgan3407", doc: colgan3407Doc as any, manifest: colgan3407Manifest as any }}
      />
      <Composition
        id="BoeingShort4"
        component={BlackBoxShort}
        durationInFrames={blackBoxShortFrames({ startId: "m10", endId: "m13", hook: "Nobody went to\nprison for\n346 deaths" })}
        fps={30} width={1080} height={1920}
        defaultProps={{ startId: "m10", endId: "m13", hook: "Nobody went to\nprison for\n346 deaths", cta: "The full 737 MAX\nscandal, explained" }}
      />
      <Composition
        id="AF447Short1"
        component={BlackBoxShort}
        durationInFrames={blackBoxShortFrames({ startId: "h1", endId: "h3", doc: af447Doc as any, manifest: af447Manifest as any })}
        fps={30} width={1080} height={1920}
        defaultProps={{ startId: "h1", endId: "h3", hook: "This plane was\nworking perfectly.\n228 people died.", slug: "af447", doc: af447Doc as any, manifest: af447Manifest as any, cta: "The full fall of\nAir France 447" }}
      />
      <Composition
        id="AF447Short2"
        component={BlackBoxShort}
        durationInFrames={blackBoxShortFrames({ startId: "e1", endId: "e3", doc: af447Doc as any, manifest: af447Manifest as any })}
        fps={30} width={1080} height={1920}
        defaultProps={{ startId: "e1", endId: "e3", hook: "This alarm rang\n75 times.\nNobody said the word.", slug: "af447", doc: af447Doc as any, manifest: af447Manifest as any, cta: "The full fall of\nAir France 447" }}
      />
      <Composition
        id="AF447Short3"
        component={BlackBoxShort}
        durationInFrames={blackBoxShortFrames({ startId: "b8", endId: "b10", doc: af447Doc as any, manifest: af447Manifest as any })}
        fps={30} width={1080} height={1920}
        defaultProps={{ startId: "b8", endId: "b10", hook: "3 frozen tubes\nkilled 228 people.", slug: "af447", doc: af447Doc as any, manifest: af447Manifest as any, cta: "The full fall of\nAir France 447" }}
      />




      {/* ── DimaagBatti WW2 — thumbnails ── */}
      <Still id="DimaagBattiWW2ThumbHi" component={WW2Thumb} defaultProps={{ lang: "hi" as const }} width={1280} height={720} />
      <Still id="DimaagBattiWW2ThumbEn" component={WW2Thumb} defaultProps={{ lang: "en" as const }} width={1280} height={720} />

      {/* ── DimaagBatti NEET — thumbnails (Gemini scene + Remotion text) ── */}
      <Still id="DimaagBattiNeetThumbHi" component={NeetThumb} defaultProps={{ lang: "hi" as const }} width={1280} height={720} />
      <Still id="DimaagBattiNeetThumbEn" component={NeetThumb} defaultProps={{ lang: "en" as const }} width={1280} height={720} />

      {/* ── mindwired — How AI Video Generation Works (pop-science explainer) ── */}
      <Composition
        id="HowAIVideo"
        component={HowAIVideo}
        durationInFrames={aiVideoTotalFrames()}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* ── kickoffdaily90 — Messi vs Mo Salah: World Cup ANIME Edition ── */}
      <Composition
        id="AnimeClash"
        component={AnimeClash}
        durationInFrames={animeClashFrames()}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* ── kickoffdaily90 — Messi vs Salah ANIME (vertical / IG Reels) ── */}
      <Composition
        id="AnimeClashV"
        component={AnimeClashV}
        durationInFrames={animeClashVFrames()}
        fps={30}
        width={1080}
        height={1920}
      />

      {/* ── kickoffdaily90 — Changing of the Guard (16:9) ── */}
      <Composition
        id="ChangingGuard"
        component={ChangingGuard}
        durationInFrames={changingGuardFrames()}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* ── kickoffdaily90 — What If Argentina Wins the World Cup (~8 min epic) ── */}
      <Composition
        id="WhatIfArgentina"
        component={WhatIfArgentina}
        durationInFrames={whatIfArgentinaFrames()}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* ── kickoffdaily90 — "63" + QF Review Shorts cuts ── */}
      <Composition id="Sixty3Short" component={Sixty3Short} durationInFrames={sixty3ShortFrames()} fps={30} width={1080} height={1920} />
      <Composition id="QFReviewShort" component={QFReviewShort} durationInFrames={qfShortFrames()} fps={30} width={1080} height={1920} />

      {/* ── kickoffdaily90 — "63" (Bellingham/Haaland Nolan-style short) ── */}
      <Composition
        id="Sixty3"
        component={Sixty3}
        durationInFrames={sixty3Frames()}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* ── kickoffdaily90 — QF Review (Jamie hybrid host show) ── */}
      <Composition
        id="QFReview"
        component={QFReview}
        durationInFrames={qfReviewFrames()}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* ── kickoffdaily90 — Messi vs Bellingham semifinal preview ── */}
      <Composition
        id="MvB"
        component={MvB}
        durationInFrames={mvbFrames()}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition id="MvBShort" component={MvBShort} durationInFrames={mvbShortFrames()} fps={30} width={1080} height={1920} />
      <Composition id="MessiYamal19" component={MessiYamal19} durationInFrames={messiYamal19Frames()} fps={30} width={1080} height={1920} />
      <Composition id="MvBThumb" component={MvBThumb} durationInFrames={1} fps={30} width={1280} height={720} />

      {/* ── kickoffdaily90 — What If Argentina (Shorts funnel cut) ── */}
      <Composition
        id="WhatIfArgentinaShort"
        component={WhatIfArgentinaShort}
        durationInFrames={whatIfArgShortFrames()}
        fps={30}
        width={1080}
        height={1920}
      />

      {/* ── kickoffdaily90 — Changing of the Guard (vertical / Shorts) ── */}
      <Composition
        id="ChangingGuardV"
        component={ChangingGuardV}
        durationInFrames={changingGuardVFrames()}
        fps={30}
        width={1080}
        height={1920}
      />

      {/* ── Mindwired #5 — A Rogue Planet Enters Our Solar System ── */}
      <Composition
        id="RoguePlanet"
        component={RoguePlanetVideo}
        durationInFrames={rogueTotalFrames()}
        fps={30}
        width={1920}
        height={1080}
      />
      <Still
        id="RoguePlanetThumbnail"
        component={RoguePlanetThumbnail}
        width={1280}
        height={720}
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

      {/* ── mindwired evidence-doc Shorts (vertical 1080×1920, outro baked) ── */}
      {MW_SHORTS.map(s => (
        <Composition
          key={s.id}
          id={s.id}
          component={MindwiredShort}
          durationInFrames={mindwiredShortFrames({ startId: s.startId, endId: s.endId, doc: s.doc as never, manifest: s.manifest as never })}
          fps={30}
          width={1080}
          height={1920}
          defaultProps={{ slug: s.slug, doc: s.doc as never, manifest: s.manifest as never, startId: s.startId, endId: s.endId, hook: s.hook }}
        />
      ))}
    </>
  );
};
