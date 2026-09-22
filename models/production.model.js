import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";


const Production = sequelize.define(
  "Production",
  {
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  { timestamps: true, tableName: "productions" },
);




export default Production;