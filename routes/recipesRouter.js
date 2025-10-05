import express, { application } from "express";

import { getCategoryFilters } from "../controllers/categoriesControllers.js";
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
import optionalAuthenticate from "../middlewares/optionalAuthenticate.js";
import upload from "../middlewares/upload.js";
import validate from "../middlewares/validate.js";
import {
  createRecipeSchema,
  listRecipesQuerySchema,
} from "../schemas/recipesSchemas.js";

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

recipeRouter.get(
  "/",
  optionalAuthenticate,
  validate(listRecipesQuerySchema, "query"),
  getRecipes
);

/**
 * @openapi
 * /api/recipes/filters:
 *   get:
 *     tags: [Recipes]
 *     summary: Get available filters for recipes
 *     description: >
 *       Returns distinct areas and ingredients that exist for the current
 *       selection. You can optionally narrow the pool by passing one or more
 *       query parameters. For example, passing category=Dessert will return
 *       only areas/ingredients that appear among Dessert recipes.
 *
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Category name (case-insensitive). Example Dessert
 *       - in: query
 *         name: area
 *         schema:
 *           type: string
 *         description: Area/cuisine name (case-insensitive). Example French
 *       - in: query
 *         name: ingredient
 *         schema:
 *           type: string
 *         description: Ingredient name (case-insensitive). Example Sugar
 *
 *     responses:
 *       200:
 *         description: Filters retrieved successfully
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
 *                   example: Filters retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     areas:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["French", "Italian", "American"]
 *                     ingredients:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["Sugar", "Flour", "Butter"]
 *       500:
 *         description: Internal server error
 */
recipeRouter.get("/filters", (req, res, next) => {
  req.params.category = String(req.query.category || "")
    .toLowerCase()
    .replace(/\s+/g, "-");
  return getCategoryFilters(req, res, next);
});

/**
 * @openapi
 * /api/recipes/me:
 *   get:
 *     tags:
 *       - Recipes
 *     summary: Retrieve recipes of the authenticated user
 *     description: Returns an array of recipes created by the logged-in user, including details such as category, area, ingredients, and owner.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: User's recipes retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 recipes:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Recipe'
 *                 total:
 *                   type: integer
 *                   example: 3
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 totalPages:
 *                   type: integer
 *                   example: 1
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */
recipeRouter.get(
  "/me",
  authenticate,
  validate(listRecipesQuerySchema, "query"),
  fetchOwnRecipes
);

/**
 * @openapi
 * /api/recipes/favorite:
 *   get:
 *     tags:
 *       - Recipes
 *     summary: Retrieve favorite recipes of the authenticated user
 *     description: Returns a paginated list of recipes that the authenticated user has added to favorites, including category, area, ingredients, and owner details.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Favorite recipes retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 recipes:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Recipe'
 *                 total:
 *                   type: integer
 *                   example: 12
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 totalPages:
 *                   type: integer
 *                   example: 2
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */
recipeRouter.get(
  "/favorite",
  authenticate,
  validate(listRecipesQuerySchema, "query"),
  fetchFavoriteRecipes
);

/**
 * @openapi
 * /api/recipes/popular:
 *   get:
 *     tags:
 *       - Recipes
 *     summary: Retrieve popular recipes
 *     description: Returns a paginated list of popular recipes ordered by popularity (favorites count). Each recipe includes category, area, ingredients, owner and a favoritesCount field.
 *     responses:
 *       '200':
 *         description: Popular recipes retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 recipes:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Recipe'
 *                 total:
 *                   type: integer
 *                   example: 286
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 totalPages:
 *                   type: integer
 *                   example: 72
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */
recipeRouter.get(
  "/popular",
  optionalAuthenticate,
  validate(listRecipesQuerySchema, "query"),
  fetchPopularRecipes
);

/**
 * @openapi
 * /api/recipes/{id}:
 *   get:
 *     tags:
 *       - Recipes
 *     summary: Retrieve recipe details
 *     description: Returns a single recipe object by ID including category, area, ingredients and owner details.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the recipe to retrieve
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       '200':
 *         description: Recipe retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Recipe'
 *       '404':
 *         description: Recipe not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               NotFoundExample:
 *                 value:
 *                   message: Resource not found
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */
recipeRouter.get("/:id", getRecipeDetails);

/**
 * @openapi
 * /api/recipes:
 *   post:
 *     tags:
 *       - Recipes
 *     summary: Add a new recipe
 *     description: Creates a new recipe with details including title, category, area, ingredients, instructions, and owner. Accepts multipart/form-data (supports optional image upload under the "photo" field).
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/CreateRecipeFormData'
 *           examples:
 *             MultipartWithFile:
 *               summary: Fields + uploaded photo
 *               value:
 *                 title: "My Awesome Recipe"
 *                 categoryId: 1
 *                 areaId: 1
 *                 instructions: "First, preheat the oven. Next, mix the ingredients. Finally, bake for 30 minutes."
 *                 description: "This is an easy and delicious recipe that is great for all occasions."
 *                 time: 60
 *                 ingredients[0][ingredientId]: 1
 *                 ingredients[0][measure]: 1 cup
 *                 ingredients[1][ingredientId]: 2
 *                 ingredients[1][measure]: 2 tsp
 *                 ingredients[2][ingredientId]: 3
 *                 ingredients[2][measure]: 1/2 cup
 *                 # photo is a file part; not representable inline here
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
  // validate(createRecipeSchema),
  upload.single("photo"),
  addRecipe
);

/**
 * @openapi
 * /api/recipes/{id}:
 *   delete:
 *     tags:
 *       - Recipes
 *     summary: Delete a recipe
 *     description: Authenticated user deletes the specified recipe. Returns the deleted recipe object.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the recipe to delete
 *         schema:
 *           type: integer
 *           example: 286
 *     responses:
 *       '200':
 *         description: Recipe deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Recipe'
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *       '404':
 *         $ref: '#/components/responses/NotFound'
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */
recipeRouter.delete("/:id", authenticate, removeRecipe);

/**
 * @openapi
 * /api/recipes/{id}/favorite:
 *   post:
 *     tags:
 *       - Recipes
 *     summary: Add recipe to favorites
 *     description: Authenticated user adds the specified recipe to their favorites.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the recipe to favorite
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       '200':
 *         description: Recipe added to favorites successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Favorite'
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *       '404':
 *         $ref: '#/components/responses/NotFound'
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */
recipeRouter.post("/:id/favorite", authenticate, addRecipeToFavorite);

/**
 * @openapi
 * /api/recipes/{id}/favorite:
 *   delete:
 *     tags:
 *       - Recipes
 *     summary: Remove recipe from favorites
 *     description: Authenticated user removes the specified recipe from their favorites. Returns the deleted favorite record.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the recipe to remove from favorites
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       '200':
 *         description: Favorite removed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Favorite'
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *       '404':
 *         $ref: '#/components/responses/NotFound'
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */
recipeRouter.delete("/:id/favorite", authenticate, deleteRecipeFromFavorite);

export default recipeRouter;
