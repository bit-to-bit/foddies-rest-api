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
 * @openapi
 * /api/categories/{category}/recipes:
 *   get:
 *     tags: [Categories]
 *     summary: List recipes in a category
 *     description: category can be id or name (case-insensitive).
 *     parameters:
 *       - in: path
 *         name: category
 *         required: true
 *         schema: { type: string }
 *       - in: query
 *         name: page
 *         schema: { type: integer, minimum: 1, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, minimum: 1, maximum: 50, default: 12 }
 *       - in: query
 *         name: area
 *         schema: { type: string }
 *       - in: query
 *         name: ingredient
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Recipes retrieved successfully
 */
router.get("/:category/recipes", getCategoryRecipes);


/**
 * @openapi
 * /api/categories/{category}/filters:
 *   get:
 *     tags: [Categories]
 *     summary: Get filters for a category
 *     description: Distinct areas and ingredients available for this category.
 *     parameters:
 *       - in: path
 *         name: category
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Filters retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: integer, example: 200 }
 *                 message: { type: string, example: Filters retrieved successfully }
 *                 data:
 *                   type: object
 *                   properties:
 *                     areas:
 *                       type: array
 *                       items: { type: string }
 *                     ingredients:
 *                       type: array
 *                       items: { type: string }
 */
router.get("/:category/filters", getCategoryFilters);

export default router;
