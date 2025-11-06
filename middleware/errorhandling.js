export const errorHandler = (err, req, res, next) => {
   let statusCode = res.statusCode === 200 ? 500 : res.statusCode;

   let message = err.message;

  if (err.name === "SequelizeValidationError") {
    statusCode = 400;
    message = err.errors.map((e) => e.message).join(", ");
  }

  if (err.name === "SequelizeUniqueConstraintError") {
    statusCode = 409;
    message = "Duplicate entry. Please use unique values.";
  }

  if (err.name === "SequelizeForeignKeyConstraintError") {
    statusCode = 409;
    message = "Cannot delete or modify because of related data.";
  }

  if (err.name === "SequelizeDatabaseError") {
    message = "Database query error.";
  }

  if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Invalid or expired token.";
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
};
