import React from "react";
import PostActions from "./PostActions";
import CommentList from "./Comments/CommentList";

const PostContent = ({ post }) => {
  return (
    <section className="prose prose-green dark:prose-invert max-w-none mb-8">
      {/* Abstract */}
      {post.abstract && (
        <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-xl border border-green-200 mb-6">
          <h2 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-2">
            Abstract
          </h2>
          <p className="text-gray-700 dark:text-gray-300">{post.abstract}</p>
        </div>
      )}

      {/* Full content */}
      <article
        className="text-gray-800 dark:text-gray-200 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* Tags: Herb + Disease */}
      <div className="mt-6 flex flex-wrap gap-2">
        {post.herb?.name && (
          <span className="px-3 py-1 text-sm rounded-full bg-green-100 text-green-700">
            🌿 {post.herb.name}
          </span>
        )}
        {post.disease?.name && (
          <span className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-700">
            💊 {post.disease.name}
          </span>
        )}
      </div>

      {/* References */}
      {post.references?.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-3">References</h3>
          <ol className="list-decimal list-inside space-y-1 text-gray-600 dark:text-gray-400">
            {post.references.map((ref, i) => (
              <li key={i}>
                <a
                  href={ref.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-600 hover:underline"
                >
                  {ref.title || ref.url}
                </a>
              </li>
            ))}
          </ol>
        </div>
      )}
    </section>
  );
};

export default PostContent;
