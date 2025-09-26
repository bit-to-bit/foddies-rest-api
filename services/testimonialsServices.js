import { Testimonial } from "../db/Testimonial.js";
import { User } from "../db/User.js";

export const listTestimonials = async ({ limit = 1, offset = 0 }) => {
  return Testimonial.findAndCountAll({
    include: [
      {
        model: User,
        as: "author",
        attributes: ["name"],
      },
    ],
    attributes: ["id", "testimonial", "createdAt", "ownerId"],
    order: [["createdAt", "DESC"]],
    limit,
    offset,
  });
};
