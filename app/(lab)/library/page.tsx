import Link from "next/link";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { FAMILY_LABEL, SYSTEMS, type Family } from "@/content/library";
import { getCurrentUser, OTHER_USER, USERS } from "@/lib/session";
import { StarButton } from "@/components/star-button";

const FAMILIES = Object.keys(FAMILY_LABEL) as Family[];

export default async function LibraryPage({
  searchParams,
}: {
  searchParams: Promise<{ family?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/gate");

  const { family } = await searchParams;
  const filter = FAMILIES.includes(family as Family)
    ? (family as Family)
    : null;

  const stars = await db.star.findMany();
  const mine = new Set(
    stars.filter((s) => s.userId === user.id).map((s) => s.systemId),
  );
  const partnerId = OTHER_USER[user.id];
  const partners = new Set(
    stars.filter((s) => s.userId === partnerId).map((s) => s.systemId),
  );

  const shown = filter
    ? SYSTEMS.filter((s) => s.family === filter)
    : SYSTEMS;

  return (
    <div>
      <header className="mb-6">
        <p className="mb-1 font-mono text-xs tracking-widest text-ink-soft uppercase">
          Structure Library — 30 catalogued systems
        </p>
        <h1 className="font-display text-3xl font-semibold tracking-tight">
          Specimen board
        </h1>
        <p className="mt-2 text-sm text-ink-soft">
          Star 4–8 systems as candidate ingredients. Starred systems feed
          the Lab.{" "}
          <span className="font-mono text-xs">
            Yours: {mine.size} · {USERS[partnerId].name}: {partners.size}
          </span>
        </p>
      </header>

      <nav
        aria-label="Filter by family"
        className="mb-6 flex flex-wrap gap-1.5"
      >
        <Link
          href="/library"
          className={`border px-2.5 py-1 font-mono text-[11px] tracking-wide uppercase transition-colors duration-150 ${
            filter === null
              ? "border-ink bg-ink text-paper"
              : "border-hairline text-ink-soft hover:border-ink hover:text-ink"
          }`}
        >
          All
        </Link>
        {FAMILIES.map((f) => (
          <Link
            key={f}
            href={`/library?family=${f}`}
            className={`border px-2.5 py-1 font-mono text-[11px] tracking-wide uppercase transition-colors duration-150 ${
              filter === f
                ? "border-ink bg-ink text-paper"
                : "border-hairline text-ink-soft hover:border-ink hover:text-ink"
            }`}
          >
            {FAMILY_LABEL[f]}
          </Link>
        ))}
      </nav>

      <ul className="grid gap-3 sm:grid-cols-2">
        {shown.map((sys) => (
          <li
            key={sys.id}
            className="flex flex-col border border-hairline bg-card"
          >
            <div className="flex items-start justify-between gap-3 border-b border-hairline px-4 py-2.5">
              <p className="font-mono text-[11px] tracking-widest text-ink-soft uppercase">
                No. {String(sys.id).padStart(2, "0")} —{" "}
                {FAMILY_LABEL[sys.family]}
              </p>
              {partners.has(sys.id) ? (
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
                {sys.name}
              </h2>
              <dl className="flex flex-col gap-2 font-mono text-xs leading-relaxed">
                <div>
                  <dt className="tracking-widest text-ink-faint uppercase">
                    Mechanism
                  </dt>
                  <dd>{sys.mechanism}</dd>
                </div>
                <div>
                  <dt className="tracking-widest text-ink-faint uppercase">
                    Engineers
                  </dt>
                  <dd>{sys.engineers}</dd>
                </div>
                <div>
                  <dt className="tracking-widest text-ink-faint uppercase">
                    Example
                  </dt>
                  <dd>{sys.example}</dd>
                </div>
                <div>
                  <dt className="tracking-widest text-ink-faint uppercase">
                    Fails when
                  </dt>
                  <dd className="text-ink-soft">{sys.failsWhen}</dd>
                </div>
              </dl>
            </div>
            <div className="border-t border-hairline px-4 py-2.5">
              <StarButton systemId={sys.id} starred={mine.has(sys.id)} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
