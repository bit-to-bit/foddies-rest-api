import express, { application } from "express";
import { authenticate } from "../middlewares/authenticate.js";
import validateBody from "../middlewares/validateBody.js";
import { getRecipes } from "../controllers/recipesControllers.js";
const recipeRouter = express.Router();

// recipeRouter.use(authenticate);

recipeRouter.get("/", getRecipes);

export default recipeRouter;
