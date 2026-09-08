#!/bin/bash
SRC="scratchpad/bio2/src/eclips_master.mov"
OUT="public/shorts/biosphere2/video"
# true image area inside the NTSC frame (cropdetect): 704x362 @ y=62
mk () {
  ffmpeg -v error -y -ss "$1" -t "$2" -i "$SRC" -filter_complex "
   [0:v]yadif=1,crop=704:362:0:62,hqdn3d=2:1:3:3,
        eq=saturation=0.9:contrast=1.08:brightness=0.02,setsar=1[c];
   [c]split=2[bg][fg];
   [bg]scale=3840:2160:force_original_aspect_ratio=increase,crop=3840:2160,
       gblur=sigma=48,eq=brightness=-0.13:saturation=0.45[b];
   [fg]scale=1900:-2:flags=lanczos,
       pad=iw+10:ih+10:5:5:color=0x24242400,
       pad=iw+2:ih+2:1:1:color=0x5a5a5aff[f];
   [b][f]overlay=(W-w)/2:(H-h)/2-40,
     vignette=PI/4.6,
     noise=alls=6:allf=t+u,
     format=yuv420p[v]" -map "[v]" -r 30 -c:v libx264 -preset medium -crf 19 -an "$OUT/$3"
  echo "  -> $3"
}
echo "rebuilding with true crop (704x362 -> 1900px window):"
mk 77.0  3.0  b2_wide_1.mp4
mk 107.2 2.8  b2_glass_1.mp4
mk 68.2  2.6  b2_interior_1.mp4
mk 83.2  2.8  b2_glass_2.mp4
mk 86.2  2.6  b2_exterior_1.mp4
mk 71.2  2.6  b2_glass_3.mp4
mk 95.2  2.6  b2_wide_2.mp4
mk 137.2 2.6  b2_present_1.mp4
mk 140.2 2.6  b2_dawn_1.mp4
mk 116.2 2.6  b2_exterior_2.mp4
