import { Router } from "express";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { z } from "zod";
import { prisma } from "../config/prisma";
import { signToken } from "../utils/jwt";
import { googleAuthService } from "../services/googleAuth.service";

const router = Router();

const registerSchema = z.object({
  name: z.string().min(1, "Non an obligatwa"),
  email: z.string().email("Imèl la pa valid"),
  password: z.string().min(8, "Modpas la dwe gen omwen 8 karaktè"),
});

const loginSchema = z.object({
  email: z.string().email("Imèl la pa valid"),
  password: z.string().min(1, "Modpas la obligatwa"),
});

const forgotPasswordSchema = z.object({
  email: z.string().email("Imèl la pa valid"),
});

// ---------- POST /auth/register ----------
router.post("/register", async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ success: false, message: parsed.error.issues[0].message });
  }
  const { name, email, password } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return res.status(409).json({ success: false, message: "Yon kont deja egziste ak imèl sa a" });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { name, email, passwordHash },
  });

  const token = signToken({ userId: user.id, email: user.email });

  return res.status(201).json({
    token,
    user: { id: user.id, name: user.name, email: user.email, plan: user.plan },
  });
});

// ---------- POST /auth/login ----------
router.post("/login", async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ success: false, message: parsed.error.issues[0].message });
  }
  const { email, password } = parsed.data;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res.status(401).json({ success: false, message: "Imèl oswa modpas pa kòrèk" });
  }

  const passwordMatches = await bcrypt.compare(password, user.passwordHash);
  if (!passwordMatches) {
    return res.status(401).json({ success: false, message: "Imèl oswa modpas pa kòrèk" });
  }

  const token = signToken({ userId: user.id, email: user.email });

  return res.json({
    token,
    user: { id: user.id, name: user.name, email: user.email, plan: user.plan },
  });
});

// ---------- POST /auth/forgot-password ----------
router.post("/forgot-password", async (req, res) => {
  const parsed = forgotPasswordSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ success: false, message: parsed.error.issues[0].message });
  }

  // NÒT: pou rezon sekirite, nou pa revele si imèl la egziste oswa non.
  // TODO: enplemante voye imèl reyèl ak yon sèvis tankou Resend, SendGrid, oswa Nodemailer + SMTP,
  // ak yon token tanporè ki ekspire (ex: 1èdtan) ki mennen nan yon paj "reyajiste modpas".
  return res.json({
    success: true,
    message: "Si yon kont egziste ak imèl sa a, yon lyen pou reyajiste modpas te voye",
  });
});

// ---------- POST /auth/google ----------
const googleSignInSchema = z.object({
  idToken: z.string().min(1, "idToken obligatwa"),
});

router.post("/google", async (req, res) => {
  const parsed = googleSignInSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ success: false, message: parsed.error.issues[0].message });
  }

  if (!process.env.GOOGLE_CLIENT_ID) {
    return res.status(501).json({
      success: false,
      message: "Google Sign-In poko konfigire sou backend la — gade TODO.md",
    });
  }

  try {
    const { email, name } = await googleAuthService.verifyIdToken(parsed.data.idToken);

    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // Itilizatè Google pou premye fwa — kreye kont, ak yon modpas o aza
      // (li pa ka janm konekte ak modpas la paske Google se sèl vwa antre l)
      const randomPassword = await bcrypt.hash(crypto.randomUUID(), 10);
      user = await prisma.user.create({ data: { name, email, passwordHash: randomPassword } });
    }

    const token = signToken({ userId: user.id, email: user.email });
    return res.json({ token, user: { id: user.id, name: user.name, email: user.email, plan: user.plan } });
  } catch (err: any) {
    console.error("[auth/google] Erè:", err.message);
    return res.status(401).json({ success: false, message: "Token Google envalid oswa ekspire" });
  }
});

export default router;
