import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Filter, 
  Search, 
  Grid, 
  List, 
  SlidersHorizontal,
  Star,
  Heart,
  ShoppingCart,
  Eye,
  Leaf,
  Package,
  Award,
  Truck
} from 'lucide-react';

const Products = () => {
  const [filters, setFilters] = useState({
    category: '',
    priceRange: '',
    organicOnly: false,
    sortBy: 'featured'
  });
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Enhanced mock products data
  const products = [
    {
      id: 1,
      name: 'Organic Turmeric Powder',
      description: 'Premium quality turmeric powder with powerful anti-inflammatory properties. Sourced from organic farms in India.',
      price: 24.99,
      compareAtPrice: 29.99,
      rating: 4.8,
      totalReviews: 156,
      image: null,
      isOrganic: true,
      category: 'Spices & Herbs',
      subcategory: 'Roots & Rhizomes',
      stock: 50,
      isFeatured: true,
      tags: ['anti-inflammatory', 'antioxidant', 'digestive'],
      seller: 'Organic Farms Co.',
      origin: 'India'
    },
    {
      id: 2,
      name: 'Ashwagandha Root Extract',
      description: 'Natural adaptogen for stress relief, energy boost, and improved mental clarity. Third-party tested for purity.',
      price: 34.99,
      compareAtPrice: 39.99,
      rating: 4.6,
      totalReviews: 89,
      image: null,
      isOrganic: false,
      category: 'Supplements',
      subcategory: 'Adaptogens',
      stock: 30,
      isFeatured: true,
      tags: ['stress-relief', 'energy', 'cognitive'],
      seller: 'Wellness Labs',
      origin: 'India'
    },
    {
      id: 3,
      name: 'Chamomile Tea Blend',
      description: 'Soothing herbal tea blend for relaxation and better sleep. Hand-picked flowers from certified organic gardens.',
      price: 18.99,
      compareAtPrice: 22.99,
      rating: 4.9,
      totalReviews: 234,
      image: null,
      isOrganic: true,
      category: 'Teas',
      subcategory: 'Herbal Blends',
      stock: 75,
      isFeatured: false,
      tags: ['relaxation', 'sleep', 'calming'],
      seller: 'Tea Garden Co.',
      origin: 'Germany'
    },
    {
      id: 4,
      name: 'Ginkgo Biloba Extract',
      description: 'Premium cognitive support supplement for memory and mental focus. Standardized extract with 24% flavonoids.',
      price: 29.99,
      compareAtPrice: 34.99,
      rating: 4.5,
      totalReviews: 67,
      image: null,
      isOrganic: false,
      category: 'Supplements',
      subcategory: 'Cognitive Support',
      stock: 45,
      isFeatured: false,
      tags: ['memory', 'focus', 'cognitive'],
      seller: 'Brain Health Inc.',
      origin: 'China'
    },
    {
      id: 5,
      name: 'Lavender Essential Oil',
      description: 'Pure therapeutic grade lavender oil for aromatherapy and relaxation. Steam distilled from French lavender.',
      price: 22.99,
      compareAtPrice: 26.99,
      rating: 4.7,
      totalReviews: 189,
      image: null,
      isOrganic: true,
      category: 'Essential Oils',
      subcategory: 'Floral Oils',
      stock: 60,
      isFeatured: true,
      tags: ['relaxation', 'aromatherapy', 'sleep'],
      seller: 'Pure Essence',
      origin: 'France'
    },
    {
      id: 6,
      name: 'Echinacea Immune Support',
      description: 'Natural immune system booster made from purple coneflower. Supports overall wellness and vitality.',
      price: 26.99,
      compareAtPrice: 31.99,
      rating: 4.4,
      totalReviews: 112,
      image: null,
      isOrganic: true,
      category: 'Supplements',
      subcategory: 'Immune Support',
      stock: 40,
      isFeatured: false,
      tags: ['immune', 'wellness', 'vitality'],
      seller: 'Nature\'s Best',
      origin: 'USA'
    }
  ];

  const categories = [
    { value: 'spices-herbs', label: 'Spices & Herbs', icon: Leaf },
    { value: 'supplements', label: 'Supplements', icon: Package },
    { value: 'teas', label: 'Herbal Teas', icon: Package },
    { value: 'essential-oils', label: 'Essential Oils', icon: Package },
    { value: 'powders', label: 'Powders & Extracts', icon: Package },
    { value: 'capsules', label: 'Capsules & Tablets', icon: Package }
  ];

  const priceRanges = [
    { value: '0-25', label: 'Under $25' },
    { value: '25-50', label: '$25 - $50' },
    { value: '50-100', label: '$50 - $100' },
    { value: '100+', label: 'Over $100' }
  ];

  const sortOptions = [
    { value: 'featured', label: 'Featured' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'newest', label: 'Newest First' },
    { value: 'popular', label: 'Most Popular' }
  ];

  const filteredProducts = products.filter(product => {
    if (filters.organicOnly && !product.isOrganic) return false;
    if (filters.category && product.category.toLowerCase() !== filters.category.toLowerCase()) return false;
    if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !product.description.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (filters.sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'newest':
        return b.id - a.id;
      case 'popular':
        return b.totalReviews - a.totalReviews;
      default:
        return b.isFeatured - a.isFeatured;
    }
  });

  const handleAddToCart = (product) => {
    const existingCart = JSON.parse(localStorage.getItem('herbalCart') || '[]');
    const existingItem = existingCart.find(item => item.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      existingCart.push({ ...product, quantity: 1 });
    }
    
    localStorage.setItem('herbalCart', JSON.stringify(existingCart));
    // You could add a toast notification here
  };

  const handleQuickView = (product) => {
    // Implement quick view modal
    console.log('Quick view:', product.name);
  };

  const handleWishlist = (product) => {
    // Implement wishlist functionality
    console.log('Added to wishlist:', product.name);
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      priceRange: '',
      organicOnly: false,
      sortBy: 'featured'
    });
    setSearchQuery('');
  };

  const ProductCard = ({ product, viewMode }) => {
    if (viewMode === 'list') {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-neutral-800 rounded-2xl shadow-lg border border-neutral-200 dark:border-neutral-700 p-6 hover:shadow-xl transition-all duration-300"
        >
          <div className="flex gap-6">
            {/* Product Image */}
            <div className="w-32 h-32 bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-700 dark:to-neutral-600 rounded-xl flex items-center justify-center flex-shrink-0">
              {product.image ? (
                <img src={product.image} alt={product.name} className="w-full h-full object-cover rounded-xl" />
              ) : (
                <Package className="h-12 w-12 text-neutral-400 dark:text-neutral-500" />
              )}
            </div>

            {/* Product Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                    <Link to={`/products/${product.id}`}>{product.name}</Link>
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-300 text-sm mb-3 line-clamp-2">{product.description}</p>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {product.tags.slice(0, 3).map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300 text-xs rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Seller & Origin */}
                  <div className="flex items-center gap-4 text-sm text-neutral-500 dark:text-neutral-400">
                    <span>Seller: {product.seller}</span>
                    <span>Origin: {product.origin}</span>
                  </div>
                </div>

                {/* Price & Rating */}
                <div className="text-right ml-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl font-bold text-neutral-900 dark:text-white">${product.price}</span>
                    {product.compareAtPrice && (
                      <span className="text-lg text-neutral-400 dark:text-neutral-500 line-through">${product.compareAtPrice}</span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-1 mb-2">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">{product.rating}</span>
                    <span className="text-sm text-neutral-500 dark:text-neutral-400">({product.totalReviews})</span>
                  </div>

                  <div className="text-sm text-neutral-500 dark:text-neutral-400 mb-3">
                    {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleAddToCart(product)}
                  className="btn btn-primary flex-1"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </button>
                <button
                  onClick={() => handleQuickView(product)}
                  className="btn btn-outline"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Quick View
                </button>
                <button
                  onClick={() => handleWishlist(product)}
                  className="btn btn-ghost"
                >
                  <Heart className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      );
    }

    // Grid View
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-neutral-800 rounded-2xl shadow-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden hover:shadow-xl transition-all duration-300 group"
      >
        {/* Product Image */}
        <div className="relative h-48 bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-700 dark:to-neutral-600">
          {product.image ? (
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package className="h-16 w-16 text-neutral-400 dark:text-neutral-500" />
            </div>
          )}
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.isOrganic && (
              <span className="px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 text-xs font-medium rounded-full flex items-center gap-1">
                <Leaf className="h-3 w-3" />
                Organic
              </span>
            )}
            {product.isFeatured && (
              <span className="px-2 py-1 bg-primary-100 dark:bg-primary-900/20 text-primary-800 dark:text-primary-300 text-xs font-medium rounded-full flex items-center gap-1">
                <Award className="h-3 w-3" />
                Featured
              </span>
            )}
          </div>

          {/* Quick Actions */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={() => handleQuickView(product)}
              className="w-8 h-8 bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm rounded-full flex items-center justify-center text-neutral-600 dark:text-neutral-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-white dark:hover:bg-neutral-800 transition-all duration-200"
            >
              <Eye className="h-4 w-4" />
            </button>
            <button
              onClick={() => handleWishlist(product)}
              className="w-8 h-8 bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm rounded-full flex items-center justify-center text-neutral-600 dark:text-neutral-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-white dark:hover:bg-neutral-800 transition-all duration-200"
            >
              <Heart className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4">
          <div className="mb-3">
            <h3 className="font-semibold text-neutral-900 dark:text-white mb-2 hover:text-primary-600 dark:hover:text-primary-400 transition-colors line-clamp-1">
              <Link to={`/products/${product.id}`}>{product.name}</Link>
            </h3>
            <p className="text-neutral-600 dark:text-neutral-300 text-sm line-clamp-2 mb-3">{product.description}</p>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">{product.rating}</span>
            </div>
            <span className="text-sm text-neutral-500 dark:text-neutral-400">({product.totalReviews})</span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl font-bold text-neutral-900 dark:text-white">${product.price}</span>
            {product.compareAtPrice && (
              <span className="text-lg text-neutral-400 dark:text-neutral-500 line-through">${product.compareAtPrice}</span>
            )}
          </div>

          {/* Actions */}
          <button
            onClick={() => handleAddToCart(product)}
            className="w-full btn btn-primary"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add to Cart
          </button>
        </div>
      </motion.div>
    );
  };

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950"
      style={{ paddingTop: '100px' }}
    >
      <div className="container">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Herbal Products
            </h1>
            <p className="text-xl text-white max-w-3xl mx-auto">
              Discover our curated collection of premium herbal remedies and natural wellness products. 
              Each item is carefully selected and verified for quality and authenticity.
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-primary-200" />
              <input
                type="text"
                placeholder="Search for herbs, supplements, teas, or specific health benefits..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 text-lg border border-neutral-300 dark:border-neutral-600 rounded-2xl focus:ring-4 focus:ring-primary-100 dark:focus:ring-primary-900/20 focus:border-primary-500 dark:focus:border-primary-400 transition-all duration-200 bg-white dark:bg-neutral-800 text-white placeholder-primary-200"
              />
            </div>
          </div>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full lg:w-80"
          >
            <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-lg border border-neutral-200 dark:border-neutral-700 p-6 sticky top-32">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold flex items-center gap-2 text-white">
                  <SlidersHorizontal className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                  Filters
                </h2>
                <button
                  onClick={clearFilters}
                  className="text-sm text-primary-200 hover:text-primary-300 font-medium transition-colors"
                >
                  Clear All
                </button>
              </div>

              <div className="space-y-6">
                {/* Category Filter */}
                <div>
                  <label className="form-label text-white">Categories</label>
                  <select 
                    className="form-input"
                    value={filters.category}
                    onChange={(e) => setFilters({...filters, category: e.target.value})}
                  >
                    <option value="">All Categories</option>
                    {categories.map((category) => (
                      <option key={category.value} value={category.label}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Range Filter */}
                <div>
                  <label className="form-label text-white">Price Range</label>
                  <select 
                    className="form-input"
                    value={filters.priceRange}
                    onChange={(e) => setFilters({...filters, priceRange: e.target.value})}
                  >
                    <option value="">Any Price</option>
                    {priceRanges.map((range) => (
                      <option key={range.value} value={range.value}>
                        {range.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Organic Filter */}
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="organicOnly"
                    checked={filters.organicOnly}
                    onChange={(e) => setFilters({...filters, organicOnly: e.target.checked})}
                    className="form-checkbox"
                  />
                  <label htmlFor="organicOnly" className="text-sm font-medium flex items-center gap-2 text-white">
                    <Leaf className="h-4 w-4 text-green-600 dark:text-green-400" />
                    Organic Only
                  </label>
                </div>

                {/* Sort Filter */}
                <div>
                  <label className="form-label text-white">Sort By</label>
                  <select 
                    className="form-input"
                    value={filters.sortBy}
                    onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Results Count */}
                <div className="pt-4 border-t border-neutral-200 dark:border-neutral-700">
                  <p className="text-sm text-primary-200">
                    Showing <span className="font-semibold text-white">{sortedProducts.length}</span> of{' '}
                    <span className="font-semibold text-white">{products.length}</span> products
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Products Section */}
          <div className="flex-1">
            {/* View Mode Toggle */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-white">View:</span>
                <div className="flex items-center gap-1 bg-neutral-100 dark:bg-neutral-700 p-1 rounded-lg">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-md transition-all duration-200 ${
                      viewMode === 'grid' 
                        ? 'bg-white dark:bg-neutral-600 text-primary-600 dark:text-primary-400 shadow-sm' 
                        : 'text-primary-200 hover:text-primary-300'
                    }`}
                  >
                    <Grid className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-md transition-all duration-200 ${
                      viewMode === 'list' 
                        ? 'bg-white dark:bg-neutral-600 text-primary-600 dark:text-primary-400 shadow-sm' 
                        : 'text-primary-200 hover:text-primary-300'
                    }`}
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-primary-200">
                <Truck className="h-4 w-4" />
                <span>Free shipping on orders over $50</span>
              </div>
            </div>

            {/* Products Grid/List */}
            {sortedProducts.length > 0 ? (
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {sortedProducts.map((product, index) => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    viewMode={viewMode}
                  />
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16"
              >
                <div className="w-24 h-24 bg-neutral-100 dark:bg-neutral-700 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="h-12 w-12 text-primary-200" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No products found</h3>
                <p className="text-primary-200 mb-6 max-w-md mx-auto">
                  Try adjusting your filters or search terms to find what you're looking for.
                </p>
                <button
                  onClick={clearFilters}
                  className="btn btn-primary"
                >
                  Clear All Filters
                </button>
              </motion.div>
            )}

            {/* Load More */}
            {sortedProducts.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center mt-12"
              >
                <button className="btn btn-outline btn-lg">
                  Load More Products
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;