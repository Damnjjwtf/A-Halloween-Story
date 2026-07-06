import "dotenv/config";
import { defineConfig } from "prisma/config";

// DATABASE_URL is only needed for migrate/introspection commands.
// `prisma generate` runs during the Vercel build, possibly before a
// database exists — don't hard-fail the whole build on a missing URL.
const url = process.env.DATABASE_URL;

export default defineConfig({
  schema: "prisma/schema.prisma",
  ...(url ? { datasource: { url } } : {}),
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
});
