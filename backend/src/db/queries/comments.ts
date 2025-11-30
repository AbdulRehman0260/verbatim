import { db } from "../index.js";
import { comments, users } from "../schema.js";
import { eq, and, desc } from "drizzle-orm";

export async function getCommentsByPostId(postId: string) {
  try {
    const result = await db
      .select({
        id: comments.id,
        content: comments.content,
        createdAt: comments.createdAt,
        userId: comments.userId,
        postId: comments.postId,
        author: users.name,
      })
      .from(comments)
      .leftJoin(users, eq(comments.userId, users.id))
      .where(eq(comments.postId, postId))
      .orderBy(desc(comments.createdAt));

    console.log(`Found ${result.length} comments`);
    return result;
  } catch (error) {
    console.error("Error in getCommentsByPostId:", error);
    throw error;
  }
}

export async function createComment(data: {
  postId: string;
  userId: string;
  content: string;
}) {
  try {
    const [newComment] = await db
      .insert(comments)
      .values({
        postId: data.postId,
        userId: data.userId,
        content: data.content,
      })
      .returning();

    return newComment;
  } catch (error) {
    console.error("Error in createComment:", error);
    throw error;
  }
}

export async function deleteComment(commentId: string, userId: string) {
  try {
    const [deletedComment] = await db
      .delete(comments)
      .where(and(eq(comments.id, commentId), eq(comments.userId, userId)))
      .returning();

    return deletedComment;
  } catch (error) {
    console.error("Error in deleteComment:", error);
    throw error;
  }
}
