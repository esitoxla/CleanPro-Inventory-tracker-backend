import jwt from "jsonwebtoken";
import User from "../models/auth.model.js";
import bcrypt from "bcrypt";

//sign up
export const registerUser = async (req, res, next) => {
  try {
    const { firstName, lastName, phoneNumber, password, confirmPassword } =
      req.body;

    // Validation
    if (
      !firstName ||
      !lastName ||
      !phoneNumber ||
      !password ||
      !confirmPassword
    ) {
      const error = new Error("All fields are required");
      error.statusCode = 400;
      return next(error);
    }

    if (password !== confirmPassword) {
      const error = new Error("Passwords do not match");
      error.statusCode = 400;
      return next(error);
    }

    // Check if user already exists
    const existingUser = await User.findOne({ where: { phoneNumber } });

    if (existingUser) {
      const error = new Error("User already exists");
      error.statusCode = 400;
      return next(error);
    }

    // Create user (password will be hashed by model hook)
    const user = await User.create({
      firstName,
      lastName,
      phoneNumber,
      password,
    });

    // Generate token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
      },
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    next(error);
  }
};


//login
export const login = async (req, res, next) => {
  const { phoneNumber, password } = req.body;

  if (!phoneNumber || !password) {
    const error = new Error("Phone number and password are required");
    error.statusCode = 400;
    return next(error);
  }

  try {
    const user = await User.findOne({ where: { phoneNumber } });

    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      return next(error);
    }

    const isMatched = await bcrypt.compare(password, user.password);

    if (!isMatched) {
      const error = new Error("Incorrect password");
      error.statusCode = 401;
      return next(error);
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user.id,
        firstName: user.firstName,
        phoneNumber: user.phoneNumber,
      },
    });
  } catch (error) {
    next(error);
  }
};


export const logout = async (req, res, next) => {
  try {
    res.clearCookie("jwt");

    res.status(200).json({ success: true, message: "User logged out" });
  } catch (error) {
    next(error);
  }
};


export const changePassword = async (req, res, next) => {
  try {
    const user = req.user; // comes from middleware

    const { oldPassword, newPassword, confirmPassword } = req.body;

    if (!oldPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        message: "New passwords do not match",
      });
    }

    // Check old password
    const isMatch = await user.comparePassword(oldPassword);

    if (!isMatch) {
      return res.status(400).json({
        message: "Incorrect old password",
      });
    }

    // Update password (hook will hash it)
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = req.user; 

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};
