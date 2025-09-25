import { Op } from "sequelize";

import { Ingredient } from "../db/Ingredient.js";

export const listIngredients = async ({ search, limit = 10, offset = 0 }) => {
  const where = search ? { name: { [Op.iLike]: `${search}%` } } : {};

  return Ingredient.findAndCountAll({
    attributes: ["id", "name", "desc", "img"],
    where,
    order: [["name", "ASC"]],
    limit,
    offset,
  });
};
