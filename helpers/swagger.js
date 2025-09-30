import path from "path";
import swaggerJSDoc from "swagger-jsdoc";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Foddies REST API",
      version: "1.0.0",
      description: "API documentation for Foddies project",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
  },
  apis: [
    path.join(__dirname, "../docs/*.js"),
    path.join(__dirname, "../routes/**/*.js"),
    path.join(__dirname, "../routes/*.js"),
    path.join(__dirname, "../app.js"),
  ],
};

export const swaggerSpec = swaggerJSDoc(options);
