import express from "express";
import usersControllers from "../controllers/usersControllers.js";
// TODO: Uncomment when authentication will work
// import { authenticate } from "../middlewares/authenticate.js";

import upload from "../middlewares/upload.js";

const usersRouter = express.Router();

usersRouter.get("/:id", usersControllers.getUserDetails);
usersRouter.patch(
    "/avatars/:id",
    upload.single("avatar"),
    // TODO: Uncomment when authentication will work
    // authenticate,
    usersControllers.updateUserAvatarController
);

export default usersRouter;
