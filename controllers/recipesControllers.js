import httpError from "../helpers/httpError.js";
import { Recipe } from "../models/recipe.js";
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

export const getRecipes = async (req, res, next) => {
  try {
    const { category, ingredient, area } = req.query;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 8;

    const data = await getAllRecipes({
      category,
      ingredient,
      area,
      page,
      limit,
    });

    // Expecting { recipes, total, page, totalPages } from service
    res.json({
      status: 200,
      message: "Recipes retrieved successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};


/* GET /api/recipes/filters?category= */
export const getRecipeFiltersByCategory = async (req, res, next) => {
  try {
    const { category } = req.query;
    const { recipes = [] } = await getAllRecipes({
      category,
      page: 1,
      limit: 500, 
    });

    const areasSet = new Set();
    const ingredientsSet = new Set();

    for (const r of recipes) {
      const areaName =
        r?.area?.name ??
        r?.Area?.name ?? 
        r?.area ??
        null;
      if (areaName) areasSet.add(areaName);

      const list =
        r?.ingredients ??
        r?.Ingredients ??
        r?.ingredientsList ??
        [];

      for (const it of list) {
        const ingName = it?.name ?? it;
        if (ingName) ingredientsSet.add(ingName);
      }
    }

    res.json({
      status: 200,
      message: "Filters retrieved successfully",
      data: {
        areas: Array.from(areasSet).sort((a, b) => a.localeCompare(b)),
        ingredients: Array.from(ingredientsSet).sort((a, b) =>
          a.localeCompare(b)
        ),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getRecipeDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    const recipe = await getRecipeById(id);
    if (!recipe) {
      throw httpError(404, `Recipe with id=${id} not found`);
    }
    res.json(recipe);
  } catch (error) {
    next(error);
  }
};

export const addRecipe = async (req, res, next) => {
  try {
    const { id: ownerId } = req.user;
    const recipe = await createRecipe({ ...req.body, ownerId });
    res.status(201).json(recipe);
  } catch (error) {
    next(error);
  }
};

export const removeRecipe = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { id: ownerId } = req.user;
    const recipe = await deleteRecipe(id, ownerId);
    if (!recipe) {
      throw httpError(404);
    }
    res.json(recipe);
  } catch (error) {
    next(error);
  }
};

export const fetchOwnRecipes = async (req, res, next) => {
  try {
    const { id: ownerId } = req.user;
    const { page, limit } = req.query;
    const recipes = await getOwnRecipes(ownerId, {
      page: Number(page) || 1,
      limit: Number(limit) || 8,
    });
    res.json(recipes);
  } catch (error) {
    next(error);
  }
};

export const addRecipeToFavorite = async (req, res, next) => {
  try {
    const { id: userId } = req.user;
    const { id: recipeId } = req.params;
    const favorite = await addToFavorite(userId, recipeId);
    res.status(201).json(favorite);
  } catch (error) {
    next(error);
  }
};

export const deleteRecipeFromFavorite = async (req, res, next) => {
  try {
    const { id: userId } = req.user;
    const { id: recipeId } = req.params;
    const favorite = await removeFromFavorite(userId, recipeId);
    if (!favorite) {
      throw httpError(404, "Favorite not found");
    }
    res.json(favorite);
  } catch (error) {
    next(error);
  }
};

export const fetchFavoriteRecipes = async (req, res, next) => {
  try {
    const { id: userId } = req.user;
    const recipes = await getUserFavoriteRecipes(userId);
    res.json(recipes);
  } catch (error) {
    next(error);
  }
};

export const fetchPopularRecipes = async (req, res, next) => {
  try {
    const { page = 1, limit = 4 } = req.query;
    const recipes = await getPopularRecipes({
      page: Number(page),
      limit: Number(limit),
    });
    res.json(recipes);
  } catch (error) {
    next(error);
  }
};
