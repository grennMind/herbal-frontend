import { motion } from "framer-motion";
import { ThumbsUp, ThumbsDown, Bookmark, Share2 } from "lucide-react";

const PostActions = ({ post }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex gap-4 mt-4 mb-6"
    >
      <button className="flex items-center gap-1 px-4 py-2 rounded-full border border-gray-200 bg-white hover:bg-green-50 hover:text-green-700 transition">
        <ThumbsUp className="h-4 w-4" /> {post.likes || 0}
      </button>

      <button className="flex items-center gap-1 px-4 py-2 rounded-full border border-gray-200 bg-white hover:bg-red-50 hover:text-red-600 transition">
        <ThumbsDown className="h-4 w-4" /> {post.dislikes || 0}
      </button>

      <button className="flex items-center gap-1 px-4 py-2 rounded-full border border-gray-200 bg-white hover:bg-yellow-50 hover:text-yellow-600 transition">
        <Bookmark className="h-4 w-4" /> Save
      </button>

      <button className="flex items-center gap-1 px-4 py-2 rounded-full border border-gray-200 bg-white hover:bg-blue-50 hover:text-blue-600 transition">
        <Share2 className="h-4 w-4" /> Share
      </button>
    </motion.div>
  );
};

export default PostActions;
