import { useEffect, useState } from "react";
import Card from "./Card";
import { axiosInstance } from "../lib/axios";

interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  thumbnailUrl?: string;
}

export default function CardHolder() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axiosInstance.get("/api/posts");

      if (Array.isArray(response.data)) {
        setPosts(response.data);
      } else if (response.data.posts && Array.isArray(response.data.posts)) {
        setPosts(response.data.posts);
      } else {
        setError("Unexpected data format received");
      }
    } catch (error: any) {
      setError(error.response?.data?.error || "Failed to load posts");
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

  if (error) {
    return (
      <div className="text-center py-16">
        <p className="text-red-600 text-lg">{error}</p>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-600 text-lg">
          No posts yet. Be the first to create one!
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <Card
            key={post.id}
            id={post.id}
            title={post.title}
            content={post.content}
            author={post.author}
            createdAt={post.createdAt}
            image={post.thumbnailUrl}
          />
        ))}
      </div>
    </div>
  );
}
