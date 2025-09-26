import { DataTypes } from "sequelize";

import { sequelize } from "./sequelize.js";

const Recipe = sequelize.define("recipe", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  categoryId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  ownerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  areaId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  instructions: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  thumb: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  time: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
});

// Recipe.sync()
//   .then(() => {
//     console.log("DB.Table [recipes] successfully updated");
//   })
//   .catch((error) => {
//     console.log(error.message);
//   });

export default Recipe;
