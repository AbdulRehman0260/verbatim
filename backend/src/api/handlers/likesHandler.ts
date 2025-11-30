import { Request, Response } from "express";
import {
  getLikeCountByPostId,
  hasUserLikedPost,
  toggleLike,
} from "../../db/queries/likes.js";

export const getLikesHandler = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;
    const likeCount = await getLikeCountByPostId(postId);
    return res.json({ likeCount });
  } catch (error) {
    console.error("Error fetching likes:", error);
    return res.status(500).json({ error: "Failed to fetch likes" });
  }
};

export const likePostHandler = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;
    const userId = (req as any).userId; // From auth middleware

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const result = await toggleLike(postId, userId);
    const likeCount = await getLikeCountByPostId(postId);

    return res.json({ ...result, likeCount });
  } catch (error) {
    console.error("Error toggling like:", error);
    return res.status(500).json({ error: "Failed to toggle like" });
  }
};

export const unlikePostHandler = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;
    const userId = (req as any).userId;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const result = await toggleLike(postId, userId);
    const likeCount = await getLikeCountByPostId(postId);

    return res.json({ ...result, likeCount });
  } catch (error) {
    console.error("Error toggling like:", error);
    return res.status(500).json({ error: "Failed to toggle like" });
  }
};

// Optional: Get user's like status for a post
export const getUserLikeStatusHandler = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;
    const userId = (req as any).userId;

    if (!userId) {
      return res.json({ liked: false });
    }

    const liked = await hasUserLikedPost(userId, postId);
    return res.json({ liked });
  } catch (error) {
    console.error("Error fetching like status:", error);
    return res.status(500).json({ error: "Failed to fetch like status" });
  }
};
