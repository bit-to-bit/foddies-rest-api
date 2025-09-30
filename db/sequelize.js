import path from "path";
import { Sequelize } from "sequelize";
import { Umzug, SequelizeStorage } from "umzug";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const {
  DATABASE_DIALECT,
  DATABASE_NAME,
  DATABASE_USERNAME,
  DATABASE_PASSWORD,
  DATABASE_HOST,
  DATABASE_PORT,
  DATABASE_SSL,
} = process.env;

const needSSL =
  (DATABASE_SSL || "").toLowerCase() === "true" ||
  /(render|neon|supabase|railway|vercel)/i.test(DATABASE_HOST || "");

export const sequelize = new Sequelize({
  dialect: DATABASE_DIALECT,
  database: DATABASE_NAME,
  username: DATABASE_USERNAME,
  password: DATABASE_PASSWORD,
  host: DATABASE_HOST,
  port: DATABASE_PORT,
  ...(needSSL
    ? {
        dialectOptions: {
          ssl: { require: true, rejectUnauthorized: false },
        },
      }
    : {}),
});

try {
  await sequelize.authenticate();
  console.log("Database connection successful");
  await runMigrations();
} catch (error) {
  console.log(`Database connection error ${error.message}`);
  process.exit(1);
}

async function runMigrations() {
  const queryInterface = sequelize.getQueryInterface();
  const umzug = new Umzug({
    migrations: {
      glob: path
        .join(__dirname, "..", "migrations", "*.js")
        .replace(/\\/g, "/"),
    },
    context: { queryInterface, DataTypes: Sequelize.DataTypes },
    storage: new SequelizeStorage({ sequelize }),
    logger: console,
  });

  const pending = await umzug.pending();

  if (pending && pending.length > 0) {
    console.log(`Applying ${pending.length} pending migration(s)...`);
    await umzug.up();
    console.log("Migrations applied successfully.");
  } else {
    console.log("No pending migrations.");
  }
}
