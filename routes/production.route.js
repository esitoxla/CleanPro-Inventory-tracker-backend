import { Router } from "express";
import { addProduction, deleteLatestProduction, getAllProductions, getProductionByProduct } from "../controllers/production.controller.js";

const router = Router();

router.get("/", getAllProductions);

router.post("/", addProduction);

router.get("/:productId", getProductionByProduct);

router.delete("/latest/:productId", deleteLatestProduction);

export default router;