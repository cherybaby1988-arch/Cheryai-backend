import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding baz done a...");

  // ---------- Akademi CHERY — kou demarraj ----------
  const courses = [
    {
      title: "Entwodiksyon nan Entèlijans Atifisyèl",
      description: "Aprann baz AI a — kisa l ye, kijan l fonksyone, ak ki jan itilize l chak jou.",
      level: "debutan",
      category: "teknoloji",
    },
    {
      title: "Kreye Kontni ak AI",
      description: "Aprann itilize CHERY AI pou ekri, kreye imaj, ak pwodwi kontni pwofesyonèl.",
      level: "entèmedyè",
      category: "kreyasyon",
    },
    {
      title: "Antreprenarya Dijital",
      description: "Kijan pou lanse ak devlope yon biznis dijital ak zouti AI modèn yo.",
      level: "entèmedyè",
      category: "biznis",
    },
  ];

  for (const course of courses) {
    const existing = await prisma.course.findFirst({ where: { title: course.title } });
    if (!existing) {
      await prisma.course.create({ data: course });
      console.log(`  ✓ Kou kreye: ${course.title}`);
    }
  }

  // ---------- Biznis & Inovasyon — zouti demarraj ----------
  const tools = [
    { name: "Analiz Mache", description: "Konprann konpetisyon ak opòtinite nan sektè w la" },
    { name: "Estimasyon Bidjè", description: "Kalkile depans ak revni previzib pou pwojè w la" },
    { name: "Pitch Deck", description: "Prepare yon prezantasyon pwofesyonèl pou envestisè" },
  ];

  for (const tool of tools) {
    const existing = await prisma.businessTool.findFirst({ where: { name: tool.name } });
    if (!existing) {
      await prisma.businessTool.create({ data: tool });
      console.log(`  ✓ Zouti kreye: ${tool.name}`);
    }
  }

  console.log("✅ Seed konplete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
