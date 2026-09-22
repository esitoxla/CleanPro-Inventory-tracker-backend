import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";


const Sale = sequelize.define(
  "Sale",
  {
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  { timestamps: true, tableName: "sales" },
);



export default Sale