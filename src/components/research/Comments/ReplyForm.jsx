import { useState } from "react";

const ReplyForm = ({ postId, parentId, onAddReply, onCancel }) => {
  const [reply, setReply] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddReply(postId, parentId, reply);
    setReply("");
    onCancel();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <textarea
        value={reply}
        onChange={(e) => setReply(e.target.value)}
        placeholder="Write your reply..."
        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-600 focus:outline-none text-sm"
        rows={2}
        required
      ></textarea>

      <div className="flex gap-2 justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="px-3 py-1 text-sm border rounded-md hover:bg-gray-100"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-3 py-1 text-sm bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          Reply
        </button>
      </div>
    </form>
  );
};

export default ReplyForm;
