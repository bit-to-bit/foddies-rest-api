import { listTestimonials } from "../services/testimonialsServices.js";

export const getTestimonials = async (req, res, next) => {
  try {
    const { limit: limitRaw = "1", page: pageRaw = "1" } = req.query;

    let limit = parseInt(limitRaw, 10);
    if (Number.isNaN(limit) || limit < 1) limit = 1;
    if (limit > 20) limit = 20;

    let page = parseInt(pageRaw, 10);
    if (Number.isNaN(page) || page < 1) page = 1;

    const offset = (page - 1) * limit;

    const { rows, count } = await listTestimonials({ limit, offset });

    res.json({
      status: 200,
      message: "Testimonials retrieved successfully",
      data: {
        items: rows.map((t) => ({
          id: t.id,
          testimonial: t.testimonial,
          authorName: t.author?.name ?? "Anonymous",
          createdAt: t.createdAt,
        })),
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
