import express from "express";

import { getIngredients } from "../controllers/ingredientsControllers.js";

const router = express.Router();

/**
 * @openapi
 * /api/ingredients:
 *   get:
 *     tags:
 *       - Ingredients
 *     summary: Retrieve list of ingredients
 *     description: Returns paginated ingredients with metadata (total, page, totalPages, limit).
 *     responses:
 *       '200':
 *         description: Ingredients retrieved successfully
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
 *                   example: Ingredients retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     items:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Ingredient'
 *                     total:
 *                       type: integer
 *                       example: 574
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     totalPages:
 *                       type: integer
 *                       example: 58
 *                     limit:
 *                       type: integer
 *                       example: 10
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
router.get("/", getIngredients);

export default router;
