import jwt from "jsonwebtoken";
import User from "../models/auth.model.js";
import bcrypt from "bcrypt";

export const login = async (req, res, next) => {
  const { password } = req.body;

  if (!password) {
    const error = new Error("Password is required");
    error.statusCode = 400;
    return next(error);
  }

   try {
     // Since it's a single-user system, just get the one user
     const user = await User.findOne();
     if (!user) {
       const error = new Error("No user found in the system");
       error.statusCode = 404;
       return next(error);
     }

     // Compare entered password with the hashed password in DB
     const isMatched = await bcrypt.compare(password, user.password);
     if (!isMatched) {
       const error = new Error("Incorrect passcode");
       error.statusCode = 401;
       return next(error);
     }

     // Generate JWT token
     const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
       expiresIn: "1d",
     });

     // Send cookie to browser
     res.cookie("jwt", token, {
       httpOnly: true,
       secure: process.env.NODE_ENV === "production", // only https in production
       sameSite: "strict",
       maxAge: 24 * 60 * 60 * 1000, // 1 day
     });

     res.status(200).json({
       success: true,
       message: "Login successful",
       user: {
         id: user.id,
         username: user.username,
       },
     });
   } catch (error) {
     next(error)
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
    const token = req.cookies.jwt;

    if (!token) {
      const error = new Error("User not authenticated");
      error.statusCode = 401;
      return next(error);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);

    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      return next(error);
    }

    const { oldPassword, newPassword } = req.body;

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      const error = new Error("Incorrect old password");
      error.statusCode = 400;
      return next(error);
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
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
    const token = req.cookies.jwt;

    if (!token) {
      const error = new Error("User not found");
      error.statusCode = 404;
      return next(error);
    }

    //Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      const error = new Error("Token invalid");
      error.statusCode = 401;
      return next(error);
    }

    //Find user by primary key (id)
    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ["password"] }, // omit password field
    });

    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      return next(error);
    }

    //Return response
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};
