import express from "express";

import {
  getCategories,
  getCategoryRecipes,
  getCategoryFilters,
} from "../controllers/categoriesControllers.js";

const router = express.Router();

/**
 * @openapi
 * /api/categories:
 *   get:
 *     tags:
 *       - Categories
 *     summary: Retrieve list of categories
 *     description: Returns an array of category objects (id + name)
 *     responses:
 *       '200':
 *         description: Categories retrieved successfully
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
 *                   example: Categories retrieved successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Category'
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */
router.get("/", getCategories);

/**
 * GET /api/categories/:category/recipes
 * List recipes for a category with optional filters & pagination.
 * :category can be id, or name (case-insensitive)
 * Query: page=1, limit=12, area, ingredient
 */
router.get("/:category/recipes", getCategoryRecipes);

/**
 * GET /api/categories/:category/filters
 * Distinct Areas & Ingredients available inside this category
 */
router.get("/:category/filters", getCategoryFilters);

export default router;
