import { Recipe, Category, Area, Ingredient, User } from "../db/index.js";
import { Op } from "sequelize";

export const getAllRecipes = async ({
  category,
  ingredient,
  area,
  page = 1,
  limit = 8,
}) => {
  console.log("Фільтр category:", category);
  const offset = (page - 1) * limit;
  const include = [];

  if (category) {
    include.push({
      model: Category,
      as: "category",
      attributes: ["name"],
      where: { name: { [Op.iLike]: `%${category}%` } },
      required: true,
    });
  }

  if (area) {
    include.push({
      model: Area,
      as: "area",
      attributes: ["name"],
      where: { name: { [Op.iLike]: `%${area}%` } },
      required: true,
    });
  }

  // include.push({
  //   model: Ingredient,
  //   as: "ingredients",
  //   attributes: ["name"],
  //   through: { attributes: [] },
  //   ...(ingredient
  //     ? { where: { name: { [Op.iLike]: `%${ingredient}%` } }, required: true }
  //     : {}),
  // });

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
