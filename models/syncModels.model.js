import sequelize from "../config/db.js";
import Product from "./Product.model.js";
import Production from "./production.model.js";
import Sale from "./sales.model.js";
import Expense from "./expense.model.js";
import User from "./auth.model.js";


//USER → PRODUCT
User.hasMany(Product, { foreignKey: "userId", as: "products" });
Product.belongsTo(User, { foreignKey: "userId", as: "user" });

// PRODUCT → SALES
Product.hasMany(Sale, { foreignKey: "productId", as: "sales" });
Sale.belongsTo(Product, { foreignKey: "productId", as: "product" });

// PRODUCT → PRODUCTION
Product.hasMany(Production, { foreignKey: "productId", as: "productions" });
Production.belongsTo(Product, { foreignKey: "productId", as: "product" });

// PRODUCT → EXPENSE
Product.hasMany(Expense, { foreignKey: "productId", as: "expenses" });
Expense.belongsTo(Product, { foreignKey: "productId", as: "product" });


export {sequelize, User, Product, Sale, Production, Expense };

