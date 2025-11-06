import sequelize from "../config/db.js";
import Product from "./Product.model.js";
import Production from "./production.model.js";
import Sale from "./sales.model.js";
import Expense from "./expense.model.js";

// Define all associations here
Product.hasMany(Sale, { foreignKey: "productId", as: "sales" });
Sale.belongsTo(Product, { foreignKey: "productId", as: "product" });

Product.hasMany(Production, { foreignKey: "productId", as: "productions" });
Production.belongsTo(Product, { foreignKey: "productId", as: "product" });

Product.hasMany(Expense, { foreignKey: "productId", as: "expenses" });
Expense.belongsTo(Product, { foreignKey: "productId", as: "product" });

export {sequelize, Product, Sale, Production, Expense };

async function syncDatabase() {
  try {
    await sequelize.sync({ alter: true }); // or { force: true } during development
    console.log("All models synchronized ");
  } catch (error) {
    console.error("Error syncing database:", error);
  } 
}

syncDatabase()