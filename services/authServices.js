import bcrypt from "bcrypt";
import gravatar from "gravatar";
import models from "../models/index.js";
import { findUser } from "../middlewares/authenticate";
import httpError from "../helpers/httpError.js";
import { createToken } from "../helpers/jwt.js";
const { User } = models;

export const registerUser = async (payload) => {
  const url = gravatar.url(
    payload.email,
    { s: "100", r: "x", d: "retro" },
    true
  );
  const hashPassword = await bcrypt.hash(payload.password, 10);
  const newUser = await User.create({
    ...payload,
    password: hashPassword,
    avatarURL: url,
  });

  return newUser;
};

export const loginUser = async (payload) => {
  const { email, password } = payload;
  const user = await findUser({ email });

  if (!user) throw new httpError(401, "Email or password is wrong!");

  const comparePassword = await bcrypt.compare(password, user.password);
  if (!comparePassword) throw new httpError(401, "Email or password is wrong!");
  const tokenPayload = {
    id: user.id,
  };

  const token = createToken(tokenPayload);
  await user.update({ token });

  return {
    token: token,
    user: { username, email, avatarURL },
  };
};

export const logoutUser = async (user) => {
  await user.update({ token: null });
};
