import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  BookOpen, 
  Leaf, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Save,
  X,
  Search,
  Filter
} from 'lucide-react';

const KnowledgeManagement = () => {
  const [activeTab, setActiveTab] = useState('plants');
  const [isAddingKnowledge, setIsAddingKnowledge] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [plants, setPlants] = useState([]);
  const [remedies, setRemedies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [plantForm, setPlantForm] = useState({
    commonName: '',
    botanicalName: '',
    family: '',
    origin: '',
    description: '',
    medicinalUses: [],
    activeCompounds: [],
    preparationMethods: [],
    dosage: '',
    contraindications: [],
    safetyNotes: '',
    images: []
  });

  const [remedyForm, setRemedyForm] = useState({
    title: '',
    condition: '',
    description: '',
    ingredients: [],
    preparation: '',
    dosage: '',
    duration: '',
    safetyWarnings: [],
    effectiveness: '',
    references: []
  });

  useEffect(() => {
    fetchKnowledgeData();
  }, []);

  const fetchKnowledgeData = async () => {
    // Mock data - replace with actual API calls
    setPlants([
      {
        id: '1',
        commonName: 'Turmeric',
        botanicalName: 'Curcuma longa',
        family: 'Zingiberaceae',
        status: 'published',
        lastUpdated: '2024-01-15',
        views: 1250,
        contributions: 3
      },
      {
        id: '2',
        commonName: 'Ashwagandha',
        botanicalName: 'Withania somnifera',
        family: 'Solanaceae',
        status: 'pending',
        lastUpdated: '2024-01-10',
        views: 890,
        contributions: 2
      }
    ]);

    setRemedies([
      {
        id: '1',
        title: 'Stress Relief Tea Blend',
        condition: 'Stress and Anxiety',
        status: 'published',
        lastUpdated: '2024-01-12',
        views: 650,
        rating: 4.8
      }
    ]);
  };

  const handlePlantInputChange = (e) => {
    const { name, value } = e.target;
    setPlantForm(prev => ({ ...prev, [name]: value }));
  };

  const handleRemedyInputChange = (e) => {
    const { name, value } = e.target;
    setRemedyForm(prev => ({ ...prev, [name]: value }));
  };

  const handleArrayInput = (form, field, value, setForm) => {
    if (value.trim()) {
      setForm(prev => ({
        ...prev,
        [field]: [...prev[field], value.trim()]
      }));
    }
  };

  const removeArrayItem = (form, field, index, setForm) => {
    setForm(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handlePlantSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Mock API call - replace with actual endpoint
      const newPlant = {
        id: Date.now().toString(),
        ...plantForm,
        status: 'pending',
        lastUpdated: new Date().toISOString(),
        views: 0,
        contributions: 1
      };

      if (editingItem) {
        setPlants(prev => prev.map(p => p.id === editingItem.id ? newPlant : p));
      } else {
        setPlants(prev => [newPlant, ...prev]);
      }

      resetPlantForm();
      setIsAddingKnowledge(false);
    } catch (err) {
      setError('Failed to save plant information');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemedySubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Mock API call - replace with actual endpoint
      const newRemedy = {
        id: Date.now().toString(),
        ...remedyForm,
        status: 'pending',
        lastUpdated: new Date().toISOString(),
        views: 0,
        rating: 0
      };

      if (editingItem) {
        setRemedies(prev => prev.map(r => r.id === editingItem.id ? newRemedy : r));
      } else {
        setRemedies(prev => [newRemedy, ...prev]);
      }

      resetRemedyForm();
      setIsAddingKnowledge(false);
    } catch (err) {
      setError('Failed to save remedy guide');
    } finally {
      setIsLoading(false);
    }
  };

  const resetPlantForm = () => {
    setPlantForm({
      commonName: '',
      botanicalName: '',
      family: '',
      origin: '',
      description: '',
      medicinalUses: [],
      activeCompounds: [],
      preparationMethods: [],
      dosage: '',
      contraindications: [],
      safetyNotes: '',
      images: []
    });
    setEditingItem(null);
  };

  const resetRemedyForm = () => {
    setRemedyForm({
      title: '',
      condition: '',
      description: '',
      ingredients: [],
      preparation: '',
      dosage: '',
      duration: '',
      safetyWarnings: [],
      effectiveness: '',
      references: []
    });
    setEditingItem(null);
  };

  const editPlant = (plant) => {
    setEditingItem(plant);
    setPlantForm({
      commonName: plant.commonName,
      botanicalName: plant.botanicalName,
      family: plant.family,
      origin: plant.origin || '',
      description: plant.description || '',
      medicinalUses: plant.medicinalUses || [],
      activeCompounds: plant.activeCompounds || [],
      preparationMethods: plant.preparationMethods || [],
      dosage: plant.dosage || '',
      contraindications: plant.contraindications || [],
      safetyNotes: plant.safetyNotes || '',
      images: plant.images || []
    });
    setIsAddingKnowledge(true);
  };

  const editRemedy = (remedy) => {
    setEditingItem(remedy);
    setRemedyForm({
      title: remedy.title,
      condition: remedy.condition,
      description: remedy.description || '',
      ingredients: remedy.ingredients || [],
      preparation: remedy.preparation || '',
      dosage: remedy.dosage || '',
      duration: remedy.duration || '',
      safetyWarnings: remedy.safetyWarnings || [],
      effectiveness: remedy.effectiveness || '',
      references: remedy.references || []
    });
    setIsAddingKnowledge(true);
  };

  const deleteItem = (type, id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;

    if (type === 'plant') {
      setPlants(prev => prev.filter(p => p.id !== id));
    } else {
      setRemedies(prev => prev.filter(r => r.id !== id));
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      published: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status) => {
    const icons = {
      published: CheckCircle,
      pending: Clock,
      rejected: AlertTriangle
    };
    const IconComponent = icons[status] || Clock;
    return <IconComponent className="h-4 w-4" />;
  };

  const filteredPlants = plants.filter(plant => {
    const matchesSearch = plant.commonName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         plant.botanicalName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterCategory === 'all' || plant.status === filterCategory;
    return matchesSearch && matchesFilter;
  });

  const filteredRemedies = remedies.filter(remedy => {
    const matchesSearch = remedy.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         remedy.condition.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterCategory === 'all' || remedy.status === filterCategory;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Knowledge Management</h2>
          <p className="text-gray-600">Contribute and manage herbal knowledge</p>
        </div>
        <button
          onClick={() => setIsAddingKnowledge(true)}
          className="btn-primary"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Knowledge
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('plants')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'plants'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Leaf className="h-4 w-4 inline mr-2" />
            Plant Database
          </button>
          <button
            onClick={() => setActiveTab('remedies')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'remedies'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <BookOpen className="h-4 w-4 inline mr-2" />
            Remedy Guides
          </button>
        </nav>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search knowledge base..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input pl-10 w-full"
          />
        </div>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="form-input w-full sm:w-48"
        >
          <option value="all">All Status</option>
          <option value="published">Published</option>
          <option value="pending">Pending Review</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Add/Edit Knowledge Form */}
      <AnimatePresence>
        {isAddingKnowledge && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="card"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">
                {editingItem ? 'Edit Knowledge' : `Add New ${activeTab === 'plants' ? 'Plant' : 'Remedy'}`}
              </h3>
              <button
                onClick={() => {
                  setIsAddingKnowledge(false);
                  resetPlantForm();
                  resetRemedyForm();
                }}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {activeTab === 'plants' ? (
              <form onSubmit={handlePlantSubmit} className="space-y-6">
                {/* Plant Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="form-label">Common Name *</label>
                    <input
                      type="text"
                      name="commonName"
                      value={plantForm.commonName}
                      onChange={handlePlantInputChange}
                      required
                      className="form-input"
                      placeholder="e.g., Turmeric"
                    />
                  </div>
                  <div>
                    <label className="form-label">Botanical Name *</label>
                    <input
                      type="text"
                      name="botanicalName"
                      value={plantForm.botanicalName}
                      onChange={handlePlantInputChange}
                      required
                      className="form-input"
                      placeholder="e.g., Curcuma longa"
                    />
                  </div>
                  <div>
                    <label className="form-label">Family</label>
                    <input
                      type="text"
                      name="family"
                      value={plantForm.family}
                      onChange={handlePlantInputChange}
                      className="form-input"
                      placeholder="e.g., Zingiberaceae"
                    />
                  </div>
                  <div>
                    <label className="form-label">Origin</label>
                    <input
                      type="text"
                      name="origin"
                      value={plantForm.origin}
                      onChange={handlePlantInputChange}
                      className="form-input"
                      placeholder="e.g., India, Southeast Asia"
                    />
                  </div>
                </div>

                <div>
                  <label className="form-label">Description *</label>
                  <textarea
                    name="description"
                    value={plantForm.description}
                    onChange={handlePlantInputChange}
                    required
                    rows={4}
                    className="form-input"
                    placeholder="Describe the plant's appearance, habitat, and general characteristics..."
                  />
                </div>

                {/* Arrays for Plant */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="form-label">Medicinal Uses</label>
                    <div className="space-y-2">
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          placeholder="Add medicinal use..."
                          className="form-input flex-1"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleArrayInput(plantForm, 'medicinalUses', e.target.value, setPlantForm);
                              e.target.value = '';
                            }
                          }}
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            const input = e.target.previousElementSibling;
                            handleArrayInput(plantForm, 'medicinalUses', input.value, setPlantForm);
                            input.value = '';
                          }}
                          className="btn-secondary px-3"
                        >
                          Add
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {plantForm.medicinalUses.map((use, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                          >
                            {use}
                            <button
                              type="button"
                              onClick={() => removeArrayItem(plantForm, 'medicinalUses', index, setPlantForm)}
                              className="ml-2 hover:text-blue-600"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="form-label">Active Compounds</label>
                    <div className="space-y-2">
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          placeholder="Add compound..."
                          className="form-input flex-1"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleArrayInput(plantForm, 'activeCompounds', e.target.value, setPlantForm);
                              e.target.value = '';
                            }
                          }}
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            const input = e.target.previousElementSibling;
                            handleArrayInput(plantForm, 'activeCompounds', input.value, setPlantForm);
                            input.value = '';
                          }}
                          className="btn-secondary px-3"
                        >
                          Add
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {plantForm.activeCompounds.map((compound, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                          >
                            {compound}
                            <button
                              type="button"
                              onClick={() => removeArrayItem(plantForm, 'activeCompounds', index, setPlantForm)}
                              className="ml-2 hover:text-green-600"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="form-label">Dosage Guidelines</label>
                  <textarea
                    name="dosage"
                    value={plantForm.dosage}
                    onChange={handlePlantInputChange}
                    rows={3}
                    className="form-input"
                    placeholder="Recommended dosage, frequency, and duration of use..."
                  />
                </div>

                <div>
                  <label className="form-label">Safety Notes</label>
                  <textarea
                    name="safetyNotes"
                    value={plantForm.safetyNotes}
                    onChange={handlePlantInputChange}
                    rows={3}
                    className="form-input"
                    placeholder="Important safety information, side effects, and precautions..."
                  />
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingKnowledge(false);
                      resetPlantForm();
                    }}
                    className="btn-outline"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="btn-primary"
                  >
                    {isLoading ? 'Saving...' : (editingItem ? 'Update Plant' : 'Add Plant')}
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleRemedySubmit} className="space-y-6">
                {/* Remedy Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="form-label">Title *</label>
                    <input
                      type="text"
                      name="title"
                      value={remedyForm.title}
                      onChange={handleRemedyInputChange}
                      required
                      className="form-input"
                      placeholder="e.g., Stress Relief Tea Blend"
                    />
                  </div>
                  <div>
                    <label className="form-label">Condition *</label>
                    <input
                      type="text"
                      name="condition"
                      value={remedyForm.condition}
                      onChange={handleRemedyInputChange}
                      required
                      className="form-input"
                      placeholder="e.g., Stress and Anxiety"
                    />
                  </div>
                </div>

                <div>
                  <label className="form-label">Description *</label>
                  <textarea
                    name="description"
                    value={remedyForm.description}
                    onChange={handleRemedyInputChange}
                    required
                    rows={4}
                    className="form-input"
                    placeholder="Describe the remedy, its benefits, and how it works..."
                  />
                </div>

                <div>
                  <label className="form-label">Ingredients</label>
                  <div className="space-y-2">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        placeholder="Add ingredient..."
                        className="form-input flex-1"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleArrayInput(remedyForm, 'ingredients', e.target.value, setRemedyForm);
                            e.target.value = '';
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          const input = e.target.previousElementSibling;
                          handleArrayInput(remedyForm, 'ingredients', input.value, setRemedyForm);
                          input.value = '';
                        }}
                        className="btn-secondary px-3"
                      >
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {remedyForm.ingredients.map((ingredient, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
                        >
                          {ingredient}
                          <button
                            type="button"
                            onClick={() => removeArrayItem(remedyForm, 'ingredients', index, setRemedyForm)}
                            className="ml-2 hover:text-purple-600"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="form-label">Preparation Method</label>
                    <textarea
                      name="preparation"
                      value={remedyForm.preparation}
                      onChange={handleRemedyInputChange}
                      rows={3}
                      className="form-input"
                      placeholder="Step-by-step preparation instructions..."
                    />
                  </div>
                  <div>
                    <label className="form-label">Dosage & Duration</label>
                    <textarea
                      name="dosage"
                      value={remedyForm.dosage}
                      onChange={handleRemedyInputChange}
                      rows={3}
                      className="form-input"
                      placeholder="How much to take and for how long..."
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingKnowledge(false);
                      resetRemedyForm();
                    }}
                    className="btn-outline"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="btn-primary"
                  >
                    {isLoading ? 'Saving...' : (editingItem ? 'Update Remedy' : 'Add Remedy')}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Knowledge List */}
      {activeTab === 'plants' ? (
        <div className="card">
          <h3 className="text-lg font-semibold mb-6">Plant Database</h3>
          
          {filteredPlants.length === 0 ? (
            <div className="text-center py-12">
              <Leaf className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">No plants found</h4>
              <p className="text-gray-600">Start contributing to our plant knowledge base</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4">Plant</th>
                    <th className="text-left py-3 px-4">Family</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-left py-3 px-4">Last Updated</th>
                    <th className="text-left py-3 px-4">Performance</th>
                    <th className="text-left py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPlants.map((plant) => (
                    <tr key={plant.id} className="border-b border-gray-100">
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-medium text-gray-900">{plant.commonName}</p>
                          <p className="text-sm text-gray-600 italic">{plant.botanicalName}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm">{plant.family}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(plant.status)}`}>
                          {getStatusIcon(plant.status)}
                          <span className="ml-1 capitalize">{plant.status}</span>
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm text-gray-600">
                          {new Date(plant.lastUpdated).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-sm">
                          <div className="flex items-center space-x-1 mb-1">
                            <Eye className="h-3 w-3 text-gray-400" />
                            <span>{plant.views}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <span className="text-gray-600">Contributions: {plant.contributions}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => editPlant(plant)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => deleteItem('plant', plant.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        <div className="card">
          <h3 className="text-lg font-semibold mb-6">Remedy Guides</h3>
          
          {filteredRemedies.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">No remedy guides found</h4>
              <p className="text-gray-600">Start creating herbal remedy guides</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4">Remedy</th>
                    <th className="text-left py-3 px-4">Condition</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-left py-3 px-4">Last Updated</th>
                    <th className="text-left py-3 px-4">Performance</th>
                    <th className="text-left py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRemedies.map((remedy) => (
                    <tr key={remedy.id} className="border-b border-gray-100">
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-medium text-gray-900">{remedy.title}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm">{remedy.condition}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(remedy.status)}`}>
                          {getStatusIcon(remedy.status)}
                          <span className="ml-1 capitalize">{remedy.status}</span>
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm text-gray-600">
                          {new Date(remedy.lastUpdated).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-sm">
                          <div className="flex items-center space-x-1 mb-1">
                            <Eye className="h-3 w-3 text-gray-400" />
                            <span>{remedy.views}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <span className="text-gray-600">Rating: {remedy.rating}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => editRemedy(remedy)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => deleteItem('remedy', remedy.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default KnowledgeManagement; 