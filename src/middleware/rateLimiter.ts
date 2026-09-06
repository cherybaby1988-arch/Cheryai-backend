import rateLimit from "express-rate-limit";

/**
 * Rate limiting jeneral — anpeche yon sèl kliyan bonbade API a.
 * Aplike sou TOUT wout yo kòm premye liy defans.
 */
export const globalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minit
  limit: 300, // 300 rekèt pa IP pa fenèt 15 minit
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Twòp rekèt — tanpri eseye ankò nan kèk minit" },
});

/**
 * Rate limiting pi sevè espesifik pou wout otantifikasyon (login/register),
 * pou anpeche atak "brute-force" sou modpas itilizatè yo.
 */
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20, // 20 tantativ login/register pa IP pa fenèt 15 minit
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Twòp tantativ koneksyon — eseye ankò nan kèk minit" },
});

/**
 * Rate limiting pou wout ki rele founisè AI yo (chat, imaj, videyo, vwa) —
 * pi restriktif paske chak apèl koute lajan (kredi API founisè AI a).
 */
export const aiRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minit
  limit: 20, // 20 apèl AI pa itilizatè pa minit
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Ou rive nan limit itilizasyon AI — tann yon ti moman" },
});
