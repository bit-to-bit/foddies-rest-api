import "dotenv/config";
import { verifyToken } from "../helpers/jwt.js";
import httpError from "../helpers/httpError.js";
import { User } from "../db/User.js";

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
