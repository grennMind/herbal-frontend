// File: src/components/research/ResearchFilters.jsx

import { useState } from "react";
import Select from "react-select";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ResearchFilters = ({ herbs, diseases, isOpen, onClose, onApply }) => {
  const [selectedHerbs, setSelectedHerbs] = useState([]);
  const [selectedDiseases, setSelectedDiseases] = useState([]);
  const [status, setStatus] = useState([]);

  const herbOptions = herbs.map(h => ({ value: h.id, label: h.name }));
  const diseaseOptions = diseases.map(d => ({ value: d.id, label: d.name }));

  const toggleStatus = s => {
    setStatus(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  };

  const clearAll = () => {
    setSelectedHerbs([]);
    setSelectedDiseases([]);
    setStatus([]);
  };

  const handleApply = () => {
    onApply({
      herbs: selectedHerbs.map(h => h.value),
      diseases: selectedDiseases.map(d => d.value),
      status,
    });
    onClose();
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

          {/* Sliding Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white dark:bg-gray-900 z-50 shadow-xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Filter Research</h3>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <X className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 flex-1 overflow-y-auto space-y-6">
              {/* Multi-select herbs */}
              <Select
                options={herbOptions}
                isMulti
                placeholder="Select herbs..."
                value={selectedHerbs}
                onChange={setSelectedHerbs}
                classNamePrefix="react-select"
              />

              {/* Multi-select diseases */}
              <Select
                options={diseaseOptions}
                isMulti
                placeholder="Select diseases..."
                value={selectedDiseases}
                onChange={setSelectedDiseases}
                classNamePrefix="react-select"
              />

              {/* Status toggles */}
              <div className="flex gap-2">
                {["Published", "Draft", "Under Review"].map(s => (
                  <motion.button
                    key={s}
                    onClick={() => toggleStatus(s)}
                    whileTap={{ scale: 0.95 }}
                    className={`px-4 py-1 rounded-full font-medium transition-all ${
                      status.includes(s)
                        ? "bg-blue-500 text-white shadow-md animate-pulse"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                    }`}
                  >
                    {s}
                  </motion.button>
                ))}
              </div>

              {/* Selected chips */}
              <div className="flex flex-wrap gap-2">
                {selectedHerbs.map(h => (
                  <motion.div
                    key={h.value}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200 rounded-full text-sm"
                  >
                    {h.label}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedHerbs(prev => prev.filter(x => x.value !== h.value))} />
                  </motion.div>
                ))}

                {selectedDiseases.map(d => (
                  <motion.div
                    key={d.value}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="flex items-center gap-1 px-3 py-1 bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-200 rounded-full text-sm"
                  >
                    {d.label}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedDiseases(prev => prev.filter(x => x.value !== d.value))} />
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <button
                onClick={clearAll}
                className="px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded-xl hover:bg-gray-400 dark:hover:bg-gray-600 font-medium"
              >
                Clear All
              </button>
              <motion.button
                onClick={handleApply}
                whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(0,255,150,0.5)" }}
                className="px-6 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl font-semibold"
              >
                Apply Filters
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ResearchFilters;
