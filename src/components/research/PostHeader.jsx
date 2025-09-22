import { User, CheckCircle } from "lucide-react";

const PostHeader = ({ post }) => (
  <header className="mb-6">
    <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
      {post.title}
    </h1>
    <div className="flex items-center gap-2 mt-2">
      <User className="h-4 w-4 text-gray-500" />
      <span className="text-sm text-gray-700">{post.author?.name || "Unknown Author"}</span>
      {post.isVerified && (
        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-medium">
          <CheckCircle className="h-3 w-3" /> Verified
        </span>
      )}
    </div>
  </header>
);

export default PostHeader;