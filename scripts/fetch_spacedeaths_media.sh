#!/bin/zsh
# Archival pull for the spacedeaths 1-hr doc. Commons-only (Openverse floods
# results with unrelated CC photos for these queries). Idempotent-ish: re-running
# re-downloads, so run once.
set -u
PY=.venv-lipsync/bin/python
OUT=public/shorts/spacedeaths/images
F() { $PY scripts/fetch_media.py "$1" --out $OUT --count "$2" --prefix "$3" --source commons --min-width 800; }

F "Bruce McCandless untethered spacewalk MMU" 5 mccandless
F "Valentin Bondarenko cosmonaut" 3 bondarenko
F "Vostok cosmonaut training Soviet 1961" 5 vostoktrain
F "Theodore Freeman astronaut" 3 freeman
F "Elliot See Charles Bassett Gemini 9 astronauts" 4 seebassett
F "NASA T-38 Talon astronaut jet" 5 t38
F "Apollo 1 crew Grissom White Chaffee" 6 apollo1crew
F "Apollo 1 fire command module interior" 6 apollo1fire
F "Apollo 1 Saturn launch pad 34" 4 pad34
F "Vladimir Komarov cosmonaut" 5 komarov
F "Soyuz 1 crash site remains" 4 soyuz1crash
F "Soyuz spacecraft parachute descent module" 4 soyuzchute
F "X-15 rocket plane Michael Adams" 5 x15
F "X-15 crash Michael Adams wreckage" 3 x15crash
F "Soyuz 11 crew Dobrovolsky Volkov Patsayev" 6 soyuz11crew
F "Salyut 1 space station" 4 salyut1
F "Soyuz 11 recovery capsule" 4 soyuz11rec
F "R-16 missile Baikonur" 4 r16
F "Mitrofan Nedelin marshal" 3 nedelin
F "Baikonur cosmodrome launch pad 1960s" 4 baikonur
F "Space Shuttle Challenger crew STS-51-L" 6 challengercrew
F "Challenger disaster explosion plume" 6 challengerexp
F "Challenger SRB O-ring joint smoke" 4 oring
F "Space Shuttle Columbia crew STS-107" 6 columbiacrew
F "Columbia disaster debris reentry" 6 columbiadebris
F "Space Shuttle foam strike external tank" 4 foamstrike
F "Alexei Leonov spacewalk Voskhod 2" 4 leonov
F "Gemini 8 Armstrong Scott spacecraft" 4 gemini8
F "Apollo 13 damaged service module mailbox" 5 apollo13
F "Luca Parmitano spacesuit helmet water EVA" 4 parmitano
F "Earth from space International Space Station night" 5 earthnight
F "astronaut spacewalk EVA void black space" 5 evavoid
F "Yuri Gagarin funeral Red Square" 3 gagarinfuneral
F "mission control Houston Apollo flight controllers" 5 missioncontrol
echo "DONE fetch"
