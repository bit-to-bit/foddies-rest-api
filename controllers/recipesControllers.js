import { getAllRecipes } from "../services/recipesServices.js";
export const getRecipes = async (req, res, next) => {
  try {
    const { category, ingredient, area, page = 1, limit = 8 } = req.query;
    const recipes = await getAllRecipes({
      category,
      ingredient,
      area,
      page: Number(page),
      limit: Number(limit),
    });
    res.json(recipes);
  } catch (error) {
    next(error);
  }
};
