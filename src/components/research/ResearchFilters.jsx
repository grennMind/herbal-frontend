import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Filter, 
  X, 
  Search, 
  Leaf, 
  Heart, 
  CheckCircle, 
  Calendar,
  ChevronDown,
  ChevronUp,
  RotateCcw
} from 'lucide-react';

const ResearchFilters = ({ 
  filters, 
  onFiltersChange, 
  isOpen, 
  onToggle, 
  herbs = [], 
  diseases = [] 
}) => {
  const [localFilters, setLocalFilters] = useState({
    q: '',
    herbId: '',
    diseaseId: '',
    verified: '',
    status: '',
    dateRange: '',
    sortBy: 'newest',
    ...filters
  });

  const [expandedSections, setExpandedSections] = useState({
    search: true,
    herbs: false,
    diseases: false,
    status: false,
    sort: false
  });

  useEffect(() => {
    setLocalFilters(prev => ({ ...prev, ...filters }));
  }, [filters]);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      q: '',
      herbId: '',
      diseaseId: '',
      verified: '',
      status: '',
      dateRange: '',
      sortBy: 'newest'
    };
    setLocalFilters(resetFilters);
    onFiltersChange(resetFilters);
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const hasActiveFilters = Object.values(localFilters).some(value => 
    value !== '' && value !== 'newest'
  );

  const FilterSection = ({ title, icon: Icon, section, children }) => (
    <div className="border-b border-neutral-200 dark:border-neutral-700 last:border-b-0">
      <button
        onClick={() => toggleSection(section)}
        className="w-full flex items-center justify-between p-4 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
      >
        <div className="flex items-center gap-3">
          <Icon className="h-5 w-5 text-neutral-500" />
          <span className="font-medium text-neutral-900 dark:text-white">{title}</span>
        </div>
        {expandedSections[section] ? (
          <ChevronUp className="h-4 w-4 text-neutral-500" />
        ) : (
          <ChevronDown className="h-4 w-4 text-neutral-500" />
        )}
      </button>
      
      <AnimatePresence>
        {expandedSections[section] && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  if (!isOpen) {
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={onToggle}
          className="btn btn-outline inline-flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          Filters
          {hasActiveFilters && (
            <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
          )}
        </button>
        {hasActiveFilters && (
          <button
            onClick={handleReset}
            className="btn btn-ghost text-sm inline-flex items-center gap-1"
          >
            <RotateCcw className="h-3 w-3" />
            Clear
          </button>
        )}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-neutral-800 rounded-2xl border border-neutral-200 dark:border-neutral-700 shadow-xl z-50 max-h-96 overflow-y-auto"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-neutral-200 dark:border-neutral-700">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-primary-500" />
          <h3 className="font-semibold text-neutral-900 dark:text-white">Filter Research</h3>
        </div>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <button
              onClick={handleReset}
              className="text-sm text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors"
            >
              Clear All
            </button>
          )}
          <button
            onClick={onToggle}
            className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded transition-colors"
          >
            <X className="h-4 w-4 text-neutral-500" />
          </button>
        </div>
      </div>

      {/* Filter Sections */}
      <div className="max-h-80 overflow-y-auto">
        {/* Search */}
        <FilterSection title="Search" icon={Search} section="search">
          <input
            type="text"
            value={localFilters.q}
            onChange={(e) => handleFilterChange('q', e.target.value)}
            placeholder="Search in title, abstract, content..."
            className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-100 dark:focus:ring-primary-900/20 focus:border-primary-500 dark:focus:border-primary-400 transition-all bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white placeholder-neutral-500 dark:placeholder-neutral-400 text-sm"
          />
        </FilterSection>

        {/* Herbs */}
        <FilterSection title="Related Herbs" icon={Leaf} section="herbs">
          <select
            value={localFilters.herbId}
            onChange={(e) => handleFilterChange('herbId', e.target.value)}
            className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-100 dark:focus:ring-primary-900/20 focus:border-primary-500 dark:focus:border-primary-400 transition-all bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white text-sm"
          >
            <option value="">All herbs</option>
            {herbs.map(herb => (
              <option key={herb.id} value={herb.id}>
                {herb.name} {herb.scientificName && `(${herb.scientificName})`}
              </option>
            ))}
          </select>
        </FilterSection>

        {/* Diseases */}
        <FilterSection title="Related Conditions" icon={Heart} section="diseases">
          <select
            value={localFilters.diseaseId}
            onChange={(e) => handleFilterChange('diseaseId', e.target.value)}
            className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-100 dark:focus:ring-primary-900/20 focus:border-primary-500 dark:focus:border-primary-400 transition-all bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white text-sm"
          >
            <option value="">All conditions</option>
            {diseases.map(disease => (
              <option key={disease.id} value={disease.id}>
                {disease.name}
              </option>
            ))}
          </select>
        </FilterSection>

        {/* Status */}
        <FilterSection title="Status & Verification" icon={CheckCircle} section="status">
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Verification Status
              </label>
              <select
                value={localFilters.verified}
                onChange={(e) => handleFilterChange('verified', e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-100 dark:focus:ring-primary-900/20 focus:border-primary-500 dark:focus:border-primary-400 transition-all bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white text-sm"
              >
                <option value="">All posts</option>
                <option value="true">Verified only</option>
                <option value="false">Unverified only</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Publication Status
              </label>
              <select
                value={localFilters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-100 dark:focus:ring-primary-900/20 focus:border-primary-500 dark:focus:border-primary-400 transition-all bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white text-sm"
              >
                <option value="">All statuses</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="under_review">Under Review</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Date Range
              </label>
              <select
                value={localFilters.dateRange}
                onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-100 dark:focus:ring-primary-900/20 focus:border-primary-500 dark:focus:border-primary-400 transition-all bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white text-sm"
              >
                <option value="">All time</option>
                <option value="today">Today</option>
                <option value="week">This week</option>
                <option value="month">This month</option>
                <option value="year">This year</option>
              </select>
            </div>
          </div>
        </FilterSection>

        {/* Sort */}
        <FilterSection title="Sort By" icon={Calendar} section="sort">
          <select
            value={localFilters.sortBy}
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-100 dark:focus:ring-primary-900/20 focus:border-primary-500 dark:focus:border-primary-400 transition-all bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white text-sm"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="most_commented">Most commented</option>
            <option value="most_liked">Most liked</option>
            <option value="title_asc">Title A-Z</option>
            <option value="title_desc">Title Z-A</option>
          </select>
        </FilterSection>
      </div>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="p-4 border-t border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-700">
          <div className="text-sm text-neutral-600 dark:text-neutral-300 mb-2">
            Active filters:
          </div>
          <div className="flex flex-wrap gap-2">
            {localFilters.q && (
              <span className="px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded text-xs">
                Search: {localFilters.q}
              </span>
            )}
            {localFilters.herbId && (
              <span className="px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded text-xs">
                Herb: {herbs.find(h => h.id === localFilters.herbId)?.name}
              </span>
            )}
            {localFilters.diseaseId && (
              <span className="px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded text-xs">
                Condition: {diseases.find(d => d.id === localFilters.diseaseId)?.name}
              </span>
            )}
            {localFilters.verified && (
              <span className="px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded text-xs">
                {localFilters.verified === 'true' ? 'Verified only' : 'Unverified only'}
              </span>
            )}
            {localFilters.status && (
              <span className="px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded text-xs">
                Status: {localFilters.status}
              </span>
            )}
            {localFilters.dateRange && (
              <span className="px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded text-xs">
                Date: {localFilters.dateRange}
              </span>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ResearchFilters;
