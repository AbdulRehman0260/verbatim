import { db } from "../index.js";
import { Post, posts, users } from "../schema.js";
import { eq, desc } from "drizzle-orm";

// Create a new post
export const createPost = async (post: {
  userId: string;
  title: string;
  content: string;
  thumbnailUrl?: string;
}): Promise<Post | undefined> => {
  const [createdPost] = await db
    .insert(posts)
    .values(post)
    .onConflictDoNothing()
    .returning();
  return createdPost;
};

// get all posts by all users
export const getAllPosts = async (): Promise<
  (Post & { author: string | null })[]
> => {
  try {
    const result = await db
      .select({
        id: posts.id,
        title: posts.title,
        content: posts.content,
        thumbnailUrl: posts.thumbnailUrl,
        createdAt: posts.createdAt,
        updatedAt: posts.updatedAt,
        userId: posts.userId,
        isPublished: posts.isPublished,
        publishedAt: posts.publishedAt,
        author: users.name,
      })
      .from(posts)
      .leftJoin(users, eq(posts.userId, users.id))
      .orderBy(desc(posts.createdAt));

    return result;
  } catch (error) {
    console.error("Error in getAllPosts:", error);
    throw error;
  }
};

// get posts by a specific user
export const getPostsByUserId = async (userId: string): Promise<Post[]> => {
  return await db
    .select()
    .from(posts)
    .where(eq(posts.userId, userId))
    .orderBy(desc(posts.createdAt));
};

// get a post by its ID
export const getPostById = async (id: string): Promise<Post | undefined> => {
  try {
    const [post] = await db
      .select({
        id: posts.id,
        title: posts.title,
        content: posts.content,
        thumbnailUrl: posts.thumbnailUrl,
        createdAt: posts.createdAt,
        updatedAt: posts.updatedAt,
        userId: posts.userId,
        isPublished: posts.isPublished,
        publishedAt: posts.publishedAt,
        author: users.name,
      })
      .from(posts)
      .leftJoin(users, eq(posts.userId, users.id))
      .where(eq(posts.id, id));
    return post;
  } catch (error) {
    console.error("Error in getPostById:", error);
    throw error;
  }
};
