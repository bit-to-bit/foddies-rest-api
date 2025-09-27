import { DataTypes } from "sequelize";

import { sequelize } from "../db/sequelize.js";

export const Ingredient = sequelize.define(
  "ingredient",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    img: { type: DataTypes.STRING, allowNull: true },
  },
  {
    timestamps: true,
    tableName: "ingredients",
    indexes: [{ fields: ["name"] }],
  }
);

Ingredient.associate = (models) => {
  Ingredient.belongsToMany(models.Recipe, {
    through: models.RecipeIngredient,
    foreignKey: "ingredientId",
    otherKey: "recipeId",
    as: "recipes",
  });

  Ingredient.hasMany(models.RecipeIngredient, {
    foreignKey: "ingredientId",
    as: "recipeIngredients",
  });
};
