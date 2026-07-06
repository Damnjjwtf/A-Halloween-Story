import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { buildExport } from "@/lib/export";
import { ExportTools } from "@/components/export-tools";

export default async function ExportPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/gate");

  const markdown = await buildExport();

  return (
    <div>
      <header className="mb-6">
        <p className="mb-1 font-mono text-xs tracking-widest text-ink-soft uppercase">
          Export — full session dump
        </p>
        <h1 className="font-display text-3xl font-semibold tracking-tight">
          Session export
        </h1>
        <p className="mt-2 text-sm text-ink-soft">
          Answers, starred ingredients, every run with votes and notes. Paste
          it back into Claude for deeper development.
        </p>
      </header>

      <div className="mb-4">
        <ExportTools markdown={markdown} />
      </div>

      <pre className="overflow-x-auto border border-hairline bg-card p-4 font-mono text-xs leading-relaxed whitespace-pre-wrap">
        {markdown}
      </pre>
    </div>
  );
}
