import { Router } from "express";
import { prisma } from "../config/prisma";
import { authMiddleware, AuthenticatedRequest } from "../middleware/auth.middleware";

const router = Router();

// ---------- GET /user/me ----------
router.get("/me", authMiddleware, async (req: AuthenticatedRequest, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.user!.userId } });
  if (!user) {
    return res.status(404).json({ success: false, message: "Itilizatè pa jwenn" });
  }
  return res.json({ id: user.id, name: user.name, email: user.email, plan: user.plan });
});

export default router;
