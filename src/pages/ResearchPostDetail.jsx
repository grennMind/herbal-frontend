import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  Leaf, 
  Heart, 
  BookOpen, 
  MessageCircle, 
  ThumbsUp, 
  ThumbsDown,
  CheckCircle,
  AlertCircle,
  Send,
  Reply,
  Edit,
  Trash2,
  Download,
  Eye,
  MoreVertical
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const ResearchPostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyContent, setReplyContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json'
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`/api/research/${id}`, {
        headers
      });

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to load research post');
      }

      setPost(data.data.post);
      setComments(data.data.post.comments || []);
    } catch (err) {
      setError(err.message || 'Failed to load research post');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Please login to post comments');
      }

      const response = await fetch(`/api/research/${id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          content: newComment.trim(),
          parentId: replyingTo?.id || null
        })
      });

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to post comment');
      }

      // Refresh comments
      await fetchPost();
      setNewComment('');
      setReplyingTo(null);
    } catch (err) {
      setError(err.message || 'Failed to post comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReplySubmit = async (parentComment) => {
    if (!replyContent.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Please login to post replies');
      }

      const response = await fetch(`/api/research/${id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          content: replyContent.trim(),
          parentId: parentComment.id
        })
      });

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to post reply');
      }

      // Refresh comments
      await fetchPost();
      setReplyContent('');
      setReplyingTo(null);
    } catch (err) {
      setError(err.message || 'Failed to post reply');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderComment = (comment, depth = 0) => {
    const isReply = depth > 0;
    const hasReplies = comment.replies && comment.replies.length > 0;
    const isReplying = replyingTo?.id === comment.id;

    return (
      <motion.div
        key={comment.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`${isReply ? 'ml-8' : ''} ${depth > 0 ? 'border-l-2 border-neutral-200 dark:border-neutral-700 pl-4' : ''}`}
      >
        <div className={`p-4 rounded-xl ${isReply ? 'bg-neutral-50 dark:bg-neutral-800' : 'bg-white dark:bg-neutral-700'} border border-neutral-200 dark:border-neutral-600 mb-3`}>
          {/* Comment Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
              <div>
                <h4 className="font-medium text-neutral-900 dark:text-white">{comment.author?.name || 'Anonymous'}</h4>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-600 rounded-lg transition-colors">
                <MoreVertical className="h-4 w-4 text-neutral-500" />
              </button>
            </div>
          </div>

          {/* Comment Content */}
          <div className="text-neutral-700 dark:text-neutral-300 mb-3">
            {comment.content}
          </div>

          {/* Comment Actions */}
          <div className="flex items-center gap-4 text-sm">
            <button className="flex items-center gap-1 text-neutral-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              <ThumbsUp className="h-4 w-4" />
              <span>Like</span>
            </button>
            
            <button className="flex items-center gap-1 text-neutral-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              <ThumbsDown className="h-4 w-4" />
              <span>Dislike</span>
            </button>
            
            {depth < 2 && (
              <button 
                onClick={() => setReplyingTo(comment)}
                className="flex items-center gap-1 text-neutral-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                <Reply className="h-4 w-4" />
                <span>Reply</span>
              </button>
            )}
          </div>

          {/* Reply Form */}
          {isReplying && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-600"
            >
              <form onSubmit={(e) => {
                e.preventDefault();
                handleReplySubmit(comment);
              }}>
                <textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Write a reply..."
                  rows={3}
                  className="w-full p-3 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-100 dark:focus:ring-primary-900/20 focus:border-primary-500 dark:focus:border-primary-400 transition-all bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-500 dark:placeholder-neutral-400 resize-none mb-3"
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={!replyContent.trim() || isSubmitting}
                    className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                  >
                    <Send className="h-4 w-4" />
                    {isSubmitting ? 'Posting...' : 'Reply'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setReplyingTo(null);
                      setReplyContent('');
                    }}
                    className="px-4 py-2 border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </div>

        {/* Replies */}
        {hasReplies && (
          <div className="space-y-2">
            {comment.replies.map(reply => renderComment(reply, depth + 1))}
          </div>
        )}
      </motion.div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950" style={{ paddingTop: '100px' }}>
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-neutral-200 dark:bg-neutral-700 rounded w-1/4 mb-6"></div>
              <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-full mb-4"></div>
              <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-3/4 mb-4"></div>
              <div className="h-32 bg-neutral-200 dark:bg-neutral-700 rounded mb-8"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950" style={{ paddingTop: '100px' }}>
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center">
              <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">Error Loading Post</h2>
              <p className="text-neutral-600 dark:text-neutral-300 mb-6">{error}</p>
              <button
                onClick={() => navigate('/research')}
                className="btn btn-primary inline-flex items-center"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Research Hub
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950" style={{ paddingTop: '100px' }}>
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center">
              <BookOpen className="h-16 w-16 text-neutral-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">Post Not Found</h2>
              <p className="text-neutral-600 dark:text-neutral-300 mb-6">The research post you're looking for doesn't exist.</p>
              <button
                onClick={() => navigate('/research')}
                className="btn btn-primary inline-flex items-center"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Research Hub
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950" style={{ paddingTop: '100px' }}>
      <div className="container">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-6">
            <button
              onClick={() => navigate('/research')}
              className="inline-flex items-center text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Research Hub
            </button>
          </motion.div>

          {/* Post Content */}
          <motion.article 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-neutral-800 rounded-2xl border border-neutral-200 dark:border-neutral-700 p-8 mb-8"
          >
            {/* Post Header */}
            <div className="mb-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white mb-3">
                    {post.title}
                  </h1>
                  
                  {post.abstract && (
                    <p className="text-lg text-neutral-600 dark:text-neutral-300 mb-4">
                      {post.abstract}
                    </p>
                  )}
                </div>
                
                {post.isVerified && (
                  <div className="flex items-center gap-1 text-green-600 dark:text-green-400 ml-4">
                    <CheckCircle className="h-5 w-5" />
                    <span className="text-sm font-medium">Verified</span>
                  </div>
                )}
              </div>

              {/* Post Meta */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-500 dark:text-neutral-400 mb-6">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{post.author?.name || 'Unknown Author'}</span>
                  <span className="px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-full text-xs">
                    {post.author?.userType || 'Researcher'}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</span>
                </div>

                {post.herb && (
                  <div className="flex items-center gap-2">
                    <Leaf className="h-4 w-4" />
                    <span>{post.herb.name}</span>
                    {post.herb.scientificName && (
                      <span className="italic">({post.herb.scientificName})</span>
                    )}
                  </div>
                )}

                {post.disease && (
                  <div className="flex items-center gap-2">
                    <Heart className="h-4 w-4" />
                    <span>{post.disease.name}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Post Content */}
            <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
              <div className="whitespace-pre-wrap text-neutral-700 dark:text-neutral-300 leading-relaxed">
                {post.content}
              </div>
            </div>

            {/* References */}
            {post.references && post.references.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-3 flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  References
                </h3>
                <div className="space-y-2">
                  {post.references.map((ref, index) => (
                    <div key={index} className="p-3 bg-neutral-50 dark:bg-neutral-700 rounded-lg">
                      <p className="text-sm text-neutral-700 dark:text-neutral-300">{ref}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Attachments */}
            {post.attachments && post.attachments.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-3 flex items-center gap-2">
                  <Download className="h-5 w-5" />
                  Attachments ({post.attachments.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {post.attachments.map((attachment, index) => (
                    <div key={index} className="flex items-center gap-3 p-4 bg-neutral-50 dark:bg-neutral-700 rounded-lg border border-neutral-200 dark:border-neutral-600">
                      <div className="text-2xl">
                        {attachment.type?.startsWith('image/') && '🖼️'}
                        {attachment.type === 'application/pdf' && '📄'}
                        {attachment.type?.includes('word') && '📝'}
                        {attachment.type === 'text/plain' && '📃'}
                        {attachment.type === 'text/csv' && '📊'}
                        {!['image/', 'application/pdf', 'word', 'text/plain', 'text/csv'].some(t => attachment.type?.includes(t)) && '📎'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-neutral-900 dark:text-white truncate">{attachment.name}</p>
                        <p className="text-xs text-neutral-500">
                          {attachment.size ? `${(attachment.size / 1024).toFixed(1)} KB` : 'Unknown size'}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        {attachment.url && (
                          <a
                            href={attachment.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 hover:bg-neutral-200 dark:hover:bg-neutral-600 rounded transition-colors"
                            title="View file"
                          >
                            <Eye className="h-4 w-4 text-neutral-500" />
                          </a>
                        )}
                        {attachment.url && (
                          <a
                            href={attachment.url}
                            download={attachment.name}
                            className="p-2 hover:bg-neutral-200 dark:hover:bg-neutral-600 rounded transition-colors"
                            title="Download file"
                          >
                            <Download className="h-4 w-4 text-neutral-500" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Post Actions */}
            <div className="flex items-center gap-4 pt-6 border-t border-neutral-200 dark:border-neutral-700">
              <button className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors">
                <ThumbsUp className="h-4 w-4" />
                <span>Like</span>
              </button>
              
              <button className="flex items-center gap-2 px-4 py-2 border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors">
                <ThumbsDown className="h-4 w-4" />
                <span>Dislike</span>
              </button>
              
              <button className="flex items-center gap-2 px-4 py-2 border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors">
                <BookOpen className="h-4 w-4" />
                <span>Save</span>
              </button>
            </div>
          </motion.article>

          {/* Comments Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-neutral-800 rounded-2xl border border-neutral-200 dark:border-neutral-700 p-8"
          >
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-6 flex items-center gap-2">
              <MessageCircle className="h-6 w-6" />
              Discussion ({comments.length})
            </h2>

            {/* New Comment Form */}
            <div className="mb-8">
              <form onSubmit={handleCommentSubmit}>
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Share your thoughts on this research..."
                  rows={4}
                  className="w-full p-4 border border-neutral-300 dark:border-neutral-600 rounded-xl focus:ring-4 focus:ring-primary-100 dark:focus:ring-primary-900/20 focus:border-primary-500 dark:focus:border-primary-400 transition-all bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white placeholder-neutral-500 dark:placeholder-neutral-400 resize-none mb-4"
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={!newComment.trim() || isSubmitting}
                    className="px-6 py-3 bg-primary-500 text-white rounded-xl hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 font-medium"
                  >
                    <Send className="h-4 w-4" />
                    {isSubmitting ? 'Posting...' : 'Post Comment'}
                  </button>
                </div>
              </form>
            </div>

            {/* Comments List */}
            <div className="space-y-4">
              {comments.length === 0 ? (
                <div className="text-center py-8 text-neutral-500 dark:text-neutral-400">
                  <MessageCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No comments yet. Be the first to share your thoughts!</p>
                </div>
              ) : (
                comments.map(comment => renderComment(comment))
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ResearchPostDetail;
