import { Op } from "sequelize";

import { Area } from "../db/Area.js";

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
