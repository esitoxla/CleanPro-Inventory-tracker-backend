import Product from "../models/Product.model.js";

// Get all products
export const getAllProducts = async (req, res, next) => {
  try {
    const products = await Product.findAll({
      order: [["id", "ASC"]],
    });
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    next(error);
  }
};
