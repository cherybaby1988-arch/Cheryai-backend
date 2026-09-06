import { Router } from "express";
import { z } from "zod";
import { authMiddleware } from "../middleware/auth.middleware";
import { getAiProvider } from "../services/ai";

const router = Router();

const languageNames: Record<string, string> = {
  ht: "Kreyòl Ayisyen",
  fr: "Franse",
  en: "Angle",
  es: "Espayòl",
};

const translateSchema = z.object({
  text: z.string().min(1),
  sourceLang: z.string(),
  targetLang: z.string(),
});

// ---------- POST /translate ----------
// Itilize modèl lang lan (Claude/ChatGPT) kòm motè tradiksyon — bon jan kalite
// pou Kreyòl Ayisyen, kontrèman ak anpil API tradiksyon "tradisyonèl" ki pa sipòte l byen.
router.post("/", authMiddleware, async (req, res) => {
  const parsed = translateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ success: false, message: parsed.error.issues[0].message });
  }
  const { text, sourceLang, targetLang } = parsed.data;

  try {
    const aiProvider = getAiProvider();
    const sourceName = languageNames[sourceLang] || sourceLang;
    const targetName = languageNames[targetLang] || targetLang;

    const systemPrompt = `Ou se yon motè tradiksyon pwofesyonèl. Tradui tèks itilizatè a bay
soti nan ${sourceName} pou rive nan ${targetName}. Reponn AVEK SÈLMAN tradiksyon an — pa ajoute
okenn eksplikasyon, kòmantè, oswa gide.`;

    const translatedText = await aiProvider.chat(
      [{ role: "user", content: text }],
      { systemPrompt, maxTokens: 800, temperature: 0.3 }
    );

    return res.json({ translatedText: translatedText.trim() });
  } catch (err: any) {
    console.error("[translate] Erè:", err.message);
    return res.status(502).json({ success: false, message: "Nou pa t ka tradui tèks la" });
  }
});

export default router;
