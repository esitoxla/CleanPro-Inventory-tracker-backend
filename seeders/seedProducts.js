import Product from "../models/Product.model.js";

export async function seedProducts() {
  const products = [
    "Liquid Soap",
    "Floor Cleaner",
    "Bleach",
    "Glass Cleaner",
    "Softener",
  ];

  for (const name of products) {
    await Product.findOrCreate({ where: { name } });
  }

  console.log("Default products seeded");
}