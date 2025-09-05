import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Upload, 
  Save, 
  X,
  Package,
  DollarSign,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    shortDescription: '',
    price: '',
    category: '',
    subcategory: '',
    stock: '',
    isOrganic: false,
    isFeatured: false,
    botanicalName: '',
    origin: '',
    medicinalUses: [],
    contraindications: [],
    dosage: '',
    preparation: '',
    images: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const categories = [
    'herbs', 'supplements', 'teas', 'oils', 'powders', 
    'capsules', 'tinctures', 'other'
  ];

  const subcategories = {
    herbs: ['fresh', 'dried', 'powdered', 'extracts'],
    supplements: ['vitamins', 'minerals', 'amino_acids', 'probiotics'],
    teas: ['loose_leaf', 'tea_bags', 'instant', 'herbal_blends'],
    oils: ['essential', 'carrier', 'infused', 'cold_pressed'],
    powders: ['protein', 'greens', 'superfoods', 'spices'],
    capsules: ['soft_gel', 'hard_gel', 'vegetarian', 'enteric_coated'],
    tinctures: ['alcohol_based', 'glycerin_based', 'vinegar_based'],
    other: ['creams', 'salves', 'balms', 'syrups']
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/products/seller', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setProducts(data.data || []);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      // Use mock data for now
      setProducts([
        {
          id: '1',
          name: 'Organic Turmeric Powder',
          description: 'Premium quality turmeric powder with powerful anti-inflammatory properties.',
          price: 24.99,
          category: 'herbs',
          stock: 50,
          isOrganic: true,
          isFeatured: true,
          status: 'active',
          views: 1250,
          sales: 45
        }
      ]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleArrayInput = (field, value) => {
    if (value.trim()) {
      setFormData(prev => ({
        ...prev,
        [field]: [...prev[field], value.trim()]
      }));
    }
  };

  const removeArrayItem = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    // Mock image upload - replace with actual Cloudinary upload
    const mockImages = files.map(file => ({
      url: URL.createObjectURL(file),
      publicId: `mock_${Date.now()}_${Math.random()}`
    }));
    
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...mockImages]
    }));
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const url = editingProduct 
        ? `http://localhost:5000/api/products/${editingProduct.id}`
        : 'http://localhost:5000/api/products';
      
      const method = editingProduct ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const data = await response.json();
        
        if (editingProduct) {
          setProducts(prev => prev.map(p => 
            p.id === editingProduct.id ? data.data : p
          ));
        } else {
          setProducts(prev => [data.data, ...prev]);
        }
        
        resetForm();
        setIsAddingProduct(false);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to save product');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Error saving product:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      shortDescription: '',
      price: '',
      category: '',
      subcategory: '',
      stock: '',
      isOrganic: false,
      isFeatured: false,
      botanicalName: '',
      origin: '',
      medicinalUses: [],
      contraindications: [],
      dosage: '',
      preparation: '',
      images: []
    });
    setEditingProduct(null);
  };

  const editProduct = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      shortDescription: product.shortDescription || '',
      price: product.price.toString(),
      category: product.category,
      subcategory: product.subcategory || '',
      stock: product.stock.toString(),
      isOrganic: product.isOrganic || false,
      isFeatured: product.isFeatured || false,
      botanicalName: product.botanicalName || '',
      origin: product.origin || '',
      medicinalUses: product.medicinalUses || [],
      contraindications: product.contraindications || [],
      dosage: product.dosage || '',
      preparation: product.preparation || '',
      images: product.images || []
    });
    setIsAddingProduct(true);
  };

  const deleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      const response = await fetch(`http://localhost:5000/api/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        setProducts(prev => prev.filter(p => p.id !== productId));
      }
    } catch (err) {
      console.error('Error deleting product:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Product Management</h2>
          <p className="text-gray-600">Manage your herbal products and inventory</p>
        </div>
        <button
          onClick={() => setIsAddingProduct(true)}
          className="btn-primary"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </button>
      </div>

      {/* Add/Edit Product Form */}
      <AnimatePresence>
        {isAddingProduct && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="card"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button
                onClick={() => {
                  setIsAddingProduct(false);
                  resetForm();
                }}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="form-label">Product Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                    placeholder="e.g., Organic Turmeric Powder"
                  />
                </div>

                <div>
                  <label className="form-label">Price *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                      min="0"
                      step="0.01"
                      className="form-input pl-8"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div>
                  <label className="form-label">Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="form-label">Subcategory</label>
                  <select
                    name="subcategory"
                    value={formData.subcategory}
                    onChange={handleInputChange}
                    className="form-input"
                  >
                    <option value="">Select Subcategory</option>
                    {formData.category && subcategories[formData.category]?.map(sub => (
                      <option key={sub} value={sub}>
                        {sub.replace('_', ' ').charAt(0).toUpperCase() + sub.replace('_', ' ').slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="form-label">Stock Quantity *</label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    required
                    min="0"
                    className="form-input"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="form-label">Botanical Name</label>
                  <input
                    type="text"
                    name="botanicalName"
                    value={formData.botanicalName}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="e.g., Curcuma longa"
                  />
                </div>
              </div>

              {/* Descriptions */}
              <div>
                <label className="form-label">Short Description</label>
                <input
                  type="text"
                  name="shortDescription"
                  value={formData.shortDescription}
                  onChange={handleInputChange}
                  maxLength="500"
                  className="form-input"
                  placeholder="Brief product description for listings..."
                />
              </div>

              <div>
                <label className="form-label">Full Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="form-input"
                  placeholder="Detailed product description, benefits, and uses..."
                />
              </div>

              {/* Herbal Specific Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="form-label">Origin</label>
                  <input
                    type="text"
                    name="origin"
                    value={formData.origin}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="e.g., India, Himalayas"
                  />
                </div>

                <div>
                  <label className="form-label">Dosage</label>
                  <input
                    type="text"
                    name="dosage"
                    value={formData.dosage}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="e.g., 1-2 capsules daily"
                  />
                </div>
              </div>

              <div>
                <label className="form-label">Preparation Method</label>
                <textarea
                  name="preparation"
                  value={formData.preparation}
                  onChange={handleInputChange}
                  rows={3}
                  className="form-input"
                  placeholder="How to prepare or use this product..."
                />
              </div>

              {/* Arrays */}
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
                            handleArrayInput('medicinalUses', e.target.value);
                            e.target.value = '';
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          const input = e.target.previousElementSibling;
                          handleArrayInput('medicinalUses', input.value);
                          input.value = '';
                        }}
                        className="btn-secondary px-3"
                      >
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.medicinalUses.map((use, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                        >
                          {use}
                          <button
                            type="button"
                            onClick={() => removeArrayItem('medicinalUses', index)}
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
                  <label className="form-label">Contraindications</label>
                  <div className="space-y-2">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        placeholder="Add contraindication..."
                        className="form-input flex-1"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleArrayInput('contraindications', e.target.value);
                            e.target.value = '';
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          const input = e.target.previousElementSibling;
                          handleArrayInput('contraindications', input.value);
                          input.value = '';
                        }}
                        className="btn-secondary px-3"
                      >
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.contraindications.map((contra, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 bg-red-100 text-red-800 rounded-full text-sm"
                        >
                          {contra}
                          <button
                            type="button"
                            onClick={() => removeArrayItem('contraindications', index)}
                            className="ml-2 hover:text-red-600"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Images */}
              <div>
                <label className="form-label">Product Images</label>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="form-input"
                    />
                    <span className="text-sm text-gray-500">Upload images</span>
                  </div>
                  
                  {formData.images.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {formData.images.map((image, index) => (
                        <div key={index} className="relative">
                          <img
                            src={image.url}
                            alt={`Product ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Options */}
              <div className="flex items-center space-x-6">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="isOrganic"
                    checked={formData.isOrganic}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-green-600 focus:ring-green-500"
                  />
                  <span className="text-sm font-medium">Organic Product</span>
                </label>
                
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="isFeatured"
                    checked={formData.isFeatured}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-green-600 focus:ring-green-500"
                  />
                  <span className="text-sm font-medium">Featured Product</span>
                </label>
              </div>

              {/* Error Message */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center"
                  >
                    <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                    <span className="text-red-700">{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit Button */}
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingProduct(false);
                    resetForm();
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
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      {editingProduct ? 'Update Product' : 'Add Product'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Products List */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-6">Your Products</h3>
        
        {products.length === 0 ? (
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">No products yet</h4>
            <p className="text-gray-600 mb-6">Start by adding your first herbal product</p>
            <button
              onClick={() => setIsAddingProduct(true)}
              className="btn-primary"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Product
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4">Product</th>
                  <th className="text-left py-3 px-4">Category</th>
                  <th className="text-left py-3 px-4">Price</th>
                  <th className="text-left py-3 px-4">Stock</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Performance</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b border-gray-100">
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Package className="h-6 w-6 text-gray-400" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{product.name}</p>
                          <p className="text-sm text-gray-600">
                            {product.shortDescription || 'No description'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="capitalize">{product.category}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-medium text-green-600">${product.price}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={product.stock > 10 ? 'text-green-600' : 'text-red-600'}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        product.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {product.status}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-sm">
                        <div className="flex items-center space-x-1 mb-1">
                          <Eye className="h-3 w-3 text-gray-400" />
                          <span>{product.views}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <TrendingUp className="h-3 w-3 text-gray-400" />
                          <span>{product.sales}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => editProduct(product)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => window.open(`/products/${product.id}`, '_blank')}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => deleteProduct(product.id)}
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
    </div>
  );
};

export default ProductManagement; 