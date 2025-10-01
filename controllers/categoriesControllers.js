import { Op } from "sequelize";
import models from "../models/index.js";

const {
  Recipe,
  Category,
  Area,
  Ingredient,
} = models;

import { listCategories } from "../services/categoriesServices.js";

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const FALLBACK_IMG = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/v123456/foodies/no_photo.jpg`;

export const getCategories = async (req, res, next) => {
  try {
    const categoriesRaw = await listCategories();

    const categories = categoriesRaw.map((c) => ({
      id: c.id,
      name: c.name,
      img: c.img || FALLBACK_IMG,
    }));

    res.json({
      status: 200,
      message: "Categories retrieved successfully",
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

/* Build Category include by id OR name */
function categoryIncludeFromParam(categoryParam, { required = true } = {}) {
  const val = String(categoryParam);
  const isId = /^\d+$/.test(val);

  return {
    model: Category,
    as: "category",
    attributes: ["id", "name"],
    required,
    where: isId
      ? { id: Number(val) }
      : { name: { [Op.iLike]: val.trim() } },
  };
}

/**
 * GET /api/categories/:category/recipes
 */
export const getCategoryRecipes = async (req, res, next) => {
  try {
    const { category } = req.params;
    const { page = 1, limit = 12, area, ingredient } = req.query;

    const pageNum = Math.max(1, Number(page) || 1);
    const perPage = Math.max(1, Number(limit) || 12);
    const offset = (pageNum - 1) * perPage;

    const include = [
      categoryIncludeFromParam(category, { required: true }),
      {
        model: Area,
        as: "area",
        attributes: ["id", "name"],
        required: !!area,
        where: area
          ? /^\d+$/.test(String(area))
            ? { id: Number(area) }
            : { name: { [Op.iLike]: String(area).trim() } }
          : undefined,
      },
      {
        model: Ingredient,
        as: "ingredients",
        attributes: ["id", "name", "img"],
        through: { attributes: ["measure"] },
        required: !!ingredient,
        where: ingredient
          ? /^\d+$/.test(String(ingredient))
            ? { id: Number(ingredient) }
            : { name: { [Op.iLike]: String(ingredient).trim() } }
          : undefined,
      },
    ];

    const { rows, count } = await Recipe.findAndCountAll({
      include,
      offset,
      limit: perPage,
      order: [["id", "ASC"]],
    });

    res.json({
      status: 200,
      message: "Recipes retrieved successfully",
      data: {
        recipes: rows,
        total: count,
        page: pageNum,
        totalPages: Math.ceil(count / perPage),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/categories/:category/filters
 */
export const getCategoryFilters = async (req, res, next) => {
  try {
    const { category } = req.params;

    const recipes = await Recipe.findAll({
      attributes: ["id"],
      include: [
        categoryIncludeFromParam(category, { required: true }),
        { model: Area, as: "area", attributes: ["id", "name"] },
        {
          model: Ingredient,
          as: "ingredients",
          attributes: ["id", "name"],
          through: { attributes: [] },
        },
      ],
    });

    const areasMap = new Map(); 
    const ingredientsMap = new Map();

    for (const r of recipes) {
      if (r.area?.id && r.area?.name) {
        areasMap.set(String(r.area.id), r.area.name);
      }
      for (const ing of r.ingredients || []) {
        if (ing.id && ing.name) {
          ingredientsMap.set(String(ing.id), ing.name);
        }
      }
    }

    const areas = Array.from(areasMap, ([id, name]) => ({
      id: Number(id),
      name,
    })).sort((a, b) => a.name.localeCompare(b.name));

    const ingredients = Array.from(ingredientsMap, ([id, name]) => ({
      id: Number(id),
      name,
    })).sort((a, b) => a.name.localeCompare(b.name));

    res.json({
      status: 200,
      message: "Filters retrieved successfully",
      data: { areas, ingredients },
    });
  } catch (error) {
    next(error);
  }
};
