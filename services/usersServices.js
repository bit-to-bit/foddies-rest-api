import fs from "node:fs/promises";

import cloudinary from "../helpers/cloudinary.js";
import models from "../models/index.js";

const { User, UserFollower, Recipe } = models;

const findUser = async (filter) => await User.findOne({ where: filter });

const getUserDetails = async (filter) => {
  const user = await User.findOne({
    attributes: ["id", "name", "email", "avatar"],
    where: filter,
  });
  if (!user) {
    return null;
  }
  const recipesAmount = await Recipe.count({ where: { ownerId: user.id } });
  // TODO: add favorite recipes relation in DB and fix:
  const favoriteRecipesAmount = 0;
  const followersAmount = await user.countFollowers();
  const followingsAmount = await user.countFollowing();
  return {
    ...user.dataValues,
    recipesAmount,
    favoriteRecipesAmount,
    followersAmount,
    followingsAmount,
  };
};

const getFollowers = async (id) => {
  const user = await User.findByPk(id);
  if (!user) {
    return null;
  }
  const followers = await user.getFollowers();
  return followers;
};

const getFollowings = async (id) => {
  const user = await User.findByPk(id);
  if (!user) {
    return null;
  }
  const followings = await user.getFollowing();
  return followings;
};

const subscribe = async (followerId, followingId) => {
  if (followerId === followingId) throw new Error("Cannot follow yourself");
  const exists = await UserFollower.findOne({
    where: { followerId, followingId },
  });
  if (exists) throw new Error("Already following");
  await UserFollower.create({ followerId, followingId });
  return { message: "Subscribed successfully" };
};

const getSubscription = async (followerId, followingId) => {
  const subscription = await UserFollower.findOne({
    where: { followerId, followingId },
  });
  return subscription || null;
};

const unsubscribe = async (followerId, followingId) => {
  const subscription = await getSubscription(followerId, followingId);
  if (subscription) {
    await subscription.destroy();
  }
  return subscription || null;
};

const updateAvatar = async (id, file) => {
  const user = await User.findByPk(id);
  if (!user) return null;

  let avatar = user.avatar;

  if (file) {
    const { url } = await cloudinary.uploader.upload(file.path, {
      folder: "foodies/avatars",
      use_filename: true,
    });
    avatar = url;
    await fs.unlink(file.path);
    await user.update({ avatar });
  }

  return { avatar };
};

const updateUser = async (filter, data) => {
  const user = await findUser(filter);
  if (user) {
    await user.update(data);
    await user.save();
  }
  return user;
};

export default {
  findUser,
  getUserDetails,
  updateUser,
  getFollowers,
  getFollowings,
  getSubscription,
  subscribe,
  unsubscribe,
  updateAvatar,
};
