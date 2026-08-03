import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";

/** "Supporter Spotlight" — the live Super Chat/Super Sticker highlight card.
 *
 *  Design-only reference asset: this component renders the STILL "chrome"
 *  (border, glow, mindwired branding) that gets exported once as a
 *  transparent PNG and reused for every supporter shoutout. The actual
 *  live text (name/amount/message) is drawn on TOP of that PNG by ffmpeg's
 *  own `drawtext` filters in the restream pipeline, not re-rendered through
 *  Remotion per event — see docs/planning/HOSTILEPLANETS-HANDOFF.md-style
 *  handoff notes for the watcher-script wiring. The exact pixel positions
 *  below (nameY/amountY/messageY) are the coordinates the ffmpeg drawtext
 *  calls must target to land inside this frame.
 *
 *  This preview render includes sample text so the design can actually be
 *  looked at; a second "frame-only" pass (props.showSample=false) exports
 *  the blank chrome for production use. */

const ACCENT = "#4DD8FF";
const DISPLAY_FONT = "'Space Grotesk', sans-serif";
const BODY_FONT = "'Inter', sans-serif";

type Props = {
  showSample?: boolean;
  name?: string;
  amount?: string;
  message?: string;
  kind?: "superchat" | "gift";
};

// Card geometry — kept as named constants so the ffmpeg drawtext y-coordinates
// documented in the watcher script match this exactly.
const CARD = { x: 1920 - 620 - 64, y: 1080 - 340 - 64, w: 620, h: 340 };
export const NAME_Y = CARD.y + 118;
export const AMOUNT_Y = CARD.y + 176;
export const MESSAGE_Y = CARD.y + 240;
export const TEXT_X = CARD.x + 40;

export const SupporterSpotlight: React.FC<Props> = ({
  showSample = true,
  name = "Jordan",
  amount = "$25.00",
  message = "Thank you for the calm company tonight.",
  kind = "superchat",
}) => {
  return (
    <AbsoluteFill style={{ background: "transparent" }}>
      {/* soft ambient glow behind the card, matching the DossierScene/
          wordmark bloom treatment used elsewhere on this channel */}
      <div
        style={{
          position: "absolute",
          left: CARD.x - 60,
          top: CARD.y - 60,
          width: CARD.w + 120,
          height: CARD.h + 120,
          background: `radial-gradient(circle, ${ACCENT}33 0%, transparent 68%)`,
        }}
      />
      {/* the card itself */}
      <div
        style={{
          position: "absolute",
          left: CARD.x,
          top: CARD.y,
          width: CARD.w,
          height: CARD.h,
          borderRadius: 22,
          background: "rgba(5,7,12,0.86)",
          border: `2px solid ${ACCENT}`,
          boxShadow: `0 0 46px ${ACCENT}66, 0 18px 50px rgba(0,0,0,0.6)`,
          padding: "34px 40px",
        }}
      >
        {/* kicker */}
        <div
          style={{
            fontFamily: DISPLAY_FONT,
            fontWeight: 700,
            fontSize: 24,
            letterSpacing: 3,
            color: ACCENT,
            textTransform: "uppercase",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <span style={{
            width: 10, height: 10, borderRadius: 999, background: ACCENT,
            boxShadow: `0 0 12px ${ACCENT}`,
          }} />
          {kind === "gift" ? "Gift received" : "Super Chat"}
        </div>

        {showSample && (
          <>
            {/* name */}
            <div
              style={{
                position: "absolute", left: 40, top: NAME_Y - CARD.y,
                fontFamily: DISPLAY_FONT, fontWeight: 700, fontSize: 46,
                color: "#fff", textShadow: "0 3px 18px rgba(0,0,0,0.7)",
              }}
            >
              {name}
            </div>
            {/* amount */}
            <div
              style={{
                position: "absolute", left: 40, top: AMOUNT_Y - CARD.y,
                fontFamily: DISPLAY_FONT, fontWeight: 700, fontSize: 32,
                color: ACCENT,
              }}
            >
              {amount}
            </div>
            {/* message */}
            <div
              style={{
                position: "absolute", left: 40, top: MESSAGE_Y - CARD.y, width: CARD.w - 80,
                fontFamily: BODY_FONT, fontWeight: 500, fontSize: 24, lineHeight: 1.35,
                color: "rgba(255,255,255,0.82)",
              }}
            >
              "{message}"
            </div>
          </>
        )}

        {/* mindwired watermark, bottom-right of the card */}
        <div
          style={{
            position: "absolute", right: 28, bottom: 20,
            fontFamily: DISPLAY_FONT, fontWeight: 700, fontSize: 18,
            letterSpacing: 1, color: "rgba(255,255,255,0.45)",
          }}
        >
          mindwired
        </div>
      </div>
    </AbsoluteFill>
  );
};
