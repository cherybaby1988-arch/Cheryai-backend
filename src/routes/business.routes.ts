import { Router } from "express";
import { z } from "zod";
import { prisma } from "../config/prisma";
import { authMiddleware } from "../middleware/auth.middleware";
import { getAiProvider } from "../services/ai";

const router = Router();

// ---------- GET /business/tools ----------
router.get("/tools", authMiddleware, async (_req, res) => {
  const tools = await prisma.businessTool.findMany();
  return res.json(tools.map((t) => ({ id: t.id, name: t.name, description: t.description })));
});

// ---------- POST /business/plan ----------
const planSchema = z.object({
  businessIdea: z.string().min(1),
  targetMarket: z.string().optional(),
});

router.post("/plan", authMiddleware, async (req, res) => {
  const parsed = planSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ success: false, message: parsed.error.issues[0].message });
  }
  const { businessIdea, targetMarket } = parsed.data;

  try {
    const aiProvider = getAiProvider();
    const systemPrompt = `Ou se yon konseye biznis ekspè ki espesyalize nan ede antreprenè
ayisyen ak Karayibeyen. Kreye yon plan biznis konsi ak seksyon klè: Rezime, Pwoblèm/Solisyon,
Mache Sib, Modèl Revni, Premye Etap Aksyon. Ekri nan Kreyòl Ayisyen, klè ak pratik.`;

    const userPrompt = targetMarket
      ? `Lide biznis: ${businessIdea}\nMache sib: ${targetMarket}`
      : `Lide biznis: ${businessIdea}`;

    const planText = await aiProvider.chat(
      [{ role: "user", content: userPrompt }],
      { systemPrompt, maxTokens: 1500 }
    );

    return res.json({ planText });
  } catch (err: any) {
    console.error("[business/plan] Erè:", err.message);
    return res.status(502).json({ success: false, message: "Nou pa t ka jenere plan biznis la" });
  }
});

export default router;
