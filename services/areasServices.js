import { Op } from "sequelize";

import models from "../models/index.js";
const { Area } = models;

export const listAreas = async ({ search, limit = 10, offset = 0 }) => {
  const where = search ? { name: { [Op.iLike]: `${search}%` } } : {};

  return Area.findAndCountAll({
    attributes: ["id", "name"],
    where,
    order: [["name", "ASC"]],
    limit,
    offset,
  });
};
