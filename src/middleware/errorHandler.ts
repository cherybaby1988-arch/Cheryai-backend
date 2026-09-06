import { Request, Response, NextFunction } from "express";

/**
 * errorHandler — dènye "filè sekirite" pou nenpòt erè ki chape nan wout yo.
 * San sa a, yon eksepsyon ki pa kaptire ta ka "kraze" pwosesis Node.js la nèt.
 */
export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  console.error("[Erè ki pa jere]", err);

  if (res.headersSent) return;

  res.status(500).json({
    success: false,
    message: "Yon erè initil rive sou sèvè a — nou deja notifye",
  });
}

/**
 * notFoundHandler — repons klè pou wout ki pa egziste, olye HTML default Express la.
 */
export function notFoundHandler(_req: Request, res: Response) {
  res.status(404).json({ success: false, message: "Wout sa a pa egziste sou API CHERY AI la" });
}
