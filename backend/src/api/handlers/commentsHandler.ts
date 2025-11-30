import { Request, Response } from "express";
import {
  createComment,
  deleteComment,
  getCommentsByPostId,
} from "../../db/queries/comments.js";

export const getCommentsByPostIdHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const { postId } = req.params;
    const comments = await getCommentsByPostId(postId);
    return res.json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    return res.status(500).json({ error: "Failed to fetch comments" });
  }
};

export const createCommentHandler = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;
    const userId = (req as any).userId;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!content || !content.trim()) {
      return res.status(400).json({ error: "Content is required" });
    }

    const newComment = await createComment({
      postId,
      userId,
      content: content.trim(),
    });

    console.log("Comment created:", newComment);
    return res.status(201).json(newComment);
  } catch (error) {
    console.error("Error creating comment:", error);
    return res.status(500).json({ error: "Failed to create comment" });
  }
};

export const deleteCommentHandler = async (req: Request, res: Response) => {
  try {
    const { commentId } = req.params;
    const userId = (req as any).userId;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const deletedComment = await deleteComment(commentId, userId);

    if (!deletedComment) {
      return res
        .status(404)
        .json({ error: "Comment not found or unauthorized" });
    }

    return res.json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Error deleting comment:", error);
    return res.status(500).json({ error: "Failed to delete comment" });
  }
};
