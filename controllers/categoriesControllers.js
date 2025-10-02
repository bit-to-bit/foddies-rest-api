import { listCategories } from "../services/categoriesServices.js";
import { getAllRecipes } from "../services/recipesServices.js";

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

/* GET /api/categories/:category/filters */
export const getCategoryFilters = async (req, res, next) => {
  try {
    const { category } = req.params;
    const area = req.query.area || "";

    const catParam = String(category || "").replace(/-/g, " ");

    const { recipes = [] } = await getAllRecipes({
      category: catParam,
      area: area || undefined,
      page: 1,
      limit: 50, 
    });

    const areasSet = new Set();
    const ingredientsSet = new Set();

    for (const r of recipes) {
      const aName = r?.area?.name;
      if (aName) areasSet.add(aName);

      const ingList = Array.isArray(r?.ingredients) ? r.ingredients : [];
      for (const ing of ingList) {
        if (ing?.name) ingredientsSet.add(ing.name);
      }
    }

    res.json({
      status: 200,
      message: "Filters retrieved successfully",
      data: {
        areas: Array.from(areasSet).sort((a, b) => a.localeCompare(b)),
        ingredients: Array.from(ingredientsSet).sort((a, b) => a.localeCompare(b)),
      },
    });
  } catch (error) {
    next(error);
  }
};