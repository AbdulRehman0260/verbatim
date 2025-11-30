import React from "react";
import { Link } from "react-router-dom";

interface CardProps {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  image?: string;
}

export default function Card({
  id,
  title,
  author,
  createdAt,
  image,
}: CardProps) {
  return (
    <Link to={`/post/${id}`} className="block w-full">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
        {image ? (
          <img
            src={image}
            alt={title}
            className="w-full h-48 object-cover flex-shrink-0"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        ) : (
          <div className="w-full h-48 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center flex-shrink-0">
            <span className="text-white text-4xl font-bold">
              {title.charAt(0).toUpperCase()}
            </span>
          </div>
        )}

        <div className="p-5 flex flex-col flex-grow">
          <h2 className="text-lg font-bold text-gray-900 mb-auto line-clamp-2">
            {title}
          </h2>

          <div className="flex items-center justify-between text-sm text-gray-600 border-t pt-3 mt-4">
            <span className="font-medium truncate mr-2">{author}</span>
            <span className="whitespace-nowrap text-xs">
              {new Date(createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
