import { Router } from "express";
import { addExpense, deleteExpense, getAllExpenses, getExpenseByProduct, getExpenseSummary, deleteLatestExpense } from "../controllers/expense.controller.js";
import { protectRoutes } from "../middleware/protectRoutes.js";


const router = Router();

router.get("/", getAllExpenses);

router.post("/", addExpense);

router.get("/summary", protectRoutes, getExpenseSummary);

router.get("/:productId", getExpenseByProduct);

router.delete("/:productId/:id", deleteExpense);

router.delete("/latest/:productId", deleteLatestExpense);

export default router;