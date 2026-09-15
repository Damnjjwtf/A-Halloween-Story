import Link from "next/link";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { FAMILY_LABEL, SYSTEMS, type Family } from "@/content/library";
import { TONE, TONE_TYPE_LABEL, type ToneType } from "@/content/tone";
import { getCurrentUser, OTHER_USER, USERS } from "@/lib/session";
import { StarButton } from "@/components/star-button";

const FAMILIES = Object.keys(FAMILY_LABEL) as Family[];
const TONE_TYPES = Object.keys(TONE_TYPE_LABEL) as ToneType[];

type Card = {
  id: number;
  index: string; // "No. 01" | "T1"
  category: string; // family or tone-type label
  name: string;
  mechanism: string;
  engineers: string;
  example: string;
  failsWhen: string;
  swatch?: string;
};

export default async function LibraryPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; family?: string; type?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/gate");

  const { tab, family, type } = await searchParams;
  const onTone = tab === "tone";

  const stars = await db.star.findMany();
  const mine = new Set(
    stars.filter((s) => s.userId === user.id).map((s) => s.systemId),
  );
  const partnerId = OTHER_USER[user.id];
  const partners = new Set(
    stars.filter((s) => s.userId === partnerId).map((s) => s.systemId),
  );

  // Split star counts by kind for the header readout.
  const myStructure = [...mine].filter((id) => id < 100).length;
  const myTone = [...mine].filter((id) => id >= 100).length;

  const familyFilter = FAMILIES.includes(family as Family)
    ? (family as Family)
    : null;
  const typeFilter = TONE_TYPES.includes(type as ToneType)
    ? (type as ToneType)
    : null;

  const cards: Card[] = onTone
    ? TONE.filter((t) => (typeFilter ? t.type === typeFilter : true)).map(
        (t) => ({
          id: t.id,
          index: t.code,
          category: TONE_TYPE_LABEL[t.type],
          name: t.name,
          mechanism: t.mechanism,
          engineers: t.engineers,
          example: t.example,
          failsWhen: t.failsWhen,
          swatch: t.swatch,
        }),
      )
    : SYSTEMS.filter((s) =>
        familyFilter ? s.family === familyFilter : true,
      ).map((s) => ({
        id: s.id,
        index: `No. ${String(s.id).padStart(2, "0")}`,
        category: FAMILY_LABEL[s.family],
        name: s.name,
        mechanism: s.mechanism,
        engineers: s.engineers,
        example: s.example,
        failsWhen: s.failsWhen,
      }));

  return (
    <div>
      <header className="mb-5">
        <p className="mb-1 font-mono text-xs tracking-widest text-ink-soft uppercase">
          {onTone
            ? "Tone Library — 20 catalogued systems"
            : "Structure Library — 34 catalogued systems"}
        </p>
        <h1 className="font-display text-3xl font-semibold tracking-tight">
          Specimen board
        </h1>
        <p className="mt-2 text-sm text-ink-soft">
          {onTone
            ? "Star 3–5 tone cards. Registers are palettes; management systems are engines. Both feed the Lab."
            : "Star 4–8 systems as candidate ingredients. Starred systems feed the Lab."}{" "}
          <span className="font-mono text-xs">
            Yours: {onTone ? myTone : myStructure}
          </span>
        </p>
      </header>

      {/* Structure / Tone tabs */}
      <nav aria-label="Library" className="-mb-px flex gap-0">
        <Link
          href="/library"
          aria-current={!onTone ? "page" : undefined}
          className={`border border-b-0 px-4 py-2 font-mono text-xs tracking-wide transition-colors duration-150 ${
            !onTone
              ? "border-ink bg-ink text-paper"
              : "border-transparent text-ink-soft hover:text-ink"
          }`}
        >
          Structure
        </Link>
        <Link
          href="/library?tab=tone"
          aria-current={onTone ? "page" : undefined}
          className={`border border-b-0 px-4 py-2 font-mono text-xs tracking-wide transition-colors duration-150 ${
            onTone
              ? "border-ink bg-ink text-paper"
              : "border-transparent text-ink-soft hover:text-ink"
          }`}
        >
          Tone
        </Link>
      </nav>

      <div className="border-b border-hairline" />

      <nav
        aria-label="Filter"
        className="mt-5 mb-6 flex flex-wrap gap-1.5"
      >
        {onTone ? (
          <>
            <FilterChip href="/library?tab=tone" active={typeFilter === null}>
              All
            </FilterChip>
            {TONE_TYPES.map((t) => (
              <FilterChip
                key={t}
                href={`/library?tab=tone&type=${t}`}
                active={typeFilter === t}
              >
                {TONE_TYPE_LABEL[t]}
              </FilterChip>
            ))}
          </>
        ) : (
          <>
            <FilterChip href="/library" active={familyFilter === null}>
              All
            </FilterChip>
            {FAMILIES.map((f) => (
              <FilterChip
                key={f}
                href={`/library?family=${f}`}
                active={familyFilter === f}
              >
                {FAMILY_LABEL[f]}
              </FilterChip>
            ))}
          </>
        )}
      </nav>

      <ul className="grid gap-3 sm:grid-cols-2">
        {cards.map((card) => (
          <li
            key={card.id}
            className="flex flex-col border border-hairline bg-card"
          >
            <div className="flex items-start justify-between gap-3 border-b border-hairline px-4 py-2.5">
              <p className="flex items-center gap-2 font-mono text-[11px] tracking-widest text-ink-soft uppercase">
                {card.swatch ? (
                  <span
                    aria-hidden
                    className="inline-block h-3 w-3 border border-hairline"
                    style={{ backgroundColor: card.swatch }}
                  />
                ) : null}
                {card.index} — {card.category}
              </p>
              {partners.has(card.id) ? (
                <span
                  className="font-mono text-[10px] tracking-widest text-ink-faint uppercase"
                  title={`Starred by ${USERS[partnerId].name}`}
                >
                  ★ {USERS[partnerId].name}
                </span>
              ) : null}
            </div>
            <div className="flex flex-1 flex-col gap-2.5 px-4 py-3">
              <h2 className="font-display text-lg leading-snug font-medium">
                {card.name}
              </h2>
              <dl className="flex flex-col gap-2 font-mono text-xs leading-relaxed">
                <div>
                  <dt className="tracking-widest text-ink-faint uppercase">
                    Mechanism
                  </dt>
                  <dd>{card.mechanism}</dd>
                </div>
                <div>
                  <dt className="tracking-widest text-ink-faint uppercase">
                    Engineers
                  </dt>
                  <dd>{card.engineers}</dd>
                </div>
                <div>
                  <dt className="tracking-widest text-ink-faint uppercase">
                    Example
                  </dt>
                  <dd>{card.example}</dd>
                </div>
                <div>
                  <dt className="tracking-widest text-ink-faint uppercase">
                    Fails when
                  </dt>
                  <dd className="text-ink-soft">{card.failsWhen}</dd>
                </div>
              </dl>
            </div>
            <div className="border-t border-hairline px-4 py-2.5">
              <StarButton systemId={card.id} starred={mine.has(card.id)} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function FilterChip({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`border px-2.5 py-1 font-mono text-[11px] tracking-wide uppercase transition-colors duration-150 ${
        active
          ? "border-ink bg-ink text-paper"
          : "border-hairline text-ink-soft hover:border-ink hover:text-ink"
      }`}
    >
      {children}
    </Link>
  );
}
