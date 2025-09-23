// File: src/components/research/cards/ResearchPostCard.jsx
import { motion } from "framer-motion";
import { Heart } from "lucide-react";

const ResearchPostCard = ({ post, onClick }) => {
  return (
    <motion.div
      layout
      whileHover={{ scale: 1.02 }}
      className="p-6 border border-gray-200 dark:border-gray-700 rounded-2xl bg-white dark:bg-neutral-800 shadow-sm cursor-pointer"
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">{post.title}</h2>
        <span
          className={`px-2 py-1 text-sm rounded-full font-semibold ${
            post.status === "Published"
              ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
              : post.status === "Draft"
              ? "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
              : "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100"
          }`}
        >
          {post.status}
        </span>
      </div>

      {/* Author & Date */}
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
        By {post.author?.name || "Unknown"} • {new Date(post.createdAt).toLocaleDateString()}
      </p>

      {/* Abstract */}
      <p className="text-gray-700 dark:text-gray-300 mb-3 line-clamp-3">
        {post.abstract}
      </p>

      {/* Herbs and Diseases */}
      <div className="flex flex-wrap gap-2 mb-3">
        {post.herbs?.map((h) => (
          <span
            key={h.id || h}
            className="px-2 py-1 bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-100 rounded-full text-xs font-medium"
          >
            {h.name || h}
          </span>
        ))}
        {post.diseases?.map((d) => (
          <span
            key={d.id || d}
            className="px-2 py-1 bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-100 rounded-full text-xs font-medium"
          >
            {d.name || d}
          </span>
        ))}
      </div>

      {/* Likes */}
      <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm">
        <Heart className="w-4 h-4 text-red-500" />
        <span>{post.likesCount || 0} Likes</span>
      </div>
    </motion.div>
  );
};

export default ResearchPostCard;
