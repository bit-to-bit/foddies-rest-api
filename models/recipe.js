import { DataTypes } from "sequelize";

import { sequelize } from "../db/sequelize.js";

export const Recipe = sequelize.define(
  "recipe",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    thumb: { type: DataTypes.STRING, allowNull: true },
    time: { type: DataTypes.INTEGER, allowNull: true },
    instructions: { type: DataTypes.TEXT, allowNull: true },
    ownerId: { type: DataTypes.INTEGER, allowNull: true },
    areaId: { type: DataTypes.INTEGER, allowNull: true },
    categoryId: { type: DataTypes.INTEGER, allowNull: true },
  },
  {
    timestamps: true,
    tableName: "recipes",
    indexes: [{ fields: ["title"] }],
  }
);

Recipe.associate = (models) => {
  Recipe.belongsTo(models.User, { foreignKey: "ownerId", as: "owner" });
  Recipe.belongsTo(models.Area, { foreignKey: "areaId", as: "area" });
  Recipe.belongsTo(models.Category, {
    foreignKey: "categoryId",
    as: "category",
  });

  Recipe.belongsToMany(models.Ingredient, {
    through: models.RecipeIngredient,
    foreignKey: "recipeId",
    otherKey: "ingredientId",
    as: "ingredients",
  });

  Recipe.belongsToMany(models.Ingredient, {
    through: models.RecipeIngredient,
    foreignKey: "recipeId",
    otherKey: "ingredientId",
    as: "ingredientsFilter",
  });

  Recipe.hasMany(models.RecipeIngredient, {
    foreignKey: "recipeId",
    as: "recipeIngredients",
  });

  Recipe.hasMany(models.Favorite, { foreignKey: "recipeId", as: "favorites" });
};
