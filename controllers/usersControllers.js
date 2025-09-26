import controllerWrapper from "../helpers/controllerWrapper.js";
import httpError from "../helpers/httpError.js";
import usersServices from "../services/usersServices.js";

const getCurrent = async (req, res) => {
  const { id } = req.user;
  const result = await usersServices.getUserDetails({ id });
  if (!result) {
    throw httpError(404, `User with id = ${id} not found`);
  }
  res.json(result);
};

const getUserDetails = async (req, res) => {
  const { id } = req.params;
  const result = await usersServices.getUserDetails({ id });
  if (!result) {
    throw httpError(404, `User with id = ${id} not found`);
  }
  res.json(result);
};

const updateAvatar = async (req, res) => {
  const { id } = req.user;
  const avatar = req.file;

  if (!avatar) {
    throw httpError(400, "Avatar file is required");
  }
  const result = await usersServices.updateAvatar(id, avatar);
  res.status(200).json(result);
};

const getFollowers = async (req, res) => {
  const { id } = req.params;
  const result = await usersServices.getFollowers(id);
  if (!result) {
    throw httpError(404, `User with id = ${id} not found`);
  }
  res.json(result);
};

const getFollowings = async (req, res) => {
  const { id } = req.user;
  const result = await usersServices.getFollowings(id);
  if (!result) {
    throw httpError(404, `User with id = ${id} not found`);
  }
  res.json(result);
};

const subscribe = async (req, res) => {
  const { id: followingId } = req.params;
  const { id: followerId } = req.user;
  if (String(followerId) === String(followingId)) {
    throw httpError(400, "Cannot follow yourself");
  }
  const subscription = await usersServices.getSubscription(
    followerId,
    followingId
  );

  if (subscription) {
    throw httpError(409, "Already subscribed");
  }
  const result = await usersServices.subscribe(followerId, followingId);
  res.json(result);
};

const unsubscribe = async (req, res) => {
  const { id: followingId } = req.params;
  const { id: followerId } = req.user;
  const result = await usersServices.unsubscribe(followerId, followingId);
  if (!result) {
    throw httpError(404, "Subscription not found");
  }
  res.status(204).send();
};

export default {
  getCurrent: controllerWrapper(getCurrent),
  getUserDetails: controllerWrapper(getUserDetails),
  updateAvatar: controllerWrapper(updateAvatar),
  getFollowers: controllerWrapper(getFollowers),
  getFollowings: controllerWrapper(getFollowings),
  subscribe: controllerWrapper(subscribe),
  unsubscribe: controllerWrapper(unsubscribe),
};
