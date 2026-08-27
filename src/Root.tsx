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
import { SupporterSpotlight } from "./mindwired-doc/SupporterSpotlight";
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
import { SubscribeCriminalRecordLong, SubscribeCriminalRecordShort, CR_OUTRO_FRAMES } from "./criminalrecord/SubscribeOutro";
import { CRTimelineTest, CRRouteTest, CRTreeTest } from "./criminalrecord/SceneTest";
import spacexDoc from "./mindwired-doc/docs/spacexlunarimpact.json";
import spacexManifest from "./mindwired-doc/docs/spacexlunarimpact.manifest.json";
import idahoDoc from "./mindwired-doc/docs/idahomurders.json";
import idahoManifest from "./mindwired-doc/docs/idahomurders.manifest.json";
import dahmerDoc from "./mindwired-doc/docs/dahmer.json";
import dahmerManifest from "./mindwired-doc/docs/dahmer.manifest.json";
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
import hostilePlanetsDoc from "./mindwired-doc/docs/hostileplanets.json";
import sleepSpaceFactsDoc from "./mindwired-doc/docs/sleepspacefacts.json";
import sleepSpaceFactsManifest from "./mindwired-doc/docs/sleepspacefacts.manifest.json";
import hostilePlanetsManifest from "./mindwired-doc/docs/hostileplanets.manifest.json";
import marsOneDoc from "./mindwired-doc/docs/marsone.json";
import marsOneManifest from "./mindwired-doc/docs/marsone.manifest.json";
import oceanGateDoc from "./mindwired-doc/docs/oceangate.json";
import oceanGateManifest from "./mindwired-doc/docs/oceangate.manifest.json";
import concordeDoc from "./mindwired-doc/docs/concorde.json";
import concordeManifest from "./mindwired-doc/docs/concorde.manifest.json";
import spaceShuttleDoc from "./mindwired-doc/docs/spaceshuttle.json";
import spaceShuttleManifest from "./mindwired-doc/docs/spaceshuttle.manifest.json";
import wtcCollapseDoc from "./mindwired-doc/docs/wtccollapse.json";
import wtcCollapseManifest from "./mindwired-doc/docs/wtccollapse.manifest.json";
import flight93Doc from "./mindwired-doc/docs/flight93.json";
import flight93Manifest from "./mindwired-doc/docs/flight93.manifest.json";
import us1549Doc from "./mindwired-doc/docs/us1549.json";
import us1549Manifest from "./mindwired-doc/docs/us1549.manifest.json";
import nasaufofilesDoc from "./mindwired-doc/docs/nasaufofiles.json";
import nasaufofilesManifest from "./mindwired-doc/docs/nasaufofiles.manifest.json";
import { NasaUfoFilesThumbnail } from "./mindwired-doc/NasaUfoFilesThumbnail";
import mh370netflixDoc from "./mindwired-doc/docs/mh370netflix.json";
import mh370netflixManifest from "./mindwired-doc/docs/mh370netflix.manifest.json";
import earhartDoc from "./mindwired-doc/docs/earhart.json";
import earhartManifest from "./mindwired-doc/docs/earhart.manifest.json";
import threemileislandDoc from "./mindwired-doc/docs/threemileisland.json";
import threemileislandManifest from "./mindwired-doc/docs/threemileisland.manifest.json";
import keybridgeDoc from "./mindwired-doc/docs/keybridge.json";
import keybridgeManifest from "./mindwired-doc/docs/keybridge.manifest.json";
import ic814kandaharDoc from "./mindwired-doc/docs/ic814kandahar.json";
import ic814kandaharManifest from "./mindwired-doc/docs/ic814kandahar.manifest.json";
import deepwaterhorizonDoc from "./mindwired-doc/docs/deepwaterhorizon.json";
import deepwaterhorizonManifest from "./mindwired-doc/docs/deepwaterhorizon.manifest.json";
import costaconcordiaDoc from "./mindwired-doc/docs/costaconcordia.json";
import kurskDoc from "./mindwired-doc/docs/kursk.json";
import kurskManifest from "./mindwired-doc/docs/kursk.manifest.json";
import twa800Doc from "./mindwired-doc/docs/twa800.json";
import twa800Manifest from "./mindwired-doc/docs/twa800.manifest.json";
import costaconcordiaManifest from "./mindwired-doc/docs/costaconcordia.manifest.json";
import area51Doc from "./mindwired-doc/docs/area51.json";
import area51Manifest from "./mindwired-doc/docs/area51.manifest.json";
import tunguskaDoc from "./mindwired-doc/docs/tunguska.json";
import tunguskaManifest from "./mindwired-doc/docs/tunguska.manifest.json";
import voyager1Doc from "./mindwired-doc/docs/voyager1.json";
import voyager1Manifest from "./mindwired-doc/docs/voyager1.manifest.json";
import planetnineDoc from "./mindwired-doc/docs/planetnine.json";
import planetnineManifest from "./mindwired-doc/docs/planetnine.manifest.json";
import yellowstoneDoc from "./mindwired-doc/docs/yellowstone.json";
import yellowstoneManifest from "./mindwired-doc/docs/yellowstone.manifest.json";
import everestbodiesDoc from "./mindwired-doc/docs/everestbodies.json";
import everestbodiesManifest from "./mindwired-doc/docs/everestbodies.manifest.json";
import otziDoc from "./mindwired-doc/docs/otzi.json";
import otziManifest from "./mindwired-doc/docs/otzi.manifest.json";
import veneraDoc from "./mindwired-doc/docs/venera.json";
import veneraManifest from "./mindwired-doc/docs/venera.manifest.json";
import bermudaTriangleDoc from "./mindwired-doc/docs/bermudatriangle.json";
import bermudaTriangleManifest from "./mindwired-doc/docs/bermudatriangle.manifest.json";
import fermiParadoxDoc from "./mindwired-doc/docs/fermiparadox.json";
import fermiParadoxManifest from "./mindwired-doc/docs/fermiparadox.manifest.json";
import thaiCaveRescueDoc from "./mindwired-doc/docs/thaicaverescue.json";
import thaiCaveRescueManifest from "./mindwired-doc/docs/thaicaverescue.manifest.json";
import apollo13Doc from "./mindwired-doc/docs/apollo13.json";
import apollo13Manifest from "./mindwired-doc/docs/apollo13.manifest.json";
import starfishPrimeDoc from "./mindwired-doc/docs/starfishprime.json";
import starfishPrimeManifest from "./mindwired-doc/docs/starfishprime.manifest.json";
import carlaWalkerDoc from "./mindwired-doc/docs/carlawalker.json";
import carlaWalkerManifest from "./mindwired-doc/docs/carlawalker.manifest.json";
import dbCooperDoc from "./mindwired-doc/docs/dbcooper.json";
import dbCooperManifest from "./mindwired-doc/docs/dbcooper.manifest.json";
import astronautsScaredDoc from "./mindwired-doc/docs/astronautsscared.json";
import astronautsScaredManifest from "./mindwired-doc/docs/astronautsscared.manifest.json";
import issInsideDoc from "./mindwired-doc/docs/issinside.json";
import issInsideManifest from "./mindwired-doc/docs/issinside.manifest.json";
import { RainStream, LOOP_SEC as RAIN_LOOP_SEC } from "./rainstream/RainStream";
import { RainShort } from "./rainstream/RainShort";

/** Vertical Shorts feeding the 24/7 rain stream — Shorts bypass channel
 *  authority, so they're the cold-start mechanism for the live. */
const RAIN_SHORTS = [
  { id: "RainShortNebula", plate: "rain/plates/nebula.png",
    hook: "rain, 250 miles above earth", sub: "24/7 · sleep · study" },
  { id: "RainShortEarth", plate: "rain/plates/earthlimb.png",
    hook: "it's raining on the window", sub: "and that's earth below" },
  { id: "RainShortRings", plate: "rain/plates/ringed_planet.png",
    hook: "8 hours of rain in deep space", sub: "for sleep · for focus" },
  { id: "RainShortStars", plate: "rain/plates/deepstars.png",
    hook: "can't sleep? try this", sub: "rain · 24/7 · no ads mid-sleep" },
] as const;
// Subscribe outro baked into the render (ONE render, no ffmpeg concat). frames @30fps.
const BB_OUTRO = { file: "outro/subscribe_blackbox_long.mp4", frames: 483 };
const CR_OUTRO = { file: "outro/subscribe_criminalrecord_long.mp4", frames: 420 };
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
import chernobylDoc from "./mindwired-doc/docs/chernobyl.json";
import chernobylManifest from "./mindwired-doc/docs/chernobyl.manifest.json";
import titanicDoc from "./mindwired-doc/docs/titanic.json";
import titanicManifest from "./mindwired-doc/docs/titanic.manifest.json";
import ai171Doc from "./mindwired-doc/docs/ai171.json";
import ai171Manifest from "./mindwired-doc/docs/ai171.manifest.json";
import helios522Doc from "./mindwired-doc/docs/helios522.json";
import helios522Manifest from "./mindwired-doc/docs/helios522.manifest.json";
import jal123Doc from "./mindwired-doc/docs/jal123.json";
import jal123Manifest from "./mindwired-doc/docs/jal123.manifest.json";
import unexplainedobjectsDoc from "./mindwired-doc/docs/unexplainedobjects.json";
import unexplainedobjectsManifest from "./mindwired-doc/docs/unexplainedobjects.manifest.json";
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
  { id: "NasaUfoFilesShort1", slug: "nasaufofiles", doc: nasaufofilesDoc, manifest: nasaufofilesManifest,
    startId: "h1", endId: "h4", hook: "A Navy fighter jet\nchased THIS in 2004" },
  { id: "NasaUfoFilesShort2", slug: "nasaufofiles", doc: nasaufofilesDoc, manifest: nasaufofilesManifest,
    startId: "d1", endId: "d4", hook: "This viral UFO video\nis probably a balloon" },
  { id: "NasaUfoFilesShort3", slug: "nasaufofiles", doc: nasaufofilesDoc, manifest: nasaufofilesManifest,
    startId: "e1", endId: "e4", hook: "He swore under oath\nthe gov't hides UFOs" },
  { id: "NasaUfoFilesShort4", slug: "nasaufofiles", doc: nasaufofilesDoc, manifest: nasaufofilesManifest,
    startId: "f1", endId: "f3", hook: "NASA said \"no aliens.\"\nTheir own report doesn't." },
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
import { CodewiredPodcastVideo, codewiredPodcastTotalFrames } from "./codewired/podcast/Video";
import podcastTurnsJson from "../public/codewired/podcast/turns.json";

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

      {/* ── mindwired — 8 Real Planets So Hostile They Shouldn't Exist (MW subscribe outro baked) ── */}
      <Composition
        id="HostilePlanetsDoc"
        component={makeDocComp(hostilePlanetsDoc, hostilePlanetsManifest, MW_OUTRO)}
        durationInFrames={docTotalFrames(hostilePlanetsDoc, hostilePlanetsManifest, MW_OUTRO)}
        fps={30}
        width={1920}
        height={1080}
      />

      <Composition
        id="AstronautsScaredDoc"
        component={makeDocComp(astronautsScaredDoc, astronautsScaredManifest, MW_OUTRO)}
        durationInFrames={docTotalFrames(astronautsScaredDoc, astronautsScaredManifest, MW_OUTRO)}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* ── mindwired — vertical Shorts funnelling to the 24/7 rain live ── */}
      {RAIN_SHORTS.map((s) => (
        <Composition
          key={s.id}
          id={s.id}
          component={RainShort}
          durationInFrames={8 * 30}
          fps={30}
          width={1080}
          height={1920}
          defaultProps={{ plate: s.plate, hook: s.hook, sub: s.sub }}
        />
      ))}

      {/* ── mindwired — 24/7 space-rain sleep stream visual (seamless 60s loop) ── */}
      <Composition
        id="RainStreamLoop"
        component={RainStream}
        durationInFrames={RAIN_LOOP_SEC * 30}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* ── mindwired — Inside the $150 Billion Space Station (ISS deep-dive, MW outro baked) ── */}
      <Composition
        id="IssInsideDoc"
        component={makeDocComp(issInsideDoc, issInsideManifest, MW_OUTRO)}
        durationInFrames={docTotalFrames(issInsideDoc, issInsideManifest, MW_OUTRO)}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* ── mindwired — Real Space Facts to Fall Asleep To Vol. 1 (24/7-stream pilot, MW outro baked) ── */}
      <Composition
        id="SleepSpaceFactsDoc"
        component={makeDocComp(sleepSpaceFactsDoc, sleepSpaceFactsManifest, MW_OUTRO)}
        durationInFrames={docTotalFrames(sleepSpaceFactsDoc, sleepSpaceFactsManifest, MW_OUTRO)}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* ── Supporter Spotlight — live Super Chat/Gift overlay card (design preview, single still) ── */}
      <Composition
        id="SupporterSpotlightPreview"
        component={SupporterSpotlight}
        durationInFrames={1}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* ── mindwired — Objects Astronomers Can't Explain (MW subscribe outro baked) ── */}
      <Composition
        id="UnexplainedObjectsDoc"
        component={makeDocComp(unexplainedobjectsDoc, unexplainedobjectsManifest, MW_OUTRO)}
        durationInFrames={docTotalFrames(unexplainedobjectsDoc, unexplainedobjectsManifest, MW_OUTRO)}
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

      {/* ── Black Box Breakdown — The World Trade Center Collapse: the NIST
             engineering investigation (Icahn: icahn-wtc-collapse, PASS,
             highest recognition/ceiling of any topic this channel has
             covered; rides the 25th anniversary Sept 2026). United 93's
             natural companion piece — the structural-engineering angle, not
             the hijacking. Highest-sensitivity episode yet: dedicated
             adversarial ethics review + primary-source verification pass
             before scripting (see docs/planning/CLAIMS-wtccollapse.md).
             Real NIST/FEMA/GPO exhibits, NIST's own labeled collapse
             simulations, one capped ~70-90s consolidated conspiracy-claims
             segment (free-fall, thermite, Silverstein "pull it," BBC early
             report, Hulsey/AE911Truth — each attributed + rebutted, never a
             live debate), zero depiction of jumping/falling/remains
             anywhere. BB subscribe outro baked. ── */}
      <Composition
        id="WtcCollapseDoc"
        component={makeDocComp(wtcCollapseDoc, wtcCollapseManifest, BB_OUTRO)}
        durationInFrames={docTotalFrames(wtcCollapseDoc, wtcCollapseManifest, BB_OUTRO)}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* ── mindwired — NASA's Real UFO Files (Evidence Engine: real Navy UAP
             videos GIMBAL/GOFAST/FLIR1 via DVIDS, real House Oversight hearing
             footage, real NASA/AARO report exhibit pages; attributed mystery
             format — Grusch's claims always paired with the AARO rebuttal;
             mindwired subscribe outro baked) ── */}
      <Composition
        id="NasaUfoFilesDoc"
        component={makeDocComp(nasaufofilesDoc, nasaufofilesManifest, MW_OUTRO)}
        durationInFrames={docTotalFrames(nasaufofilesDoc, nasaufofilesManifest, MW_OUTRO)}
        fps={30}
        width={1920}
        height={1080}
      />
      <Still
        id="NasaUfoFilesThumbnail"
        component={NasaUfoFilesThumbnail}
        width={1280}
        height={720}
      />

      {/* ── Black Box Breakdown — US Airways 1549 "Miracle on the Hudson"
             (Evidence Engine: real FAA ATC audio at length — mayday call, three
             runway offers, the ditching decision — + real US Coast Guard VTS
             harbor-camera footage of the ditching/rescue/salvage; CVR RECREATION
             for the two unreleased cockpit lines; BB subscribe outro baked) ── */}
      <Composition
        id="US1549Doc"
        component={makeDocComp(us1549Doc, us1549Manifest, BB_OUTRO)}
        durationInFrames={docTotalFrames(us1549Doc, us1549Manifest, BB_OUTRO)}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* ── Black Box Breakdown — MH370 video #3, fact-checking Netflix's 2023
             "MH370: The Plane That Disappeared" (Icahn: icahn-mh370-netflix-
             reaction, PASS-WITH-CONDITIONS). Differentiated from Videos 1-2
             (disappearance timeline + full 8-theory roster, already shipped):
             per-episode claim-vs-record chapters, a dedicated "what Netflix
             got wrong" meta-chapter, the glide-vs-dive BFO/descent-rate math
             (Holland IEEE 2017 exhibit), and the 2025-2026 present tense.
             Zaharie pilot-theory framing: official record affirmatively found
             nothing supporting it — never asserted as fact. BB subscribe
             outro baked. ── */}
      <Composition
        id="MH370NetflixDoc"
        component={makeDocComp(mh370netflixDoc, mh370netflixManifest, BB_OUTRO)}
        durationInFrames={docTotalFrames(mh370netflixDoc, mh370netflixManifest, BB_OUTRO)}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* ── Black Box Breakdown — Amelia Earhart's 1937 disappearance
             (Icahn: icahn-earhart, PASS 3/3 recognition. Real evidentiary
             reconstruction: USS Itasca radio-log RECREATION for the final
             transmissions [no real audio survives from 1937], real 1930s
             newsreel/photo archival footage, NARA radio-log exhibit, TIGHAR
             Nikumaroro forensic findings attributed-never-asserted. Two
             unfilmable-moment dossier scenes for the open-ocean ditching and
             the 1940/41 forensic artifact table. BB subscribe outro baked) ── */}
      <Composition
        id="EarhartDoc"
        component={makeDocComp(earhartDoc, earhartManifest, BB_OUTRO)}
        durationInFrames={docTotalFrames(earhartDoc, earhartManifest, BB_OUTRO)}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* ── Black Box Breakdown — Three Mile Island (1979 meltdown) fused with
             its live 2024-2027 AI-datacenter restart (Crane Clean Energy Center)
             (Icahn: icahn-threemileisland, PASS-WITH-CONDITIONS 2026-08-05,
             adversarially re-checked — recognition downgraded 3->2/3, packaging
             must lead with the restart/AI hook. Real evidence: Kemeny Commission
             Report exhibit (verified primary document, OSTI/nonuclear.se mirror),
             NRC's live June 2026 draft EA exhibit (Federal Register 91 FR 34658,
             verified via the FR API), real 1979 NRC archival motion footage
             (CC-BY, clipped from NRC's own "Moments in NRC History" video) for
             the cold open. BB subscribe outro baked) ── */}
      <Composition
        id="ThreeMileIslandDoc"
        component={makeDocComp(threemileislandDoc, threemileislandManifest, BB_OUTRO)}
        durationInFrames={docTotalFrames(threemileislandDoc, threemileislandManifest, BB_OUTRO)}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* ── Three Mile Island funnel Shorts (4) — cut from the long-form's own
             real footage/exhibits + narration audio, per
             docs/publishing/SHORTS-SCHEDULE-threemileisland.md. `ids` (added
             to BlackBoxShort for this episode) hand-picks non-contiguous
             beats so each Short stays in the 35-60s body sweet spot instead
             of dragging in connective-tissue scenes between them.
             `imgOverride` backfills a real photo/exhibit behind kinetic-only
             or bare chapter-card beats that have no img of their own — never
             a bare black text scene. ── */}
      <Composition
        id="ThreeMileIslandShort1"
        component={BlackBoxShort}
        durationInFrames={blackBoxShortFrames({ startId: "h1", endId: "h4", doc: threemileislandDoc as any, manifest: threemileislandManifest as any })}
        fps={30} width={1080} height={1920}
        defaultProps={{ startId: "h1", endId: "h4", imgOverride: { h3: "ex_kemeny_cover" }, hook: "THIS REACTOR MELTED\nDOWN IN 1979", cta: "The full investigation\nis on the channel", slug: "threemileisland", doc: threemileislandDoc as any, manifest: threemileislandManifest as any }}
      />
      <Composition
        id="ThreeMileIslandShort2"
        component={BlackBoxShort}
        durationInFrames={blackBoxShortFrames({ ids: ["a4", "b1", "b2", "b3"], doc: threemileislandDoc as any, manifest: threemileislandManifest as any })}
        fps={30} width={1080} height={1920}
        defaultProps={{ ids: ["a4", "b1", "b2", "b3"], imgOverride: { a4: "tmi_controlroom", b2: "tmi_controlroom" }, hook: "THE LIGHT LIED", cta: "The full minute-by-minute\nbreakdown is on the channel", slug: "threemileisland", doc: threemileislandDoc as any, manifest: threemileislandManifest as any }}
      />
      <Composition
        id="ThreeMileIslandShort3"
        component={BlackBoxShort}
        durationInFrames={blackBoxShortFrames({ ids: ["h3", "c1_1", "c1_2"], doc: threemileislandDoc as any, manifest: threemileislandManifest as any })}
        fps={30} width={1080} height={1920}
        defaultProps={{ ids: ["h3", "c1_1", "c1_2"], imgOverride: { h3: "ex_kemeny_cover", c1_2: "ex_kemeny_cover" }, hook: "THE REPORT DIDN'T\nBLAME THE VALVE", cta: "The real 1979 report vs.\nthe 2026 paperwork — on the channel", slug: "threemileisland", doc: threemileislandDoc as any, manifest: threemileislandManifest as any }}
      />
      <Composition
        id="ThreeMileIslandShort4"
        component={BlackBoxShort}
        durationInFrames={blackBoxShortFrames({ ids: ["d5", "e1", "e2", "e4"], doc: threemileislandDoc as any, manifest: threemileislandManifest as any })}
        fps={30} width={1080} height={1920}
        defaultProps={{ ids: ["d5", "e1", "e2", "e4"], hook: "STATUS:\nSTILL PENDING", hookImg: "ex_nrc_ea.png", cta: "This is a live, open story —\nfull breakdown on the channel", slug: "threemileisland", doc: threemileislandDoc as any, manifest: threemileislandManifest as any }}
      />

      {/* ── Black Box Breakdown — Francis Scott Key Bridge collapse (2024 MV Dali
             strike) fused with the live 2026 DOJ criminal indictment (Icahn:
             icahn-keybridge, PASS-WITH-CONDITIONS 2026-08-08 — 3/3 recognition,
             giant real ceiling, genuinely still-unfolding legal currency (2027
             trial), footage confirmed strong via a direct probe — the opposite
             result from the Edmund Fitzgerald footage-fail that preceded this
             pick. Locked package: title leads with the DOJ-charges wedge, not
             the already-saturated "revisiting 2024" collapse retelling. Real
             evidence: NTSB Marine Investigation Report MIR-25-40 (full report
             downloaded + cited), real NTSB-docket CCTV of the actual collapse
             (DCA24MM031), real DOJ/EPA indictment press release, real named
             quotes (NTSB Chair Homendy, Gov. Wes Moore). Narrator: Robyn
             (female Cartesia voice, Akshay's explicit choice for this episode
             — see memory female-narrator-voice-robyn). BB subscribe outro
             baked) ── */}
      <Composition
        id="KeyBridgeDoc"
        component={makeDocComp(keybridgeDoc as any, keybridgeManifest as any, BB_OUTRO)}
        durationInFrames={docTotalFrames(keybridgeDoc as any, keybridgeManifest as any, BB_OUTRO)}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* ── Black Box Breakdown — IC 814 / Indian Airlines Flight 814 "Kandahar
             Hijacking" (Dec 1999, Icahn: icahn-ic814kandahar, PASS-WITH-CONDITIONS
             2026-08-09 — 287.5:1 headline, 2/3 recognition needing a bridge,
             HIGH sensitivity: Masood Azhar is real/alive/dangerous and every
             claim about him and the contested prisoner swap stays
             attributed-never-asserted; the 2024 Netflix code-name controversy
             stated factually, no side taken. No free archival motion footage of
             the actual 1999 event/Kandahar exists — real Commons photos of the
             actual Indian Airlines A300 fleet livery anchor identity, real
             generic commercial-airliner motion covers first-30s pacing (the
             AI171 pattern), the real 2000 Lok Sabha statement to Parliament is
             the primary document exhibit. Rupin Katyal's murder handled via a
             respectful generic real candle-vigil stand-in, never a misleading
             photo. Narrator: standard male Cartesia clone. BB subscribe outro
             baked) ── */}
      <Composition
        id="Ic814KandaharDoc"
        component={makeDocComp(ic814kandaharDoc as any, ic814kandaharManifest as any, BB_OUTRO)}
        durationInFrames={docTotalFrames(ic814kandaharDoc as any, ic814kandaharManifest as any, BB_OUTRO)}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* ── Black Box Breakdown — Deepwater Horizon oil rig disaster (Gulf of
             Mexico, April 20, 2010, Icahn: icahn-deepwaterhorizon, PASS
             2026-08-10 — 715:1 headline w/ real millions of views, found after
             discovering the queue's "3rd MH370 video" flag was stale (already
             shipped). Recognition 2/3 — packaging leads with "BP," not the
             rig's name. Sensitivity MODERATE: cause is legally settled (BP's
             own 2012 guilty plea to 11 felony manslaughter counts + $4.5B
             settlement), 11 real named workers died, no living dangerous
             figures. Real USCG helicopter footage of the actual fire anchors
             the mandatory first-30s real-video cold open; real BOEMRE/USCG
             joint investigation report (Sept 2011) is the document exhibit;
             real DVIDS photos of Brett Cocales testifying anchor the "who
             cares" email beat. Narrator: standard male Cartesia clone. BB
             subscribe outro baked) ── */}
      <Composition
        id="DeepwaterHorizonDoc"
        component={makeDocComp(deepwaterhorizonDoc as any, deepwaterhorizonManifest as any, BB_OUTRO)}
        durationInFrames={docTotalFrames(deepwaterhorizonDoc as any, deepwaterhorizonManifest as any, BB_OUTRO)}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* ── Black Box Breakdown — Costa Concordia ("What Netflix's Costa
             Concordia Documentary Left Out") — Icahn-validated 2026-08-12,
             strongest raw ratios yet (3317:1 headline, real coast-guard
             audio). Real 2026 currency wedge: Netflix's "Shipwrecked:
             Nightmare at Sea" (July 2026) omits the ~3-year search for
             Russel Rebello's remains — this episode's differentiator. The
             real Schettino/De Falco radio exchange was never officially
             released (press leak, no free license found) — rendered as a
             RadioScene "CALL RECREATION", never as real audio, per the
             channel's honesty rule. Real CC-licensed Commons photos
             throughout (ship before/during/after, the 2013 parbuckling
             salvage); zero AI-generated imagery. Sensitivity: Schettino is
             real/living/still incarcerated (release ~2033) — every
             characterization beyond his official verdict is attributed-
             never-asserted. See memory `icahn-costaconcordia` +
             docs/planning/CLAIMS-costaconcordia.md. BB_OUTRO baked. ── */}
      <Composition
        id="CostaConcordiaDoc"
        component={makeDocComp(costaconcordiaDoc as any, costaconcordiaManifest as any, BB_OUTRO)}
        durationInFrames={docTotalFrames(costaconcordiaDoc as any, costaconcordiaManifest as any, BB_OUTRO)}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* ── Kursk submarine disaster (Black Box Breakdown) — evidence-vs-
             official-story doc. All real assets: mil.ru/kremlin.ru CC-BY
             sister-ship + RTR interview footage, PD NORSAR seismogram +
             StrålevernRapport 2001:5 exhibits, real Vidyayevo/memorial
             photos; the Kolesnikov note is a labeled DossierScene
             RECONSTRUCTION only. Sensitivity: Putin/Popov/Kuznetsov/
             families all [LIVING] — attributed-never-asserted per
             docs/planning/CLAIMS-kursk.md (see its DATA CORRECTIONS
             block); collision theory attributed, never platformed. See
             memory `icahn-kursk`. BB_OUTRO baked. ── */}
      <Composition
        id="KurskDoc"
        component={makeDocComp(kurskDoc as any, kurskManifest as any, BB_OUTRO)}
        durationInFrames={docTotalFrames(kurskDoc as any, kurskManifest as any, BB_OUTRO)}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* ── TWA Flight 800 (Black Box Breakdown) — the NTSB's settled center-
             wing-tank/wiring verdict vs. the missile-theory conspiracy history
             vs. the live 2026 Judicial Watch FOIA wave. All real assets: the
             actual N93119 accident airframe (Commons), real DVIDS Navy salvage
             + USCG photos, real NTSB AAR-00/03 + Safety Rec Letter exhibit
             pages (pdftoppm'd from the live PDFs, exhibit-pinned so the
             Probable Cause and wiring-defect reveals always show their own
             cited page — see ATTRIBUTION.md's "exhibit-pinned duplicates"
             note), the real CIA witness-perception diagram, the real 2026
             Judicial Watch FOIA teletype pages, the Montoursville memorial.
             CVR exchange is a labeled CVR RECREATION (no public CVR audio
             exists in law). Sensitivity: the missile/Krick-lawsuit theory and
             the Cairo-fax terrorism lead are both attributed-never-asserted
             per docs/planning/CLAIMS-twa800.md's DATA CORRECTIONS block;
             Ronald Krick/Jack Cashill/Tom Stalcup/Tom Fitton all [LIVING].
             See memory `icahn-twa800`. BB_OUTRO baked. ── */}
      <Composition
        id="Twa800Doc"
        component={makeDocComp(twa800Doc as any, twa800Manifest as any, BB_OUTRO)}
        durationInFrames={docTotalFrames(twa800Doc as any, twa800Manifest as any, BB_OUTRO)}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* ── Deepwater Horizon funnel Shorts (4) — cold open (real USCG fire
             video, native), the guilty plea (matches the long-form's own
             locked-package hook), the "who cares" email evidence, the eleven
             names tribute. All 4 ranges are self-contained real-footage beats. ── */}
      <Composition
        id="DeepwaterHorizonShort1"
        component={BlackBoxShort}
        durationInFrames={blackBoxShortFrames({ startId: "h1", endId: "h7", doc: deepwaterhorizonDoc as any, manifest: deepwaterhorizonManifest as any })}
        fps={30} width={1080} height={1920}
        defaultProps={{ startId: "h1", endId: "h7", hook: "BP PLED GUILTY\nTO KILLING 11 MEN", cta: "The full story\nis on the channel", slug: "deepwaterhorizon", doc: deepwaterhorizonDoc as any, manifest: deepwaterhorizonManifest as any }}
      />
      <Composition
        id="DeepwaterHorizonShort2"
        component={BlackBoxShort}
        durationInFrames={blackBoxShortFrames({ startId: "b1", endId: "b5", doc: deepwaterhorizonDoc as any, manifest: deepwaterhorizonManifest as any })}
        fps={30} width={1080} height={1920}
        defaultProps={{ startId: "b1", endId: "b5", hook: "THE EMAIL THAT SAID\n\"WHO CARES\"", cta: "What happened next\nis on the channel", slug: "deepwaterhorizon", doc: deepwaterhorizonDoc as any, manifest: deepwaterhorizonManifest as any }}
      />
      <Composition
        id="DeepwaterHorizonShort3"
        component={BlackBoxShort}
        durationInFrames={blackBoxShortFrames({ startId: "e3", endId: "e8", doc: deepwaterhorizonDoc as any, manifest: deepwaterhorizonManifest as any })}
        fps={30} width={1080} height={1920}
        defaultProps={{ startId: "e3", endId: "e8", hook: "11 MEN DIED.\nTHESE ARE THEIR NAMES.", cta: "Their full stories\nare on the channel", slug: "deepwaterhorizon", doc: deepwaterhorizonDoc as any, manifest: deepwaterhorizonManifest as any }}
      />
      <Composition
        id="DeepwaterHorizonShort4"
        component={BlackBoxShort}
        durationInFrames={blackBoxShortFrames({ startId: "g1", endId: "g4", doc: deepwaterhorizonDoc as any, manifest: deepwaterhorizonManifest as any })}
        fps={30} width={1080} height={1920}
        defaultProps={{ startId: "g1", endId: "g4", hook: "14 FEDERAL COUNTS.\n$4 BILLION.", cta: "The full guilty plea\nis on the channel", slug: "deepwaterhorizon", doc: deepwaterhorizonDoc as any, manifest: deepwaterhorizonManifest as any }}
      />

      {/* ── IC 814 Kandahar funnel Shorts (4) — cold open (real cruise/cockpit
             video, native), the swap decision (matches the long-form's own
             locked-package hook), the Kandahar standoff, the 2024 Netflix
             controversy (proven curiosity pattern from the MH370-Netflix
             Short). All 4 ranges are contiguous, self-contained beats that
             don't decontextualize the Masood Azhar/JeM claims — those stay
             inside chapter 6, never cut alone per the shorts-funnel
             sensitivity rule. ── */}
      <Composition
        id="Ic814KandaharShort1"
        component={BlackBoxShort}
        durationInFrames={blackBoxShortFrames({ startId: "h1", endId: "h6", doc: ic814kandaharDoc as any, manifest: ic814kandaharManifest as any })}
        fps={30} width={1080} height={1920}
        defaultProps={{ startId: "h1", endId: "h6", hook: "A MASKED MAN WALKED\nINTO THE COCKPIT", cta: "The full hijacking\nbreakdown on the channel", slug: "ic814kandahar", doc: ic814kandaharDoc as any, manifest: ic814kandaharManifest as any }}
      />
      <Composition
        id="Ic814KandaharShort2"
        component={BlackBoxShort}
        durationInFrames={blackBoxShortFrames({ startId: "f1", endId: "f8", doc: ic814kandaharDoc as any, manifest: ic814kandaharManifest as any })}
        fps={30} width={1080} height={1920}
        defaultProps={{ startId: "f1", endId: "f8", hook: "INDIA FREED 3\nTERRORISTS FOR THIS", cta: "What happened next\nis on the channel", slug: "ic814kandahar", doc: ic814kandaharDoc as any, manifest: ic814kandaharManifest as any }}
      />
      <Composition
        id="Ic814KandaharShort3"
        component={BlackBoxShort}
        durationInFrames={blackBoxShortFrames({ startId: "e4", endId: "e9", doc: ic814kandaharDoc as any, manifest: ic814kandaharManifest as any })}
        fps={30} width={1080} height={1920}
        defaultProps={{ startId: "e4", endId: "e9", hook: "7 DAYS.\n176 HOSTAGES.", hookImg: "ic_desert_airfield_1.jpeg", cta: "The full negotiation\nis on the channel", slug: "ic814kandahar", doc: ic814kandaharDoc as any, manifest: ic814kandaharManifest as any }}
      />
      <Composition
        id="Ic814KandaharShort4"
        component={BlackBoxShort}
        durationInFrames={blackBoxShortFrames({ startId: "j1", endId: "j5", doc: ic814kandaharDoc as any, manifest: ic814kandaharManifest as any })}
        fps={30} width={1080} height={1920}
        defaultProps={{ startId: "j1", endId: "j5", hook: "THE NETFLIX SHOW GOT\nSOMETHING RIGHT", cta: "What almost nobody\nreported — on the channel", slug: "ic814kandahar", doc: ic814kandaharDoc as any, manifest: ic814kandaharManifest as any }}
      />

      <Composition
        id="Area51Doc"
        component={makeDocComp(area51Doc, area51Manifest, MW_OUTRO)}
        durationInFrames={docTotalFrames(area51Doc, area51Manifest, MW_OUTRO)}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* ── mindwired — the 1908 Tunguska Event
             (Icahn: icahn-tunguska-event, PASS 2/3 recognition — packaging
             must lead with "biggest explosion in recorded history, no
             crater, no meteorite" bridge, never the bare word "Tunguska".
             Real Kulik-expedition archival photography, real 1908
             seismograph/barograph record imagery; fringe theories (mini
             black hole / antimatter / alien craft) rendered as dossier
             scenes, attributed-never-asserted, dismissed by the real
             science. MW subscribe outro baked) ── */}
      <Composition
        id="TunguskaDoc"
        component={makeDocComp(tunguskaDoc, tunguskaManifest, MW_OUTRO)}
        durationInFrames={docTotalFrames(tunguskaDoc, tunguskaManifest, MW_OUTRO)}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* ── mindwired — Voyager 1 & 2 (49-year mission, live 2025-2026 power-down)
             Icahn: icahn-voyager1, PASS no conditions, 3/3 recognition, live
             currency (JPL's "Big Bang" power fix, confirmed Aug 2026). Real
             NASA/JPL archival photography throughout; real DSN dish footage
             (Commons 360 video, reprojected flat) for the cold open. Locked
             title: "NASA Built It to Last 5 Years. It's Been 49." MW subscribe
             outro baked. ── */}
      <Composition
        id="Voyager1Doc"
        component={makeDocComp(voyager1Doc, voyager1Manifest, MW_OUTRO)}
        durationInFrames={docTotalFrames(voyager1Doc, voyager1Manifest, MW_OUTRO)}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* ── mindwired — Planet Nine (the undiscovered planet hypothesis)
             Icahn: icahn-planetnine, PASS-WITH-CONDITIONS, winner of a
             6-candidate re-sweep after Betelgeuse was declined for weak
             ratios. Real Caltech-sourced evidence diagram + artist concept
             (both clearly labeled), real NOIRLab Rubin Observatory drone
             footage for the cold open, real Batygin/Brown Caltech photo.
             Locked title (swapped live 2026-08-10 after a ctr-engine
             title-retest caught the original incumbent failing an
             adversarial honesty check): "Pluto's Killer Can't Prove the
             Planet He's Chasing." MW subscribe outro baked. ── */}
      <Composition
        id="PlanetNineDoc"
        component={makeDocComp(planetnineDoc, planetnineManifest, MW_OUTRO)}
        durationInFrames={docTotalFrames(planetnineDoc, planetnineManifest, MW_OUTRO)}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* ── Planet Nine funnel Shorts (4) — the Pluto-killer backstory (the
             new title's own hook), the six-object statistical pattern, the
             real skeptic fight over telescope bias, and the live Vera Rubin
             Observatory currency. Real Caltech/NOIRLab stills + the real
             Rubin drone video for Short4's hook plate. ── */}
      <Composition
        id="PlanetNineShort1"
        component={MindwiredShort}
        durationInFrames={mindwiredShortFrames({ startId: "c1", endId: "a5", doc: planetnineDoc as any, manifest: planetnineManifest as any })}
        fps={30} width={1080} height={1920}
        defaultProps={{ startId: "c1", endId: "a5", hook: "He killed Pluto.\nThen he said there's another planet.", slug: "planetnine", hookImg: "mike_brown_portrait_1.jpg", doc: planetnineDoc as any, manifest: planetnineManifest as any }}
      />
      <Composition
        id="PlanetNineShort2"
        component={MindwiredShort}
        durationInFrames={mindwiredShortFrames({ startId: "c2", endId: "b5", doc: planetnineDoc as any, manifest: planetnineManifest as any })}
        fps={30} width={1080} height={1920}
        defaultProps={{ startId: "c2", endId: "b5", hook: "The odds of this being\na coincidence: 1 in 15,000.", slug: "planetnine", hookImg: "orbit_diagram_1.jpg", doc: planetnineDoc as any, manifest: planetnineManifest as any }}
      />
      <Composition
        id="PlanetNineShort3"
        component={MindwiredShort}
        durationInFrames={mindwiredShortFrames({ startId: "c5", endId: "f5", doc: planetnineDoc as any, manifest: planetnineManifest as any })}
        fps={30} width={1080} height={1920}
        defaultProps={{ startId: "c5", endId: "f5", hook: "Real scientists say this\ndiscovery might be an illusion.", slug: "planetnine", hookImg: "palomar_observatory_1.jpg", doc: planetnineDoc as any, manifest: planetnineManifest as any }}
      />
      <Composition
        id="PlanetNineShort4"
        component={MindwiredShort}
        durationInFrames={mindwiredShortFrames({ startId: "c7", endId: "i4", doc: planetnineDoc as any, manifest: planetnineManifest as any })}
        fps={30} width={1080} height={1920}
        defaultProps={{ startId: "c7", endId: "i4", hook: "A new telescope in Chile\nmight finally answer this.", slug: "planetnine", hookVideo: "rubin_observatory_1.mp4", hookFrom: 2, doc: planetnineDoc as any, manifest: planetnineManifest as any }}
      />

      {/* ── Yellowstone supervolcano (Icahn: icahn-yellowstone, mindwired winner
             2026-08-10/11 — 554.8:1 headline, 3/3 recognition, giant-name
             ceiling class). Differentiation constraint from the sweep: never
             lead with the generic "what if it erupted tomorrow" framing every
             major channel has already done. Built instead around two real,
             current hooks — the real June 13, 2026 Biscuit Basin hydrothermal
             explosion (real USGS monitoring-camera video + photos, cold open
             uses the real 05:09:50 MDT instrument-detection moment, no
             fabricated witness) and the real June 2026 "mantle wind" study
             revising the old deep-plume theory — with the real 1959 Hebgen
             Lake earthquake (tectonic, NOT volcanic — never implied as
             causally linked) as the historical throughline. Sensitivity: low;
             never overstates USGS's own ~1-in-730,000/yr eruption-probability
             science as imminent. MW_OUTRO baked. ── */}
      <Composition
        id="YellowstoneDoc"
        component={makeDocComp(yellowstoneDoc as any, yellowstoneManifest as any, MW_OUTRO)}
        durationInFrames={docTotalFrames(yellowstoneDoc as any, yellowstoneManifest as any, MW_OUTRO)}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* ── mindwired — Bodies Still on Everest ("They Called Him Green Boots.
             He Wasn't.") — Icahn-validated 2026-08-12, same real-photo/real-data
             DNA as the channel's #1 video (21 Astronauts Never Came Home), but
             deliberately off the astronaut/cosmonaut well. Real 2026 currency
             wedge: Green Boots misidentified as Tsewang Paljor for 30 years,
             corrected by 2026 DNA identification as Dorje Morup (per ITBP tender
             docs — mechanism honestly hedged per CLAIMS correction #2, not
             asserted as a clean forensic reveal). Real CC BY 3.0 aerial flyby +
             real Commons expedition/icefall photos throughout; zero AI-generated
             imagery. Sensitivity: 1996-and-older core is settled history; the
             2026 identification/recovery and 2026 season deaths are recent with
             living family — attributed-never-asserted, no gratuitous corpse
             imagery. MW_OUTRO baked. See memory `icahn-everest-bodies` +
             docs/planning/CLAIMS-everestbodies.md. ── */}
      <Composition
        id="EverestBodiesDoc"
        component={makeDocComp(everestbodiesDoc as any, everestbodiesManifest as any, MW_OUTRO)}
        durationInFrames={docTotalFrames(everestbodiesDoc as any, everestbodiesManifest as any, MW_OUTRO)}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* ── Everest Bodies funnel Shorts (4) — each a trailer for the one
             episode above, per the shorts-funnel spec. Beats: (1) the cold
             open itself, h1-h5; (2) the 2026 identity reveal, e6-e9 — cut
             deliberately INCLUDES e7, the "lab report never made public"
             hedge, so the identification is never asserted as clean forensic
             fact out of context (CLAIMS correction #2); (3) the ITBP north-
             side story, d4-d8 — starts AFTER d3 (Morup's airport promise to
             his wife) so a living widow's personal beat is never a
             de-contextualized hook, and d5's ritual detail keeps its own
             "reportedly"; (4) Mallory/Irvine's camera, f2-f5, ending on "it
             has never been found" (stops before f7's living great-niece).
             Hook plates: real motion video where the range has it, real
             archival photos otherwise — never a bare card. No corpse imagery
             exists anywhere in this episode's pools by design. ── */}
      <Composition
        id="EverestBodiesShort1"
        component={MindwiredShort}
        durationInFrames={mindwiredShortFrames({ startId: "h1", endId: "h5", doc: everestbodiesDoc as any, manifest: everestbodiesManifest as any })}
        fps={30} width={1080} height={1920}
        defaultProps={{ startId: "h1", endId: "h5", hook: "They called him Green Boots.\nHe wasn't.", slug: "everestbodies", hookVideo: "everestflyby_1.mp4", hookFrom: 3, doc: everestbodiesDoc as any, manifest: everestbodiesManifest as any }}
      />
      <Composition
        id="EverestBodiesShort2"
        component={MindwiredShort}
        durationInFrames={mindwiredShortFrames({ startId: "e6", endId: "e9", doc: everestbodiesDoc as any, manifest: everestbodiesManifest as any })}
        fps={30} width={1080} height={1920}
        defaultProps={{ startId: "e6", endId: "e9", hook: "Everest's most famous body.\nThe wrong name for 30 years.", slug: "everestbodies", hookImg: "everest_3.jpg", doc: everestbodiesDoc as any, manifest: everestbodiesManifest as any }}
      />
      <Composition
        id="EverestBodiesShort3"
        component={MindwiredShort}
        durationInFrames={mindwiredShortFrames({ startId: "d4", endId: "d8", doc: everestbodiesDoc as any, manifest: everestbodiesManifest as any })}
        fps={30} width={1080} height={1920}
        defaultProps={{ startId: "d4", endId: "d8", hook: "8 died on Everest that night.\nThe world remembered 4.", slug: "everestbodies", hookVideo: "climbingascent_2.mp4", hookFrom: 2, doc: everestbodiesDoc as any, manifest: everestbodiesManifest as any }}
      />
      <Composition
        id="EverestBodiesShort4"
        component={MindwiredShort}
        durationInFrames={mindwiredShortFrames({ startId: "f2", endId: "f5", doc: everestbodiesDoc as any, manifest: everestbodiesManifest as any })}
        fps={30} width={1080} height={1920}
        defaultProps={{ startId: "f2", endId: "f5", hook: "This camera could rewrite\nEverest's history.", slug: "everestbodies", hookImg: "mallory_1.jpg", doc: everestbodiesDoc as any, manifest: everestbodiesManifest as any }}
      />

      {/* ── mindwired — Ötzi the Iceman ("Something in the Iceman Is Still
             Alive") — Icahn-validated 2026-08-14 (fresh 109:1 @ 1.0M, May 2026;
             memory `icahn-otzi`). Spine: the world's oldest open murder case +
             the 2025-26 science wave (Nov 2025 Sci Rep cause-of-death reversal;
             Jun 2026 Microbiome viable-yeasts study). Honesty rules baked in:
             the "still alive" claim is precisely scoped to glacial microbes
             (scene i8 — "not his cells, his passengers"); every replica photo
             is captioned RECONSTRUCTION; real-mummy visuals come ONLY from the
             two CC BY paper-figure sets (Villa IJLM 2025, Sarhan Microbiome
             2026) — the Sci Rep 2025 + Cell Genomics 2023 figures are NC-ND
             and deliberately absent. Zero AI-generated imagery. MW_OUTRO
             baked. See docs/planning/CLAIMS-otzi.md. ── */}
      <Composition
        id="OtziDoc"
        component={makeDocComp(otziDoc as any, otziManifest as any, MW_OUTRO)}
        durationInFrames={docTotalFrames(otziDoc as any, otziManifest as any, MW_OUTRO)}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* ── Ötzi funnel Shorts (4) — trailers for OtziDoc per the shorts-funnel
             spec, cut same-session as the render (the Everest lesson: no drip
             doc = silently skipped drip). Beats: (1) the cold open h1-h5;
             (2) the missed-murder-weapon reveal d3-d6, ending on "remember
             that estimate"; (3) the 2025 hours-not-minutes reversal g6-g8,
             ending on "he waited"; (4) the still-alive microbes i5-i8 — cut
             deliberately INCLUDES i8, the "not his cells, his passengers"
             honesty beat, so the title claim is never left unscoped. Hook
             plates are real motion from this episode's own pool. ── */}
      <Composition
        id="OtziShort1"
        component={MindwiredShort}
        durationInFrames={mindwiredShortFrames({ startId: "h1", endId: "h5", doc: otziDoc as any, manifest: otziManifest as any })}
        fps={30} width={1080} height={1920}
        defaultProps={{ startId: "h1", endId: "h5", hook: "Something in the Iceman\nis still alive.", slug: "otzi", hookVideo: "glacierair_1.mp4", hookFrom: 2, doc: otziDoc as any, manifest: otziManifest as any }}
      />
      <Composition
        id="OtziShort2"
        component={MindwiredShort}
        durationInFrames={mindwiredShortFrames({ startId: "d3", endId: "d6", doc: otziDoc as any, manifest: otziManifest as any })}
        fps={30} width={1080} height={1920}
        defaultProps={{ startId: "d3", endId: "d6", hook: "Science missed the murder weapon\nfor 10 years.", slug: "otzi", hookVideo: "icecave_1.mp4", hookFrom: 2, doc: otziDoc as any, manifest: otziManifest as any }}
      />
      <Composition
        id="OtziShort3"
        component={MindwiredShort}
        durationInFrames={mindwiredShortFrames({ startId: "g6", endId: "g8", doc: otziDoc as any, manifest: otziManifest as any })}
        fps={30} width={1080} height={1920}
        defaultProps={{ startId: "g6", endId: "g8", hook: "He didn't die in minutes.\nHe waited for hours.", slug: "otzi", hookVideo: "alpspeak_1.mp4", hookFrom: 2, doc: otziDoc as any, manifest: otziManifest as any }}
      />
      <Composition
        id="OtziShort4"
        component={MindwiredShort}
        durationInFrames={mindwiredShortFrames({ startId: "i5", endId: "i8", doc: otziDoc as any, manifest: otziManifest as any })}
        fps={30} width={1080} height={1920}
        defaultProps={{ startId: "i5", endId: "i8", hook: "Dead 5,300 years.\nSomething on him is alive.", slug: "otzi", hookVideo: "labdish_1.mp4", hookFrom: 3, doc: otziDoc as any, manifest: otziManifest as any }}
      />

      {/* ── mindwired — Venera ("The Only Photos Ever Taken on Venus") —
             Icahn PASS-COND 2026-08-16 (memory `icahn-venera`); sole survivor
             of a 9-topic space kill sweep. Spine: engineering-forensics of
             the Venera program's failure ladder + the attributed 2012
             Ksanfomaliti "life on Venus" anomaly (debunked, never asserted)
             + the LIVE FY27 budget wedge (NASA's Venus portfolio killed
             again, fight unresolved in Congress as of Aug 2026). Real
             Commons/CC-BY visuals only: the actual Venera 9/10/13/14
             panoramas, museum lander replicas, Soviet stamps, the 2025 Bank
             of Russia anniversary coin, NASA SVS Magellan radar footage, and
             generic NASA hardware-test b-roll (never captioned as archival
             Venera footage — see public/shorts/venera/video/ATTRIBUTION.md).
             JWST-cannot-see-Venus guardrail respected throughout; no Soviet
             newsreel, no Mitchell/Stryk reprocessings. See
             docs/planning/CLAIMS-venera.md. ── */}
      <Composition
        id="VeneraDoc"
        component={makeDocComp(veneraDoc as any, veneraManifest as any, MW_OUTRO)}
        durationInFrames={docTotalFrames(veneraDoc as any, veneraManifest as any, MW_OUTRO)}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* ── Bermuda Triangle ("The Bermuda Triangle Isn't Real. Here's Proof.")
             — mindwired, widened ocean/earth-mystery lane per studying
             @official-yesterday (memory yesterday-channel-study). Icahn PASS
             2026-08-20 (memory icahn-bermudatriangle). Honest debunk-only
             framing: Flight 19, USS Cyclops, Marine Sulphur Queen, Star
             Tiger/Star Ariel, Mary Celeste myth-padding, Kusche's 1975
             debunking book, and the real statistics (Lloyd's, NOAA, 2013 WWF
             shipping-loss study). Full fact base: docs/planning/CLAIMS-bermudatriangle.md. ── */}
      <Composition
        id="BermudaTriangleDoc"
        component={makeDocComp(bermudaTriangleDoc as any, bermudaTriangleManifest as any, MW_OUTRO)}
        durationInFrames={docTotalFrames(bermudaTriangleDoc as any, bermudaTriangleManifest as any, MW_OUTRO)}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* ── Fermi Paradox ("Why Haven't We Found Aliens?") — mindwired, space
             lane. Icahn PASS 2026-08-20 (memory icahn-fermiparadox), picked
             from a 14-agent NEO/LEMMiNO catalog sweep (memory
             icahn-neo-lemmino-sweep). Locked structure: 3I/ATLAS real-footage
             cold open + K2-18b's still-unresolved 2023-2026 biosignature
             dispute as the sustained spine, Great Filter/Rare Earth/Dark
             Forest/Zoo Hypothesis as the named-explainer middle. Full fact
             base + corrections: docs/planning/CLAIMS-fermiparadox.md. ── */}
      <Composition
        id="FermiParadoxDoc"
        component={makeDocComp(fermiParadoxDoc as any, fermiParadoxManifest as any, MW_OUTRO)}
        durationInFrames={docTotalFrames(fermiParadoxDoc as any, fermiParadoxManifest as any, MW_OUTRO)}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* ── Thai Cave Rescue (Tham Luang, 2018) — mindwired, disaster/rescue
             lane. Icahn PASS-WITH-CONDITIONS from the 2026-08-20 NEO/LEMMiNO
             sweep (runner-up to Fermi Paradox), re-validated live 2026-08-21
             (memory icahn-neo-lemmino-sweep) — the "Laos echo" currency hook
             did NOT produce a small-channel outlier on a live recheck, so
             demand rests on the topic's proven recognition (a movie-recap
             channel hit 31.1:1 on "Thirteen Lives" alone) rather than the
             echo itself. Differentiation: the real US pararescue team every
             film left out (DVIDS PD footage/photos), the real federal Musk
             v. Unsworth defamation trial neither major production touches,
             the statelessness/farmers/credit-dispute threads, and the honest
             2026 Laos-rescue coda. Full fact base + corrections:
             docs/planning/CLAIMS-thaicaverescue.md. ── */}
      <Composition
        id="ThaiCaveRescueDoc"
        component={makeDocComp(thaiCaveRescueDoc as any, thaiCaveRescueManifest as any, MW_OUTRO)}
        durationInFrames={docTotalFrames(thaiCaveRescueDoc as any, thaiCaveRescueManifest as any, MW_OUTRO)}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* ── Apollo 13 near-disaster (1970), mindwired. Icahn PASS 2026-08-21
             (memory icahn-apollo13) — giant-name/evergreen, currency via
             commander Jim Lovell's Aug 2025 death + the Jun 2026 Tribeca
             documentary "Odyssey", closing coda on Artemis II breaking
             Apollo 13's 56-year distance record with Lovell's own posthumous
             message. Fred Haise (92) is the sole surviving crew member —
             framed attributed-never-asserted throughout. Real-vs-movie
             corrections are the spine (the real transcript vs the 1995
             film's invented lines). Real NASA/JSC PD footage: two full
             documentaries manually sourced and cut (MOCR crisis footage +
             the live 1970 splashdown/recovery broadcast feed) — see
             public/shorts/apollo13/video/ATTRIBUTION.md. Full fact base:
             docs/planning/CLAIMS-apollo13.md. MW_OUTRO baked. ── */}
      <Composition
        id="Apollo13Doc"
        component={makeDocComp(apollo13Doc as any, apollo13Manifest as any, MW_OUTRO)}
        durationInFrames={docTotalFrames(apollo13Doc as any, apollo13Manifest as any, MW_OUTRO)}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* ── Apollo 13 funnel Shorts (4) — trailers for Apollo13Doc. Beats:
             (1) the real-vs-movie transcript reveal (h1-h4); (2) the mailbox
             CO2 fix built from duct tape (c5a-c5d); (3) the reentry blackout
             + splashdown (c7a-c7f); (4) Lovell's posthumous message +
             Artemis II breaking his record (c10a-c10e). ── */}
      <Composition
        id="Apollo13Short1"
        component={MindwiredShort}
        durationInFrames={mindwiredShortFrames({ startId: "h1", endId: "h4", doc: apollo13Doc as any, manifest: apollo13Manifest as any })}
        fps={30} width={1080} height={1920}
        defaultProps={{ startId: "h1", endId: "h4", hook: "You know the Apollo 13 line.\nIt's not what he really said.", slug: "apollo13", hookVideo: "moccontrol_2.mp4", hookFrom: 1, doc: apollo13Doc as any, manifest: apollo13Manifest as any }}
      />
      <Composition
        id="Apollo13Short2"
        component={MindwiredShort}
        durationInFrames={mindwiredShortFrames({ startId: "c5a", endId: "c5d", doc: apollo13Doc as any, manifest: apollo13Manifest as any })}
        fps={30} width={1080} height={1920}
        defaultProps={{ startId: "c5a", endId: "c5d", hook: "Three men were running out of air.\nThe fix was duct tape and a flight manual.", slug: "apollo13", hookImg: "mailboxfix_1.jpg", doc: apollo13Doc as any, manifest: apollo13Manifest as any }}
      />
      <Composition
        id="Apollo13Short3"
        component={MindwiredShort}
        durationInFrames={mindwiredShortFrames({ startId: "c7a", endId: "c7f", doc: apollo13Doc as any, manifest: apollo13Manifest as any })}
        fps={30} width={1080} height={1920}
        defaultProps={{ startId: "c7a", endId: "c7f", hook: "Mission Control expected static\nfor 4 minutes. It lasted twice that long.", slug: "apollo13", hookVideo: "recovery_3.mp4", hookFrom: 1, doc: apollo13Doc as any, manifest: apollo13Manifest as any }}
      />
      <Composition
        id="Apollo13Short4"
        component={MindwiredShort}
        durationInFrames={mindwiredShortFrames({ startId: "c10a", endId: "c10e", doc: apollo13Doc as any, manifest: apollo13Manifest as any })}
        fps={30} width={1080} height={1920}
        defaultProps={{ startId: "c10a", endId: "c10e", hook: "He recorded this message before he died.\nThen a new crew broke his own record.", slug: "apollo13", hookImg: "lovell_1.jpg", doc: apollo13Doc as any, manifest: apollo13Manifest as any }}
      />

      {/* ── Starfish Prime / Operation Fishbowl (1962), mindwired. Icahn PASS
             2026-08-22 (memory icahn-starfishprime) — fresh 5.2:1/601K-view
             corroborator proves "US nuked space" framing pulls now; live
             2024-2026 currency via Russia's alleged space-based nuclear ASAT
             weapon (Starfish Prime cited as the real precedent). Real PD
             footage hand-cut from the declassified NASA/DOE
             StarfishPrimeInterimReportByCommanderJTF8 reel (detonation +
             real Tongatapu auroral footage + Fishbowl launch footage) — see
             public/shorts/starfishprime/video/ATTRIBUTION.md. First episode
             with the full craft-overhaul voice stack (Grant narrator +
             pronunciation layer + broadcast polish). Full fact base:
             docs/planning/CLAIMS-starfishprime.md. MW_OUTRO baked. ── */}
      <Composition
        id="StarfishPrimeDoc"
        component={makeDocComp(starfishPrimeDoc as any, starfishPrimeManifest as any, MW_OUTRO)}
        durationInFrames={docTotalFrames(starfishPrimeDoc as any, starfishPrimeManifest as any, MW_OUTRO)}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* ── Thai Cave Rescue funnel Shorts (4) — trailers for ThaiCaveRescueDoc,
             one per differentiation thread. (1) the American pararescuemen no
             film named (a2-a4, real Galindo interview quote clip); (2) Musk's
             "pedo guy" tweet (m3-m4, real Musk portrait); (3) the stateless
             boys' fast-tracked citizenship (w2-w2b, real Wild Boars photo);
             (4) the 2026 Laos echo — the same two divers, eight years later
             (l1-l2, real Xaysomboun cave photo). ── */}
      <Composition
        id="ThaiCaveRescueShort1"
        component={MindwiredShort}
        durationInFrames={mindwiredShortFrames({ startId: "a2", endId: "a4", doc: thaiCaveRescueDoc as any, manifest: thaiCaveRescueManifest as any })}
        fps={30} width={1080} height={1920}
        defaultProps={{ startId: "a2", endId: "a4", hook: "Two American rescuers were inside\nthis cave. No movie says their names.", slug: "thaicaverescue", hookVideo: "galindo_6.mp4", hookFrom: 1, doc: thaiCaveRescueDoc as any, manifest: thaiCaveRescueManifest as any }}
      />
      <Composition
        id="ThaiCaveRescueShort2"
        component={MindwiredShort}
        durationInFrames={mindwiredShortFrames({ startId: "m3", endId: "m4", doc: thaiCaveRescueDoc as any, manifest: thaiCaveRescueManifest as any })}
        fps={30} width={1080} height={1920}
        defaultProps={{ startId: "m3", endId: "m4", hook: "A caver called Elon Musk's rescue\nsubmarine a stunt. This is what he tweeted back.", slug: "thaicaverescue", hookImg: "muskportrait_2.jpg", doc: thaiCaveRescueDoc as any, manifest: thaiCaveRescueManifest as any }}
      />
      <Composition
        id="ThaiCaveRescueShort3"
        component={MindwiredShort}
        durationInFrames={mindwiredShortFrames({ startId: "w2", endId: "w2b", doc: thaiCaveRescueDoc as any, manifest: thaiCaveRescueManifest as any })}
        fps={30} width={1080} height={1920}
        defaultProps={{ startId: "w2", endId: "w2b", hook: "Some of these boys had never had\na legal ID card in their own country.", slug: "thaicaverescue", hookImg: "ekkapol_2.jpg", doc: thaiCaveRescueDoc as any, manifest: thaiCaveRescueManifest as any }}
      />
      <Composition
        id="ThaiCaveRescueShort4"
        component={MindwiredShort}
        durationInFrames={mindwiredShortFrames({ startId: "l1", endId: "l2", doc: thaiCaveRescueDoc as any, manifest: thaiCaveRescueManifest as any })}
        fps={30} width={1080} height={1920}
        defaultProps={{ startId: "l1", endId: "l2", hook: "Eight years after Tham Luang, the same\nreal divers went back into a flooded cave.", slug: "thaicaverescue", hookImg: "laosmap_2.jpg", doc: thaiCaveRescueDoc as any, manifest: thaiCaveRescueManifest as any }}
      />

      {/* ── Fermi Paradox funnel Shorts (4) — trailers for FermiParadoxDoc.
             Beats: (1) the 3I/ATLAS Loeb-vs-NASA clash (h2-h5); (2) Fermi's
             lunch-table quote + the witnesses' own date dispute (f3-f5);
             (3) K2-18b's "strongest hints yet" claim through Hu's rebuttal
             (k3-k5); (4) Loeb's dark-forest reasoning + Wright's rebuttal +
             the zero-signal SETI result (df2-df4). ── */}
      <Composition
        id="FermiParadoxShort1"
        component={MindwiredShort}
        durationInFrames={mindwiredShortFrames({ startId: "h2", endId: "h5", doc: fermiParadoxDoc as any, manifest: fermiParadoxManifest as any })}
        fps={30} width={1080} height={1920}
        defaultProps={{ startId: "h2", endId: "h5", hook: "A Harvard scientist says this object\nmight be alien technology. NASA disagreed.", slug: "fermiparadox", hookVideo: "atlasreal_2.mp4", hookFrom: 2, doc: fermiParadoxDoc as any, manifest: fermiParadoxManifest as any }}
      />
      <Composition
        id="FermiParadoxShort2"
        component={MindwiredShort}
        durationInFrames={mindwiredShortFrames({ startId: "f3", endId: "f5", doc: fermiParadoxDoc as any, manifest: fermiParadoxManifest as any })}
        fps={30} width={1080} height={1920}
        defaultProps={{ startId: "f3", endId: "f5", hook: "Three men heard Enrico Fermi ask\nthis question. They never agreed why.", slug: "fermiparadox", hookImg: "fermiblackboard_2.jpg", doc: fermiParadoxDoc as any, manifest: fermiParadoxManifest as any }}
      />
      <Composition
        id="FermiParadoxShort3"
        component={MindwiredShort}
        durationInFrames={mindwiredShortFrames({ startId: "k3", endId: "k5", doc: fermiParadoxDoc as any, manifest: fermiParadoxManifest as any })}
        fps={30} width={1080} height={1920}
        defaultProps={{ startId: "k3", endId: "k5", hook: "Scientists said they found the strongest\nsign of alien life ever. Then it fell apart.", slug: "fermiparadox", hookImg: "k218b_3.jpg", doc: fermiParadoxDoc as any, manifest: fermiParadoxManifest as any }}
      />
      <Composition
        id="FermiParadoxShort4"
        component={MindwiredShort}
        durationInFrames={mindwiredShortFrames({ startId: "df2", endId: "df4", doc: fermiParadoxDoc as any, manifest: fermiParadoxManifest as any })}
        fps={30} width={1080} height={1920}
        defaultProps={{ startId: "df2", endId: "df4", hook: "A real scientist just used sci-fi logic\nto explain why aliens might be hiding.", slug: "fermiparadox", hookVideo: "atlasreal_3.mp4", hookFrom: 1, doc: fermiParadoxDoc as any, manifest: fermiParadoxManifest as any }}
      />

      {/* ── Bermuda Triangle funnel Shorts (4) — trailers for BermudaTriangleDoc.
             Beats: (1) the fabricated-1962-quote debunk (a5-b5); (2) the Mary
             Celeste geography reveal (g1-g4); (3) the 2013 WWF "not even top 10"
             statistic (i3a-i5a); (4) the hexagonal-clouds "horrendous editing"
             quote (j5-j7). ── */}
      <Composition
        id="BermudaTriangleShort1"
        component={MindwiredShort}
        durationInFrames={mindwiredShortFrames({ startId: "b4", endId: "b5", doc: bermudaTriangleDoc as any, manifest: bermudaTriangleManifest as any })}
        fps={30} width={1080} height={1920}
        defaultProps={{ startId: "b4", endId: "b5", hook: "That famous Bermuda Triangle\nradio quote? Invented in 1962.", slug: "bermudatriangle", hookVideo: "avengerdeck_2.mp4", hookFrom: 2, doc: bermudaTriangleDoc as any, manifest: bermudaTriangleManifest as any }}
      />
      <Composition
        id="BermudaTriangleShort2"
        component={MindwiredShort}
        durationInFrames={mindwiredShortFrames({ startId: "g1", endId: "g4", doc: bermudaTriangleDoc as any, manifest: bermudaTriangleManifest as any })}
        fps={30} width={1080} height={1920}
        defaultProps={{ startId: "g1", endId: "g4", hook: "The most famous \"Bermuda Triangle\"\nship was never anywhere near it.", slug: "bermudatriangle", hookVideo: "avengerdeck_4.mp4", hookFrom: 1, doc: bermudaTriangleDoc as any, manifest: bermudaTriangleManifest as any }}
      />
      <Composition
        id="BermudaTriangleShort3"
        component={MindwiredShort}
        durationInFrames={mindwiredShortFrames({ startId: "i3a", endId: "i5a", doc: bermudaTriangleDoc as any, manifest: bermudaTriangleManifest as any })}
        fps={30} width={1080} height={1920}
        defaultProps={{ startId: "i3a", endId: "i5a", hook: "A real 2013 study ranked the\nworld's oceans. Guess who's not top 10.", slug: "bermudatriangle", hookVideo: "avengersmoke_1.mp4", hookFrom: 3, doc: bermudaTriangleDoc as any, manifest: bermudaTriangleManifest as any }}
      />
      <Composition
        id="BermudaTriangleShort4"
        component={MindwiredShort}
        durationInFrames={mindwiredShortFrames({ startId: "j5", endId: "j7", doc: bermudaTriangleDoc as any, manifest: bermudaTriangleManifest as any })}
        fps={30} width={1080} height={1920}
        defaultProps={{ startId: "j5", endId: "j7", hook: "A scientist's own words: the TV\nediting on this was \"horrendous.\"", slug: "bermudatriangle", hookVideo: "avengerdeck_1.mp4", hookFrom: 4, doc: bermudaTriangleDoc as any, manifest: bermudaTriangleManifest as any }}
      />

      {/* ── Venera funnel Shorts (4) — trailers for VeneraDoc, cut same-session
             as the render (Everest lesson applied). Beats: (1) the cold open
             h1-h5, the wedge tease; (2) Venera 7's Dec 1970 landing + the
             23-minutes-in-the-noise reveal a7-a10; (3) the 127-minute record
             + first color/sound c3a-c3d; (4) the Ksanfomaliti debunk d3-d6 —
             attributed-never-asserted, ends on "never replicated, never
             confirmed" so the claim is never left unscoped. Hook plates use
             this episode's own real assets (Magellan flyover, real panoramas,
             museum replicas). ── */}
      <Composition
        id="VeneraShort1"
        component={MindwiredShort}
        durationInFrames={mindwiredShortFrames({ startId: "h1", endId: "h5", doc: veneraDoc as any, manifest: veneraManifest as any })}
        fps={30} width={1080} height={1920}
        defaultProps={{ startId: "h1", endId: "h5", hook: "The only photos ever taken\non the surface of Venus.", slug: "venera", hookVideo: "magellanflyover_1.mp4", hookFrom: 2, doc: veneraDoc as any, manifest: veneraManifest as any }}
      />
      <Composition
        id="VeneraShort2"
        component={MindwiredShort}
        durationInFrames={mindwiredShortFrames({ startId: "a7", endId: "a10", doc: veneraDoc as any, manifest: veneraManifest as any })}
        fps={30} width={1080} height={1920}
        defaultProps={{ startId: "a7", endId: "a10", hook: "It went silent.\nThen someone found 23 more minutes.", slug: "venera", hookVideo: "magellanflyover_2.mp4", hookFrom: 2, doc: veneraDoc as any, manifest: veneraManifest as any }}
      />
      <Composition
        id="VeneraShort3"
        component={MindwiredShort}
        durationInFrames={mindwiredShortFrames({ startId: "c3a", endId: "c3d", doc: veneraDoc as any, manifest: veneraManifest as any })}
        fps={30} width={1080} height={1920}
        defaultProps={{ startId: "c3a", endId: "c3d", hook: "Built to survive 32 minutes.\nIt lasted 127.", slug: "venera", hookVideo: "magellanflyover_1.mp4", hookFrom: 6, doc: veneraDoc as any, manifest: veneraManifest as any }}
      />
      <Composition
        id="VeneraShort4"
        component={MindwiredShort}
        durationInFrames={mindwiredShortFrames({ startId: "d3", endId: "d6", doc: veneraDoc as any, manifest: veneraManifest as any })}
        fps={30} width={1080} height={1920}
        defaultProps={{ startId: "d3", endId: "d6", hook: "A scientist said something\nin these photos was alive.", slug: "venera", hookVideo: "magellanflyover_2.mp4", hookFrom: 4, doc: veneraDoc as any, manifest: veneraManifest as any }}
      />

      {/* ── Criminal Record — Carla Walker / Glen McCurley ("The Killer Was
             in the File the Whole Time") — Icahn PASS 2026-08-16 (memory
             icahn-carlawalker). Fort Worth, 1974: McCurley was interviewed,
             passed a polygraph, and was cleared — Othram's forensic genetic
             genealogy matched him in 2020, 46 years 7 months later. Fully
             adjudicated (guilty plea 2021, died in custody 2023) — zero
             living-suspect sensitivity. Real assets only: his actual 2020
             booking photo (news-syndicated, public record), real Fort Worth
             courthouse/courtroom Commons photos — no crime reconstruction,
             no AI depiction, no victim photo (house ban, confirmed excluded
             despite wide press availability). See CLAIMS-carlawalker.md. ── */}
      <Composition
        id="CarlaWalkerDoc"
        component={makeDocComp(carlaWalkerDoc as any, carlaWalkerManifest as any, CR_OUTRO)}
        durationInFrames={docTotalFrames(carlaWalkerDoc as any, carlaWalkerManifest as any, CR_OUTRO)}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* ── Black Box Breakdown — D.B. Cooper ("The Only Unsolved Hijacking
             in American History") — Icahn KILLED 2026-08-16 (saturated, no
             fresh outlier), PRODUCED ANYWAY per Akshay's explicit override
             (memory icahn-dbcooper). HARD RULE: case is formally unsolved —
             FBI suspended active investigation July 2016, never confirmed
             any suspect. Every theory (McCoy, Christiansen, Weber, Rackstraw,
             Dayton, Peterson, L.D. Cooper) stays attributed-never-asserted;
             the 2026 "DNA confirms identity" clickbait claim is explicitly
             named and refuted in-script (scene e4), never treated as real.
             Real assets: the actual FBI composite sketches, the real 1980
             Tena Bar recovered-ransom photo, a real Northwest Orient 727 +
             its real rear-airstair mechanism (Commons, CC BY 2.5/GFDL). No
             real ATC audio survives — none claimed. See CLAIMS-dbcooper.md. ── */}
      <Composition
        id="DbCooperDoc"
        component={makeDocComp(dbCooperDoc as any, dbCooperManifest as any, BB_OUTRO)}
        durationInFrames={docTotalFrames(dbCooperDoc as any, dbCooperManifest as any, BB_OUTRO)}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* ── Carla Walker funnel Shorts (4) — trailers for CarlaWalkerDoc, cut
             same-session (Everest lesson applied). Beats: (1) the cold open
             h1-h5; (2) the 1974 interview + polygraph b2-b6; (3) the DNA
             match reveal d3-d6; (4) the arrest + plea f1-f4. Real assets
             only (his actual booking photo, real courthouse). ── */}
      <Composition
        id="CarlaWalkerShort1"
        component={MindwiredShort}
        durationInFrames={mindwiredShortFrames({ startId: "h1", endId: "h5", doc: carlaWalkerDoc as any, manifest: carlaWalkerManifest as any })}
        fps={30} width={1080} height={1920}
        defaultProps={{ startId: "h1", endId: "h5", hook: "He was interviewed in 1974.\nHe passed a polygraph.", slug: "carlawalker", doc: carlaWalkerDoc as any, manifest: carlaWalkerManifest as any }}
      />
      <Composition
        id="CarlaWalkerShort2"
        component={MindwiredShort}
        durationInFrames={mindwiredShortFrames({ startId: "b2", endId: "b6", doc: carlaWalkerDoc as any, manifest: carlaWalkerManifest as any })}
        fps={30} width={1080} height={1920}
        defaultProps={{ startId: "b2", endId: "b6", hook: "The gun matched.\nThey cleared him anyway.", slug: "carlawalker", doc: carlaWalkerDoc as any, manifest: carlaWalkerManifest as any }}
      />
      <Composition
        id="CarlaWalkerShort3"
        component={MindwiredShort}
        durationInFrames={mindwiredShortFrames({ startId: "d3", endId: "d6", doc: carlaWalkerDoc as any, manifest: carlaWalkerManifest as any })}
        fps={30} width={1080} height={1920}
        defaultProps={{ startId: "d3", endId: "d6", hook: "46 years later,\nthe DNA came back.", slug: "carlawalker", doc: carlaWalkerDoc as any, manifest: carlaWalkerManifest as any }}
      />
      <Composition
        id="CarlaWalkerShort4"
        component={MindwiredShort}
        durationInFrames={mindwiredShortFrames({ startId: "f1", endId: "f4", doc: carlaWalkerDoc as any, manifest: carlaWalkerManifest as any })}
        fps={30} width={1080} height={1920}
        defaultProps={{ startId: "f1", endId: "f4", hook: "Third day of trial.\nHe pled guilty.", slug: "carlawalker", doc: carlaWalkerDoc as any, manifest: carlaWalkerManifest as any }}
      />

      {/* ── D.B. Cooper funnel Shorts (4) — trailers for DbCooperDoc, cut
             same-session. Beats: (1) the cold open h1-h5; (2) the hijacking
             itself a1-a4; (3) the only recovered evidence c3a-c3d; (4) three
             of the seven suspect theories d2-d4. Never claims the case is
             solved — every Short stays inside the attributed-theory frame. ── */}
      <Composition
        id="DbCooperShort1"
        component={MindwiredShort}
        durationInFrames={mindwiredShortFrames({ startId: "h1", endId: "h5", doc: dbCooperDoc as any, manifest: dbCooperManifest as any })}
        fps={30} width={1080} height={1920}
        defaultProps={{ startId: "h1", endId: "h5", hook: "He jumped from a plane\nwith $200,000. Alone.", slug: "dbcooper", doc: dbCooperDoc as any, manifest: dbCooperManifest as any }}
      />
      <Composition
        id="DbCooperShort2"
        component={MindwiredShort}
        durationInFrames={mindwiredShortFrames({ startId: "a1", endId: "a4", doc: dbCooperDoc as any, manifest: dbCooperManifest as any })}
        fps={30} width={1080} height={1920}
        defaultProps={{ startId: "a1", endId: "a4", hook: "\"I have a bomb.\"", slug: "dbcooper", doc: dbCooperDoc as any, manifest: dbCooperManifest as any }}
      />
      <Composition
        id="DbCooperShort3"
        component={MindwiredShort}
        durationInFrames={mindwiredShortFrames({ startId: "c3a", endId: "c3d", doc: dbCooperDoc as any, manifest: dbCooperManifest as any })}
        fps={30} width={1080} height={1920}
        defaultProps={{ startId: "c3a", endId: "c3d", hook: "A boy found $5,800\nof the ransom. In 1980.", slug: "dbcooper", doc: dbCooperDoc as any, manifest: dbCooperManifest as any }}
      />
      <Composition
        id="DbCooperShort4"
        component={MindwiredShort}
        durationInFrames={mindwiredShortFrames({ startId: "d2", endId: "d4", doc: dbCooperDoc as any, manifest: dbCooperManifest as any })}
        fps={30} width={1080} height={1920}
        defaultProps={{ startId: "d2", endId: "d4", hook: "7 suspects. 0 confirmed\nby the FBI.", slug: "dbcooper", doc: dbCooperDoc as any, manifest: dbCooperManifest as any }}
      />

      {/* ── Yellowstone funnel Shorts (4) — the real cold-open explosion, the
             mantle-wind "textbook was wrong" reveal, the 1959 Hebgen Lake
             earthquake (stops at e6, before Anita Painter Thon's personal
             account, so a named individual's story is never cut out of
             context as a standalone hook), and the explicit real-vs-
             hypothetical differentiator. Real USGS video/photos for every
             hook plate — never a bare card. ── */}
      <Composition
        id="YellowstoneShort1"
        component={MindwiredShort}
        durationInFrames={mindwiredShortFrames({ startId: "h1", endId: "h6", doc: yellowstoneDoc as any, manifest: yellowstoneManifest as any })}
        fps={30} width={1080} height={1920}
        defaultProps={{ startId: "h1", endId: "h6", hook: "A camera caught\nYellowstone cracking open.", slug: "yellowstone", hookVideo: "biscuit_explosion_1.mp4", hookFrom: 3, doc: yellowstoneDoc as any, manifest: yellowstoneManifest as any }}
      />
      <Composition
        id="YellowstoneShort2"
        component={MindwiredShort}
        durationInFrames={mindwiredShortFrames({ startId: "c2", endId: "b5", doc: yellowstoneDoc as any, manifest: yellowstoneManifest as any })}
        fps={30} width={1080} height={1920}
        defaultProps={{ startId: "c2", endId: "b5", hook: "The Yellowstone answer\neveryone learned was wrong.", slug: "yellowstone", hookImg: "old_faithful_1_1.jpg", doc: yellowstoneDoc as any, manifest: yellowstoneManifest as any }}
      />
      <Composition
        id="YellowstoneShort3"
        component={MindwiredShort}
        durationInFrames={mindwiredShortFrames({ startId: "e1", endId: "e6", doc: yellowstoneDoc as any, manifest: yellowstoneManifest as any })}
        fps={30} width={1080} height={1920}
        defaultProps={{ startId: "e1", endId: "e6", hook: "28 people died here.\nIt wasn't the volcano.", slug: "yellowstone", hookImg: "hebgen_slide_1_2.jpg", doc: yellowstoneDoc as any, manifest: yellowstoneManifest as any }}
      />
      <Composition
        id="YellowstoneShort4"
        component={MindwiredShort}
        durationInFrames={mindwiredShortFrames({ startId: "c6", endId: "g3", doc: yellowstoneDoc as any, manifest: yellowstoneManifest as any })}
        fps={30} width={1080} height={1920}
        defaultProps={{ startId: "c6", endId: "g3", hook: "This isn't the\n\"what if it erupts\" video.", slug: "yellowstone", hookImg: "biscuit_vents_map_1_1.jpg", doc: yellowstoneDoc as any, manifest: yellowstoneManifest as any }}
      />

      {/* ── Earhart funnel Shorts (4) — cold open, the real NARA radio-log
             reveal, the 13-bones forensic story, the 2025 declassification.
             Pinned-comment CTA on each names the long-form by title.
             `hookVideo` = real archival motion under the 2.5s hook card (the
             feed judges those 2.5s; a bare black text card is a hard CLAUDE.md
             violation). Short1 inherits h2's Electra footage automatically;
             the other three ranges are photo-only, so each gets an explicit
             verified PD newsreel plate from this episode's own fetch set. ── */}
      <Composition
        id="EarhartShort1"
        component={BlackBoxShort}
        durationInFrames={blackBoxShortFrames({ startId: "h1", endId: "h9", doc: earhartDoc as any, manifest: earhartManifest as any })}
        fps={30} width={1080} height={1920}
        defaultProps={{ startId: "h1", endId: "h9", hook: "Her last words were\nrecorded, word for word", cta: "They had her radio log.\nThey never had her body.", slug: "earhart", doc: earhartDoc as any, manifest: earhartManifest as any }}
      />
      <Composition
        id="EarhartShort2"
        component={BlackBoxShort}
        durationInFrames={blackBoxShortFrames({ startId: "c3_8", endId: "c3_16", doc: earhartDoc as any, manifest: earhartManifest as any })}
        fps={30} width={1080} height={1920}
        defaultProps={{ startId: "c3_8", endId: "c3_16", hook: "This document is real.\nIt still doesn't solve it", cta: "The full radio log\nbreakdown on the channel", slug: "earhart", hookVideo: "electra_exterior_1.mp4", hookFrom: 2, doc: earhartDoc as any, manifest: earhartManifest as any }}
      />
      <Composition
        id="EarhartShort3"
        component={BlackBoxShort}
        durationInFrames={blackBoxShortFrames({ startId: "c6_2", endId: "c6_9", doc: earhartDoc as any, manifest: earhartManifest as any })}
        fps={30} width={1080} height={1920}
        defaultProps={{ startId: "c6_2", endId: "c6_9", hook: "13 bones were found.\nOne might be her", cta: "The full forensic story\non the channel", slug: "earhart", hookVideo: "uslexington_1.mp4", hookFrom: 1, doc: earhartDoc as any, manifest: earhartManifest as any }}
      />
      <Composition
        id="EarhartShort4"
        component={BlackBoxShort}
        durationInFrames={blackBoxShortFrames({ startId: "c8_2", endId: "c8_9", doc: earhartDoc as any, manifest: earhartManifest as any })}
        fps={30} width={1080} height={1920}
        defaultProps={{ startId: "c8_2", endId: "c8_9", hook: "The US just declassified\nthousands of pages on her", cta: "What's actually in the files\n— on the channel", slug: "earhart", hookVideo: "honolulu_oakland_1935_1.mp4", hookFrom: 3, doc: earhartDoc as any, manifest: earhartManifest as any }}
      />

      {/* ── Tunguska funnel Shorts (4) — Semenov cold open, the Kulik
             expedition "no crater" reveal, Chelyabinsk 2013 modern analog,
             the 3 fringe theories debunked. Recognition-bridge rule applies:
             hooks lead with "biggest explosion" framing, never bare
             "Tunguska".
             Hook plates: Short1 is pinned to the real 1927-30 Kulik
             "matchstick forest" photo, and Short2 falls through to the real
             Kulik portrait, INSTEAD of the range default — the default would
             have put 2013 Chelyabinsk footage under an 1908 claim and implied
             it was Tunguska. (taiga_1 was tried and rejected: cropped to 9:16
             it's 85% empty river water — verified on a still.) Short3 IS about
             2013, so it uses chelyabinsk_2 at the 10s mark where the airburst
             flash is actually visible. Short4 uses the real NASA Ames
             hypervelocity-lab footage for the physics-theories beat. ── */}
      <Composition
        id="TunguskaShort1"
        component={MindwiredShort}
        durationInFrames={mindwiredShortFrames({ startId: "h1", endId: "h6", doc: tunguskaDoc as any, manifest: tunguskaManifest as any })}
        fps={30} width={1080} height={1920}
        defaultProps={{ startId: "h1", endId: "h6", hook: "The biggest explosion\nin history left no crater", slug: "tunguska", hookImg: "kulik_fallen_trees_2.jpg", doc: tunguskaDoc as any, manifest: tunguskaManifest as any }}
      />
      <Composition
        id="TunguskaShort2"
        component={MindwiredShort}
        durationInFrames={mindwiredShortFrames({ startId: "e4", endId: "e6", doc: tunguskaDoc as any, manifest: tunguskaManifest as any })}
        fps={30} width={1080} height={1920}
        defaultProps={{ startId: "e4", endId: "e6", hook: "It took 19 years to\nreach the blast site", slug: "tunguska", doc: tunguskaDoc as any, manifest: tunguskaManifest as any }}
      />
      <Composition
        id="TunguskaShort3"
        component={MindwiredShort}
        durationInFrames={mindwiredShortFrames({ startId: "h1c", endId: "h5c", doc: tunguskaDoc as any, manifest: tunguskaManifest as any })}
        fps={30} width={1080} height={1920}
        defaultProps={{ startId: "h1c", endId: "h5c", hook: "In 2013 it happened again\n— and got filmed", slug: "tunguska", hookVideo: "chelyabinsk_2.mp4", hookFrom: 11, doc: tunguskaDoc as any, manifest: tunguskaManifest as any }}
      />
      <Composition
        id="TunguskaShort4"
        component={MindwiredShort}
        durationInFrames={mindwiredShortFrames({ startId: "f1", endId: "f6", doc: tunguskaDoc as any, manifest: tunguskaManifest as any })}
        fps={30} width={1080} height={1920}
        defaultProps={{ startId: "f1", endId: "f6", hook: "3 theories tried to\nexplain it. All 3 failed", slug: "tunguska", hookVideo: "nasa_ames_1.mp4", doc: tunguskaDoc as any, manifest: tunguskaManifest as any }}
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

      {/* ── Black Box Breakdown — Japan Airlines 123 (BB subscribe outro baked) ── */}
      <Composition
        id="Jal123Doc"
        component={makeDocComp(jal123Doc, jal123Manifest, BB_OUTRO)}
        durationInFrames={docTotalFrames(jal123Doc, jal123Manifest, BB_OUTRO)}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* ── Black Box Breakdown — Helios 522: the plane that flew itself (BB outro baked) ── */}
      <Composition
        id="Helios522Doc"
        component={makeDocComp(helios522Doc, helios522Manifest, BB_OUTRO)}
        durationInFrames={docTotalFrames(helios522Doc, helios522Manifest, BB_OUTRO)}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* ── Black Box Breakdown — Chernobyl: the official report vs. the show (BB outro baked) ── */}
      <Composition
        id="ChernobylDoc"
        component={makeDocComp(chernobylDoc, chernobylManifest, BB_OUTRO)}
        durationInFrames={docTotalFrames(chernobylDoc, chernobylManifest, BB_OUTRO)}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* ── Black Box Breakdown — Titanic: the verdict two governments couldn't agree on (BB outro baked) ── */}
      <Composition
        id="TitanicDoc"
        component={makeDocComp(titanicDoc, titanicManifest, BB_OUTRO)}
        durationInFrames={docTotalFrames(titanicDoc, titanicManifest, BB_OUTRO)}
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

      {/* ── Criminal Record — launch episode: the Moscow, Idaho record.
             Document-first by necessity (no licensable footage exists for a
             state criminal case — see CLAIMS-idahomurders.md) with the
             evidence-animation layer carrying the motion. CR outro baked. ── */}
      <Composition
        id="IdahoMurdersDoc"
        component={makeDocComp(idahoDoc as any, idahoManifest as any, CR_OUTRO)}
        durationInFrames={docTotalFrames(idahoDoc as any, idahoManifest as any, CR_OUTRO)}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* ── Criminal Record ep.2 — Milwaukee, 1991: the accountability record.
             Institutional-failure frame built on the real Wisconsin Court of
             Appeals opinion (No. 98-2889). No depiction of the crimes anywhere;
             see docs/planning/CLAIMS-dahmer.md. CR outro baked. ── */}
      <Composition
        id="DahmerDoc"
        component={makeDocComp(dahmerDoc as any, dahmerManifest as any, CR_OUTRO)}
        durationInFrames={docTotalFrames(dahmerDoc as any, dahmerManifest as any, CR_OUTRO)}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* ── mindwired — a spent Falcon 9 stage hits the Moon (Icahn:
             icahn-spacex-lunar-impact, PASS; time-locked, ship ~Aug 14).
             Confirmed the impact happened on schedule (Aug 5, 06:35 UTC);
             no released imagery yet, so the episode ends honestly on that,
             not on a fabricated visual. Real footage: Ranger 7-9 impact
             films, the actual Blue Ghost Mission 1 launch, LCROSS, the 2022
             double-crater LROC photo. MW outro baked. ── */}
      <Composition
        id="SpacexLunarImpactDoc"
        component={makeDocComp(spacexDoc as any, spacexManifest as any, MW_OUTRO)}
        durationInFrames={docTotalFrames(spacexDoc as any, spacexManifest as any, MW_OUTRO)}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* ── Criminal Record — evidence-animation reference comps (real Idaho
             record data; the RadioTest equivalent for this channel) ── */}
      <Composition id="CRTimelineTest" component={CRTimelineTest}
        durationInFrames={150} fps={30} width={1920} height={1080} />
      <Composition id="CRRouteTest" component={CRRouteTest}
        durationInFrames={150} fps={30} width={1920} height={1080} />
      <Composition id="CRTreeTest" component={CRTreeTest}
        durationInFrames={150} fps={30} width={1920} height={1080} />

      {/* ── Criminal Record — standing subscribe outro (typographic, not a
             talking head: the channel's pitch is the real filing on screen, and
             an AI presenter would undercut it. Built once, reused forever.) ── */}
      <Composition
        id="SubscribeCriminalRecordLong"
        component={SubscribeCriminalRecordLong}
        durationInFrames={CR_OUTRO_FRAMES}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="SubscribeCriminalRecordShort"
        component={SubscribeCriminalRecordShort}
        durationInFrames={CR_OUTRO_FRAMES}
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
      {/* ── codewired — two-host podcast engine (prototype episode 1) ── */}
      <Composition
        id="CodewiredPodcast"
        component={CodewiredPodcastVideo}
        durationInFrames={codewiredPodcastTotalFrames(podcastTurnsJson as any)}
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
      {/* ── MH370 Netflix fact-check Shorts (contiguous self-contained windows) ── */}
      <Composition
        id="Mh370NetflixShort1"
        component={BlackBoxShort}
        durationInFrames={blackBoxShortFrames({ startId: "e8", endId: "e9", doc: mh370netflixDoc as any, manifest: mh370netflixManifest as any })}
        fps={30} width={1080} height={1920}
        defaultProps={{ startId: "e8", endId: "e9", hook: "He wrote Netflix's\nhijack theory.\nNow he says it's wrong.", cta: "The full MH370\nfact-check", slug: "mh370netflix", doc: mh370netflixDoc as any, manifest: mh370netflixManifest as any }}
      />
      <Composition
        id="Mh370NetflixShort2"
        component={BlackBoxShort}
        durationInFrames={blackBoxShortFrames({ startId: "g4", endId: "g6", doc: mh370netflixDoc as any, manifest: mh370netflixManifest as any })}
        fps={30} width={1080} height={1920}
        defaultProps={{ startId: "g4", endId: "g6", hook: "The director doesn't\nbelieve her own\nNetflix series.", cta: "What Netflix's MH370\ndoc got wrong", slug: "mh370netflix", doc: mh370netflixDoc as any, manifest: mh370netflixManifest as any }}
      />
      <Composition
        id="Mh370NetflixShort3"
        component={BlackBoxShort}
        durationInFrames={blackBoxShortFrames({ startId: "p2", endId: "p4", doc: mh370netflixDoc as any, manifest: mh370netflixManifest as any })}
        fps={30} width={1080} height={1920}
        defaultProps={{ startId: "p2", endId: "p4", hook: "The black box\ndid the math.\nNobody was flying it.", cta: "The full MH370\nflight-recorder breakdown", slug: "mh370netflix", doc: mh370netflixDoc as any, manifest: mh370netflixManifest as any }}
      />
      <Composition
        id="Mh370NetflixShort4"
        component={BlackBoxShort}
        durationInFrames={blackBoxShortFrames({ startId: "r8", endId: "r9", doc: mh370netflixDoc as any, manifest: mh370netflixManifest as any })}
        fps={30} width={1080} height={1920}
        defaultProps={{ startId: "r8", endId: "r9", hook: "Same man.\n3 theories.\nStill no answer.", cta: "The full MH370\nfact-check", slug: "mh370netflix", doc: mh370netflixDoc as any, manifest: mh370netflixManifest as any }}
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
