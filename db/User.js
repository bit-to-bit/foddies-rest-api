import { sequelize } from "./sequelize.js";
import { DataTypes } from "sequelize";
import { emailRegexp } from "../constants/userConstants.js";

export const User = sequelize.define("user", {
  id: {
    type: DataTypes.STRING(24),
    primaryKey: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      is: emailRegexp,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  token: {
    type: DataTypes.STRING,
    defaultValue: null,
  },
  avatarURL: { type: DataTypes.STRING },
});

User.sync()
  .then(() => {
    console.log("DB.Table [users] successfully updated");
  })
  .catch((error) => {
    console.log(error.message);
  });
