#!/bin/bash
SRC="scratchpad/bio2/src/eclips_master.mov"
OUT="public/shorts/biosphere2/video"
# boomerang (fwd+reverse) + 0.8x speed => seamless loop, no visible repeat
mk () { # start dur outfile
  ffmpeg -v error -y -ss "$1" -t "$2" -i "$SRC" -filter_complex "
   [0:v]yadif=1,crop=704:362:0:62,hqdn3d=2:1:3:3,
        eq=saturation=0.9:contrast=1.08:brightness=0.02,setpts=1.25*PTS,setsar=1,fps=30[s];
   [s]split=2[a][r];[r]reverse[rv];[a][rv]concat=n=2:v=1:a=0[l];
   [l]split=2[bg][fg];
   [bg]scale=3840:2160:force_original_aspect_ratio=increase,crop=3840:2160,
       gblur=sigma=48,eq=brightness=-0.13:saturation=0.45[b];
   [fg]scale=1900:-2:flags=lanczos,
       pad=iw+10:ih+10:5:5:color=0x24242400,
       pad=iw+2:ih+2:1:1:color=0x5a5a5aff[f];
   [b][f]overlay=(W-w)/2:(H-h)/2-40,vignette=PI/4.6,
     noise=alls=6:allf=t+u,format=yuv420p[v]" -map "[v]" -r 30 -c:v libx264 -preset medium -crf 19 -an "$OUT/$3"
  printf "  %-22s %ss\n" "$3" "$(ffprobe -v error -show_entries format=duration -of csv=p=0 $OUT/$3 | cut -c1-4)"
}
echo "rebuilding on true shot boundaries:"
mk 72.3  6.7  b2_wide_1.mp4       # exterior space frame + ziggurat  (72.1-79.2)
mk 88.5  7.7  b2_wide_2.mp4       # desert biome interior            (88.3-96.4)
mk 112.1 10.9 b2_exterior_2.mp4   # long interior run                (111.9-123.2)
mk 138.5 6.0  b2_present_1.mp4    # structure + vegetation           (138.3-144.7)
mk 82.2  4.6  b2_glass_2.mp4      # interior lush under glass        (82.0-87.0)
mk 107.3 4.4  b2_glass_1.mp4      # interior glass over water        (107.1-111.9)
mk 102.4 2.6  b2_glass_3.mp4      # interior                         (102.2-105.1)
mk 97.3  2.5  b2_interior_2.mp4   # interior                         (97.1-100.0)
mk 68.5  1.9  b2_interior_1.mp4   # walkway under the frame          (68.3-70.6)
mk 83.0  3.8  b2_exterior_1.mp4   # interior vegetation              (82.0-87.0)
