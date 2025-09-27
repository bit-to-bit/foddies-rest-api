import express from "express";

import usersControllers from "../controllers/usersControllers.js";
import authenticate from "../middlewares/authenticate.js";
import upload from "../middlewares/upload.js";

const usersRouter = express.Router();
usersRouter.use(authenticate);

usersRouter.get("/me", usersControllers.getCurrent);
usersRouter.get("/:id", usersControllers.getUserDetails);
usersRouter.patch(
  "/me/avatar",
  upload.single("avatar"),
  usersControllers.updateAvatar
);
usersRouter.get("/:id/followers", usersControllers.getFollowers);
usersRouter.get("/me/followings", usersControllers.getFollowings);
usersRouter.post("/:id/subscribe", usersControllers.subscribe);
usersRouter.delete("/:id/unsubscribe", usersControllers.unsubscribe);

export default usersRouter;
