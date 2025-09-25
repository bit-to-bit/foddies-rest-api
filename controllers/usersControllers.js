import httpError from "../helpers/httpError.js";
import * as usersServices from "../services/usersServices.js";

const getUserDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await usersServices.getUserDetails({ id });
    if (!result) {
      throw httpError(404, `User with id = ${id} not found`);
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export default {
  getUserDetails,
};
