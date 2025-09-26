import models from "../models/index.js";
const { Category } = models;

export const listCategories = async () => {
  return Category.findAll({
    attributes: ["id", "name"],
    order: [["name", "ASC"]],
  });
};
