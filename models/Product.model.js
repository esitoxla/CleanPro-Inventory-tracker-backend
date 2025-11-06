import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";


const Product = sequelize.define(
  "Product",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  { tableName: "products", timestamps: true }
);





export default Product;