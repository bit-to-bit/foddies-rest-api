import { Area } from "./area.js";
import { Category } from "./category.js";
import { Ingredient } from "./ingredient.js";
import { Recipe } from "./recipe.js";
import { RecipeIngredient } from "./recipeIngredient.js";
import { Testimonial } from "./testimonial.js";
import { User } from "./user.js";
import { UserFollower } from "./userFollower.js";

const models = {
  User,
  Area,
  Category,
  Ingredient,
  Recipe,
  RecipeIngredient,
  Testimonial,
  UserFollower,
};

Object.values(models).forEach((m) => {
  if (m && typeof m.associate === "function") m.associate(models);
});

export default models;
