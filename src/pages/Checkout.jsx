import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Lock, Truck, CreditCard, Info, X, Plus, Minus, MapPin, ChevronDown } from 'lucide-react';

const Checkout = () => {
  const [activeStep, setActiveStep] = useState(1);
  const [showPromoInput, setShowPromoInput] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [saveInfo, setSaveInfo] = useState(true);
  
  const navigate = useNavigate();

  // Sample cart data
  const cartItems = [
    {
      id: 1,
      name: 'Organic Turmeric Powder',
      price: 25000,
      quantity: 2,
      image: '/images/products/turmeric.jpg'
    },
    {
      id: 2,
      name: 'Pure Shea Butter',
      price: 15000,
      quantity: 1,
      image: '/images/products/shea-butter.jpg'
    }
  ];

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 50000 ? 0 : 5000; // Free shipping over 50,000 UGX
  const total = subtotal + shipping;

  const handleBackToCart = () => {
    navigate('/cart');
  };

  const handleContinueToPayment = () => {
    setActiveStep(2);
  };

  const handlePlaceOrder = () => {
    setActiveStep(3);
  };

  const applyPromoCode = () => {
    console.log('Applying promo code:', promoCode);
    setShowPromoInput(false);
  };

  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity < 1) return;
    // Update cart logic here
    console.log(`Updating item ${id} quantity to ${newQuantity}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto w-full px-4 py-3">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            {/* Logo and Brand */}
            <div className="flex items-center">
              <div className="h-10 w-10 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                NW
              </div>
              <h1 className="ml-2 text-xl font-bold text-gray-900">NATURE WELLNESS</h1>
            </div>
            
            {/* Navigation Items */}
            <div className="flex flex-wrap gap-4 mt-3 md:mt-0">
              <div className="flex items-center text-sm font-medium text-gray-700">
                <Lock className="h-4 w-4 text-green-600 mr-1.5" />
                <span>Secure Checkout</span>
              </div>
              <div className="flex items-center text-sm font-medium text-gray-700">
                <Truck className="h-4 w-4 text-green-600 mr-1.5" />
                <span>Delivery Nationwide</span>
              </div>
              <div className="flex items-center text-sm font-medium text-gray-700">
                <Info className="h-4 w-4 text-green-600 mr-1.5" />
                <span>Help</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full py-8">
        <div className="max-w-6xl mx-auto px-4">
          {/* Progress Steps */}
          <div className="flex justify-between items-center mb-8 max-w-2xl mx-auto">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${
                  activeStep >= step ? 'bg-green-600' : 'bg-gray-300'
                }`}
              >
                {step}
              </div>
              <span className="text-sm mt-2 text-gray-600">
                {step === 1 ? 'Delivery' : step === 2 ? 'Payment' : 'Complete'}
              </span>
            </div>
          ))}
        </div>

        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column - Form */}
          <div className="lg:col-span-8 bg-white rounded-lg shadow-sm p-6">
            {activeStep === 1 && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-800">Delivery Information</h2>
                  <button className="text-sm text-green-600 flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    Use Current Location
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="First name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Last name"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 border-r border-gray-300 bg-gray-50 rounded-l-md">
                        <span className="text-gray-500 text-sm">+256</span>
                        <ChevronDown className="h-4 w-4 text-gray-400 ml-1" />
                      </div>
                      <input
                        type="tel"
                        className="w-full pl-20 pr-4 py-2 border border-gray-300 rounded-r-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="701234567"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="your.email@example.com"
                    />
                    <p className="mt-1 text-xs text-gray-500">Order updates will be sent to this email</p>
                  </div>

                  <div className="pt-2">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Delivery Address</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <select className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent">
                          <option value="">Select District</option>
                          <option value="kampala">Kampala</option>
                          <option value="wakiso">Wakiso</option>
                          <option value="mukono">Mukono</option>
                        </select>
                      </div>
                      <div>
                        <input
                          type="text"
                          className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="Street name"
                        />
                      </div>
                    </div>
                    <textarea
                      rows="2"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="House number, building, apartment, etc."
                    ></textarea>
                  </div>

                  <div className="pt-2">
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Delivery Option</h3>
                    <div className="space-y-3">
                      <label className="flex items-center p-3 border border-gray-200 rounded-md hover:border-green-500 cursor-pointer">
                        <input
                          type="radio"
                          name="delivery-option"
                          className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                          defaultChecked
                        />
                        <div className="ml-3">
                          <div className="flex justify-between">
                            <span className="text-sm font-medium text-gray-900">Door Delivery</span>
                            <span className="text-sm font-medium text-gray-900">UGX {shipping.toLocaleString()}</span>
                          </div>
                          <p className="text-xs text-gray-500">3-5 business days</p>
                        </div>
                      </label>
                      <label className="flex items-center p-3 border border-gray-200 rounded-md hover:border-green-500 cursor-pointer">
                        <input
                          type="radio"
                          name="delivery-option"
                          className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                        />
                        <div className="ml-3">
                          <div className="flex justify-between">
                            <span className="text-sm font-medium text-gray-900">Pickup Station</span>
                            <span className="text-sm font-medium text-gray-900">UGX 3,000</span>
                          </div>
                          <p className="text-xs text-gray-500">Available at selected locations</p>
                        </div>
                      </label>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <input
                      id="save-info"
                      name="save-info"
                      type="checkbox"
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      checked={saveInfo}
                      onChange={(e) => setSaveInfo(e.target.checked)}
                    />
                    <label htmlFor="save-info" className="ml-2 block text-sm text-gray-700">
                      Save my information for a faster checkout
                    </label>
                  </div>
                </div>

                <div className="pt-4 flex justify-between items-center border-t border-gray-200">
                  <button
                    onClick={handleBackToCart}
                    className="flex items-center text-green-600 hover:text-green-700 text-sm"
                  >
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Back to Cart
                  </button>
                  <button
                    onClick={handleContinueToPayment}
                    className="px-6 py-2.5 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 text-sm font-medium"
                  >
                    Continue to Payment
                  </button>
                </div>
              </div>
            )}

            {activeStep === 2 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800">Payment Method</h2>
                
                <div className="space-y-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <input
                        id="card-payment"
                        name="payment-method"
                        type="radio"
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                        checked={paymentMethod === 'card'}
                        onChange={() => setPaymentMethod('card')}
                      />
                      <label htmlFor="card-payment" className="ml-3 block text-sm font-medium text-gray-700">
                        Credit/Debit Card
                      </label>
                    </div>

                    {paymentMethod === 'card' && (
                      <div className="ml-7 mt-4 space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                          <div className="relative">
                            <input
                              type="text"
                              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              placeholder="1234 5678 9012 3456"
                            />
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <CreditCard className="h-5 w-5 text-gray-400" />
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                            <input
                              type="text"
                              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              placeholder="MM/YY"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                            <div className="relative">
                              <input
                                type="text"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                placeholder="123"
                              />
                              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                <Info className="h-4 w-4 text-gray-400" />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Name on Card</label>
                          <input
                            type="text"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            placeholder="Full Name"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <input
                        id="mobile-money"
                        name="payment-method"
                        type="radio"
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                        checked={paymentMethod === 'mobile'}
                        onChange={() => setPaymentMethod('mobile')}
                      />
                      <label htmlFor="mobile-money" className="ml-3 block text-sm font-medium text-gray-700">
                        Mobile Money
                      </label>
                    </div>
                    {paymentMethod === 'mobile' && (
                      <div className="ml-7 mt-4 space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 border-r border-gray-300 bg-gray-50 rounded-l-md">
                              <span className="text-gray-500 text-sm">+256</span>
                            </div>
                            <input
                              type="tel"
                              className="w-full pl-16 pr-4 py-2 border border-gray-300 rounded-r-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              placeholder="701234567"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Provider</label>
                          <select className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent">
                            <option value="">Select Mobile Money Provider</option>
                            <option value="mtn">MTN Mobile Money</option>
                            <option value="airtel">Airtel Money</option>
                            <option value="africell">Africell Money</option>
                          </select>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <input
                        id="cash-delivery"
                        name="payment-method"
                        type="radio"
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                        checked={paymentMethod === 'cash'}
                        onChange={() => setPaymentMethod('cash')}
                      />
                      <label htmlFor="cash-delivery" className="ml-3 block text-sm font-medium text-gray-700">
                        Cash on Delivery
                      </label>
                    </div>
                    {paymentMethod === 'cash' && (
                      <div className="ml-7 mt-4 text-sm text-gray-600">
                        <p>Pay with cash upon delivery. An extra UGX 5,000 will be charged for this service.</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200 flex justify-between items-center">
                  <button
                    onClick={() => setActiveStep(1)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 text-sm"
                  >
                    Back
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    className="px-6 py-2.5 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 text-sm font-medium"
                  >
                    Place Order
                  </button>
                </div>
              </div>
            )}

            {activeStep === 3 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="h-8 w-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h2>
                <p className="text-gray-600 mb-6">
                  Thank you for shopping with Nature Wellness. Your order has been received.
                </p>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 max-w-md mx-auto mb-8">
                  <p className="text-sm text-green-700">
                    <span className="font-medium">Order #:</span> NW{Math.floor(100000 + Math.random() * 900000)}
                  </p>
                  <p className="text-sm text-green-700 mt-1">
                    We'll send you shipping confirmation when your order is on the way!
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
                  <button
                    onClick={() => navigate('/')}
                    className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 text-sm"
                  >
                    Continue Shopping
                  </button>
                  <button
                    onClick={() => navigate('/orders')}
                    className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 text-sm font-medium"
                  >
                    View Order Status
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Order Summary</h2>
              
              <div className="space-y-4 mb-6 max-h-96 overflow-y-auto pr-2">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-start space-x-3">
                    <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 truncate">{item.name}</h3>
                      <div className="flex items-center justify-between mt-1">
                        <div className="flex items-center border border-gray-200 rounded-md">
                          <button 
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            className="px-2 py-1 text-gray-500 hover:bg-gray-50"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="px-2 text-sm w-8 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            className="px-2 py-1 text-gray-500 hover:bg-gray-50"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <span className="text-sm font-medium text-gray-900 ml-2">
                          UGX {(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {!showPromoInput ? (
                <button
                  onClick={() => setShowPromoInput(true)}
                  className="w-full text-sm text-green-600 hover:text-green-700 mb-4 text-left"
                >
                  + Add a promo code
                </button>
              ) : (
                <div className="mb-4">
                  <div className="flex">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md text-sm focus:ring-green-500 focus:border-green-500"
                      placeholder="Enter promo code"
                    />
                    <button
                      onClick={applyPromoCode}
                      className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-r-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-3 border-t border-gray-200 pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal ({cartItems.length} items)</span>
                  <span className="text-gray-900 font-medium">UGX {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span className={shipping === 0 ? 'text-green-600' : 'text-gray-900 font-medium'}>
                    {shipping === 0 ? 'FREE' : `UGX ${shipping.toLocaleString()}`}
                  </span>
                </div>
                {promoCode && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600">Promo Code ({promoCode})</span>
                    <span className="text-green-600 font-medium">- UGX 5,000</span>
                  </div>
                )}
                <div className="border-t border-gray-200 pt-3 mt-2">
                  <div className="flex justify-between font-medium text-gray-900">
                    <span>Total</span>
                    <span>UGX {total.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center text-xs text-gray-500">
                <Lock className="h-4 w-4 text-green-600 mr-1" />
                <span>Secure checkout with SSL encryption</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-6xl mx-auto w-full px-4 py-6">
          <div className="text-center text-sm text-gray-500">
            <p>© {new Date().getFullYear()} Nature Wellness. All rights reserved.</p>
            <div className="mt-2 flex flex-wrap justify-center space-x-4">
              <a href="#" className="hover:text-green-600">Terms of Service</a>
              <span>•</span>
              <a href="#" className="hover:text-green-600">Privacy Policy</a>
              <span>•</span>
              <a href="#" className="hover:text-green-600">Return Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Checkout;
