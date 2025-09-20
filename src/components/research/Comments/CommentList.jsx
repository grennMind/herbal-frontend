import CommentCard from "./CommentCard";

const CommentList = ({ comments, postId, onAddReply }) => {
  if (!comments || comments.length === 0) {
    return (
      <div className="p-6 bg-gray-50 dark:bg-gray-800/40 rounded-xl text-gray-600 dark:text-gray-300 text-center">
        No comments yet. Be the first to share your thoughts!
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {comments.map((comment) => (
        <CommentCard
          key={comment.id}
          comment={comment}
          postId={postId}
          onAddReply={onAddReply}
        />
      ))}
    </div>
  );
};

export default CommentList;
