import { ImageResponse } from "next/og";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

// Specimen-board palette, mirrored from globals.css @theme tokens.
const PAPER = "#f1f0eb";
const INK = "#17181c";
const INK_SOFT = "#5c5d63";
const HAIRLINE = "#c9c8c1";
const SIGNAL = "#6321f4";

/**
 * Renders a specimen-sheet OG card: mono kicker, big title, optional
 * subtitle, hairline frame + corner registration marks. Font is the
 * ImageResponse default (no network fetch — reliable behind the proxy).
 */
export function ogCard({
  kicker,
  title,
  subtitle,
  accent = false,
}: {
  kicker: string;
  title: string;
  subtitle?: string;
  accent?: boolean;
}) {
  const mark = (style: React.CSSProperties) => ({
    position: "absolute" as const,
    width: 28,
    height: 28,
    borderColor: INK,
    ...style,
  });

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: PAPER,
          color: INK,
          padding: 64,
          position: "relative",
          fontFamily: "sans-serif",
        }}
      >
        {/* hairline frame */}
        <div
          style={{
            position: "absolute",
            inset: 40,
            border: `1px solid ${HAIRLINE}`,
          }}
        />
        {/* corner registration marks */}
        <div style={mark({ top: 26, left: 26, borderTop: `2px solid ${INK}`, borderLeft: `2px solid ${INK}` })} />
        <div style={mark({ top: 26, right: 26, borderTop: `2px solid ${INK}`, borderRight: `2px solid ${INK}` })} />
        <div style={mark({ bottom: 26, left: 26, borderBottom: `2px solid ${INK}`, borderLeft: `2px solid ${INK}` })} />
        <div style={mark({ bottom: 26, right: 26, borderBottom: `2px solid ${INK}`, borderRight: `2px solid ${INK}` })} />

        <div
          style={{
            display: "flex",
            fontSize: 24,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: accent ? SIGNAL : INK_SOFT,
            fontFamily: "monospace",
          }}
        >
          {kicker}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              display: "flex",
              fontSize: title.length > 34 ? 76 : 104,
              lineHeight: 1.02,
              fontWeight: 700,
              letterSpacing: -2,
              maxWidth: 980,
            }}
          >
            {title}
          </div>
          {subtitle ? (
            <div
              style={{
                display: "flex",
                fontSize: 30,
                lineHeight: 1.35,
                color: INK_SOFT,
                maxWidth: 940,
                fontFamily: "monospace",
              }}
            >
              {subtitle}
            </div>
          ) : null}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 20,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: INK_SOFT,
            fontFamily: "monospace",
          }}
        >
          <span>Structure Lab</span>
          <span>A Halloween Story</span>
        </div>
      </div>
    ),
    OG_SIZE,
  );
}
