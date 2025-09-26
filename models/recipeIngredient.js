import { DataTypes } from "sequelize";

import { sequelize } from "../db/sequelize.js";

export const RecipeIngredient = sequelize.define(
  "recipeIngredient",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    recipeId: { type: DataTypes.INTEGER, allowNull: false },
    ingredientId: { type: DataTypes.INTEGER, allowNull: false },
    measure: { type: DataTypes.STRING, allowNull: true },
  },
  {
    timestamps: false,
    tableName: "recipe_ingredients",
    indexes: [
      {
        unique: true,
        name: "uniq_recipe_ingredient",
        fields: ["recipeId", "ingredientId"],
      },
    ],
  }
);

RecipeIngredient.associate = (models) => {
  RecipeIngredient.belongsTo(models.Recipe, {
    foreignKey: "recipeId",
    as: "recipe",
  });
  RecipeIngredient.belongsTo(models.Ingredient, {
    foreignKey: "ingredientId",
    as: "ingredient",
  });
};
