import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowBigUp, ArrowBigDown, Bookmark, Share2 } from "lucide-react";
import { fetchResearchPost, postComment, voteOnPost, savePost, deleteResearchPost } from "../api/research";
import { getCurrentUser } from "../services/userService";

const CommentNode = ({ node, onReply }) => {
  const [openReply, setOpenReply] = useState(false);
  const [replyText, setReplyText] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onReply(node.id, replyText);
    setReplyText("");
    setOpenReply(false);
  };

  return (
    <div className="mt-4">
      <div className="p-3 rounded-lg bg-neutral-900/40 border border-neutral-800">
        <div className="text-sm text-neutral-300 whitespace-pre-wrap">{node.content}</div>
        <div className="flex gap-3 mt-2 text-xs text-neutral-500">
          <button className="hover:text-white" onClick={() => setOpenReply((v) => !v)}>Reply</button>
        </div>
        <AnimatePresence>
          {openReply && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              onSubmit={handleSubmit}
              className="mt-2"
            >
              <textarea
                className="w-full p-2 rounded-md bg-neutral-900 border border-neutral-800 text-white"
                rows={3}
                placeholder="Write a reply..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
              />
              <div className="mt-2 flex gap-2">
                <button type="submit" className="px-3 py-1 rounded-md bg-blue-600 text-white">Post</button>
                <button type="button" className="px-3 py-1 rounded-md bg-neutral-800 text-neutral-200" onClick={() => setOpenReply(false)}>Cancel</button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
      {node.replies?.length > 0 && (
        <div className="ml-6 border-l border-neutral-800 pl-4">
          {node.replies.map((child) => (
            <CommentNode key={child.id} node={child} onReply={onReply} />
          ))}
        </div>
      )}
    </div>
  );
};

const ResearchPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [myVote, setMyVote] = useState(0);
  const [newComment, setNewComment] = useState("");
  const [saving, setSaving] = useState(false);
  const [voting, setVoting] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const load = async () => {
    setLoading(true);
    const { post: p, comments: c, myVote: v } = await fetchResearchPost(id);
    setPost(p);
    setComments(c || []);
    setMyVote(v || 0);
    setLoading(false);
  };

  useEffect(() => {
    load();
    (async () => {
      try {
        const u = await getCurrentUser();
        setCurrentUser(u);
      } catch {
        setCurrentUser(null);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const votesCount = useMemo(() => post?.votes_count ?? 0, [post]);

  const handleVote = async (value) => {
    if (voting) return;
    try {
      setVoting(true);
      const next = myVote === value ? 0 : value;
      const ok = await voteOnPost(id, next);
      if (ok) {
        setMyVote(next);
        // optimistic: adjust count
        setPost((prev) => prev ? { ...prev, votes_count: (prev.votes_count ?? 0) + (next - myVote) } : prev);
      }
    } finally {
      setVoting(false);
    }
  };

  const handleSave = async () => {
    if (saving) return;
    setSaving(true);
    try {
      await savePost(id, "save");
    } finally {
      setSaving(false);
    }
  };

  const handleAddComment = async (parentId, text) => {
    const c = await postComment(id, text, parentId || null);
    if (!c) return;
    // rebuild tree: simplest is to reload; for UX, we do minimal insert
    await load();
  };

  const canDelete = useMemo(() => {
    if (!currentUser || !post) return false;
    const role = currentUser.profile?.user_type || currentUser.user_type;
    return role === 'researcher' && post.author_id === currentUser.id;
  }, [currentUser, post]);

  const handleDelete = async () => {
    if (!canDelete) return;
    const ok = window.confirm("Delete this research post? This action cannot be undone.");
    if (!ok) return;
    const success = await deleteResearchPost(id);
    if (success) {
      navigate("/research-hub");
    }
  };

  const submitRootComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    await handleAddComment(null, newComment.trim());
    setNewComment("");
  };

  if (loading) {
    return <div className="container pt-32 text-neutral-300">Loading...</div>;
  }
  if (!post) {
    return <div className="container pt-32 text-neutral-300">Post not found.</div>;
  }

  return (
    <div className="container pt-28 pb-16">
      <div className="grid lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
            <div className="flex items-start justify-between">
              <h1 className="text-2xl font-extrabold text-neutral-900 dark:text-white">{post.title}</h1>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleVote(1)}
                  className={`p-2 rounded-md border ${myVote === 1 ? 'bg-blue-600 text-white border-blue-500' : 'border-neutral-800 text-neutral-300 hover:bg-neutral-800'}`}
                  disabled={voting}
                >
                  <ArrowBigUp className="w-5 h-5" />
                </button>
                <div className="min-w-[2rem] text-center text-neutral-200">{votesCount}</div>
                <button
                  onClick={() => handleVote(-1)}
                  className={`p-2 rounded-md border ${myVote === -1 ? 'bg-blue-600 text-white border-blue-500' : 'border-neutral-800 text-neutral-300 hover:bg-neutral-800'}`}
                  disabled={voting}
                >
                  <ArrowBigDown className="w-5 h-5" />
                </button>
              </div>
            </div>
            {post.abstract && (
              <p className="mt-2 text-neutral-600 dark:text-neutral-300">{post.abstract}</p>
            )}
            <div className="prose prose-neutral dark:prose-invert max-w-none mt-6 whitespace-pre-wrap">
              {post.content}
            </div>
            {(post.references_list?.length > 0) && (
              <div className="mt-6">
                <h3 className="text-sm font-semibold text-neutral-500">References</h3>
                <ul className="list-disc list-inside text-sm text-neutral-400 mt-2">
                  {post.references_list.map((r, idx) => (
                    <li key={idx}>{typeof r === 'string' ? r : JSON.stringify(r)}</li>
                  ))}
                </ul>
              </div>
            )}
            <div className="mt-6 flex gap-2 flex-wrap">
              <button onClick={handleSave} className="px-3 py-2 rounded-lg bg-neutral-800 text-neutral-200 border border-neutral-700 flex items-center gap-2">
                <Bookmark className="w-4 h-4" /> Save
              </button>
              <button className="px-3 py-2 rounded-lg bg-neutral-800 text-neutral-200 border border-neutral-700 flex items-center gap-2" onClick={() => navigator.clipboard.writeText(window.location.href)}>
                <Share2 className="w-4 h-4" /> Share
              </button>
              {canDelete && (
                <button onClick={handleDelete} className="px-3 py-2 rounded-lg bg-red-600 text-white border border-red-700 flex items-center gap-2">
                  Delete Post
                </button>
              )}
            </div>
          </div>

          {/* Comments */}
          <div className="mt-8 p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
            <h2 className="text-lg font-bold text-white mb-4">Comments</h2>
            <form onSubmit={submitRootComment} className="mb-4">
              <textarea
                className="w-full p-3 rounded-md bg-neutral-900 border border-neutral-800 text-white"
                rows={4}
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <div className="mt-2">
                <button type="submit" className="px-4 py-2 rounded-md bg-green-600 text-white">Post Comment</button>
              </div>
            </form>

            <div>
              {comments?.length ? (
                comments.map((c) => (
                  <CommentNode key={c.id} node={c} onReply={handleAddComment} />
                ))
              ) : (
                <div className="text-neutral-400 text-sm">No comments yet.</div>
              )}
            </div>
          </div>
        </div>
        <div className="lg:col-span-1">
          {/* Sidebar for tags/herb/disease */}
          <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
            <div className="text-sm text-neutral-400">Metadata</div>
            <div className="mt-2 text-sm text-neutral-300 space-y-1">
              <div>Status: {post.status}</div>
              {post.related_herb_id && <div>Herb: {post.related_herb_id}</div>}
              {post.related_disease_id && <div>Disease: {post.related_disease_id}</div>}
              <div>Verified: {post.is_verified ? 'Yes' : 'No'}</div>
              <div>Created: {new Date(post.created_at || Date.now()).toLocaleString()}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResearchPost;
