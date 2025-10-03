import express from "express";

import { getCategories, getCategoryFilters } from "../controllers/categoriesControllers.js";

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
 * /api/categories/{category}/filters:
 *   get:
 *     tags: [Categories]
 *     summary: Get available filters for a category
 *     description: >
 *       Returns distinct areas and ingredients that exist among recipes
 *       belonging to the specified category.
 *
 *     parameters:
 *       - in: path
 *         name: category
 *         required: true
 *         schema:
 *           type: string
 *         description: >
 *           Category name or ID (case-insensitive).  
 *           Examples: Dessert, Beef, 1
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
 *                       example: ["French", "Italian", "Croatian"]
 *                     ingredients:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["Sugar", "Salt", "Onion"]
 *       404:
 *         description: Category not found
 *       500:
 *         description: Internal server error
 */
router.get("/:category/filters", getCategoryFilters);

export default router;
