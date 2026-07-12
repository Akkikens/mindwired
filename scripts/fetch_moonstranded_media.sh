#!/bin/zsh
# Archival pull for moonstranded (Apollo 11 stranding contingency doc).
set -u
PY=.venv-lipsync/bin/python
OUT=public/shorts/moonstranded/images
F() { $PY scripts/fetch_media.py "$1" --out $OUT --count "$2" --prefix "$3" --source commons --min-width 800; }

F "Apollo 11 crew portrait Armstrong Aldrin Collins" 6 crew
F "Apollo 11 Saturn V launch" 6 saturnv
F "Apollo 11 lunar module Eagle" 6 eagle
F "Buzz Aldrin on the Moon Apollo 11" 6 aldrinmoon
F "Neil Armstrong Apollo 11" 5 armstrong
F "Michael Collins astronaut Apollo 11" 5 collins
F "Apollo 11 command module Columbia" 5 columbia
F "Richard Nixon 1969 White House" 5 nixon
F "William Safire" 3 safire
F "In Event of Moon Disaster memo" 3 memo
F "Apollo 11 mission control celebration Houston" 6 missionctl
F "Apollo lunar module ascent stage rendezvous" 5 ascent
F "Apollo 11 Aldrin ladder descent Moon surface" 5 surface
F "Apollo 11 flag salute Moon" 4 flag
F "Moon surface Sea of Tranquility Apollo" 4 tranquility
F "Apollo lunar module cockpit interior panel" 4 lmcockpit
F "Apollo 11 splashdown recovery Hornet" 5 splashdown
F "Apollo 11 quarantine facility Nixon" 4 quarantine
F "Apollo 8 Earthrise" 3 earthrise
F "Apollo 11 launch spectators crowd" 4 crowd
F "Janet Armstrong Joan Aldrin families" 3 families
F "Apollo guidance computer DSKY" 4 agc
F "felt tip pen Duro marker" 2 pen
F "Apollo 13 mission control" 3 apollo13ctl
F "full moon photograph black sky" 4 moonfull
