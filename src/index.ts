import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";

import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import chatRoutes from "./routes/chat.routes";
import createRoutes from "./routes/create.routes";
import voiceRoutes from "./routes/voice.routes";
import translateRoutes from "./routes/translate.routes";
import academyRoutes from "./routes/academy.routes";
import businessRoutes from "./routes/business.routes";

import { globalRateLimiter, authRateLimiter, aiRateLimiter } from "./middleware/rateLimiter";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";

const app = express();
const PORT = process.env.PORT || 3000;

// ============ Sekirite ak konfigirasyon debaz ============

app.use(helmet()); // headers HTTP sekirize (X-Frame-Options, CSP debaz, elt.)

const allowedOrigins = (process.env.ALLOWED_ORIGINS || "").split(",").filter(Boolean);
app.use(
  cors({
    origin: allowedOrigins.length > 0 ? allowedOrigins : true,
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" })); // limit sou gwosè body (anpeche payload jeyan)
app.use(globalRateLimiter);

// ============ Wout ============

app.get("/", (_req, res) => {
  res.json({
    name: "CHERY AI Assistant API",
    status: "ap fonksyone",
    version: "1.0.0",
    slogan: "Aprann • Kreye • Travay • Inove",
  });
});

app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/auth", authRateLimiter, authRoutes);
app.use("/user", userRoutes);
app.use("/chat", aiRateLimiter, chatRoutes);
app.use("/create", aiRateLimiter, createRoutes);
app.use("/voice", aiRateLimiter, voiceRoutes);
app.use("/translate", aiRateLimiter, translateRoutes);
app.use("/academy", academyRoutes);
app.use("/business", aiRateLimiter, businessRoutes);

// ============ Jesyon erè (TOUJOU an dènye pozisyon) ============

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 CHERY AI Backend ap koute sou pò ${PORT}`);
  console.log(`   Anviwònman: ${process.env.NODE_ENV || "development"}`);
});
