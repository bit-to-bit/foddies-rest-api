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

/**
 * @openapi
 * /api/recipes:
 *   get:
 *     tags:
 *       - Recipes
 *     summary: Retrieve list of recipes
 *     description: Returns an array of recipe objects with details including category, area, ingredients, and owner.
 *     responses:
 *       '200':
 *         description: Recipes retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Recipes retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     recipes:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Recipe'
 *                     total:
 *                       type: integer
 *                       example: 285
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     totalPages:
 *                       type: integer
 *                       example: 36
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */
recipeRouter.get("/", getRecipes);
recipeRouter.get("/me", authenticate, fetchOwnRecipes);
recipeRouter.get("/favorite", authenticate, fetchFavoriteRecipes);
recipeRouter.get("/popular", fetchPopularRecipes);
recipeRouter.get("/:id", getRecipeDetails);

/**
 * @openapi
 * /api/recipes:
 *   post:
 *     tags:
 *       - Recipes
 *     summary: Add a new recipe
 *     description: Creates a new recipe with details including title, category, area, ingredients, instructions, and owner.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateRecipeRequest'
 *     responses:
 *       '201':
 *         description: Recipe created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Recipe'
 *       '400':
 *         $ref: '#/components/responses/BadRequest'
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */
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
