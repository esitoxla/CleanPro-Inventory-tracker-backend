import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";


const Expense = sequelize.define(
  "Expense",
  {
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  },
  { timestamps: true }
);



export default Expense;