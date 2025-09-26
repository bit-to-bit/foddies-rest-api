import { listIngredients } from "../services/ingredientsServices.js";

export const getIngredients = async (req, res, next) => {
  try {
    const {
      search = "",
      limit: limitRaw = "10",
      page: pageRaw = "1",
    } = req.query;

    let limit = parseInt(limitRaw, 10);
    if (Number.isNaN(limit) || limit < 1) limit = 10;
    if (limit > 50) limit = 50;

    let page = parseInt(pageRaw, 10);
    if (Number.isNaN(page) || page < 1) page = 1;

    const offset = (page - 1) * limit;

    const { rows, count } = await listIngredients({ search, limit, offset });

    res.json({
      status: 200,
      message: "Ingredients retrieved successfully",
      data: {
        items: rows,
        total: count,
        page,
        totalPages: Math.ceil(count / limit),
        limit,
      },
    });
  } catch (error) {
    next(error);
  }
};
