import Expense from "../models/expense.model.js";
import Product from "../models/Product.model.js";
import { Sequelize } from "sequelize";

export const addExpense = async (req, res, next) => {
  try {
    const { productId, description, amount } = req.body;

    if (!productId || !description || !amount) {
      const error = new Error(
        "Product ID, description, and amount are required"
      );
      error.statusCode = 400;
      return next(error);
    }

    const product = await Product.findByPk(productId);
    if (!product) {
      const error = new Error("Product not found");
      error.statusCode = 404;
      return next(error);
    }

    const expense = await Expense.create({ productId, description, amount });
    res.status(201).json({
      success: true,
      message: "Expense record added",
      data: expense,
    });
  } catch (error) {
    next(error);
  }
};


export const getAllExpenses = async (req, res, next) => {
  try {
    const expenses = await Expense.findAll({
      include: [{ model: Product, as: "product", attributes: ["name"] }],
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({ success: true, data: expenses });
  } catch (error) {
    next(error);
  }
};


export const getExpenseByProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const expenses = await Expense.findAll({
      where: { productId },
      include: [{ model: Product, as: "product", attributes: ["name"] }],
      order: [["createdAt", "DESC"]],
    });

    if (!expenses.length) {
      const error = new Error("No expenses found for this product");
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json({ success: true, data: expenses });
  } catch (error) {
    next(error);
  }
};


//this will delete the expense of a particular product
export const deleteExpense = async (req, res, next) => {
  try {
    const { productId, id } = req.params; // get both from URL

    // Ensure both parameters are provided
    if (!productId || !id) {
      const error = new Error("Product ID and Expense ID are required");
      error.statusCode = 400;
      return next(error);
    }

    // Find the expense that matches both productId and id
    const deleted = await Expense.destroy({
      where: { id, productId },
    });

    if (!deleted) {
      const error = new Error("Expense not found for this product");
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json({
      success: true,
      message: "Expense deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};



export const getExpenseSummary = async (req, res, next) => {
  try {
    const expenses = await Expense.findAll({
      attributes: [
        "productId",
        [Sequelize.fn("SUM", Sequelize.col("amount")), "total"],
      ],
      include: [
        {
          model: Product,
          as: "product",
          attributes: ["name"],
        },
      ],
      group: ["productId", "product.id"],
      order: [["productId", "ASC"]],
    });

    if (!expenses.length) {
      return res.status(404).json({
        success: false,
        message: "No expenses found",
      });
    }

    const summary = expenses.map((exp) => ({
      product: exp.product.name,
      total: parseFloat(exp.dataValues.total),
    }));

    const overallTotal = summary.reduce((sum, item) => sum + item.total, 0);

    res.status(200).json({
      success: true,
      data: summary,
      total: overallTotal,
    });
  } catch (error) {
    next(error);
  }
};