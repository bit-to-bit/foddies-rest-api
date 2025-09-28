import { listCategories } from "../services/categoriesServices.js";

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
