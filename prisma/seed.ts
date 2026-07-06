import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const db = new PrismaClient({ adapter });

async function main() {
  await db.user.upsert({
    where: { id: "jj" },
    update: {},
    create: { id: "jj", name: "JJ" },
  });
  await db.user.upsert({
    where: { id: "stefan" },
    update: {},
    create: { id: "stefan", name: "Stefan" },
  });
  console.log("Seeded users: jj, stefan");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
