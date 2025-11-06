import Production from "../models/production.model.js";
import Product from "../models/Product.model.js";

export const addProduction = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || !quantity) {
      const error = new Error("Product ID and amount are required");
      error.statusCode = 400;
      return next(error);
    }

    const product = await Product.findByPk(productId);
    if (!product) {
      const error = new Error("Product not found");
      error.statusCode = 404;
      return next(error);
    }

    const production = await Production.create({ productId, quantity });
    res.status(201).json({
      success: true,
      message: "Production record added",
      productId,
      data: production,
    });
  } catch (error) {
    next(error);
  }
};


// GET all productions
export const getAllProductions = async (req, res, next) => {
  try {
    const productions = await Production.findAll({
      include: [{ model: Product, as: "product", attributes: ["name"] }],
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({ success: true, data: productions });
  } catch (error) {
    next(error);
  }
};


// GET productions for a specific product
export const getProductionByProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const productions = await Production.findAll({
      where: { productId },
      include: [{ model: Product, as: "product", attributes: ["name"] }],
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({ success: true, data: productions });
  } catch (error) {
    next(error);
  }
};



// Delete the most recent production record for a product
export const deleteLatestProduction = async (req, res, next) => {
  try {
    const { productId } = req.params;

    // Find the latest record for that product
    const latestProduction = await Production.findOne({
      where: { productId },
      order: [["createdAt", "DESC"]],  //descending order so the one that was added recently
    });

    if (!latestProduction) {
      return res.status(404).json({
        success: false,
        message: "No production record found to delete",
      });
    }

    await latestProduction.destroy();

    res.status(200).json({
      success: true,
      message: "Latest production record deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

