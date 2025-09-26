// file for relations between models
import e from "express";

import { Area } from "./Area.js";
import { Category } from "./Categorie.js";
import { Ingredient } from "./Ingredient.js";
import Recipe from "./Recipe.js";
import RecipeIngredientMeasure from "./RecipeIngredientMeasure.js";
import { User } from "./User.js";

// Recipe - Category
Category.hasMany(Recipe, { foreignKey: "categoryId", as: "recipes" });
Recipe.belongsTo(Category, { foreignKey: "categoryId", as: "category" });

// Recipe - Area
Area.hasMany(Recipe, { foreignKey: "areaId", as: "recipes" });
Recipe.belongsTo(Area, { foreignKey: "areaId", as: "area" });

console.log("Ассоціації між моделями встановлені");

// // Recipe - Ingredient (Many-to-Many)

// Recipe.belongsToMany(Ingredient, {
//   through: "RecipeIngredientMeasure",
//   as: "ingredients",
//   foreignKey: "recipeId",
// });
// Ingredient.belongsToMany(Recipe, {
//   through: "RecipeIngredientMeasure",
//   as: "recipes",
//   foreignKey: "ingredientId",
// });

// // Recipe - RecipeIngredientMeasure (One-to-Many)
// Recipe.hasMany(RecipeIngredientMeasure, {
//   foreignKey: "recipeId",
//   as: "ingredientMeasures",
// });
// RecipeIngredientMeasure.belongsTo(Recipe, {
//   foreignKey: "recipeId",
//   as: "recipe",
// });
// // Ingredient - RecipeIngredientMeasure (One-to-Many)
// Ingredient.hasMany(RecipeIngredientMeasure, {
//   foreignKey: "ingredientId",
//   as: "recipeMeasures",
// });
// RecipeIngredientMeasure.belongsTo(Ingredient, {
//   foreignKey: "ingredientId",
//   as: "ingredient",
// });
export { Recipe, Category, Area, Ingredient, User, RecipeIngredientMeasure };
