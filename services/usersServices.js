import models from "../models/index.js";
const { User, UserFollower } = models;

const findUser = async (filter) => await User.findOne({ where: filter });

const getUserDetails = async (filter) => {
  const user = await User.findOne({
    attributes: ["id", "name", "email", "avatar"],
    where: filter,
  });
  if (!user) {
    return null;
  }
  const recipesAmount = 0;
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
  const followings = await user.getFollowings();
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

const unsubscribe = async (followerId, followingId) => {
  if (followerId === followingId) throw new Error("Cannot follow yourself");
  const exists = await UserFollower.findOne({
    where: { followerId, followingId },
  });
  if (exists) throw new Error("Already following");
  await UserFollower.destroy({ followerId, followingId });
  return { message: "Subscribed successfully" };
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
  subscribe,
  unsubscribe,
};
