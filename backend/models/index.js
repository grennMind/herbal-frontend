import { sequelize } from '../config/database.js';
import User from './User.js';
import Product from './Product.js';
import { Order, OrderItem } from './Order.js';

// Define associations
User.hasMany(Product, { 
  foreignKey: 'sellerId', 
  as: 'products' 
});
Product.belongsTo(User, { 
  foreignKey: 'sellerId', 
  as: 'seller' 
});

User.hasMany(Order, { 
  foreignKey: 'buyerId', 
  as: 'orders' 
});
Order.belongsTo(User, { 
  foreignKey: 'buyerId', 
  as: 'buyer' 
});

Order.hasMany(OrderItem, { 
  foreignKey: 'orderId', 
  as: 'items' 
});
OrderItem.belongsTo(Order, { 
  foreignKey: 'orderId', 
  as: 'order' 
});

Product.hasMany(OrderItem, { 
  foreignKey: 'productId', 
  as: 'orderItems' 
});
OrderItem.belongsTo(Product, { 
  foreignKey: 'productId', 
  as: 'product' 
});

User.hasMany(OrderItem, { 
  foreignKey: 'sellerId', 
  as: 'soldItems' 
});
OrderItem.belongsTo(User, { 
  foreignKey: 'sellerId', 
  as: 'seller' 
});

export {
  sequelize,
  User,
  Product,
  Order,
  OrderItem
};
