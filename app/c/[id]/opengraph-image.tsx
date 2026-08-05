import { db } from "@/lib/db";
import { ogCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Structure Lab — candidate structure";

// Rendered per request so a freshly-shared candidate previews correctly.
export const dynamic = "force-dynamic";

export default async function Image({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const c = await db.candidate.findUnique({
    where: { id },
    select: { name: true, engineSummary: true },
  });

  if (!c) {
    return ogCard({
      kicker: "Candidate structure",
      title: "Structure Lab",
    });
  }

  const subtitle =
    c.engineSummary.length > 150
      ? `${c.engineSummary.slice(0, 147)}…`
      : c.engineSummary;

  return ogCard({
    kicker: "Candidate structure",
    title: c.name,
    subtitle,
    accent: true,
  });
}
