import { isHttpError } from "http-errors";
import { ValidationError, UniqueConstraintError } from "sequelize";

export function errorHandler(err, _req, res, _next) {
  if (isHttpError(err)) {
    return res.status(err.status).json({
      status: err.status,
      message: err.message,
    });
  }
  if (err instanceof ValidationError) {
    err.status = 400;
  }
  if (err instanceof UniqueConstraintError) {
    err.status = 409;
  }
  res
    .status(err.status || 500)
    .json({ status: err.status, message: err.message });
}
