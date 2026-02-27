import { Sequelize } from "sequelize";

let sequelize;

if (process.env.DATABASE_URL) {
  // ===== PRODUCTION (RAILWAY) =====
  sequelize = new Sequelize(process.env.MYSQL_URL, {
    dialect: "mysql",
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  });
  console.log("Using Railway Database...");
} else {
  // ===== LOCAL DEVELOPMENT =====
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
      host: process.env.DB_HOST,
      dialect: "mysql",
      logging: false,
    },
  );
  console.log("Using Local Database...");
}

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log("MySQL connected successfully!");
  } catch (error) {
    console.error("Unable to connect to MySQL:", error);
  }
}

testConnection();

export default sequelize;
