import models from "../models/index.js";

import e from "express";
import { Op } from "sequelize";
const { Recipe, Category, Area, Ingredient, User, RecipeIngredient } = models;

import { sequelize } from "../db/sequelize.js";
import httpError from "../helpers/httpError.js";

export const recipeDetails = (filters = {}) => {
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
  // include.push({
  //   model: Ingredient,
  //   as: "ingredients",
  //   attributes: ["name"],
  //   through: { attributes: [] },
  //   ...(ingredient
  //     ? { where: { name: { [Op.iLike]: `%${ingredient}%` } }, required: true }
  //     : {}),
  // });
  // include.push({
  //   model: User,
  //   as: "owner",
  //   attributes: ["name", "email"],
  // });
  return include;
};

export const getAllRecipes = async ({
  category,
  ingredient,
  area,
  page = 1,
  limit = 8,
}) => {
  const offset = (page - 1) * limit;
  const include = recipeDetails({ category, area, ingredient });

  const total = await Recipe.count({
    include,
    distinct: true,
    col: "id",
  });

  const recipes = await Recipe.findAll({
    include,
    limit,
    offset,
    order: [["id", "DESC"]],
    distinct: true,
    logging: console.log,
  });

  return {
    recipes,
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

export const createRecipe = async (data) => {
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
    return recipe;
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
