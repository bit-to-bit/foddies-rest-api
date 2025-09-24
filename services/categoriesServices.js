import { Category } from '../db/Categorie.js';

export const listCategories = async () => {
  return Category.findAll({
    attributes: ['id', 'name'],
    order: [['name', 'ASC']],
  });
};
