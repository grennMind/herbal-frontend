// File: src/components/research/cards/ResearchPostCard.jsx
import { motion } from "framer-motion";
import { MessageSquare, ArrowBigUp } from "lucide-react";

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
            (post.status || '').toLowerCase() === "published"
              ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
              : (post.status || '').toLowerCase() === "draft"
              ? "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
              : "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100"
          }`}
        >
          {(post.status || '').charAt(0).toUpperCase() + (post.status || '').slice(1)}
        </span>
      </div>

      {/* Author & Date */}
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
        {new Date(post.created_at || post.createdAt || Date.now()).toLocaleDateString()}
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

      {/* Votes and Comments */}
      <div className="flex items-center gap-4 text-gray-500 dark:text-gray-400 text-sm">
        <div className="flex items-center gap-1">
          <ArrowBigUp className="w-4 h-4 text-blue-500" />
          <span>{post.votes_count ?? 0}</span>
        </div>
        <div className="flex items-center gap-1">
          <MessageSquare className="w-4 h-4 text-gray-400" />
          <span>{post.comments_count ?? 0}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default ResearchPostCard;
