import express from "express";

import usersControllers from "../controllers/usersControllers.js";

const usersRouter = express.Router();

usersRouter.get("/:id", usersControllers.getUserDetails);

export default usersRouter;
