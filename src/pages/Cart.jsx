import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trash2, 
  Heart, 
  ArrowLeft, 
  Lock, 
  Shield, 
  Truck, 
  CreditCard,
  CheckCircle,
  X,
  Plus,
  Minus
} from 'lucide-react';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponDiscount, setCouponDiscount] = useState(0);

  useEffect(() => {
    const savedCart = localStorage.getItem('herbalCart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    const updatedCart = cartItems.map(item => 
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updatedCart);
    localStorage.setItem('herbalCart', JSON.stringify(updatedCart));
  };

  const removeItem = (itemId) => {
    const updatedCart = cartItems.filter(item => item.id !== itemId);
    setCartItems(updatedCart);
    localStorage.setItem('herbalCart', JSON.stringify(updatedCart));
  };

  const moveToWishlist = (item) => {
    // Implement wishlist functionality
    console.log('Moving to wishlist:', item.name);
    removeItem(item.id);
  };

  const applyCoupon = () => {
    if (couponCode.toLowerCase() === 'welcome10') {
      setCouponApplied(true);
      setCouponDiscount(subtotal * 0.1);
      // You could add a toast notification here
    } else {
      setCouponApplied(false);
      setCouponDiscount(0);
      // You could add an error toast here
    }
  };

  const removeCoupon = () => {
    setCouponApplied(false);
    setCouponDiscount(0);
    setCouponCode('');
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 50 ? 0 : 5.99;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax - couponDiscount;

  if (cartItems.length === 0) {
    return (
      <div 
        className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950"
        style={{ paddingTop: '100px' }}
      >
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="w-24 h-24 bg-neutral-100 dark:bg-neutral-700 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="h-12 w-12 text-neutral-400 dark:text-neutral-500" />
            </div>
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">Your cart is empty</h1>
            <p className="text-lg text-neutral-600 dark:text-neutral-300 mb-8 max-w-md mx-auto">
              Looks like you haven't added any herbal products to your cart yet. 
              Start exploring our collection of natural wellness solutions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/products"
                className="btn btn-primary btn-lg inline-flex items-center"
              >
                Browse Products
                <ArrowLeft className="ml-2 h-5 w-5 rotate-180" />
              </Link>
              <Link
                to="/"
                className="btn btn-outline btn-lg"
              >
                Back to Home
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950"
      style={{ paddingTop: '100px' }}
    >
      <div className="container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">Shopping Cart</h1>
              <p className="text-neutral-600 dark:text-neutral-300">
                {cartItems.length} item{cartItems.length !== 1 ? 's' : ''} in your cart
              </p>
            </div>
            <Link
              to="/products"
              className="btn btn-outline inline-flex items-center"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Continue Shopping
            </Link>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-neutral-800 rounded-2xl shadow-lg border border-neutral-200 dark:border-neutral-700 p-6"
            >
              <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-6">Cart Items</h2>
              
              <div className="space-y-4">
                {cartItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex gap-4 p-4 bg-neutral-50 dark:bg-neutral-700/50 rounded-xl border border-neutral-200 dark:border-neutral-600"
                  >
                    {/* Product Image */}
                    <div className="w-20 h-20 bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-600 dark:to-neutral-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-lg" />
                      ) : (
                        <div className="text-center">
                          <div className="w-8 h-8 bg-neutral-300 dark:bg-neutral-500 rounded-full mx-auto mb-1"></div>
                          <div className="text-xs text-neutral-500 dark:text-neutral-400">No Image</div>
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-neutral-900 dark:text-white mb-1 line-clamp-1">
                            {item.name}
                          </h3>
                          <p className="text-sm text-neutral-600 dark:text-neutral-300 line-clamp-2">
                            {item.description}
                          </p>
                        </div>
                        <div className="text-right ml-4">
                          <div className="text-lg font-bold text-neutral-900 dark:text-white">
                            ${(item.price * item.quantity).toFixed(2)}
                          </div>
                          {item.compareAtPrice && (
                            <div className="text-sm text-neutral-400 dark:text-neutral-500 line-through">
                              ${(item.compareAtPrice * item.quantity).toFixed(2)}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Quantity Controls & Actions */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 bg-white dark:bg-neutral-600 border border-neutral-300 dark:border-neutral-500 rounded-lg flex items-center justify-center text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-500 transition-colors"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="w-12 text-center font-medium text-neutral-900 dark:text-white">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 bg-white dark:bg-neutral-600 border border-neutral-300 dark:border-neutral-500 rounded-lg flex items-center justify-center text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-500 transition-colors"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => moveToWishlist(item)}
                            className="p-2 text-neutral-500 dark:text-neutral-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200"
                            title="Move to Wishlist"
                          >
                            <Heart className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="p-2 text-neutral-500 dark:text-neutral-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200"
                            title="Remove Item"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-lg border border-neutral-200 dark:border-neutral-700 p-6 sticky top-32">
              <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-6">Order Summary</h2>

              {/* Coupon Section */}
              <div className="mb-6 p-4 bg-neutral-50 dark:bg-neutral-700/50 rounded-xl border border-neutral-200 dark:border-neutral-600">
                <h3 className="font-medium text-neutral-900 dark:text-white mb-3">Have a coupon?</h3>
                {!couponApplied ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="flex-1 form-input text-sm"
                    />
                    <button
                      onClick={applyCoupon}
                      className="btn btn-primary text-sm px-4 py-2"
                    >
                      Apply
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                      <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                        Coupon applied: {couponCode}
                      </span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">
                  Try "WELCOME10" for 10% off
                </p>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-neutral-600 dark:text-neutral-300">
                  <span>Subtotal ({cartItems.length} items)</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between text-neutral-600 dark:text-neutral-300">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                </div>
                
                <div className="flex justify-between text-neutral-600 dark:text-neutral-300">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>

                {couponApplied && (
                  <div className="flex justify-between text-green-600 dark:text-green-400 font-medium">
                    <span>Coupon Discount</span>
                    <span>-${couponDiscount.toFixed(2)}</span>
                  </div>
                )}

                <div className="border-t border-neutral-200 dark:border-neutral-600 pt-3">
                  <div className="flex justify-between text-lg font-bold text-neutral-900 dark:text-white">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Security & Trust Indicators */}
              <div className="mb-6 space-y-3">
                <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                  <Lock className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <span>Secure checkout</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                  <Shield className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <span>30-day money-back guarantee</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                  <Truck className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <span>Free shipping on orders over $50</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button className="w-full btn btn-primary btn-lg">
                <CreditCard className="mr-2 h-5 w-5" />
                Proceed to Checkout
              </button>

              {/* Additional Info */}
              <p className="text-xs text-neutral-500 dark:text-neutral-400 text-center mt-4">
                By completing your order, you agree to our Terms of Service and Privacy Policy.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Cart;