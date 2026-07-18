# spacesounds — evidence audio sources (fetched 2026-07-18)

ALL files are real archival audio. NOTHING in this directory is synthesized.
Honesty labels: ACTUAL RECORDING = microphone/received transmission;
DATA AUDIO = spacecraft radio/plasma-wave data played as sound;
SONIFICATION = non-audio data converted to sound.

| file | class | mission/year | source | license |
|---|---|---|---|---|
| saturn_radio_1.mp3, saturn_radio_2.mp3 | DATA AUDIO | Cassini SKR 2003-04 | nasa.gov/wp-content/uploads/2015/01/584791main_spookysaturn.mp3, 584795main_saturn_radio_waves.mp3 | NASA PD |
| saturn_skr_uiowa.wav | DATA AUDIO | Cassini SKR 2003 | space.physics.uiowa.edu/space-audio/cassini/SKR1/SKR-03-324.wav | CC BY 4.0 (Univ. of Iowa) |
| earth_chorus.mp3 | DATA AUDIO | Van Allen Probes EMFISIS 2012 | nasa.gov .../693857main_emfisis_chorus_1.mp3 | NASA PD |
| perseus_blackhole.mp4/.mp3 | SONIFICATION (real pressure waves +57 octaves) | Chandra 2022 | chandra.si.edu/sound/sounds/perseus_sonification.mp4 | credit NASA/CXC/SAO/K.Arcand; SYSTEM Sounds |
| huygens_titan_descent.mp3 | RECONSTRUCTION from HASI descent data | Huygens 2005 | esamultimedia.esa.int/images/huygens_alien_winds_descent.mp3 | ESA (CC BY-SA 3.0 IGO — credit ESA/HASI) |
| huygens_titan_radar.mp3 | SONIFICATION (radar echoes) | Huygens 2005 | esamultimedia.esa.int/images/huygens_alien_winds_descent_radar.mp3 | ESA (CC BY-SA 3.0 IGO) |
| jupiter_lightning.mp3 | DATA AUDIO (whistlers) | Voyager 1979 | nasa.gov .../603921main_voyager_jupiter_lightning.mp3 | NASA PD |
| enceladus_hiss.mp3 | DATA AUDIO | Cassini | nasa.gov .../584796main_enceladus.mp3 | NASA PD |
| sputnik_beep.mp3 | ACTUAL RECORDING (received transmission) | Sputnik 1957 | nasa.gov .../578626main_sputnik-beep.mp3 | PD |
| kepler_star_1.mp3, kepler_star_2.mp3 | SONIFICATION (starquake photometry) | Kepler | nasa.gov .../578358main_..., 578359main_... | NASA PD |

## Batch 2 (fetched 2026-07-18, verified with ffprobe — all valid audio, >3s)

| file | class | mission/year | source URL | license |
|---|---|---|---|---|
| voyager_interstellar.mp3 (24.6s) | DATA AUDIO (PWS plasma oscillations) — extracted from U-Iowa's own video v1pws_interstellar_epo.mp4 | Voyager 1, Oct 2012–May 2013 | https://space.physics.uiowa.edu/plasma-wave/voyager/v1pws_interstellar_2014.html (v1pws_interstellar_epo.mp4) | CC BY (Univ. of Iowa space-audio) |
| voyager_heliopause.wav (72.1s) | DATA AUDIO (heliospheric 2–3 kHz radio emissions) | Voyager PWS, 1992–94 event | https://space-audio.org/vgr-helio.html (vger8204-darker-3.wav) | CC BY (Univ. of Iowa space-audio) |
| juno_bowshock.mp3 (16.5s) | DATA AUDIO (Waves instrument, Jupiter bow shock crossing) | Juno, 2016-06-24 (DOY 176) | https://space.physics.uiowa.edu/plasma-wave/juno/audio/201606/jno-bshock-16-176-0700-0900-blk.html (jno-bshock-16-176-0700-0900-blk.mp3) | CC BY (Univ. of Iowa space-audio) |
| ganymede_flyby.mp3 (49.0s) | DATA AUDIO (Waves electric-field data shifted to audio) — audio extracted from JPL PIA25030.mov | Juno PJ34 Ganymede flyby, 2021-06-07 | https://science.nasa.gov/photojournal/audio-of-junos-ganymede-flyby/ (assets.science.nasa.gov .../pia25030/PIA25030.mov) | NASA/JPL-Caltech/SwRI/Univ. of Iowa — PD |
| mars_perseverance_wind.mp3 (20.0s) | ACTUAL RECORDING — first audio from the Martian surface (SuperCam mic, Sol 1, includes wind) | Perseverance, Feb 2021 | https://science.nasa.gov/resource/first-audio-recording-of-sounds-on-mars/ (45825_SCAM_MIC_SOL001_RUN001.mp3) | NASA/JPL-Caltech/LANL/CNES/CNRS — PD |
| mars_laser_zaps.mp3 (11.1s) | ACTUAL RECORDING — SuperCam laser zapping rock, 30 shots audible | Perseverance, Sol 12 (Mar 2021) | https://science.nasa.gov/resource/first-acoustic-recording-of-laser-shots-on-mars/ (45831_SCAM_MIC_SOL012_RUN001.mp3) | NASA/JPL-Caltech/LANL/CNES/CNRS — PD |
| mars_rover_driving.mp3 (85.0s) | ACTUAL RECORDING — rover driving, 90s filtered highlights | Perseverance, Sol 16 (Mar 2021) | https://science.nasa.gov/resource/sounds-of-perseverance-mars-rover-driving-sol-16-90-second-highlights/ (45857_FILTERED_HIGHLIGHTS_-_Sol16RoverDriveHighlights.mp3) | NASA/JPL-Caltech — PD |
| mars_insight_marsquake.wav (40.0s) | SONIFICATION (SEIS seismic data processed into audible range) — first likely marsquake | InSight, Sol 128 (2019-04-06) | https://science.nasa.gov/resource/first-likely-marsquake-heard-by-nasas-insight/ (42692_insight_quake_sol128.wav) | NASA/JPL-Caltech/CNES/IPGP — PD |

SKIPPED — apollo10_space_music: no verifiable NASA-original digitization of the
Apollo 10 onboard tape (102h GET far-side "space music") found. The only archive.org
candidate, `apollo-10-space-music-cleaned`, is an anonymous 2023 community upload
with noise-reduction processing and no documented chain to the NASA/JSC tape —
fails the provenance rule, not downloaded.

EXCLUDED for license/authenticity: 67P "singing comet" (non-commercial license),
CMB/Cramer "Big Bang sound" (permission-based), Jodrell Bank pulsars (unclear),
Symphonies of the Planets album (Content-ID trap), Wow! signal (NO real audio
exists — stated on screen as an honesty beat).
