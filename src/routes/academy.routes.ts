import { Router } from "express";
import { z } from "zod";
import { prisma } from "../config/prisma";
import { authMiddleware, AuthenticatedRequest } from "../middleware/auth.middleware";

const router = Router();

// ---------- GET /academy/courses ----------
router.get("/courses", authMiddleware, async (req: AuthenticatedRequest, res) => {
  const userId = req.user!.userId;

  const courses = await prisma.course.findMany({
    include: { progress: { where: { userId } } },
  });

  return res.json(
    courses.map((c) => ({
      id: c.id,
      title: c.title,
      description: c.description,
      level: c.level,
      progressPercent: c.progress[0]?.progressPercent ?? 0,
    }))
  );
});

// ---------- GET /academy/courses/:courseId ----------
router.get("/courses/:courseId", authMiddleware, async (req, res) => {
  const course = await prisma.course.findUnique({
    where: { id: req.params.courseId },
    include: { lessons: { orderBy: { order: "asc" } } },
  });
  if (!course) {
    return res.status(404).json({ success: false, message: "Kou pa jwenn" });
  }
  return res.json({
    id: course.id,
    title: course.title,
    lessons: course.lessons.map((l) => ({ id: l.id, title: l.title, contentUrl: l.contentUrl, isCompleted: false })),
  });
});

// ---------- POST /academy/progress ----------
const progressSchema = z.object({
  courseId: z.string(),
  lessonId: z.string(),
  completed: z.boolean(),
});

router.post("/progress", authMiddleware, async (req: AuthenticatedRequest, res) => {
  const parsed = progressSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ success: false, message: parsed.error.issues[0].message });
  }
  const userId = req.user!.userId;
  const { courseId } = parsed.data;

  // TODO: kalkile vrè pousantaj lan selon konbyen leson total ki genyen nan kou a
  // ak konbyen ki make "completed". Pou kounye a, senplifikasyon MVP: +10% pa leson.
  const existing = await prisma.userProgress.findUnique({
    where: { userId_courseId: { userId, courseId } },
  });
  const newPercent = Math.min(100, (existing?.progressPercent ?? 0) + 10);

  await prisma.userProgress.upsert({
    where: { userId_courseId: { userId, courseId } },
    update: { progressPercent: newPercent },
    create: { userId, courseId, progressPercent: newPercent },
  });

  return res.json({ success: true, message: "Pwogrè mete ajou" });
});

export default router;
