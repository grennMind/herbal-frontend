import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  Package, 
  Truck, 
  Mail, 
  Home, 
  ShoppingBag,
  Clock,
  MapPin,
  X
} from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { Link } from 'react-router-dom';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const [orderDetails, setOrderDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (sessionId) {
      fetchOrderDetails(sessionId);
    } else {
      setIsLoading(false);
    }
  }, [sessionId]);

  const fetchOrderDetails = async (sessionId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/payments/session/${sessionId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();

      if (data.success) {
        setOrderDetails(data.data);
      } else {
        setError(data.message || 'Failed to fetch order details');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Error fetching order details:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-primary-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-800 pt-40 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 dark:border-primary-400 mx-auto mb-4"></div>
          <p className="text-lg text-neutral-600 dark:text-neutral-300">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-primary-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-800 pt-40">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <X className="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">Error Loading Order</h1>
            <p className="text-lg text-neutral-600 dark:text-neutral-300 mb-8">{error}</p>
            <Link to="/" className="btn btn-primary">
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-primary-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-800 pt-40">
      <div className="container">
        <div className="max-w-4xl mx-auto">
          {/* Success Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 dark:text-white mb-4">
              Payment Successful!
            </h1>
            <p className="text-xl text-neutral-600 dark:text-neutral-300">
              Thank you for your order. Your payment has been processed successfully.
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            {/* Order Summary Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="card mb-8"
            >
              <h2 className="text-2xl font-semibold mb-6">Order Summary</h2>
              
              {orderDetails ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">Order Details</h3>
                      <div className="space-y-2 text-sm">
                        <p><span className="text-gray-600">Order ID:</span> {orderDetails.id}</p>
                        <p><span className="text-gray-600">Date:</span> {new Date(orderDetails.created).toLocaleDateString()}</p>
                        <p><span className="text-gray-600">Total:</span> ${(orderDetails.amount_total / 100).toFixed(2)}</p>
                        <p><span className="text-gray-600">Status:</span> 
                          <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                            Paid
                          </span>
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">Payment Method</h3>
                      <div className="space-y-2 text-sm">
                        <p><span className="text-gray-600">Method:</span> Credit Card</p>
                        <p><span className="text-gray-600">Provider:</span> Stripe</p>
                        <p><span className="text-gray-600">Transaction:</span> {orderDetails.payment_intent}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600">Order details will be available shortly.</p>
                </div>
              )}
            </motion.div>

            {/* Next Steps */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="card mb-8"
            >
              <h2 className="text-2xl font-semibold mb-6">What Happens Next?</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Package className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="font-medium text-gray-900 mb-2">Order Processing</h3>
                  <p className="text-sm text-gray-600">
                    We're preparing your order and will notify you when it ships.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Truck className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="font-medium text-gray-900 mb-2">Shipping</h3>
                  <p className="text-sm text-gray-600">
                    Your order will be shipped within 1-2 business days.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="font-medium text-gray-900 mb-2">Tracking</h3>
                  <p className="text-sm text-gray-600">
                    You'll receive tracking information via email.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Estimated Timeline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="card mb-8"
            >
              <h2 className="text-2xl font-semibold mb-6">Estimated Timeline</h2>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Order Confirmed</p>
                    <p className="text-sm text-gray-600">Your order has been received and confirmed</p>
                  </div>
                  <span className="text-sm text-gray-500">Today</span>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <Package className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Processing</p>
                    <p className="text-sm text-gray-600">We're preparing your order for shipment</p>
                  </div>
                  <span className="text-sm text-gray-500">1-2 days</span>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                    <Truck className="h-5 w-5 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Shipped</p>
                    <p className="text-sm text-gray-600">Your order is on its way</p>
                  </div>
                  <span className="text-sm text-gray-500">2-3 days</span>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Delivered</p>
                    <p className="text-sm text-gray-600">Your order arrives at your doorstep</p>
                  </div>
                  <span className="text-sm text-gray-500">3-7 days</span>
                </div>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <button
                onClick={() => window.location.href = '/dashboard'}
                className="btn-primary px-8 py-3 text-lg flex items-center justify-center"
              >
                <Home className="h-5 w-5 mr-2" />
                Go to Dashboard
              </button>
              
              <button
                onClick={() => window.location.href = '/products'}
                className="btn-outline px-8 py-3 text-lg flex items-center justify-center"
              >
                <ShoppingBag className="h-5 w-5 mr-2" />
                Continue Shopping
              </button>
            </motion.div>

            {/* Support Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
              className="mt-12 text-center"
            >
              <p className="text-gray-400 mb-4">
                Have questions about your order?
              </p>
              <div className="flex justify-center space-x-6 text-sm">
                <a href="mailto:support@herbalmarketplace.com" className="text-green-400 hover:text-green-300">
                  support@herbalmarketplace.com
                </a>
                <span className="text-gray-600">|</span>
                <span className="text-gray-400">1-800-HERBAL</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess; 