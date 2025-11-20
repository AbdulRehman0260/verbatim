import { Request, Response } from "express";
import { createPresignedUrl } from "../utils/utils.js";
import { createPost } from "../../db/queries/posts.js";
import { v4 as uuidv4 } from "uuid";

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
    const userId = req.user.id;
    const { title, content, thumbnailUrl } = req.body;
    const id = uuidv4();
    const now = new Date();

    const newPost = await createPost({
      id,
      createdAt: now,
      updatedAt: now,
      userId,
      title,
      content,
      thumbnailUrl: thumbnailUrl ?? null,
      isPublished: null,
      publishedAt: null,
    });

    res.json(newPost);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create post" });
  }
};
