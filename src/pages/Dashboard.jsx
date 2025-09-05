import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Package, 
  ShoppingCart, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Star,
  Plus,
  Edit,
  Eye,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle,
  Leaf,
  BookOpen,
  Settings
} from 'lucide-react';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState({});
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    // Mock user data - replace with actual auth context
    const mockUser = {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      userType: 'seller', // 'buyer', 'seller', 'herbalist'
      avatar: null,
      isVerified: true
    };
    setUser(mockUser);

    // Mock data - replace with actual API calls
    const mockOrders = [
      {
        id: '1',
        orderNumber: 'HM-12345678-ABCD',
        status: 'paid',
        totalAmount: 89.97,
        createdAt: '2024-01-15T10:30:00Z',
        items: [
          { name: 'Organic Turmeric Powder', quantity: 2, price: 24.99 },
          { name: 'Ashwagandha Root Extract', quantity: 1, price: 34.99 }
        ]
      },
      {
        id: '2',
        orderNumber: 'HM-12345679-EFGH',
        status: 'shipped',
        totalAmount: 45.98,
        createdAt: '2024-01-14T15:45:00Z',
        items: [
          { name: 'Chamomile Tea Blend', quantity: 2, price: 18.99 }
        ]
      }
    ];

    const mockProducts = [
      {
        id: '1',
        name: 'Organic Turmeric Powder',
        price: 24.99,
        stock: 50,
        status: 'active',
        views: 1250,
        sales: 45
      },
      {
        id: '2',
        name: 'Ashwagandha Root Extract',
        price: 34.99,
        stock: 30,
        status: 'active',
        views: 890,
        sales: 28
      }
    ];

    const mockStats = {
      totalOrders: 156,
      totalRevenue: 2847.50,
      totalProducts: 24,
      totalCustomers: 89,
      monthlyGrowth: 12.5,
      averageOrderValue: 18.25
    };

    setOrders(mockOrders);
    setProducts(mockProducts);
    setStats(mockStats);
  }, []);

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      paid: 'bg-blue-100 text-blue-800',
      processing: 'bg-purple-100 text-purple-800',
      shipped: 'bg-indigo-100 text-indigo-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: Clock,
      paid: CheckCircle,
      processing: Package,
      shipped: Truck,
      delivered: CheckCircle,
      cancelled: AlertCircle
    };
    const IconComponent = icons[status] || Clock;
    return <IconComponent className="h-4 w-4" />;
  };

  const renderBuyerDashboard = () => (
    <div className="space-y-6">
      {/* Order History */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Recent Orders</h3>
          <button className="btn-secondary">View All Orders</button>
        </div>
        <div className="space-y-3">
          {orders.slice(0, 5).map((order) => (
            <div key={order.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div>
                <p className="font-medium">{order.orderNumber}</p>
                <p className="text-sm text-gray-600">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-600">
                  {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold">${order.totalAmount}</p>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                  {getStatusIcon(order.status)}
                  <span className="ml-1 capitalize">{order.status}</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button className="card p-6 text-center hover:shadow-lg transition-shadow">
          <Leaf className="h-8 w-8 mx-auto mb-2 text-green-600" />
          <h4 className="font-medium">Plant Scanner</h4>
          <p className="text-sm text-gray-600">Identify plants</p>
        </button>
        <button className="card p-6 text-center hover:shadow-lg transition-shadow">
          <BookOpen className="h-8 w-8 mx-auto mb-2 text-blue-600" />
          <h4 className="font-medium">Symptom Checker</h4>
          <p className="text-sm text-gray-600">Check symptoms</p>
        </button>
        <button className="card p-6 text-center hover:shadow-lg transition-shadow">
          <Star className="h-8 w-8 mx-auto mb-2 text-purple-600" />
          <h4 className="font-medium">Get Recommendations</h4>
          <p className="text-sm text-gray-600">AI-powered advice</p>
        </button>
      </div>
    </div>
  );

  const renderSellerDashboard = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-4">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <ShoppingCart className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-2xl font-semibold">{stats.totalOrders}</p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Revenue</p>
              <p className="text-2xl font-semibold">${stats.totalRevenue}</p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Package className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Products</p>
              <p className="text-2xl font-semibold">{stats.totalProducts}</p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Users className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Customers</p>
              <p className="text-2xl font-semibold">{stats.totalCustomers}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Recent Orders</h3>
          <button className="btn-secondary">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2">Order</th>
                <th className="text-left py-2">Customer</th>
                <th className="text-left py-2">Amount</th>
                <th className="text-left py-2">Status</th>
                <th className="text-left py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 5).map((order) => (
                <tr key={order.id} className="border-b border-gray-100">
                  <td className="py-3">
                    <p className="font-medium">{order.orderNumber}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </td>
                  <td className="py-3">
                    <p className="font-medium">Customer Name</p>
                    <p className="text-sm text-gray-600">customer@email.com</p>
                  </td>
                  <td className="py-3 font-semibold">${order.totalAmount}</td>
                  <td className="py-3">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      <span className="ml-1 capitalize">{order.status}</span>
                    </span>
                  </td>
                  <td className="py-3">
                    <div className="flex space-x-2">
                      <button className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="p-1 text-green-600 hover:bg-green-50 rounded">
                        <Truck className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Management */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Product Management</h3>
          <button className="btn-primary">
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <div key={product.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-medium">{product.name}</h4>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  product.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {product.status}
                </span>
              </div>
              <p className="text-lg font-semibold text-green-600">${product.price}</p>
              <div className="grid grid-cols-2 gap-2 mt-3 text-sm">
                <div>
                  <p className="text-gray-600">Stock</p>
                  <p className="font-medium">{product.stock}</p>
                </div>
                <div>
                  <p className="text-gray-600">Views</p>
                  <p className="font-medium">{product.views}</p>
                </div>
              </div>
              <div className="flex space-x-2 mt-3">
                <button className="flex-1 btn-secondary py-2">
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </button>
                <button className="flex-1 btn-outline py-2">
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderHerbalistDashboard = () => (
    <div className="space-y-6">
      {/* Knowledge Contribution */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Knowledge Contribution</h3>
          <button className="btn-primary">
            <Plus className="h-4 w-4 mr-2" />
            Add Knowledge
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium mb-2">Plant Database</h4>
            <p className="text-sm text-gray-600 mb-3">Contribute to our medicinal plant knowledge base</p>
            <button className="btn-secondary w-full">Manage Plants</button>
          </div>
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium mb-2">Remedy Guides</h4>
            <p className="text-sm text-gray-600 mb-3">Create and edit herbal remedy guides</p>
            <button className="btn-secondary w-full">Manage Guides</button>
          </div>
        </div>
      </div>

      {/* Verification Status */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Verification Status</h3>
        <div className="flex items-center p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <CheckCircle className="h-6 w-6 text-blue-600 mr-3" />
          <div>
            <h4 className="font-medium text-blue-900">Verification Pending</h4>
            <p className="text-sm text-blue-700">Your credentials are under review</p>
          </div>
        </div>
      </div>

      {/* Recent Contributions */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Recent Contributions</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
            <div>
              <p className="font-medium">Turmeric Medicinal Properties</p>
              <p className="text-sm text-gray-600">Updated 2 days ago</p>
            </div>
            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Published</span>
          </div>
          <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
            <div>
              <p className="font-medium">Ashwagandha Safety Guidelines</p>
              <p className="text-sm text-gray-600">Updated 1 week ago</p>
            </div>
            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">Pending Review</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderOverview = () => {
    switch (user?.userType) {
      case 'buyer':
        return renderBuyerDashboard();
      case 'seller':
        return renderSellerDashboard();
      case 'herbalist':
        return renderHerbalistDashboard();
      default:
        return <div>Loading...</div>;
    }
  };

  if (!user) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950">
      <div className="container py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
                Dashboard
              </h1>
              <p className="text-xl text-neutral-600 dark:text-neutral-300">
                Welcome back, {user.name}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-neutral-500 dark:text-neutral-400">Account Type</p>
                <p className="font-medium text-neutral-900 dark:text-white capitalize">{user.userType}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-semibold">
                {user.name.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Navigation Tabs */}
        <div className="mb-6">
          <nav className="flex space-x-1 bg-neutral-100 dark:bg-neutral-800 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'overview'
                  ? 'bg-primary-500 text-white'
                  : 'text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'orders'
                  ? 'bg-primary-500 text-white'
                  : 'text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              Orders
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'products'
                  ? 'bg-primary-500 text-white'
                  : 'text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              Products
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'settings'
                  ? 'bg-primary-500 text-white'
                  : 'text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              Settings
            </button>
          </nav>
        </div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'orders' && (
            <div className="card">
              <h3 className="text-lg font-semibold mb-4">All Orders</h3>
              <p className="text-gray-600">Order management interface coming soon...</p>
            </div>
          )}
          {activeTab === 'products' && (
            <div className="card">
              <h3 className="text-lg font-semibold mb-4">Product Management</h3>
              <p className="text-gray-600">Product management interface coming soon...</p>
            </div>
          )}
          {activeTab === 'settings' && (
            <div className="card">
              <h3 className="text-lg font-semibold mb-4">Account Settings</h3>
              <p className="text-gray-600">Settings interface coming soon...</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;