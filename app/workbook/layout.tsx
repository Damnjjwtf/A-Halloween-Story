import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";

export default async function WorkbookLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/gate");

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-3xl flex-col px-4 sm:px-6">
      <header className="flex items-baseline justify-between border-b border-hairline py-4">
        <Link
          href="/workbook"
          className="font-display text-lg font-semibold tracking-tight"
        >
          Structure Lab
        </Link>
        <p className="font-mono text-xs tracking-widest text-ink-soft uppercase">
          Operator: {user.name}
        </p>
      </header>
      <main className="flex-1 py-8">{children}</main>
      <footer className="flex items-baseline justify-between border-t border-hairline py-4">
        <p className="font-mono text-[11px] tracking-widest text-ink-faint uppercase">
          A Halloween Story — structural invention workbook
        </p>
        <p className="font-mono text-[11px] tracking-widest text-ink-faint uppercase">
          v0.1 — M1
        </p>
      </footer>
    </div>
  );
}
