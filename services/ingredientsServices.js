import { Op } from 'sequelize';
import models from "../models/index.js";
const { Ingredient } = models;

export const listIngredients = async ({ search, limit = 10, offset = 0 }) => {
  const where = search ? { name: { [Op.iLike]: `${search}%` } } : {};

  return Ingredient.findAndCountAll({
    attributes: ['id', 'name', 'desc', 'img'],
    where,
    order: [['name', 'ASC']],
    limit,
    offset,
  });
};
