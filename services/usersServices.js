import bcrypt from "bcrypt";
import { User } from "../db/User.js";
import { getDefaultAvatarUrl } from "../helpers/avatar.js";
import { generateUserId } from "../helpers/idGenerator.js";

export const findUser = async (filter) => await User.findOne({ where: filter });

export const getUserDetails = async (filter) => {
  const user = await findUser(filter);
  if (!user) {
    return null;
  }
  // TODO: Refactor this function after creating reciepes and follovers entities
  return { ...user.get(), recipesAmount: 0, followersAmount: 0 };
};

export const createUser = async (data) => {
  const { password, id = generateUserId() } = data;
  const hashPassword = await bcrypt.hash(password, 10);
  const avatar = getDefaultAvatarUrl();
  return User.create({ ...data, password: hashPassword, avatarURL: avatar });
};

export const updateUser = async (filter, data) => {
  const user = await findUser(filter);
  if (user) {
    await user.update(data);
    await user.save();
  }
  return user;
};
