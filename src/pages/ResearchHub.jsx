import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Filter, BookOpen, CheckCircle, AlertCircle, User, Plus } from 'lucide-react';
import ResearchPostForm from '../components/research/ResearchPostForm';
import ResearchFilters from '../components/research/ResearchFilters';

const ResearchHub = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [posts, setPosts] = useState([]);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 });
  const [q, setQ] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({});
  const [herbs, setHerbs] = useState([]);
  const [diseases, setDiseases] = useState([]);

  const fetchPosts = async (page = 1) => {
    try {
      setIsLoading(true);
      setError('');
      const params = new URLSearchParams();
      params.set('page', String(page));
      params.set('limit', '10');
      
      // Add search and filter parameters
      const searchQuery = filters.q || q;
      if (searchQuery) params.set('q', searchQuery);
      if (filters.herbId) params.set('herbId', filters.herbId);
      if (filters.diseaseId) params.set('diseaseId', filters.diseaseId);
      if (filters.verified) params.set('verified', filters.verified);
      if (filters.status) params.set('status', filters.status);
      
      const res = await fetch(`/api/research?${params.toString()}`);
      const raw = await res.text();
      let data;
      try {
        data = raw ? JSON.parse(raw) : {};
      } catch (e) {
        throw new Error(raw || 'Invalid server response');
      }
      if (!res.ok || !data.success) throw new Error(data.message || 'Failed to load research');
      setPosts(data.data.posts || []);
      setPagination(data.data.pagination || { currentPage: 1, totalPages: 1 });
    } catch (e) {
      setError(e.message || 'Failed to load research');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchHerbsAndDiseases = async () => {
    try {
      // Fetch herbs and diseases for filters
      // For now using mock data - replace with actual API calls
      setHerbs([
        { id: '1', name: 'Turmeric', scientificName: 'Curcuma longa' },
        { id: '2', name: 'Ginger', scientificName: 'Zingiber officinale' },
        { id: '3', name: 'Echinacea', scientificName: 'Echinacea purpurea' },
        { id: '4', name: 'Chamomile', scientificName: 'Matricaria chamomilla' },
        { id: '5', name: 'Peppermint', scientificName: 'Mentha piperita' }
      ]);
      
      setDiseases([
        { id: '1', name: 'Inflammation' },
        { id: '2', name: 'Digestive Issues' },
        { id: '3', name: 'Stress and Anxiety' },
        { id: '4', name: 'Common Cold' },
        { id: '5', name: 'Insomnia' }
      ]);
    } catch (err) {
      console.error('Error fetching herbs and diseases:', err);
    }
  };

  useEffect(() => {
    fetchPosts(1);
    fetchHerbsAndDiseases();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSearch = (e) => {
    e.preventDefault();
    fetchPosts(1);
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    fetchPosts(1);
  };

  const goToPage = (page) => {
    if (page < 1 || page > pagination.totalPages) return;
    fetchPosts(page);
  };

  const handleCreatePost = async (postData) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Please login to create research posts');
      }

      const response = await fetch('/api/research', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(postData)
      });

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to create research post');
      }

      // Refresh the posts list
      await fetchPosts(1);
      setShowCreateForm(false);
    } catch (err) {
      throw err;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950" style={{ paddingTop: '100px' }}>
      <div className="container">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <BookOpen className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 dark:text-white mb-3">Herbal Research Hub</h1>
          <p className="text-neutral-600 dark:text-neutral-300 max-w-3xl mx-auto">
            Explore and share research on herbs, diseases, dosages, safety, and efficacy. Help build a collaborative knowledge base.
          </p>
        </motion.div>

        {/* Search & Actions */}
        <div className="mb-8 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
          <form onSubmit={onSearch} className="flex-1">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400 dark:text-neutral-500" />
              <input
                type="text"
                placeholder="Search research by title, abstract, or content..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className="w-full pl-12 pr-4 py-4 text-base border border-neutral-300 dark:border-neutral-600 rounded-2xl focus:ring-4 focus:ring-primary-100 dark:focus:ring-primary-900/20 focus:border-primary-500 dark:focus:border-primary-400 transition-all bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-500 dark:placeholder-neutral-400"
              />
            </div>
          </form>

          <div className="flex gap-3 relative">
            <ResearchFilters
              filters={filters}
              onFiltersChange={handleFiltersChange}
              isOpen={showFilters}
              onToggle={() => setShowFilters(!showFilters)}
              herbs={herbs}
              diseases={diseases}
            />
            <button 
              onClick={() => setShowCreateForm(true)}
              className="btn btn-primary inline-flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Research Post
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 rounded-xl text-red-700 dark:text-red-300 flex items-start gap-2">
            <AlertCircle className="h-5 w-5 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Create Post Form */}
        {showCreateForm && (
          <div className="mb-8">
            <ResearchPostForm
              onSave={handleCreatePost}
              onCancel={() => setShowCreateForm(false)}
            />
          </div>
        )}

        {/* Results */}
        <div className="grid grid-cols-1 gap-4">
          {isLoading ? (
            <div className="p-8 bg-white dark:bg-neutral-800 rounded-2xl border border-neutral-200 dark:border-neutral-700 text-center">Loading...</div>
          ) : posts.length === 0 ? (
            <div className="p-8 bg-white dark:bg-neutral-800 rounded-2xl border border-neutral-200 dark:border-neutral-700 text-center">No research found.</div>
          ) : (
            posts.map((post) => (
              <div key={post.id} className="p-6 bg-white dark:bg-neutral-800 rounded-2xl border border-neutral-200 dark:border-neutral-700">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Link to={`/research/${post.id}`} className="text-xl font-semibold text-neutral-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                      {post.title}
                    </Link>
                    {post.abstract && (
                      <p className="mt-2 text-neutral-600 dark:text-neutral-300 line-clamp-2">{post.abstract}</p>
                    )}
                    <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-neutral-500 dark:text-neutral-400">
                      <span className="inline-flex items-center gap-1"><User className="h-4 w-4" /> {post.author?.name || 'Unknown'}</span>
                      {post.herb?.name && (
                        <span className="inline-flex items-center gap-1">Herb: {post.herb.name}</span>
                      )}
                      {post.disease?.name && (
                        <span className="inline-flex items-center gap-1">Disease: {post.disease.name}</span>
                      )}
                      {post.isVerified ? (
                        <span className="inline-flex items-center gap-1 text-green-600 dark:text-green-400"><CheckCircle className="h-4 w-4" /> Verified</span>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {posts.length > 0 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            <button className="btn btn-outline" onClick={() => goToPage(pagination.currentPage - 1)} disabled={pagination.currentPage <= 1}>
              Prev
            </button>
            <span className="text-sm text-neutral-600 dark:text-neutral-300">
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>
            <button className="btn btn-outline" onClick={() => goToPage(pagination.currentPage + 1)} disabled={pagination.currentPage >= pagination.totalPages}>
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResearchHub;
