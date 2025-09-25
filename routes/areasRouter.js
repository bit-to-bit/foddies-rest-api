import express from "express";

import { getAreas } from "../controllers/areasControllers.js";

const router = express.Router();

router.get("/", getAreas);

export default router;
