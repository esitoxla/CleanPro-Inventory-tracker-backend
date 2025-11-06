import { Router } from "express";
import { addSale, deleteLatestSale, getAllSales, getSaleByProduct } from "../controllers/sales.controller.js";


const router = Router();

router.get("/", getAllSales);

router.post("/", addSale);

router.get("/:productId", getSaleByProduct);

router.delete("/latest/:productId", deleteLatestSale);

export default router;