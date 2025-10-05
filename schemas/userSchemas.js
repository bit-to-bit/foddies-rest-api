import Joi from "joi";

export const userIdParamSchema = Joi.object({
  id: Joi.number().integer().min(1).required(),
});
