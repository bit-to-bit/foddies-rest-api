import Joi from "joi";

import { paginationQuerySchema } from "./paginationSchemas.js";

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

export const listRecipesQuerySchema = paginationQuerySchema.keys({
  category: Joi.string().trim().optional(),
  ingredient: Joi.string().trim().optional(),
  area: Joi.string().trim().optional(),
});
