import Link from "next/link";
import { redirect } from "next/navigation";
import { SECTIONS } from "@/content/workbook";
import { computeProgress } from "@/lib/progress";
import { getCurrentUser, OTHER_USER, USERS } from "@/lib/session";
import { ProgressTag } from "@/components/progress-tag";

export default async function WorkbookOverview() {
  const user = await getCurrentUser();
  if (!user) redirect("/gate");

  const partnerId = OTHER_USER[user.id];
  const [mine, partner] = await Promise.all([
    computeProgress(user.id),
    computeProgress(partnerId),
  ]);

  return (
    <div>
      <header className="mb-8">
        <p className="mb-1 font-mono text-xs tracking-widest text-ink-soft uppercase">
          Workbook — answer independently, compare later
        </p>
        <h1 className="font-display text-3xl font-semibold tracking-tight">
          Question bank
        </h1>
      </header>

      <ul className="grid gap-3 sm:grid-cols-2">
        {SECTIONS.map((section) => {
          const p = mine.get(section.id);
          const pp = partner.get(section.id);

          if (section.deferred) {
            return (
              <li
                key={section.id}
                className="border border-dashed border-hairline p-4 opacity-60"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="font-mono text-xs tracking-widest text-ink-soft uppercase">
                    Sec. {section.index}
                  </p>
                  <span className="border border-signal px-1.5 py-0.5 font-mono text-[10px] tracking-widest text-signal uppercase">
                    M2
                  </span>
                </div>
                <h2 className="mt-1 font-display text-xl font-medium">
                  {section.title}
                </h2>
                <p className="mt-2 text-xs leading-relaxed text-ink-soft">
                  {section.deferredNote}
                </p>
              </li>
            );
          }

          return (
            <li key={section.id}>
              <Link
                href={`/workbook/${section.id}`}
                className="relative block overflow-hidden border border-hairline bg-card p-4 transition-colors duration-150 hover:border-ink"
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute -right-2 -bottom-5 font-mono text-[5rem] leading-none font-medium text-ink/[0.05] select-none"
                >
                  {section.index}
                </span>
                <div className="flex items-start justify-between gap-2">
                  <p className="font-mono text-xs tracking-widest text-ink-soft uppercase">
                    Sec. {section.index}
                  </p>
                  {p ? (
                    <ProgressTag answered={p.answered} total={p.total} />
                  ) : null}
                </div>
                <h2 className="mt-1 font-display text-xl font-medium">
                  {section.title}
                </h2>
                {pp && pp.answered > 0 ? (
                  <p className="mt-2 font-mono text-[11px] tracking-wide text-ink-faint">
                    {USERS[partnerId].name}: {pp.answered}/{pp.total}
                  </p>
                ) : null}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
