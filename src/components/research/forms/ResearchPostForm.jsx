import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { supabase } from "../../../config/supabase";

const ResearchPostForm = ({ isOpen, onClose, onAdd }) => {
  const [title, setTitle] = useState("");
  const [abstract, setAbstract] = useState("");
  const [content, setContent] = useState("");
  const [relatedHerb, setRelatedHerb] = useState(null);
  const [relatedDisease, setRelatedDisease] = useState(null);
  const [herbs, setHerbs] = useState([]);
  const [diseases, setDiseases] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch herbs & diseases for dropdowns
  useEffect(() => {
    const fetchData = async () => {
      let { data: herbsData } = await supabase.from("herbs").select("id,name").eq("is_active", true);
      let { data: diseasesData } = await supabase.from("diseases").select("id,name").eq("is_active", true);
      setHerbs(herbsData || []);
      setDiseases(diseasesData || []);
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase
      .from("research_posts")
      .insert([
        {
          title,
          abstract,
          content,
          related_herb_id: relatedHerb,
          related_disease_id: relatedDisease,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error(error);
      setLoading(false);
    } else {
      onAdd(data); // Update ResearchHub posts instantly
      setTitle("");
      setAbstract("");
      setContent("");
      setRelatedHerb(null);
      setRelatedDisease(null);
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-40"
          />

          {/* Sliding Form Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed right-0 top-20 h-[calc(100%-5rem)] w-full max-w-lg bg-white dark:bg-gray-900 z-50 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Add New Research
              </h2>
              <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700">
                <X className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 flex-1 overflow-y-auto">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200">Title</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:text-white"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200">Abstract</label>
                  <textarea
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:text-white"
                    value={abstract}
                    onChange={(e) => setAbstract(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200">Content</label>
                  <textarea
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:text-white"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                    rows={6}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200">Related Herb</label>
                    <select
                      className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:text-white"
                      value={relatedHerb || ""}
                      onChange={(e) => setRelatedHerb(e.target.value)}
                    >
                      <option value="">Select Herb</option>
                      {herbs.map((h) => (
                        <option key={h.id} value={h.id}>{h.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200">Related Disease</label>
                    <select
                      className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:text-white"
                      value={relatedDisease || ""}
                      onChange={(e) => setRelatedDisease(e.target.value)}
                    >
                      <option value="">Select Disease</option>
                      {diseases.map((d) => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Submit */}
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(0,150,255,0.4)" }}
                  className="w-full py-2 px-4 bg-blue-500 text-white rounded-xl font-semibold"
                  disabled={loading}
                >
                  {loading ? "Posting..." : "Post Research"}
                </motion.button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ResearchPostForm;
