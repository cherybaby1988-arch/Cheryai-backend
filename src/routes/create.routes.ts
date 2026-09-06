import { Router } from "express";
import { z } from "zod";
import { prisma } from "../config/prisma";
import { authMiddleware, AuthenticatedRequest } from "../middleware/auth.middleware";
import { getAiProvider } from "../services/ai";

const router = Router();

// ============ Kreye Tèks (fonksyonèl — itilize Claude/ChatGPT) ============

const textGenSchema = z.object({
  prompt: z.string().min(1),
  tone: z.string().optional(),
  language: z.string().optional(),
});

router.post("/text", authMiddleware, async (req: AuthenticatedRequest, res) => {
  const parsed = textGenSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ success: false, message: parsed.error.issues[0].message });
  }
  const { prompt, tone } = parsed.data;

  try {
    const aiProvider = getAiProvider();
    const systemPrompt = `Ou se yon asistan ekriti pwofesyonèl. Ekri kontni klè, byen estriktire,
nan yon ton ${tone || "netral"}. Reponn nan menm lang prompt la itilize a.`;

    const generatedText = await aiProvider.chat(
      [{ role: "user", content: prompt }],
      { systemPrompt, maxTokens: 1500 }
    );

    return res.json({ generatedText });
  } catch (err: any) {
    console.error("[create/text] Erè:", err.message);
    return res.status(502).json({ success: false, message: "Nou pa t ka jenere tèks la" });
  }
});

// ============ Imaj AI (estrikti pare — mande kle founisè imaj) ============

const imageGenSchema = z.object({
  prompt: z.string().min(1),
  style: z.string().optional(),
});

router.post("/image", authMiddleware, async (req: AuthenticatedRequest, res) => {
  const parsed = imageGenSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ success: false, message: parsed.error.issues[0].message });
  }

  /**
   * TODO: konekte yon vrè founisè jenerasyon imaj:
   *   - OpenAI DALL-E 3 (POST https://api.openai.com/v1/images/generations, kle OPENAI_API_KEY)
   *   - Stability AI (Stable Diffusion)
   *   - Google Imagen (Vertex AI)
   *
   * Egzanp OpenAI (dekomante lè OPENAI_API_KEY konfigire):
   *
   * const response = await fetch("https://api.openai.com/v1/images/generations", {
   *   method: "POST",
   *   headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
   *   body: JSON.stringify({ model: "dall-e-3", prompt: parsed.data.prompt, n: 1, size: "1024x1024" }),
   * });
   * const data = await response.json();
   * const imageUrl = data.data[0].url;
   *
   * Apre sa, sere l nan baz done a ak prisma.generatedImage.create(...)
   */
  return res.status(501).json({
    success: false,
    message: "Jenerasyon imaj poko konekte — konfigire OPENAI_API_KEY oswa STABILITY_API_KEY (gade TODO.md)",
  });
});

router.get("/image/history", authMiddleware, async (req: AuthenticatedRequest, res) => {
  const images = await prisma.generatedImage.findMany({
    where: { userId: req.user!.userId },
    orderBy: { createdAt: "desc" },
  });
  return res.json(
    images.map((img) => ({ id: img.id, prompt: img.prompt, imageUrl: img.imageUrl, createdAt: img.createdAt.getTime() }))
  );
});

// ============ Videyo AI (estrikti pare — mande kle founisè videyo) ============

const videoGenSchema = z.object({
  prompt: z.string().min(1),
  durationSeconds: z.number().min(1).max(60).optional(),
});

router.post("/video", authMiddleware, async (req: AuthenticatedRequest, res) => {
  const parsed = videoGenSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ success: false, message: parsed.error.issues[0].message });
  }

  const video = await prisma.generatedVideo.create({
    data: { userId: req.user!.userId, prompt: parsed.data.prompt, status: "pending" },
  });

  /**
   * TODO: kòmanse jenerasyon reyèl la ak yon founisè (Runway ML, Pika Labs, Luma AI, elt.)
   * — anpil founisè videyo travay AN ASENKRÒN: yo retounen yon jobId imedyatman,
   * epi w dwe tcheke estati a pi devan (gade GET /create/video/status/:jobId anba a),
   * oswa itilize yon webhook si founisè a sipòte l.
   *
   * Pou kounye a, nou kreye anrejistreman an ak estati "pending" epi nou retounen l.
   */

  return res.json({ jobId: video.id, status: video.status });
});

router.get("/video/status/:jobId", authMiddleware, async (req: AuthenticatedRequest, res) => {
  const video = await prisma.generatedVideo.findFirst({
    where: { id: req.params.jobId, userId: req.user!.userId },
  });
  if (!video) {
    return res.status(404).json({ success: false, message: "Videyo pa jwenn" });
  }
  return res.json({ jobId: video.id, status: video.status, videoUrl: video.videoUrl ?? undefined });
});

export default router;
