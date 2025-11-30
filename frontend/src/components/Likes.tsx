import { useState, useEffect } from "react";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export default function LikeButton({ postId }: { postId: string }) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (postId) {
      fetchLikeData();
    }
  }, [postId]);

  const fetchLikeData = async () => {
    try {
      const response = await axiosInstance.get(`/api/likes/${postId}`);
      setLikeCount(response.data.likeCount);
    } catch (error) {
      console.error("Failed to fetch likes", error);
    }
  };

  const handleLike = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.post(`/api/likes/${postId}`);
      setLiked(response.data.liked);
      setLikeCount(response.data.likeCount);
    } catch (error: any) {
      console.error("Failed to toggle like", error);
      if (error.response?.status === 401) {
        toast.error("Please login to like posts");
      } else {
        toast.error("Failed to like post. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLike}
      disabled={loading}
      className={`flex items-center gap-3 px-6 py-3 rounded-lg font-medium transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
        liked
          ? "bg-red-500 text-white shadow-md hover:bg-red-600"
          : "bg-white border-2 border-gray-300 text-gray-700 hover:border-red-500 hover:text-red-500"
      }`}
    >
      <svg
        className={`w-6 h-6 ${
          liked ? "fill-current" : "stroke-current fill-none"
        }`}
        viewBox="0 0 24 24"
        strokeWidth="2"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
      <span className="text-lg">{likeCount}</span>
    </button>
  );
}
