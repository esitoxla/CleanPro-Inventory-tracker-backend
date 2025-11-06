import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import sequelize from "./config/db.js";
import { seedUser } from "./seeders/seedUser.js";
import authRoute from "./routes/auth.route.js"
import productionRoute from "./routes/production.route.js"
import expenseRoute from "./routes/expense.route.js"
import saleRoute from "./routes/sale.route.js"
import productRoute from "./routes/product.route.js"
import { notFound } from "./middleware/notFound.js";
import { errorHandler } from "./middleware/errorhandling.js";
import { seedProducts } from "./seeders/seedProducts.js";

const PORT = process.env.PORT;

const app = express();

app.use(express.json());

app.use(
  cors({
    origin:[ "http://localhost:5174", "https://cleanpro-inventory-tracker.netlify.app/"],
    credentials: true,
  })
);

app.use(cookieParser());

app.use("/api/auth", authRoute);
app.use("/api/productions", productionRoute);
app.use("/api/sales", saleRoute);
app.use("/api/expenses", expenseRoute);
app.use("/api/products", productRoute);


app.use(notFound);
app.use(errorHandler);


sequelize.sync().then(() => {
  seedUser();
  seedProducts();
  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
  });
});
