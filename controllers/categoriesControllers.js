import Joi from "joi";
import { Op } from "sequelize";
import models from "../models/index.js";
import { paginationQuerySchema } from "../schemas/paginationSchemas.js";

const { Recipe, Category, Area, Ingredient, User } = models;

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || "demo";
const FALLBACK_IMG = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/v123456/foodies/no_photo.jpg`;

/* ---------- Validation Schemas -------- */

const categoryParamSchema = Joi.object({
  category: Joi.alternatives()
    .try(Joi.number().integer().positive(), Joi.string().trim().min(1))
    .required(),
});

const categoryFiltersQuerySchema = Joi.object({
}).unknown(true);

const categoryRecipesQuerySchema = paginationQuerySchema
  .keys({
    area: Joi.string().trim().allow(""),
    ingredient: Joi.string().trim().allow(""),
  })
  .unknown(true);


function categoryIncludeFromParam(categoryParam, { required = true } = {}) {
  const val = String(categoryParam);
  const isId = /^\d+$/.test(val);

  return {
    model: Category,
    as: "category",
    attributes: ["id", "name", "img"],
    required,
    where: isId ? { id: Number(val) } : { name: { [Op.iLike]: val.trim() } },
  };
}

/* GET /api/categories */
export const getCategories = async (req, res, next) => {
  try {
    const rows = await Category.findAll({
      attributes: ["id", "name", "img"],
      order: [["name", "ASC"]],
    });

    const data = rows.map((c) => ({
      id: c.id,
      name: c.name,
      img: c.img || FALLBACK_IMG,
    }));

    res.json({
      status: 200,
      message: "Categories retrieved successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

/* GET /api/categories/:category/recipes */
export const getCategoryRecipes = async (req, res, next) => {
  try {
    const { value: paramsVal, error: pErr } = categoryParamSchema.validate(
      req.params
    );
    if (pErr) {
      return res.status(400).json({ status: 400, message: pErr.message });
    }

    const { value: queryVal, error: qErr } = categoryRecipesQuerySchema.validate(
      req.query
    );
    if (qErr) {
      return res.status(400).json({ status: 400, message: qErr.message });
    }

    const { category } = paramsVal;
    const { page = 1, limit = 12, area, ingredient } = queryVal;

    const pageNum = Math.max(1, Number(page) || 1);
    const limitNum = Math.max(1, Number(limit) || 12);
    const offset = (pageNum - 1) * limitNum;

    const includes = [
      categoryIncludeFromParam(category, { required: true }),
      {
        model: Area,
        as: "area",
        attributes: ["id", "name"],
        required: Boolean(area),
        where: area ? { name: { [Op.iLike]: area.trim() } } : undefined,
      },
      {
        model: Ingredient,
        as: "ingredients",
        attributes: ["id", "name"],
        through: { attributes: [] },
        required: Boolean(ingredient),
        where: ingredient
          ? { name: { [Op.iLike]: ingredient.trim() } }
          : undefined,
      },
      {
        model: User,
        as: "owner",
        attributes: ["id", "name", "avatar"],
      },
    ];

    const { rows, count } = await Recipe.findAndCountAll({
      attributes: ["id", "title", "description", "thumb", "preview", "img"],
      include: includes,
      distinct: true,
      offset,
      limit: limitNum,
      order: [["id", "ASC"]],
    });

    const recipes = rows.map((r) => ({
      id: r.id,
      title: r.title,
      description:
        r.description ??
        (r.instructions ? String(r.instructions).slice(0, 160) : ""),
      image: r.thumb || r.preview || r.img || null,
      category: r.category ? { id: r.category.id, name: r.category.name } : null,
      area: r.area ? { id: r.area.id, name: r.area.name } : null,
      ingredients: Array.isArray(r.ingredients)
        ? r.ingredients.map((i) => ({ id: i.id, name: i.name }))
        : [],
      owner: r.owner
        ? { id: r.owner.id, name: r.owner.name, avatar: r.owner.avatar }
        : null,
    }));

    const total = typeof count === "number" ? count : 0;
    const totalPages = total > 0 ? Math.ceil(total / limitNum) : 0;

    res.json({
      status: 200,
      message: "Category recipes retrieved successfully",
      data: { recipes, total, page: pageNum, totalPages },
    });
  } catch (error) {
    next(error);
  }
};

/* GET /api/categories/:category/filters */
export const getCategoryFilters = async (req, res, next) => {
  try {
    const { value: paramsVal, error: pErr } = categoryParamSchema.validate(
      req.params
    );
    if (pErr) {
      return res.status(400).json({ status: 400, message: pErr.message });
    }

    const { error: qErr } = categoryFiltersQuerySchema.validate(req.query);
    if (qErr) {
      return res.status(400).json({ status: 400, message: qErr.message });
    }

    const { category } = paramsVal;

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

    const areas = [
      ...new Map(
        recipes
          .map((r) => r.area)
          .filter(Boolean)
          .map((a) => [a.id, { id: a.id, name: a.name }])
      ).values(),
    ].sort((a, b) => a.name.localeCompare(b.name));

    const ingredients = [
      ...new Map(
        recipes
          .flatMap((r) => r.ingredients || [])
          .map((i) => [i.id, { id: i.id, name: i.name }])
      ).values(),
    ].sort((a, b) => a.name.localeCompare(b.name));

    res.json({
      status: 200,
      message: "Filters retrieved successfully",
      data: { areas, ingredients },
    });
  } catch (error) {
    next(error);
  }
};
