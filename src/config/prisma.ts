import { PrismaClient } from "@prisma/client";

/**
 * Yon sèl enstans PrismaClient pataje pou tout aplikasyon an
 * (evite louvri twòp koneksyon baz done pandan devlopman ak hot-reload).
 */
export const prisma = new PrismaClient();
