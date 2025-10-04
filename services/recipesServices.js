import models from "../models/index.js";

import e from "express";
import { Op } from "sequelize";
const { Recipe, Category, Area, Ingredient, User, RecipeIngredient, Favorite } =
  models;

import { sequelize } from "../db/sequelize.js";
import httpError from "../helpers/httpError.js";

export const recipeDetails = (filters = {}, userId = null) => {
  const { category, area, ingredient } = filters;
  const include = [];
  include.push({
    model: Category,
    as: "category",
    attributes: ["name"],
    ...(category
      ? { where: { name: { [Op.iLike]: `%${category}%` } }, required: true }
      : {}),
  });
  include.push({
    model: Area,
    as: "area",
    attributes: ["name"],
    ...(area
      ? { where: { name: { [Op.iLike]: `%${area}%` } }, required: true }
      : {}),
  });
  const ingredientFilter = ingredient
    ? [
        {
          model: Ingredient,
          as: "ingredientsFilter",
          attributes: [],
          through: { attributes: [] },
          where: { name: { [Op.iLike]: `%${ingredient}%` } },
          required: true,
        },
      ]
    : [];

  include.push(...ingredientFilter);
  include.push({
    model: Ingredient,
    as: "ingredients",
    attributes: ["name", "img"],
    through: { attributes: ["measure"] },
  });

  include.push({
    model: User,
    as: "owner",
    attributes: ["id", "name", "avatar"],
  });
  if (userId) {
    include.push({
      model: Favorite,
      as: "favorites",
      where: { userId },
      required: false,
    });
  }
  return include;
};

export const getAllRecipes = async ({
  category,
  ingredient,
  area,
  page = 1,
  limit = 8,
  userId,
}) => {
  const offset = (page - 1) * limit;
  const include = recipeDetails({ category, area, ingredient }, userId);

  const { count: total, rows: recipes } = await Recipe.findAndCountAll({
    include,
    limit,
    offset,
    order: [["id", "DESC"]],
    distinct: true,
  });
  const normalized = recipes.map((r) => ({
    ...r.dataValues,
    isFavorite: userId ? r.favorites && r.favorites.length > 0 : false,
  }));
  console.log(userId);

  return {
    recipes: normalized,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
};

export const getRecipeById = async (id) => {
  const recipe = await Recipe.findByPk(id, {
    include: recipeDetails(),
  });
  return recipe;
};

export const createRecipe = async (data, file) => {
  const transaction = await sequelize.transaction();

  try {
    const recipe = await Recipe.create(data, { transaction });

    if (data.ingredients && data.ingredients.length > 0) {
      const ingredientMeasures = data.ingredients.map((item) => ({
        recipeId: recipe.id,
        ingredientId: item.ingredientId,
        measure: item.measure,
      }));
      await RecipeIngredient.bulkCreate(ingredientMeasures, {
        transaction,
      });
    }

    await transaction.commit();
    const createdRecipe = await Recipe.findByPk(recipe.id, {
      include: recipeDetails(),
    });

    if (file) {
      const { url } = await cloudinary.uploader.upload(file.path, {
        folder: "foodies/recipes",
        use_filename: true,
      });
      thumb = url;
      await fs.unlink(file.path);
      await createdRecipe.update({ thumb });
      await createdRecipe.save();
    }

    return createdRecipe;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

export const deleteRecipe = async (recipeId, ownerId) => {
  const transaction = await sequelize.transaction();
  try {
    const recipe = await Recipe.findOne({ where: { id: recipeId, ownerId } });
    if (!recipe) {
      throw httpError(404, "Recipe not found or you are not the owner");
    }
    await RecipeIngredient.destroy({ where: { recipeId } }, { transaction });
    await Recipe.destroy({ where: { id: recipeId } }, { transaction });
    await transaction.commit();
    return recipe;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

export const getOwnRecipes = async (ownerId, { page = 1, limit = 10 } = {}) => {
  const offset = (page - 1) * limit;
  const { count: total, rows: recipes } = await Recipe.findAndCountAll({
    where: { ownerId },
    include: recipeDetails(),
    limit,
    offset,
    order: [["id", "DESC"]],
  });
  return {
    recipes,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
};

export const addToFavorite = async (userId, recipeId) => {
  const recipe = await Recipe.findByPk(recipeId);
  if (!recipe) {
    throw httpError(404, "Recipe not found");
  }
  const existing = await Favorite.findOne({ where: { userId, recipeId } });
  if (existing) {
    throw httpError(400, "Recipe already in favorites");
  }
  const favorite = await Favorite.create({ userId, recipeId });
  return favorite;
};

export const removeFromFavorite = async (userId, recipeId) => {
  const favorite = await Favorite.findOne({ where: { userId, recipeId } });
  if (!favorite) {
    throw httpError(404, "Favorite not found");
  }
  await Favorite.destroy({ where: { userId, recipeId } });
  return favorite;
};

export const getUserFavoriteRecipes = async (
  userId,
  { page = 1, limit = 9 } = {}
) => {
  const pageNum = Number(page) || 1;
  const limitNum = Number(limit) || 9;
  const offset = (pageNum - 1) * limitNum;
  const { count: total, rows: favorites } = await Favorite.findAndCountAll({
    where: { userId },
    include: {
      model: Recipe,
      as: "recipe",
      include: recipeDetails(),
    },
    distinct: true,
    limit: limitNum,
    offset,
    order: [["id", "DESC"]],
  });
  const recipes = favorites.map((fav) => fav.recipe);
  return {
    recipes,
    total,
    page: pageNum,
    totalPages: Math.ceil(total / limitNum),
  };
};

export const getPopularRecipes = async ({ page = 1, limit = 4 } = {}) => {
  const offset = (page - 1) * limit;
  const recipes = await Recipe.findAll({
    attributes: {
      include: [
        [
          sequelize.literal(`(
            SELECT COUNT(*) 
            FROM "favorites" AS f 
            WHERE f."recipeId" = "recipe"."id"
          )`),
          "favoritesCount",
        ],
      ],
    },
    include: recipeDetails(),
    order: [[sequelize.literal('"favoritesCount"'), "DESC"]],
    limit,
    offset,
  });

  const totalCount = await Recipe.count();
  return {
    recipes,
    total: totalCount,
    page,
    totalPages: Math.ceil(totalCount / limit),
  };
};
