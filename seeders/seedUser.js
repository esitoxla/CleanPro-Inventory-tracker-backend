import bcrypt from "bcrypt";
import User from "../models/auth.model.js";

const new_pass = "1234"

export async function seedUser() {
  const existing = await User.findOne();
  if (!existing) {
    const hash = await bcrypt.hash(new_pass, 10);
    await User.create({ username: "cleanpro", password: hash });
    console.log("Default user seeded");
  } else {
    console.log("User already exists, skipping seed");
  }
}