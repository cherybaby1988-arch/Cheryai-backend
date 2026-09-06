import { Request, Response, NextFunction } from "express";
import { verifyToken, TokenPayload } from "../utils/jwt";

// Elaji tip Express Request pou enkli itilizatè otantifye a
export interface AuthenticatedRequest extends Request {
  user?: TokenPayload;
}

/**
 * authMiddleware — pwoteje wout ki mande yon itilizatè konekte.
 * Li tann yon header "Authorization: Bearer <token>" — sa a koresponn
 * egzakteman ak sa AuthInterceptor.kt nan app Android la voye otomatikman.
 */
export function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "Ou dwe konekte pou aksede resous sa a" });
  }

  const token = authHeader.slice("Bearer ".length);

  try {
    const payload = verifyToken(token);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Token ekspire oswa envalid — konekte ankò" });
  }
}
