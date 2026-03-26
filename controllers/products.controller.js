import Product from "../models/Product.model.js";
import { colorMap } from "../Utils/colorMap.js";

//add a product
export const createProduct = async (req, res, next) => {
  try {
    const { name, description, color } = req.body;

    if (!name || !color) {
      return res.status(400).json({
        message: "Name and color are required",
      });
    }

    const normalizedColor = color.toLowerCase().trim();
    const hexColor = colorMap[normalizedColor];

    if (!hexColor) {
      return res.status(400).json({
        message: "Invalid color selected",
      });
    }

    const product = await Product.create({
      name,
      description,
      color: hexColor,
      userId: req.user.id, //important
    });

    res.status(201).json({
      success: true,
      product,
    });
  } catch (error) {
    next(error);
  }
};

// Get all products
export const getAllProducts = async (req, res, next) => {
  try {
    const products = await Product.findAll({
      where: { userId: req.user.id },
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    next(error);
  }
};

//get one product
export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    next(error);
  }
};

//update product
export const updateProduct = async (req, res, next) => {
  try {
    const { name, description, color } = req.body;

    const product = await Product.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    // Update fields if provided
    if (name) product.name = name;
    if (description) product.description = description;

    if (color) {
      const normalizedColor = color.toLowerCase().trim();
      const hexColor = colorMap[normalizedColor];

      if (!hexColor) {
        return res.status(400).json({
          message: "Invalid color selected",
        });
      }

      product.color = hexColor;
    }

    await product.save();

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    next(error);
  }
};

//delete a product
export const deleteProduct = async (req, res, next) => {
  try {
    const deleted = await Product.destroy({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
    });

    if (!deleted) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};