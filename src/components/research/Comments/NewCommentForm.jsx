import { useState } from "react";

const NewCommentForm = ({ onAdd }) => {
  const [comment, setComment] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(comment);
    setComment("");
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 bg-white dark:bg-gray-900 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Add a comment..."
        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-600 focus:outline-none"
        rows={3}
        required
      ></textarea>

      <div className="flex justify-end mt-3">
        <button
          type="submit"
          className="px-4 py-2 bg-green-700 text-white rounded-md hover:bg-green-600"
        >
          Post Comment
        </button>
      </div>
    </form>
  );
};

export default NewCommentForm;