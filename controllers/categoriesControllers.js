import { listCategories } from "../services/categoriesServices.js";

export const getCategories = async (req, res, next) => {
  try {
    const categories = await listCategories();
    res.json({
      status: 200,
      message: "Categories retrieved successfully",
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};
