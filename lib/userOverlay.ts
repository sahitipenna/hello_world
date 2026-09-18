import { prisma } from "./db";

export async function getPromptEdits(userId: string, dateISO: string) {
  const rows = await prisma.promptEdit.findMany({ where: { userId, dateISO } });
  const map: Record<number, string> = {};
  rows.forEach((r) => {
    map[r.index] = r.text;
  });
  return map;
}

export async function getSectionEdits(userId: string, dateISO: string) {
  const rows = await prisma.sectionEdit.findMany({ where: { userId, dateISO } });
  const map: Record<string, Record<string, string>> = {};
  rows.forEach((r) => {
    if (!map[r.sectionId]) map[r.sectionId] = {};
    map[r.sectionId][r.field] = r.value;
  });
  return map;
}

export async function getTodoChecks(userId: string, dateISO: string) {
  const rows = await prisma.dailyTodoCheck.findMany({ where: { userId, dateISO } });
  const map: Record<number, boolean> = {};
  rows.forEach((r) => {
    map[r.index] = r.done;
  });
  return map;
}
