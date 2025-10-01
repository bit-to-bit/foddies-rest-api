import {
  registerUser,
  loginUser,
  logoutUser,
} from "../services/authServices.js";
import usersServices from "../services/usersServices.js";

export const registerController = async (req, res) => {
  if (await usersServices.findUser({ email: req.body.email })) {
    return res.status(409).json({ message: "Email already exists" });
  }
  const { user, token } = await registerUser(req.body);
  res.status(201).json({
    token,
    user,
  });
};

export const loginController = async (req, res) => {
  const { token, user } = await loginUser(req.body);
  res.status(200).json({
    token: token,
    user: user,
  });
};

export const logoutController = async (req, res) => {
  const { id } = await logoutUser(req.user);
  res.status(200).json({
    id: id,
    message: "Logout is successfully!",
  });
};
