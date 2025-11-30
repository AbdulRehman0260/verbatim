import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { axiosInstance } from "../lib/axios";
import CommentSection from "../components/CommentSection";
import LikeButton from "../components/Likes";

interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  thumbnailUrl?: string;
}

export default function GetPostPage() {
  const { id } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (id) {
      console.log("🔍 Fetching post with ID:", id);
      fetchPost();
    }
  }, [id]);

  const fetchPost = async () => {
    try {
      console.log("📡 Making request to:", `/api/posts/${id}`);
      const response = await axiosInstance.get(`/api/posts/${id}`);
      console.log("✅ Post received:", response.data);

      // Handle both {post: {...}} and direct post object
      const postData = response.data.post || response.data;
      console.log("📝 Post data:", postData);

      setPost(postData);
      setError("");
    } catch (error: any) {
      console.error("❌ Failed to fetch post", error);
      setError(error.response?.data?.error || "Post not found");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Post not found
        </h2>
        <p className="text-gray-600">{error}</p>
        <button
          onClick={() => window.history.back()}
          className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Go Back
        </button>
      </div>
    );
  }

  console.log("🎯 Rendering post with ID:", post.id);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <article className="bg-white rounded-lg shadow-lg overflow-hidden">
        {post.thumbnailUrl && (
          <img
            src={post.thumbnailUrl}
            alt={post.title}
            className="w-full h-96 object-cover"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        )}

        <div className="p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {post.title}
          </h1>

          <div className="flex items-center gap-4 text-gray-600 mb-6 pb-6 border-b">
            <span className="font-medium">By {post.author}</span>
            <span>•</span>
            <span>
              {new Date(post.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>

          <div className="mb-8">
            <LikeButton postId={post.id} />
          </div>

          <div className="prose max-w-none text-gray-700 leading-relaxed mb-8 whitespace-pre-wrap">
            {post.content}
          </div>

          <CommentSection postId={post.id} />
        </div>
      </article>
    </div>
  );
}
