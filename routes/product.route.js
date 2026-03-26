import { Router } from "express";
import { createProduct, deleteProduct, getAllProducts, getProductById, updateProduct } from "../controllers/products.controller.js";
import { protectRoutes } from "../middleware/protectRoutes.js";


const router = Router();

router.use(protectRoutes);

router.post("/create", createProduct);

router.get("/all", getAllProducts);

router.get("/:id", getProductById);

router.put("/:id", updateProduct);

router.delete("/:id", deleteProduct);

export default router;
