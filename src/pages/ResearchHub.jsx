// src/pages/ResearchHub.jsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import researchService from "../services/researchService";
import ResearchFilters from "../components/research/filters/ResearchFilters";
import ResearchPostCard from "../components/research/cards/ResearchPostCard";
import ResearchPostForm from "../components/research/forms/ResearchPostForm";
import { X, Plus } from "lucide-react";

const ResearchHub = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [filterValues, setFilterValues] = useState({ herbs: [], diseases: [], status: [] });

  // Fetch posts from Supabase
  const fetchPosts = async () => {
    try {
      setLoading(true);
      const data = await researchService.filterPosts(filterValues);
      setPosts(data);
    } catch (err) {
      console.error("Error fetching posts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [filterValues]);

  const handleApplyFilters = (filters) => {
    setFilterValues(filters);
  };

  const handleAddPost = (newPost) => {
    setPosts([newPost, ...posts]);
  };

  return (
    <div className="relative min-h-screen p-4 md:p-8 pt-28">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h1 className="text-3xl md:text-4xl font-bold text-green-700">Research Hub</h1>
        <div className="flex gap-2 mt-4 md:mt-0">
          <button
            onClick={() => setFiltersOpen(true)}
            className="flex items-center gap-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all shadow-md"
          >
            Filters
          </button>
          <button
            onClick={() => setFormOpen(true)}
            className="flex items-center gap-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all shadow-md"
          >
            <Plus className="h-5 w-5" />
            Add New Research
          </button>
        </div>
      </div>

      {/* Research Post Form */}
      <AnimatePresence>
        {formOpen && (
          <ResearchPostForm
            isOpen={formOpen}
            onClose={() => setFormOpen(false)}
            onAdd={handleAddPost}
          />
        )}
      </AnimatePresence>

      {/* Research Filters */}
      <ResearchFilters
        herbs={[]} // Fetch herbs from Supabase if you want dynamic options
        diseases={[]} // Fetch diseases if needed
        isOpen={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        onApply={handleApplyFilters}
      />

      {/* Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {loading ? (
          <p className="text-gray-500 col-span-full text-center">Loading...</p>
        ) : posts.length === 0 ? (
          <p className="text-gray-500 col-span-full text-center">No research posts found.</p>
        ) : (
          posts.map((post) => (
            <motion.div
              key={post.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              whileHover={{ scale: 1.02, boxShadow: "0 10px 20px rgba(0,0,0,0.12)" }}
              className="w-full"
            >
              <ResearchPostCard post={post} />
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default ResearchHub;
