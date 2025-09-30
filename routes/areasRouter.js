import express from "express";

import { getAreas } from "../controllers/areasControllers.js";

const router = express.Router();

/**
 * @openapi
 * /api/areas:
 *   get:
 *     tags:
 *       - Areas
 *     summary: Retrieve list of areas
 *     description: Returns paginated list of area objects (id + name) with pagination metadata.
 *     responses:
 *       '200':
 *         description: Areas retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AreasResponse'
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get("/", getAreas);

export default router;
