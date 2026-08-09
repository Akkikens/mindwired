- `dsn_dish_1.mp4`, `dsn_dish_2.mp4`, `dsn_dish_3.mp4` — MANUAL PULL (2026-08-08). The
  automated fetcher's top hits for "Deep Space Network dish antenna tracking" and
  "Voyager 1977 JPL mission control" were both wrong (a laser-comms PR video and a
  Webb/Hubble nebula clip, respectively — neither is real DSN or Voyager footage).
  Found via direct Wikimedia Commons search instead: "Explore NASA's 70-Meter Deep
  Space Communications Dish (360° Video) (dsn-communicate-3)" — real NASA DSN B-roll
  (part of the "DSN Communicate" educational series), public domain (US federal
  government work) — https://commons.wikimedia.org/wiki/File:Explore_NASA%E2%80%99s_70-Meter_Deep_Space_Communications_Dish_(360%C2%B0_Video)_(dsn-communicate-3).webm
  Source is an equirectangular 360° video; reprojected to three flat, undistorted
  rectilinear clips (`ffmpeg -vf v360=e:flat:...`) at three different crops/angles of
  the SAME real dish — all three are genuinely real footage of the real object, just
  reframed like three camera setups at one real location. Clean windows (no on-screen
  "Fun Fact" graphic overlay from the source video) were manually verified frame-by-frame
  before selecting the extraction timestamps.
- `milkyway_timelapse_1.mp4` — "SOFIA Reveals New View of Milky Way's Center" — real
  credited astrophotography composite, on-screen credit "Risinger / Guisard / ESO /
  Hubble" — kept as generic real Milky Way b-roll (credit line stays visible in-frame).

Removed (confirmed wrong content by eyeball): `dsn_night_1.mp4` (a NASA laser-comms PR
video, not a dish), `vintage_jpl_1.mp4` (a Webb/Hubble Helix Nebula clip, not JPL 1977
footage), `palebluedot_presser_1.mp4` (generic stylized CGI Earth-from-space stock, not
the real 1990 NASA press conference) — scenes using these were rewritten to use real
stills (Pale Blue Dot photo, cleanroom photo) with a camera push instead, since those
beats fall outside the mandatory first-30-60s real-video window.
