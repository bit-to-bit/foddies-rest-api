import express from "express";

import { getTestimonials } from "../controllers/testimonialsControllers.js";

const router = express.Router();

/**
 * @openapi
 * /api/testimonials:
 *   get:
 *     tags:
 *       - Testimonials
 *     summary: Get all testimonials
 *     description: Returns a paginated list of testimonials with author name and creation date.
 *     responses:
 *       '200':
 *         description: Testimonials retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TestimonialsResponse'
 *       '500':
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get("/", getTestimonials);

export default router;
