import { UUID } from "crypto";
import { db } from "../index.js";
import { likes } from "../schema.js";
import { eq, and, count } from "drizzle-orm";

export const getLikeCountByPostId = async (postId: string) => {
  const result = await db
    .select({ count: count() })
    .from(likes)
    .where(eq(likes.postId, postId));
  return result[0]?.count || 0;
};

export const hasUserLikedPost = async (userId: string, postId: string) => {
  const result = await db
    .select()
    .from(likes)
    .where(and(eq(likes.postId, postId), eq(likes.userId, userId)));
  return result.length > 0;
};

export const likePost = async (userId: string, postId: string) => {
  const [newLike] = await db
    .insert(likes)
    .values({ userId, postId })
    .returning();
  return newLike;
};

export const unlikePost = async (userId: string, postId: string) => {
  const [deletedLike] = await db
    .delete(likes)
    .where(and(eq(likes.userId, userId), eq(likes.postId, postId)))
    .returning();
  return deletedLike;
};

export const toggleLike = async (postId: string, userId: string) => {
  const existing = await db
    .select()
    .from(likes)
    .where(and(eq(likes.postId, postId), eq(likes.userId, userId)));

  if (existing.length > 0) {
    await unlikePost(userId, postId);
    return { liked: false };
  } else {
    await likePost(userId, postId);
    return { liked: true };
  }
};
