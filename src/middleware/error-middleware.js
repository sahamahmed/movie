import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from "@prisma/client/runtime/library";
import ErrorHandler from "../utils/error-handler.js";

const errorMiddleware = (err, req, res, next) => {
  err.message = err.message || "Internal Server Error";  
  err.statusCode = err.statusCode || 500;

  console.log(err.message);

  if (err instanceof PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      const message = `Duplicate value entered for field: ${err.meta?.target}. Please use a different value.`;
      err = new ErrorHandler(message, 400);
    }
  }

  if (err instanceof PrismaClientValidationError) {
    err = new ErrorHandler(
      "Invalid input data. Please check your request.",
      400
    );
  }

  if (err instanceof PrismaClientKnownRequestError && err.code === "P2025") {
    err = new ErrorHandler("Resource not found.", 404);
  }

  if (err.name === "JsonWebTokenError") {
    err = new ErrorHandler("Invalid token. Please log in again.", 401);
  }

  if (err.name === "TokenExpiredError") {
    err = new ErrorHandler("Token expired. Please log in again.", 401);
  }

  if (err instanceof SyntaxError && err.hasOwnProperty("body")) {
    err = new ErrorHandler("Invalid JSON syntax in request body.", 400);
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message ? err.message : "Something went wrong!",
  });
};

export default errorMiddleware;
