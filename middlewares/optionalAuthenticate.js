import { verifyToken } from "../helpers/jwt.js";
import usersServices from "../services/usersServices.js";

const optionalAuthenticate = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) return next();

  const [bearer, token] = authorization.split(" ");
  if (bearer !== "Bearer") return next();

  try {
    const { id } = verifyToken(token);
    const user = await usersServices.findUser({ id });
    if (user && user.token) {
      req.user = user;
    }
  } catch (error) {
    console.warn("Optional auth failed:", error.message);
  } finally {
    next();
  }
};

export default optionalAuthenticate;
