import express from "express";

import { checkHealth } from "../controllers/healthControllers.js";

const healsRouter = express.Router();

healsRouter.get("/ping", checkHealth);

export default healsRouter;
