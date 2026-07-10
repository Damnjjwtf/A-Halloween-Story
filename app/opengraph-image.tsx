import { ogCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Structure Lab — a structural invention workbook";

export default function Image() {
  return ogCard({
    kicker: "Structural invention workbook",
    title: "Structure Lab",
    subtitle: "A two-person engine for inventing story structure, not collecting it.",
  });
}
