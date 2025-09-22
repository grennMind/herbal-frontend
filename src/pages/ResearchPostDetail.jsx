import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, AlertCircle, BookOpen } from "lucide-react";

import PostHeader from "../components/research/PostHeader";
import PostContent from "../components/research/PostContent";
import PostActions from "../components/research/PostActions";
import Attachments from "../components/research/Attachments";
import CommentList from "../components/research/Comments/CommentList";
import NewCommentForm from "../components/research/Comments/NewCommentForm";
import { fetchResearchPost } from "../api/research";

const ResearchPostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadPost = async () => {
      try {
        setIsLoading(true);
        const postData = await fetchResearchPost(id);
        setPost(postData);
        setComments(postData.comments || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadPost();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center">
        <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Error Loading Post</h2>
        <p className="mb-6">{error}</p>
        <button
          onClick={() => navigate("/research")}
          className="btn btn-primary inline-flex items-center"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Research Hub
        </button>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center">
        <BookOpen className="h-16 w-16 text-neutral-400 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Post Not Found</h2>
        <p className="mb-6">The research post you're looking for doesn't exist.</p>
        <button
          onClick={() => navigate("/research")}
          className="btn btn-primary inline-flex items-center"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Research Hub
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 pt-24">
      <div className="container max-w-4xl mx-auto space-y-8">
        {/* Back Button */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <button
            onClick={() => navigate("/research")}
            className="inline-flex items-center text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Research Hub
          </button>
        </motion.div>

        {/* Post Header */}
        <PostHeader post={post} />

        {/* Post Content */}
        <PostContent content={post.content} />

        {/* Attachments */}
        {post.attachments?.length > 0 && <Attachments attachments={post.attachments} />}

        {/* Post Actions */}
        <PostActions />

        {/* Comments Section */}
        <div className="bg-white dark:bg-neutral-800 rounded-2xl border border-neutral-200 dark:border-neutral-700 p-8">
          <NewCommentForm postId={id} setComments={setComments} />
          <CommentList comments={comments} setComments={setComments} postId={id} />
        </div>
      </div>
    </div>
  );
};

export default ResearchPostDetail;
