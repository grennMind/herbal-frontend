import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { createResearchPost } from "../api/research";
import { supabase } from "../config/supabase";

export default function ResearchNew() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [abstract, setAbstract] = useState("");
  const [content, setContent] = useState("");
  const [referencesList, setReferencesList] = useState([""]);
  const [relatedHerb, setRelatedHerb] = useState("");
  const [relatedDisease, setRelatedDisease] = useState("");
  const [herbs, setHerbs] = useState([]);
  const [diseases, setDiseases] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    (async () => {
      const { data: herbsData } = await supabase.from("herbs").select("id,name").eq("is_active", true);
      const { data: diseasesData } = await supabase.from("diseases").select("id,name").eq("is_active", true);
      setHerbs(herbsData || []);
      setDiseases(diseasesData || []);
    })();
  }, []);

  const addReference = () => setReferencesList((prev) => [...prev, ""]);
  const updateReference = (idx, val) => setReferencesList((prev) => prev.map((r, i) => (i === idx ? val : r)));
  const removeReference = (idx) => setReferencesList((prev) => prev.filter((_, i) => i !== idx));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setNotice("");
    try {
      const payload = {
        title,
        abstract,
        content,
        references: referencesList.filter(Boolean),
        relatedHerbId: relatedHerb || null,
        relatedDiseaseId: relatedDisease || null,
        schemaVersion: "1.0",
        entities: {},
        keyphrases: [],
        annotations: {},
      };
      const post = await createResearchPost(payload);
      if (post) {
        setNotice("Research post published successfully.");
        // Redirect to Research Hub so the new post appears in the feed
        navigate(`/research-hub`);
      }
      else {
        // Fallback: insert directly via Supabase client (RLS must allow researcher inserts)
        const { data: auth } = await supabase.auth.getUser();
        if (!auth?.user) {
          setError("Please log in to publish a research post.");
          return;
        }
        const insertBody = {
          title,
          abstract,
          content,
          references_list: referencesList.filter(Boolean),
          attachments: [],
          related_herb_id: relatedHerb || null,
          related_disease_id: relatedDisease || null,
          author_id: auth.user.id,
          status: 'published',
        };
        const { data: directPost, error: directErr } = await supabase
          .from('research_posts')
          .insert([insertBody])
          .select('*')
          .single();
        if (directErr) {
          console.error('Supabase direct insert error:', directErr);
          setError("Failed to publish. Ensure your account has researcher access and try again.");
          return;
        }
        // Best-effort: do not block on structured creation; the backend can enrich later
        setNotice("Research post published successfully.");
        navigate('/research-hub');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container pt-28 pb-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-extrabold text-neutral-900 dark:text-neutral-100 mb-6">New Research Post</h1>
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-100 text-red-800 border border-red-200">{error}</div>
        )}
        {notice && (
          <div className="mb-4 p-3 rounded-lg bg-green-100 text-green-800 border border-green-200">{notice}</div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-1 font-medium text-neutral-700 dark:text-neutral-200">Title</label>
            <input className="w-full px-3 py-2 rounded-lg border dark:bg-neutral-900 dark:text-white" value={title} onChange={(e)=>setTitle(e.target.value)} required />
          </div>
          <div>
            <label className="block mb-1 font-medium text-neutral-700 dark:text-neutral-200">Abstract</label>
            <textarea className="w-full px-3 py-2 rounded-lg border dark:bg-neutral-900 dark:text-white" rows={3} value={abstract} onChange={(e)=>setAbstract(e.target.value)} />
          </div>
          <div>
            <label className="block mb-1 font-medium text-neutral-700 dark:text-neutral-200">Content</label>
            <textarea className="w-full px-3 py-2 rounded-lg border dark:bg-neutral-900 dark:text-white" rows={10} value={content} onChange={(e)=>setContent(e.target.value)} required />
          </div>
          <div>
            <label className="block mb-1 font-medium text-neutral-700 dark:text-neutral-200">References</label>
            <div className="space-y-2">
              {referencesList.map((ref, idx) => (
                <div key={idx} className="flex gap-2">
                  <input className="flex-1 px-3 py-2 rounded-lg border dark:bg-neutral-900 dark:text-white" value={ref} onChange={(e)=>updateReference(idx, e.target.value)} placeholder="e.g., PMID:123456 or full citation" />
                  <button type="button" className="px-3 py-2 rounded-lg bg-neutral-800 text-white" onClick={() => removeReference(idx)}>Remove</button>
                </div>
              ))}
              <button type="button" className="px-3 py-2 rounded-lg bg-neutral-800 text-white" onClick={addReference}>Add Reference</button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-medium text-neutral-700 dark:text-neutral-200">Related Herb</label>
              <select className="w-full px-3 py-2 rounded-lg border dark:bg-neutral-900 dark:text-white" value={relatedHerb} onChange={(e)=>setRelatedHerb(e.target.value)}>
                <option value="">Select Herb</option>
                {herbs.map((h)=> <option key={h.id} value={h.id}>{h.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block mb-1 font-medium text-neutral-700 dark:text-neutral-200">Related Disease</label>
              <select className="w-full px-3 py-2 rounded-lg border dark:bg-neutral-900 dark:text-white" value={relatedDisease} onChange={(e)=>setRelatedDisease(e.target.value)}>
                <option value="">Select Disease</option>
                {diseases.map((d)=> <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>
          </div>
          <div className="flex justify-end">
            <motion.button whileHover={{ scale: 1.03 }} type="submit" disabled={submitting} className="px-5 py-2 rounded-lg bg-blue-600 text-white">
              {submitting ? 'Publishing...' : 'Publish Post'}
            </motion.button>
          </div>
        </form>
      </div>
    </div>
  );
}
