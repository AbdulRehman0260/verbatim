import { db } from "../index.js";
import { posts } from "../schema.js";
import type { Post } from "../schema.js";

// Create a new post
export const createPost = async (post: Post): Promise<Post | undefined> => {
  const [createdPost] = await db
    .insert(posts)
    .values(post)
    .onConflictDoNothing()
    .returning();
  return createdPost;
};
