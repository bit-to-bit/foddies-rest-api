
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import path from 'path';
import 'dotenv/config';
import './db/sequelize.js';
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./helpers/swagger.js";
import areasRouter from "./routes/areasRouter.js";
import authRouter from "./routes/authRouter.js";
import categoriesRouter from "./routes/categoriesRouter.js";
import healthRouter from "./routes/healthRouter.js";
import ingredientsRouter from "./routes/ingredientsRouter.js";
import testimonialsRouter from "./routes/testimonialsRouter.js";
import usersRouter from "./routes/usersRouter.js";


const { APP_PORT = 3000 } = process.env;

const app = express();

app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(express.static(path.resolve("public")));

app.use("/api/health", healthRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/ingredients", ingredientsRouter);
app.use("/api/users", usersRouter);
app.use("/api/areas", areasRouter);
app.use("/api/auth", authRouter);
app.use("/api/testimonials", testimonialsRouter);

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
