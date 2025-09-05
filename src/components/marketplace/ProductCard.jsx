import { Star, ShoppingCart, Heart, Leaf, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

const ProductCard = ({ product }) => {
  const {
    id,
    name,
    description,
    price,
    rating = 0,
    image,
    isOrganic = false,
    category
  } = product;

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      className="product-card group"
    >
      {/* Product Image */}
      <div className="relative h-56 bg-gradient-to-br from-gray-800 to-gray-900 overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-3 opacity-50">🌿</div>
              <span className="text-sm text-gray-400">No image available</span>
            </div>
          </div>
        )}
        
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {isOrganic && (
            <div className="organic-badge flex items-center gap-1">
              <Leaf className="h-3 w-3" />
              <span>Organic</span>
            </div>
          )}
          <div className="herbal-badge">
            <Shield className="h-3 w-3" />
            <span>Verified</span>
          </div>
        </div>

        {/* Wishlist Button */}
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="absolute top-3 right-3 p-2 bg-black/20 backdrop-blur-sm rounded-full hover:bg-black/40 transition-colors group"
        >
          <Heart className="h-4 w-4 text-white group-hover:text-red-400 transition-colors" />
        </motion.button>

        {/* Quick Actions */}
        <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="w-full btn-primary py-2 text-sm backdrop-blur-sm"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Quick Add
          </motion.button>
        </div>
      </div>

      {/* Product Info */}
      <div className="product-content">
        <div className="mb-3">
          <span className="text-xs text-green-400 uppercase tracking-wider font-medium">
            {category}
          </span>
        </div>
        
        <h3 className="product-title group-hover:text-green-400 transition-colors">
          {name}
        </h3>
        
        <p className="product-description">
          {description}
        </p>

        {/* Rating */}
        <div className="flex items-center mb-4">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(rating)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-600'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-400 ml-2">
            ({rating.toFixed(1)})
          </span>
          <span className="text-xs text-gray-500 ml-auto">
            {Math.floor(Math.random() * 50 + 10)} reviews
          </span>
        </div>

        {/* Price and Add to Cart */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="product-price">
              ${price}
            </span>
            <span className="text-xs text-gray-500 line-through">
              ${(price * 1.2).toFixed(2)}
            </span>
          </div>
          
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-outline px-4 py-2 text-sm group-hover:bg-green-500 group-hover:text-black group-hover:border-green-500 transition-all"
          >
            Add to Cart
          </motion.button>
        </div>

        {/* Additional Info */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-700">
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              In Stock
            </span>
            <span>Free Shipping</span>
          </div>
          <span className="text-xs text-green-400 font-medium">2-3 days delivery</span>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
