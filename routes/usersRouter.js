import express from "express";

import usersControllers from "../controllers/usersControllers.js";

const usersRouter = express.Router();

usersRouter.get("/me", usersControllers.getCurrent);
usersRouter.get("/:id", usersControllers.getUserDetails);
usersRouter.patch("/me/avatar", usersControllers.updateAvatar);
usersRouter.get("/:id/followers", usersControllers.getFollowers);
usersRouter.get("/me/followings", usersControllers.getFollowings);
usersRouter.post("/:id/subscribe", usersControllers.subscribe);
usersRouter.delete("/:id/unsubscribe", usersControllers.unsubscribe);

export default usersRouter;

// getCurrent         -- інформація про поточного користувача GET /users/me
// getUserDetails     -- інформація про користувача           GET /users/:id
// updateAvatar       -- оновлення аватарки                   PATCH /users/me/avatar
// getFollowers       -- послідовники                         GET /users/:id/followers
// getFollowings      -- підписки                             GET /users/me/followings
// subscribe          -- підписатися на користувача           POST /users/:id/subscribe
// unsubscribe        -- відписатися від користувача          DELETE /users/:id/unsubscribe
