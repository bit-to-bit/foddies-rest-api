import { Op } from "sequelize";

import {
  Recipe,
  Category,
  Area,
  Ingredient,
  User,
  RecipeIngredientMeasure,
} from "../db/index.js";
import { sequelize } from "../db/sequelize.js";
import httpError from "../helpers/httpError.js";
import e from "express";

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
  // const include = [];

  // if (category) {
  //   include.push({
  //     model: Category,
  //     as: "category",
  //     attributes: ["name"],
  //     where: { name: { [Op.iLike]: `%${category}%` } },
  //     required: true,
  //   });
  // } else {
  //   include.push({
  //     model: Category,
  //     as: "category",
  //     attributes: ["name"],
  //   });
  // }

  // if (area) {
  //   include.push({
  //     model: Area,
  //     as: "area",
  //     attributes: ["name"],
  //     where: { name: { [Op.iLike]: `%${area}%` } },
  //     required: true,
  //   });
  // } else {
  //   include.push({
  //     model: Area,
  //     as: "area",
  //     attributes: ["name"],
  //   });
  // }

  // if (ingredient) {
  //   include.push({
  //     model: Ingredient,
  //     as: "ingredients",
  //     attributes: ["name"],
  //     through: { attributes: [] },
  //     where: { name: { [Op.iLike]: `%${ingredient}%` } },
  //     required: true,
  //   });
  // } else {
  //   include.push({
  //     model: Ingredient,
  //     as: "ingredients",
  //     attributes: ["name"],
  //     through: { attributes: [] },
  //   });
  // }

  // Підрахунок загальної кількості рецептів з урахуванням фільтрів
  const total = await Recipe.count({
    include,
    distinct: true,
    col: "id",
  });

  // Отримання рецептів з фільтрацією та пагінацією
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

// const result = await getAllRecipes({ category: "Beef" });
// console.log(result);

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
      await RecipeIngredientMeasure.bulkCreate(ingredientMeasures, {
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
    await RecipeIngredientMeasure.destroy(
      { where: { recipeId } },
      { transaction }
    );
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
