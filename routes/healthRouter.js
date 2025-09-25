import express from "express";

import { checkHealth } from "../controllers/healthControllers.js";

const healthRouter = express.Router();

/**
 * @openapi
 * /api/health/ping:
 *   get:
 *     summary: Health check
 *     description: Returns service health status, current timestamp and a short message.
 *     tags:
 *       - Health
 *     operationId: getHealthPing
 *     responses:
 *       200:
 *         description: Service is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required: [status, timestamp, message]
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: 2025-09-25T10:15:30.000Z
 *                 message:
 *                   type: string
 *                   example: Server is healthy
 *       500:
 *         description: Server error
 */
healthRouter.get("/ping", checkHealth);

export default healthRouter;
