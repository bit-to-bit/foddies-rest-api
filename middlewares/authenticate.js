import createError from "http-errors";
import { verifyToken } from "../helpers/jwt.js";
import usersServices from "../services/usersServices.js";

const authenticate = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    throw new createError.Unauthorized("Authorization header not found");
  }

  const [bearer, token] = authorization.split(" ");
  if (bearer !== "Bearer") {
    throw new createError.Unauthorized("Bearer not found");
  }

  const { email } = verifyToken(token);

  const user = await usersServices.findUser({ email });
  if (!user) {
    throw new createError.Unauthorized("User not found");
  }
  if (!user.token) {
    throw new createError.Unauthorized("Not authorized");
  }

  req.user = user;
  next();
};

export default authenticate;
