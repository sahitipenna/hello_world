import { prisma } from "./db";
import type {
  Prisma,
  UserInterest,
  CategoryEngagement,
  Bookmark,
  DailyTodoCheck,
  PromptEdit,
  SectionEdit,
  QuizProgress,
  QuizEdit,
  PushSubscription,
} from "@prisma/client";

/** Moves every `fromId` row in a user-scoped table to `toId`, skipping any
 * row whose unique key the destination already has one for (the
 * destination's own, presumably-established row always wins — this never
 * overwrites it). Conflicts are resolved by checking the destination's
 * existing keys in application code *before* writing anything, rather than
 * relying on a unique-constraint violation to signal "skip": Postgres
 * aborts an entire transaction after any statement fails, so a caught
 * constraint error here would otherwise poison every later step of the
 * same merge (confirmed while testing this — the naive create-and-catch
 * version failed every subsequent table once the first real conflict
 * hit). Delegate is loosely typed on purpose — the same tradeoff as
 * ContentTypeDef's delegate in lib/adminContent.ts — so one helper can
 * serve every per-user table below instead of one copy per model. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function moveTable<Row extends { userId: string }>(
  model: any,
  fromId: string,
  toId: string,
  keyOf: (row: Row) => string,
  toCreateData: (row: Row) => object
) {
  const [destRows, sourceRows]: [Row[], Row[]] = await Promise.all([
    model.findMany({ where: { userId: toId } }),
    model.findMany({ where: { userId: fromId } }),
  ]);
  const destKeys = new Set(destRows.map(keyOf));
  const toInsert = sourceRows.filter((r) => !destKeys.has(keyOf(r))).map(toCreateData);
  if (toInsert.length > 0) {
    await model.createMany({ data: toInsert });
  }
  await model.deleteMany({ where: { userId: fromId } });
}

/** Merges everything `fromId` has saved into `toId`, then deletes the now-
 * empty `fromId` row. Used by the Google sign-in callback: when a visitor
 * signs in with an account already linked to an older, established row,
 * their identity cookie switches to that row — without this, whatever
 * they'd just set on the session being abandoned (interests, bookmarks,
 * desk edits...) would be silently stranded on a row the cookie no longer
 * points at.
 *
 * Tables with no per-user uniqueness (UsageEvent, TodoListItem,
 * PushSubscription) are reassigned directly, no conflict possible.
 * Preference scalars on User itself (timeBudgetMinutes, sectionOrder,
 * hiddenSections, deskSkin) fill in on the destination only where it
 * doesn't already have its own value — plan, razorpaySubscriptionId,
 * visitCount, lastSeenAt, and createdAt are deliberately left untouched,
 * so the established row's own billing state and history are never
 * overwritten by the session merging into it. */
export async function mergeUserInto(fromId: string, toId: string): Promise<void> {
  if (fromId === toId) return;

  await prisma.$transaction(async (tx) => {
    await moveTable<UserInterest>(
      tx.userInterest,
      fromId,
      toId,
      (r) => r.tagId,
      (r) => ({ userId: toId, tagId: r.tagId, weight: r.weight })
    );

    await moveTable<CategoryEngagement>(
      tx.categoryEngagement,
      fromId,
      toId,
      (r) => r.category,
      (r) => ({ userId: toId, category: r.category, score: r.score })
    );

    await moveTable<Bookmark>(
      tx.bookmark,
      fromId,
      toId,
      (r) => `${r.contentType}:${r.contentId}`,
      (r) => ({ userId: toId, contentType: r.contentType, contentId: r.contentId })
    );

    await moveTable<DailyTodoCheck>(
      tx.dailyTodoCheck,
      fromId,
      toId,
      (r) => `${r.dateISO}:${r.index}`,
      (r) => ({ userId: toId, dateISO: r.dateISO, index: r.index, done: r.done })
    );

    await moveTable<PromptEdit>(
      tx.promptEdit,
      fromId,
      toId,
      (r) => `${r.dateISO}:${r.index}`,
      (r) => ({ userId: toId, dateISO: r.dateISO, index: r.index, text: r.text })
    );

    await moveTable<SectionEdit>(
      tx.sectionEdit,
      fromId,
      toId,
      (r) => `${r.dateISO}:${r.sectionId}:${r.field}`,
      (r) => ({ userId: toId, dateISO: r.dateISO, sectionId: r.sectionId, field: r.field, value: r.value })
    );

    await moveTable<QuizProgress>(
      tx.quizProgress,
      fromId,
      toId,
      (r) => `${r.genre}:${r.difficulty}`,
      (r) => ({ userId: toId, genre: r.genre, difficulty: r.difficulty, completedAt: r.completedAt })
    );

    await moveTable<QuizEdit>(
      tx.quizEdit,
      fromId,
      toId,
      (r) => `${r.genre}:${r.difficulty}:${r.questionIndex}`,
      (r) => ({
        userId: toId,
        genre: r.genre,
        difficulty: r.difficulty,
        questionIndex: r.questionIndex,
        question: r.question,
        answer: r.answer,
      })
    );

    // No per-user uniqueness to collide with — move freely.
    await tx.todoListItem.updateMany({ where: { userId: fromId }, data: { userId: toId } });
    await tx.usageEvent.updateMany({ where: { userId: fromId }, data: { userId: toId } });
    await moveTable<PushSubscription>(
      tx.pushSubscription,
      fromId,
      toId,
      (r) => r.endpoint,
      (r) => ({ userId: toId, endpoint: r.endpoint, p256dh: r.p256dh, auth: r.auth })
    );

    const [fromUser, toUser] = await Promise.all([
      tx.user.findUnique({ where: { id: fromId } }),
      tx.user.findUnique({ where: { id: toId } }),
    ]);
    if (fromUser && toUser) {
      const fill: Prisma.UserUpdateInput = {};
      if (toUser.timeBudgetMinutes == null && fromUser.timeBudgetMinutes != null) fill.timeBudgetMinutes = fromUser.timeBudgetMinutes;
      if (toUser.sectionOrder == null && fromUser.sectionOrder != null) fill.sectionOrder = fromUser.sectionOrder;
      if (toUser.hiddenSections == null && fromUser.hiddenSections != null) fill.hiddenSections = fromUser.hiddenSections;
      if (toUser.deskSkin == null && fromUser.deskSkin != null) fill.deskSkin = fromUser.deskSkin;
      if (Object.keys(fill).length > 0) {
        await tx.user.update({ where: { id: toId }, data: fill });
      }
    }

    // Fully drained, and the cookie is about to stop pointing at it —
    // delete rather than leave a ghost visitor cluttering /admin's
    // Insights per-visitor list.
    await tx.user.delete({ where: { id: fromId } });
  });
}
