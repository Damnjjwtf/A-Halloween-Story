"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const VIEWS = [
  { href: "/workbook", label: "Workbook" },
  { href: "/compare", label: "Compare" },
  { href: "/library", label: "Library" },
  { href: "/lab", label: "Lab" },
  { href: "/export", label: "Export" },
] as const;

export function LabNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Views" className="-mb-px flex gap-0 overflow-x-auto">
      {VIEWS.map((v) => {
        const active =
          pathname === v.href || pathname.startsWith(v.href + "/");
        return (
          <Link
            key={v.href}
            href={v.href}
            aria-current={active ? "page" : undefined}
            className={`border border-b-0 px-3 py-2 font-mono text-xs tracking-wide whitespace-nowrap transition-colors duration-150 sm:px-4 ${
              active
                ? "border-ink bg-ink text-paper"
                : "border-transparent text-ink-soft hover:text-ink"
            }`}
          >
            {v.label}
          </Link>
        );
      })}
    </nav>
  );
}
