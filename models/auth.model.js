import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import bcrypt from "bcrypt";

const User = sequelize.define("User", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      is: /^[0-9]{10}$/, // Ghana format
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

//before validating phonenumber
User.beforeValidate((user) => {
  if (user.phoneNumber) {
    user.phoneNumber = user.phoneNumber.trim();
  }
});

//  Hash password before saving
User.beforeSave(async (user) => {
  if (user.changed("password")) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
  }
});

// Compare password
User.prototype.comparePassword = function (passwordFromUser) {
  return bcrypt.compare(passwordFromUser, this.password);
};


export default User;
