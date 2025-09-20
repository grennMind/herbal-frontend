import { useState } from "react";
import { User } from "lucide-react";
import ReplyForm from "./ReplyForm";

const CommentCard = ({ comment, postId, onAddReply }) => {
  const [showReplyForm, setShowReplyForm] = useState(false);

  return (
    <div className="p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl">
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <User className="h-5 w-5 text-green-600" />
        <span className="font-medium text-gray-800 dark:text-gray-200">
          {comment.author || "Anonymous"}
        </span>
        <span className="text-sm text-gray-500 ml-auto">
          {new Date(comment.createdAt).toLocaleDateString()}
        </span>
      </div>

      {/* Content */}
      <p className="text-gray-700 dark:text-gray-300">{comment.text}</p>

      {/* Actions */}
      <div className="mt-3 flex gap-4 text-sm text-green-600">
        <button
          onClick={() => setShowReplyForm(!showReplyForm)}
          className="hover:underline"
        >
          Reply
        </button>
      </div>

      {/* Reply Form */}
      {showReplyForm && (
        <div className="mt-3">
          <ReplyForm
            postId={postId}
            parentId={comment.id}
            onAddReply={onAddReply}
            onCancel={() => setShowReplyForm(false)}
          />
        </div>
      )}

      {/* Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-4 pl-6 border-l-2 border-gray-200 dark:border-gray-700 space-y-4">
          {comment.replies.map((reply) => (
            <CommentCard
              key={reply.id}
              comment={reply}
              postId={postId}
              onAddReply={onAddReply}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentCard;
