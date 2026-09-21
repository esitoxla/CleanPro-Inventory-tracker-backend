import { Router } from "express";
import { addSale, deleteLatestSale, getAllSales, getSaleByProduct } from "../controllers/sales.controller.js";
import { protectRoutes } from "../middleware/protectRoutes.js";


const router = Router();

router.use(protectRoutes);

router.get("/", getAllSales);

router.post("/", addSale);

router.get("/:productId", getSaleByProduct);

router.delete("/latest/:productId", deleteLatestSale);

export default router;