// Run `prisma migrate deploy` during the build when a database is
// configured (Vercel). Skips quietly when DATABASE_URL is absent so
// local/CI builds without a database still work.
import { execSync } from "node:child_process";

if (!process.env.DATABASE_URL) {
  console.log("migrate-if-db: DATABASE_URL not set, skipping migrations");
  process.exit(0);
}

execSync("npx prisma migrate deploy", { stdio: "inherit" });
