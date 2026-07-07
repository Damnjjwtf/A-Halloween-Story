-- Seed the two seats. Idempotent; replaces the manual `prisma db seed` step.
INSERT INTO "User" ("id", "name")
VALUES ('jj', 'JJ'), ('stefan', 'Stefan')
ON CONFLICT ("id") DO NOTHING;
