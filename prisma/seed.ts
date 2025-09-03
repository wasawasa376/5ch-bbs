import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const boards = [
    { slug: "news", name: "ニュース", description: "時事・速報" },
    { slug: "tech", name: "技術", description: "開発・ガジェット" },
    { slug: "life", name: "生活", description: "雑談・相談" },
  ];
  for (const [i, b] of boards.entries()) {
    await prisma.board.upsert({
      where: { slug: b.slug },
      create: { ...b, order: i },
      update: {},
    });
  }
  console.log("Seed done");
}

main().finally(async () => prisma.$disconnect());
