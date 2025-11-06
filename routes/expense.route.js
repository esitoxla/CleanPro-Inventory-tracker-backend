import { Router } from "express";
import { addExpense, deleteExpense, getAllExpenses, getExpenseByProduct, getExpenseSummary } from "../controllers/expense.controller.js";


const router = Router();

router.get("/", getAllExpenses);

router.post("/", addExpense);

router.get("/summary", getExpenseSummary);

router.get("/:productId", getExpenseByProduct);

router.delete("/:productId/:id", deleteExpense);

export default router;