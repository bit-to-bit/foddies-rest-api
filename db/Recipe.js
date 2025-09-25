import { DataTypes } from "sequelize";

import { sequelize } from "./sequelize.js";

const Recipe = sequelize.define("Recipe", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  categoryId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  ownerId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  areaId: {
    type: DataTypes.STRING,
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

// Recipe.sync();

export default Recipe;
