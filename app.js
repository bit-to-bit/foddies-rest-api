import express from "express";
import morgan from "morgan";
import cors from "cors";
import path from "path";
import "dotenv/config";
import "./db/sequelize.js";

import healsRouter from "./routes/healthRouter.js";

const { APP_PORT = 3000 } = process.env;

const app = express();

app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());

app.use(express.static(path.resolve("public")));

app.use("/api", healsRouter);

app.use((_, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

app.listen(APP_PORT, () => {
  console.log(`Server is running. Use our API on port: ${APP_PORT}`);
});
