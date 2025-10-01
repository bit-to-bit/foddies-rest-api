import Joi from "joi";
import httpError from "../helpers/httpError.js";
import { paginationQuerySchema } from "../schemas/paginationSchemas.js";

import {
  getAllRecipes,
  getRecipeById,
  createRecipe,
  deleteRecipe,
  getOwnRecipes,
  addToFavorite,
  removeFromFavorite,
  getUserFavoriteRecipes,
  getPopularRecipes,
} from "../services/recipesServices.js";

/* GET /api/recipes */
export const getRecipes = async (req, res, next) => {
  try {
    
    const schema = paginationQuerySchema.keys({
      category: Joi.string().trim().optional(),
      area: Joi.string().trim().optional(),
      ingredient: Joi.string().trim().optional(),
    });

    const { value, error } = schema.validate(req.query);
    if (error) {
      return res.status(400).json({ status: 400, message: error.message });
    }

    const { category, area, ingredient, page, limit } = value;

    const data = await getAllRecipes({
      category,
      area,
      ingredient,
      page,
      limit,
    });

    res.json({
      status: 200,
      message: "Recipes retrieved successfully",
      data, 
    });
  } catch (error) {
    next(error);
  }
};

/* GET /api/recipes/:id */
export const getRecipeDetails = async (req, res, next) => {
  try {
    const { id } = req.params;

    const recipe = await getRecipeById(id);
    if (!recipe) {
      throw httpError(404, `Recipe with id=${id} not found`);
    }

    res.json({
      status: 200,
      message: "Recipe retrieved successfully",
      data: recipe,
    });
  } catch (error) {
    next(error);
  }
};

/* POST /api/recipes */
export const addRecipe = async (req, res, next) => {
  try {
    const { id: ownerId } = req.user;
    const recipe = await createRecipe({ ...req.body, ownerId });

    res.status(201).json({
      status: 201,
      message: "Recipe created successfully",
      data: recipe,
    });
  } catch (error) {
    next(error);
  }
};

/* DELETE /api/recipes/:id */
export const removeRecipe = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { id: ownerId } = req.user;

    const recipe = await deleteRecipe(id, ownerId);
    if (!recipe) {
      throw httpError(404, "Recipe not found");
    }

    res.json({
      status: 200,
      message: "Recipe deleted successfully",
      data: recipe,
    });
  } catch (error) {
    next(error);
  }
};

/* GET /api/recipes/me */
export const fetchOwnRecipes = async (req, res, next) => {
  try {
    const { value, error } = paginationQuerySchema.validate(req.query);
    if (error) {
      return res.status(400).json({ status: 400, message: error.message });
    }

    const { id: ownerId } = req.user;
    const { page, limit } = value;

    const data = await getOwnRecipes(ownerId, { page, limit });
    res.json({
      status: 200,
      message: "User recipes retrieved successfully",
      data, 
    });
  } catch (error) {
    next(error);
  }
};

/* POST /api/recipes/:id/favorite */
export const addRecipeToFavorite = async (req, res, next) => {
  try {
    const { id: userId } = req.user;
    const { id: recipeId } = req.params;

    const favorite = await addToFavorite(userId, recipeId);

    res.status(201).json({
      status: 201,
      message: "Recipe added to favorites",
      data: favorite,
    });
  } catch (error) {
    next(error);
  }
};

/* DELETE /api/recipes/:id/favorite */
export const deleteRecipeFromFavorite = async (req, res, next) => {
  try {
    const { id: userId } = req.user;
    const { id: recipeId } = req.params;

    const favorite = await removeFromFavorite(userId, recipeId);
    if (!favorite) {
      throw httpError(404, "Favorite not found");
    }

    res.json({
      status: 200,
      message: "Favorite removed successfully",
      data: favorite,
    });
  } catch (error) {
    next(error);
  }
};

/* GET /api/recipes/favorite */
export const fetchFavoriteRecipes = async (req, res, next) => {
  try {
    const { id: userId } = req.user;

    const data = await getUserFavoriteRecipes(userId);
    res.json({
      status: 200,
      message: "Favorite recipes retrieved successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

/* GET /api/recipes/popular */
export const fetchPopularRecipes = async (req, res, next) => {
  try {
    const { value, error } = paginationQuerySchema
      .fork(["limit"], (s) => s.default(4))
      .validate(req.query);

    if (error) {
      return res.status(400).json({ status: 400, message: error.message });
    }

    const { page, limit } = value;

    const data = await getPopularRecipes({ page, limit });
    res.json({
      status: 200,
      message: "Popular recipes retrieved successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

/* GET /api/recipes/filters?category */
export const getRecipeFiltersByCategory = async (req, res, next) => {
  try {
    const schema = Joi.object({
      category: Joi.string().trim().required(),
    });

    const { value, error } = schema.validate(req.query);
    if (error) {
      return res.status(400).json({ status: 400, message: error.message });
    }

    const { category } = value;

    const { recipes = [] } = await getAllRecipes({
      category,
      page: 1,
      limit: 50,
    });

    const areasSet = new Set();
    const ingredientsSet = new Set();

    for (const r of recipes) {
      if (r?.area?.name) areasSet.add(r.area.name);

      if (Array.isArray(r?.ingredients)) {
        r.ingredients.forEach((ing) => {
          if (ing?.name) ingredientsSet.add(ing.name);
        });
      }
    }

    res.json({
      status: 200,
      message: "Filters retrieved successfully",
      data: {
        areas: [...areasSet],
        ingredients: [...ingredientsSet],
      },
    });
  } catch (error) {
    next(error);
  }
};
