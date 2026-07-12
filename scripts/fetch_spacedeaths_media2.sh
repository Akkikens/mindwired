#!/bin/zsh
# Round 2 — gap-filling queries (reworded; lower min-width for rare subjects).
set -u
PY=.venv-lipsync/bin/python
OUT=public/shorts/spacedeaths/images
F() { $PY scripts/fetch_media.py "$1" --out $OUT --count "$2" --prefix "$3" --source commons --min-width 600; }

F "Mitrofan Nedelin" 3 nedelin
F "Baikonur Cosmodrome Gagarin's Start" 4 baikonur
F "funeral Yuri Gagarin 1968" 3 gagarinfuneral
F "astronaut extravehicular activity Earth orbit" 5 evavoid
F "Apollo 13 service module damage photographed" 4 apollo13
F "Gemini 8 Agena target vehicle docking" 4 gemini8
F "Alexei Leonov" 4 leonov
F "Luca Parmitano EVA International Space Station" 4 parmitano
F "STS-107 Columbia launch" 4 foamstrike
F "Space Shuttle external tank separation" 3 foamstrike2
F "Vladimir Komarov memorial" 3 soyuz1crash
F "Columbia accident debris reconstruction hangar" 4 columbiadebris
F "Earth at night from the International Space Station" 4 earthnight
F "Space Shuttle Solid Rocket Booster recovery segments" 3 oring
F "Challenger STS-51-L launch smoke" 4 challengerexp
F "Soyuz 11 stamp Dobrovolsky Volkov Patsayev" 4 soyuz11crew
F "Soviet Air Force pilots 1960 group" 3 vostoktrain
F "R-16 intercontinental ballistic missile" 3 r16
F "Plesetsk Cosmodrome rocket launch" 4 plesetsk
F "Long March 3B rocket launch Xichang" 4 longmarch
F "Alcantara Launch Center VLS-1 rocket" 4 alcantara
F "shortwave radio receiver equipment 1960s station" 4 radio
F "Laika space dog Sputnik" 4 laika
F "Yuri Gagarin portrait 1961" 4 gagarin
F "MiG-15UTI trainer aircraft" 3 mig15
F "Valentin Bondarenko portrait" 2 bondarenko
echo "DONE fetch2"
