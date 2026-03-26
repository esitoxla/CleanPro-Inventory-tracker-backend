import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";


const Product = sequelize.define(
  "Product",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    color: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "#22c55e", // nice green default
      validate: {
        is: /^#([0-9A-F]{3}){1,2}$/i, // HEX validation
      },
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  { tableName: "products", timestamps: true },
);


export default Product;