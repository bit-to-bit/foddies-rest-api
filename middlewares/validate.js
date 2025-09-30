import HttpError from "../helpers/httpError.js";

const validate = (schema, source = "body") => {
  const func = (req, _, next) => {
    const { error } = schema.validate(req[source], { abortEarly: false });
    if (error) {
      next(HttpError(400, error.message));
    }
    next();
  };

  return func;
};

export default validate;
