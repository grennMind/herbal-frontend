import React, { useState, useEffect } from "react";
import PostContent from "../components/research/PostContent";
import PostActions from "../components/research/PostActions";
import CommentList from "../components/research/Comments/CommentList";
import NewCommentForm from "../components/research/Comments/NewCommentForm";
import NewResearchForm from "../components/research/NewResearchForm";
import { fetchResearchPosts } from "../api/research"; // Make sure this exists

const ResearchHub = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setIsLoading(true);
      setError("");

      const data = await fetchResearchPosts(); // API should return array of posts
      setPosts(data || []);
    } catch (err) {
      setError(err.message || "Failed to load research posts");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-neutral-900 dark:text-white">
          Research Hub
        </h1>

        {/* New Research Form */}
        <div className="mb-12">
          <NewResearchForm onPostCreated={loadPosts} />
        </div>

        {/* Loading & Error Handling */}
        {isLoading && <p className="text-center text-neutral-500">Loading posts...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        {/* Research Posts */}
        {!isLoading && posts.length === 0 && (
          <p className="text-center text-neutral-500">No research posts yet.</p>
        )}

        <div className="space-y-10">
          {posts.map((post) => (
            <article key={post.id} className="bg-white dark:bg-neutral-800 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-700">
              {/* Post Content */}
              <PostContent post={post} />

              {/* Post Actions */}
              <PostActions post={post} />

              {/* Comments Section */}
              <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4 text-neutral-900 dark:text-white">
                  Discussion
                </h2>

                <NewCommentForm postId={post.id} onCommentPosted={loadPosts} />

                <CommentList comments={post.comments || []} />
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResearchHub;
