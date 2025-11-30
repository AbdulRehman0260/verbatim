import { Request, Response } from "express";
import { createPresignedUrl } from "../utils/utils.js";
import {
  createPost,
  getPostById,
  getAllPosts,
} from "../../db/queries/posts.js";

import postgres from "postgres";
import { config } from "../../config.js";

const sql = postgres(config.db.url, { max: 1 });

export const imageUploadHandler = async (req: Request, res: Response) => {
  try {
    const fileName = req.query.fileName as string;
    if (!fileName) {
      return res.status(400).json({ error: "fileName required" });
    }

    const key = `uploads/${Date.now()}-${fileName}`;

    const url = await createPresignedUrl(key);

    res.json({
      uploadUrl: url,
      fileUrl: `https://${process.env.AWS_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`,
    });
  } catch (error) {
    console.error("S3 error:", error);
    return res.status(500).json({ error: "Failed to create upload URL" });
  }
};

export const createPostHandler = async (req: Request | any, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "Not authenticated" });

    const { title, content, thumbnailUrl } = req.body;

    const newPost = await createPost({
      userId,
      title,
      content,
      thumbnailUrl: thumbnailUrl ?? null,
    });

    res.status(201).json(newPost);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create post" });
  }
};

export const getAllPostsHandler = async (req: Request, res: Response) => {
  try {
    let posts;
    try {
      posts = await getAllPosts();
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
    res.json({ posts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
};

export const getPostByIdHandler = async (req: Request, res: Response) => {
  try {
    const postId = req.params.id;
    const post = await getPostById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.json({ post: post });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch post" });
  }
};
