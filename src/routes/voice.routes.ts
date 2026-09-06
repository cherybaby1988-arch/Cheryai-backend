import { Router } from "express";
import { z } from "zod";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

const ttsSchema = z.object({
  text: z.string().min(1),
  voice: z.string().optional(),
  language: z.string().optional(),
});

// ============ POST /voice/text-to-speech (estrikti pare) ============
router.post("/text-to-speech", authMiddleware, async (req, res) => {
  const parsed = ttsSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ success: false, message: parsed.error.issues[0].message });
  }

  /**
   * TODO: konekte yon vrè founisè Tèks-a-Vwa:
   *   - ElevenLabs (bon kalite vwa, sipò miltiling)
   *   - Google Cloud Text-to-Speech
   *   - Amazon Polly
   *
   * Egzanp ElevenLabs (dekomante lè ELEVENLABS_API_KEY konfigire):
   *
   * const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
   *   method: "POST",
   *   headers: { "xi-api-key": process.env.ELEVENLABS_API_KEY!, "Content-Type": "application/json" },
   *   body: JSON.stringify({ text: parsed.data.text }),
   * });
   * // Konvèti repons lan (odyo binè) an fichye, sere l (S3/Cloud Storage), retounen URL la.
   */
  return res.status(501).json({
    success: false,
    message: "Tèks-a-Vwa poko konekte — konfigire ELEVENLABS_API_KEY oswa lòt founisè (gade TODO.md)",
  });
});

// ============ POST /voice/speech-to-text (estrikti pare) ============
router.post("/speech-to-text", authMiddleware, async (_req, res) => {
  /**
   * TODO: resevwa fichye odyo a (multipart/form-data ak "multer"), voye l bay
   * Whisper API (OpenAI) oswa Google Speech-to-Text, retounen tèks transkri a.
   *
   * Egzanp OpenAI Whisper:
   * const formData = new FormData();
   * formData.append("file", audioBuffer, "audio.webm");
   * formData.append("model", "whisper-1");
   * const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
   *   method: "POST",
   *   headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
   *   body: formData,
   * });
   */
  return res.status(501).json({
    success: false,
    message: "Vwa-a-Tèks poko konekte — konfigire OPENAI_API_KEY pou Whisper (gade TODO.md)",
  });
});

export default router;
