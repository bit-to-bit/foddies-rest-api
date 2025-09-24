import { DataTypes } from "sequelize";
import sequelize from "./sequelize.js";

const Recipe = sequelize.define("Recipe", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  categoryID: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  ownerID: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  areaID: {
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
