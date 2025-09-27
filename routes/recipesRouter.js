import express, { application } from "express";

import {
  getRecipes,
  getRecipeDetails,
  addRecipe,
  removeRecipe,
  fetchOwnRecipes,
  addRecipeToFavorite,
  deleteRecipeFromFavorite,
  fetchFavoriteRecipes,
  fetchPopularRecipes,
} from "../controllers/recipesControllers.js";
import authenticate from "../middlewares/authenticate.js";
import validateBody from "../middlewares/validateBody.js";
import { createRecipeSchema } from "../schemas/recipesSchemas.js";
const recipeRouter = express.Router();

// recipeRouter.use(authenticate);

recipeRouter.get("/", getRecipes);
recipeRouter.get("/me", authenticate, fetchOwnRecipes);
recipeRouter.get("/favorite", authenticate, fetchFavoriteRecipes);
recipeRouter.get("/popular", fetchPopularRecipes);
recipeRouter.get("/:id", getRecipeDetails);
recipeRouter.post(
  "/",
  authenticate,
  validateBody(createRecipeSchema),
  addRecipe
);
recipeRouter.delete("/:id", authenticate, removeRecipe);
recipeRouter.post("/:id/favorite", authenticate, addRecipeToFavorite);
recipeRouter.delete("/:id/favorite", authenticate, deleteRecipeFromFavorite);

export default recipeRouter;
