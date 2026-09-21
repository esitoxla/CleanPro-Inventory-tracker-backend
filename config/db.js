import { Sequelize } from "sequelize";

let sequelize;

if (process.env.NODE_ENV === "production") {
  // ===== PRODUCTION (RENDER + AIVEN) =====
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      dialect: "mysql",
      logging: false,
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      },
    },
  );
  console.log("Using Aiven Database...");
} else {
  // ===== LOCAL DEVELOPMENT =====
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      dialect: "mysql",
      logging: false,
    },
  );
  console.log("Using Local Database...");
}

export default sequelize;
