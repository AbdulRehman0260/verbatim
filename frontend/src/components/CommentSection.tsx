import { useState, useEffect } from "react";
import { axiosInstance } from "../lib/axios";

interface Comment {
  id: string;
  content: string;
  userId: string;
  author: string | null;
  createdAt: string;
}

export default function CommentSection({ postId }: { postId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (postId) {
      console.log("Fetching comments for post:", postId);
      fetchComments();
    }
  }, [postId]);

  const fetchComments = async () => {
    try {
      const response = await axiosInstance.get(`/api/comments/${postId}`);
      setComments(response.data);
    } catch (error) {
      console.error("Failed to fetch comments", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) {
      setError("Comment cannot be empty");
      return;
    }

    setLoading(true);
    setError("");
    try {
      await axiosInstance.post(`/api/comments/${postId}`, {
        content: newComment,
      });
      setNewComment("");
      fetchComments();
    } catch (error: any) {
      if (error.response?.status === 401) {
        setError("Please login to comment");
      } else {
        setError(
          error.response?.data?.error ||
            "Failed to post comment. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8 border-t pt-6">
      <h3 className="text-2xl font-bold mb-6">Comments ({comments.length})</h3>

      <form onSubmit={handleSubmit} className="mb-8">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          placeholder="Share your thoughts..."
          rows={4}
        />
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="mt-3 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "Posting..." : "Post Comment"}
        </button>
      </form>

      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No comments yet. Be the first to comment!
          </p>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="p-5 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-sm transition-shadow"
            >
              <p className="text-gray-800 leading-relaxed">{comment.content}</p>
              <div className="flex items-center justify-between mt-3 text-sm text-gray-500">
                <span className="font-medium">
                  {comment.author ||
                    `User ${comment.userId.substring(0, 8)}...`}
                </span>
                <span>
                  {new Date(comment.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
