import "dotenv/config";
import models from "../models/index.js";
const { User } = models;
import httpError from "../helpers/httpError.js";
import { verifyToken } from "../helpers/jwt.js";

export const findUser = async (query) => {
  return User.findOne({
    where: query,
  });
};

export const authenticate = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    throw new httpError(401, "Authorization header missing!");
  }
  const [bearer, token] = authorization.split(" ");
  if (bearer !== "Bearer") {
    throw new httpError(401, "Authorization header must have bearer type!");
  }

  const { id } = verifyToken(token);
  const user = await findUser({ id });

  if (!user) {
    throw new httpError(401, "User not found!");
  }

  req.user = user;
  next();
};
