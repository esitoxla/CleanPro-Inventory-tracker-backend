import { Product, Sale } from "../models/syncModels.model.js";

export const addSale = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || !quantity) {
      const error = new Error("Product ID and amount are required");
      error.statusCode = 400;
      return next(error);
    }

    const product = await Product.findOne({ where: { id: productId, userId: req.user.id } });
    if (!product) {
      const error = new Error("Product not found");
      error.statusCode = 404;
      return next(error);
    }

    const sale = await Sale.create({
      productId,
      quantity,
    });
    res.status(201).json({
      success: true,
      message: "Sale record added",
      data: sale,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllSales = async (req, res, next) => {
  try {
    const sales = await Sale.findAll({
      include: [{ model: Product, as: "product", attributes: ["name"], where: { userId: req.user.id } }],
      order: [["createdAt", "DESC"]], //is used to specify the sorting order for query results. means:
      // Sort by the column createdAt
      // In descending order
    });

    res.status(200).json({ success: true, data: sales });
  } catch (error) {
    next(error);
  }
};

export const getSaleByProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const product = await Product.findOne({ where: { id: productId, userId: req.user.id } });
    if (!product) {
      const error = new Error("Product not found");
      error.statusCode = 404;
      return next(error);
    }

    const sales = await Sale.findAll({
      where: { productId },
      include: [{ model: Product, as: "product", attributes: ["name"] }],
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({ success: true, data: sales });
  } catch (error) {
    next(error);
  }
};





// Delete the most recent sale record for a product
export const deleteLatestSale = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const product = await Product.findOne({ where: { id: productId, userId: req.user.id } });
    if (!product) {
      const error = new Error("Product not found");
      error.statusCode = 404;
      return next(error);
    }

    const latestSale = await Sale.findOne({
      where: { productId },
      order: [["createdAt", "DESC"]],
    });

    if (!latestSale) {
      const error = new Error("No sale record found to delete");
      error.statusCode = 404;
      return next(error);
    }

    await latestSale.destroy();

    res.status(200).json({
      success: true,
      message: "Latest sale record deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
