import Joi from "joi";

export const createRecipeSchema = Joi.object({
  title: Joi.string().min(3).max(255).required(),
  categoryId: Joi.number().integer().required(),
  ownerId: Joi.number().integer().required(),
  areaId: Joi.number().integer().optional().allow(null),
  instructions: Joi.string().min(10).required(),
  description: Joi.string().optional().allow(null, ""),
  thumb: Joi.string().uri().optional().allow(null, ""),
  time: Joi.number().integer().min(1).optional().allow(null),
  ingredients: Joi.array()
    .items(
      Joi.object({
        ingredientId: Joi.number().integer().required(),
        measure: Joi.string().required(),
      })
    )
    .min(1)
    .required(),
});
