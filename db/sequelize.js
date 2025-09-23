import { Sequelize } from "sequelize";

const {
  DATABASE_DIALECT,
  DATABASE_NAME,
  DATABASE_USERNAME,
  DATABASE_PASSWORD,
  DATABASE_HOST,
  DATABASE_PORT,
} = process.env;

export const sequelize = new Sequelize({
  dialect: DATABASE_DIALECT,
  database: DATABASE_NAME,
  username: DATABASE_USERNAME,
  password: DATABASE_PASSWORD,
  host: DATABASE_HOST,
  port: DATABASE_PORT,
  dialectOptions: { ssl: true },
});

try {
  await sequelize.authenticate();
  console.log("Database connection successful");
} catch (error) {
  console.log(`Database connection error ${error.message}`);
  process.exit(1);
}
