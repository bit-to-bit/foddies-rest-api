import controllerWrapper from "../helpers/controllerWrapper.js";
import httpError from "../helpers/httpError.js";
import usersServices from "../services/usersServices.js";

const getCurrent = async (req, res) => {
  // const { id } = req.user;
  const id = 2;
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
  // const { id } = req.user;
  // const fileName = req.file.filename;
  // const tempFilePath = req.file.path;
  // const storageFilePath = path.resolve("public", "avatars", fileName);
  // await fs.rename(tempFilePath, storageFilePath);
  // const avatar = await getAvatarUrl(req.headers.host, fileName);
  // const { avatarURL } = await usersServices.updateUser(
  //   { id },
  //   { avatarURL: avatar }
  // );

  const avatarURL = "To Do";

  res.status(200).json({ avatarURL });
  // await fs.unlink(tempFilePath);
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
  const { id } = req.params;
  const result = await usersServices.getFollowings(id);
  if (!result) {
    throw httpError(404, `User with id = ${id} not found`);
  }
  res.json(result);
};

const subscribe = async (req, res) => {
  const { id: followingId } = req.params;
  const { id: followerId } = req.user;
  const result = await usersServices.subscribe(followerId, followingId);
  res.json(result);
};

const unsubscribe = async (req, res) => {
  const { id: followingId } = req.params;
  const { id: followerId } = req.user;
  const result = await usersServices.unsubscribe(followerId, followingId);
  res.json(result);
};

// getCurrent         -- інформація про поточного користувача GET /users/me
// getUserDetails     -- інформація про користувача           GET /users/:id
// updateAvatar       -- оновлення аватарки                   PATCH /users/me/avatar
// getFollowers       -- послідовники                         GET /users/:id/followers
// getFollowings      -- підписки                             GET /users/me/followings
// subscribe          -- підписатися на користувача           POST /users/:id/subscribe
// unsubscribe        -- відписатися від користувача          DELETE /users/:id/unsubscribe

export default {
  getCurrent: controllerWrapper(getCurrent),
  getUserDetails: controllerWrapper(getUserDetails),
  updateAvatar: controllerWrapper(updateAvatar),
  getFollowers: controllerWrapper(getFollowers),
  getFollowings: controllerWrapper(getFollowings),
  subscribe: controllerWrapper(subscribe),
  unsubscribe: controllerWrapper(unsubscribe),
};
