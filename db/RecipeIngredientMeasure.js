import { DataTypes } from "sequelize";

import { sequelize } from "./sequelize.js";

const RecipeIngredientMeasure = sequelize.define("ingredient-measure", {
  recipeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  ingredientId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  measure: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// RecipeIngredientMeasure.sync();

export default RecipeIngredientMeasure;
