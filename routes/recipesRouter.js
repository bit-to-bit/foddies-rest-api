import express, { application } from "express";

import {
  getRecipes,
  getRecipeDetails,
  addRecipe,
  removeRecipe,
  fetchOwnRecipes,
} from "../controllers/recipesControllers.js";
import { authenticate } from "../middlewares/authenticate.js";
import validateBody from "../middlewares/validateBody.js";
import { createRecipeSchema } from "../schemas/recipesSchemas.js";
const recipeRouter = express.Router();

// recipeRouter.use(authenticate);

recipeRouter.get("/", getRecipes);
recipeRouter.get("/me", authenticate, fetchOwnRecipes);
recipeRouter.get("/:id", getRecipeDetails);
recipeRouter.post(
  "/",
  authenticate,
  validateBody(createRecipeSchema),
  addRecipe
);
recipeRouter.delete("/:id", authenticate, removeRecipe);

export default recipeRouter;
