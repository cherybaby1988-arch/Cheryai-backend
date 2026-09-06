import { Router } from "express";
import { z } from "zod";
import { prisma } from "../config/prisma";
import { authMiddleware, AuthenticatedRequest } from "../middleware/auth.middleware";
import { getAiProvider, AiMessage } from "../services/ai";

const router = Router();

const CHAT_SYSTEM_PROMPT = `Ou se CHERY AI Assistant, yon asistan entèlijans atifisyèl ki ede itilizatè
ayisyen aprann, kreye, travay ak inove. Reponn PRENSIPALMAN an Kreyòl Ayisyen, sof si itilizatè a
ekri w nan yon lòt lang (Franse, Angle, oswa Espayòl) — nan ka sa a, reponn nan menm lang lan.
Rete klè, chalere, ak pratik nan repons ou yo.`;

const chatMessageSchema = z.object({
  message: z.string().min(1, "Mesaj la pa ka vid"),
  language: z.string().optional(),
});

// ---------- POST /chat/message ----------
router.post("/message", authMiddleware, async (req: AuthenticatedRequest, res) => {
  const parsed = chatMessageSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ success: false, message: parsed.error.issues[0].message });
  }
  const { message } = parsed.data;
  const userId = req.user!.userId;

  try {
    // Jwenn oswa kreye konvèsasyon "aktiv" itilizatè a (senplifikasyon MVP:
    // yon sèl konvèsasyon kontinyèl pa itilizatè — ka elaji pou plizyè fil pi devan).
    let conversation = await prisma.conversation.findFirst({
      where: { userId },
      orderBy: { lastActivity: "desc" },
    });
    if (!conversation) {
      conversation = await prisma.conversation.create({ data: { userId } });
    }

    // Chaje dènye 20 mesaj yo pou bay AI a kontèks (san fè kontèks la twò long/chè)
    const history = await prisma.message.findMany({
      where: { conversationId: conversation.id },
      orderBy: { createdAt: "asc" },
      take: 20,
    });

    const aiMessages: AiMessage[] = history.map((m) => ({
      role: m.sender === "USER" ? "user" : "assistant",
      content: m.content,
    }));
    aiMessages.push({ role: "user", content: message });

    const aiProvider = getAiProvider();
    const reply = await aiProvider.chat(aiMessages, { systemPrompt: CHAT_SYSTEM_PROMPT });

    // Anrejistre toude mesaj yo (itilizatè a + AI a) nan baz done a
    await prisma.message.create({ data: { conversationId: conversation.id, sender: "USER", content: message } });
    const aiMessageRecord = await prisma.message.create({
      data: { conversationId: conversation.id, sender: "AI", content: reply },
    });

    return res.json({ reply, messageId: aiMessageRecord.id });
  } catch (err: any) {
    console.error("[chat/message] Erè:", err.message);
    return res.status(502).json({
      success: false,
      message: "CHERY AI pa t ka reponn kounye a — eseye ankò nan yon ti moman",
    });
  }
});

// ---------- GET /chat/history ----------
router.get("/history", authMiddleware, async (req: AuthenticatedRequest, res) => {
  const userId = req.user!.userId;

  const conversation = await prisma.conversation.findFirst({
    where: { userId },
    orderBy: { lastActivity: "desc" },
  });
  if (!conversation) return res.json([]);

  const messages = await prisma.message.findMany({
    where: { conversationId: conversation.id },
    orderBy: { createdAt: "asc" },
  });

  return res.json(
    messages.map((m) => ({
      id: m.id,
      content: m.content,
      sender: m.sender,
      timestamp: m.createdAt.getTime(),
    }))
  );
});

// ---------- POST /chat/message/image (TODO) ----------
router.post("/message/image", authMiddleware, async (_req, res) => {
  // TODO: itilize "multer" pou resevwa fichye a (multipart/form-data), voye l bay
  // yon modèl AI ki sipòte vizyon (Claude ak vizyon, oswa GPT-4o vizyon), epi retounen repons lan.
  return res.status(501).json({ success: false, message: "Chat ak imaj poko konekte sou backend la" });
});

// ---------- POST /chat/message/voice (TODO) ----------
router.post("/message/voice", authMiddleware, async (_req, res) => {
  // TODO: resevwa odyo a, konvèti l an tèks (Whisper API oswa lòt STT), epi
  // pase rezilta a nan menm pipeline chat/message la anwo a.
  return res.status(501).json({ success: false, message: "Chat ak vwa poko konekte sou backend la" });
});

export default router;
