import bcrypt from "bcrypt";
import gravatar from "gravatar";
import createError from "http-errors";
import usersServices from "./usersServices.js";
import { createToken } from "../helpers/jwt.js";
import models from "../models/index.js";
const { User } = models;

export const registerUser = async (payload) => {
  const url = gravatar.url(
    payload.email,
    { s: "100", r: "x", d: "retro" },
    true
  );
  const hashPassword = await bcrypt.hash(payload.password, 10);
  const tokenPayload = {
    email: payload.email,
  };

  const token = createToken(tokenPayload);

  const newUser = await User.create({
    ...payload,
    token: token,
    password: hashPassword,
    avatar: url,
  });

  return newUser;
};

export const loginUser = async (payload) => {
  const { email, password } = payload;
  const user = await usersServices.findUser({ email });

  if (!user) throw new createError.Unauthorized("Email or password is wrong!");

  const comparePassword = await bcrypt.compare(password, user.password);
  if (!comparePassword)
    throw new createError.Unauthorized("Email or password is wrong!");
  const tokenPayload = {
    email: user.email,
  };

  const token = createToken(tokenPayload);
  await user.update({ token });

  return {
    token: token,
    user: { name: user.name, email, avatar: user.avatar },
  };
};

export const logoutUser = async (user) => {
  await user.update({ token: null });
  return user;
};
