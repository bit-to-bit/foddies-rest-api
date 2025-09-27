import bcrypt from "bcrypt";

import { getDefaultAvatarUrl } from "../helpers/avatar.js";
import { generateUserId } from "../helpers/idGenerator.js";
import fs from "node:fs/promises";
import cloudinary from "../helpers/cloudinary.js";
import models from "../models/index.js";
const { User } = models;

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
}

export const updateAvatar = async (id, file) => {
    const user = await User.findByPk(id);

    // TODO: Uncomment when authentication will work
    // if (!user) {
    //     throw HttpError(401, "Not authorized");
    // }

    if (!file) throw HttpError(400, "Avatar file is required");

    let avatar = null;

    if (file) {
        const { url } = await cloudinary.uploader.upload(file.path, {
            folder: "foodies/avatars",
            use_filename: true,
        });
        avatar = url;
        await fs.unlink(file.path);
    }

    await user.update({ avatar: avatar });
    return {
        avatar: user.avatar,
    };
};
