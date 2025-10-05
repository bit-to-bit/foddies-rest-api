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

const getFollowers = async (id, page = 1, limit = 8) => {
  const user = await User.findByPk(id);
  if (!user) {
    return null;
  }
  const offset = (page - 1) * limit;
  const total = await user.countFollowers();
  const followers = await user.getFollowers({
    offset,
    limit,
    order: [["id", "ASC"]],
  });
  return {
    followers,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

const getFollowings = async (id, page = 1, limit = 8) => {
  const user = await User.findByPk(id);
  if (!user) {
    return null;
  }
  const offset = (page - 1) * limit;
  const total = await user.countFollowing();
  const followings = await user.getFollowing({
    offset,
    limit,
    order: [["id", "ASC"]],
  });
  return {
    followings,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
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

const getUserRecipes = async (id, page = 1, limit = 8) => {
  const user = await User.findByPk(id);

  if (!user) {
    return null;
  }

  const offset = (page - 1) * limit;

  const [total, recipes] = await Promise.all([
    Recipe.count({ where: { ownerId: id } }),
    Recipe.findAll({
      where: { ownerId: id },
      offset,
      limit,
      order: [["id", "DESC"]],
      include: [
        { model: models.Category, as: "category" },
        { model: models.Area, as: "area" },
        {
          model: models.User,
          as: "owner",
          attributes: ["id", "name", "email", "avatar"],
        },
        { model: models.Ingredient, as: "ingredients" },
      ],
    }),
  ]);

  return {
    recipes,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
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
  getUserRecipes,
};
