import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const PostForm = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let thumbnailUrl = null;
      if (imageFile) {
        const { data } = await axiosInstance.get("/upload-url", {
          params: {
            fileName: imageFile.name,
          },
          withCredentials: true,
        });

        const { uploadUrl, fileUrl } = data;

        await axios.put(uploadUrl, imageFile, {
          headers: {
            "Content-Type": imageFile.type,
          },
        });
        thumbnailUrl = fileUrl;
        await axiosInstance.post(
          "/post",
          {
            title,
            content,
            thumbnailUrl,
          },
          { withCredentials: true }
        );
      }
      toast.success("Post created successfully");
      navigate("/");
    } catch (error) {
      console.error("Failed to create post:", error);
      toast.error("Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="text-gray-600 hover:text-gray-900 cursor-pointer font-medium transition-colors"
          >
            ← Back
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || !title.trim() || !content.trim()}
            className="px-6 py-2 bg-green-600 text-white rounded-full font-medium hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Publishing..." : "Publish Post"}
          </button>
        </div>
      </div>

      {/* Editor Container */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Featured Image */}
          {imagePreview ? (
            <div className="relative group">
              <img
                src={imagePreview}
                alt="Featured"
                className="w-full h-96 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => {
                  setImageFile(null);
                  setImagePreview("");
                }}
                className="absolute top-4 right-4 bg-white px-4 py-2 rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
              >
                Remove Image
              </button>
            </div>
          ) : (
            <label className="block border-2 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer hover:border-gray-400 transition-colors">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <div className="text-gray-500">
                <svg
                  className="mx-auto h-12 w-12 mb-4"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <p className="text-lg font-medium">Add a featured image</p>
                <p className="text-sm mt-1">Click to upload</p>
              </div>
            </label>
          )}

          {/* Title Input */}
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Post title..."
            className="w-full text-5xl font-bold border-none outline-none focus:ring-0 placeholder-gray-300 bg-transparent"
            required
          />

          {/* Content Textarea */}
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Tell your story..."
            className="w-full min-h-[500px] text-xl leading-relaxed border-none outline-none focus:ring-0 placeholder-gray-300 resize-none bg-transparent font-serif"
            required
          />
        </form>
      </div>
    </div>
  );
};
