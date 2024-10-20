 
 
/* eslint-disable @typescript-eslint/no-unused-vars */
 

import { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import handleZodError from "../errors/handleZodError";
import handleCastError from "../errors/handleCastError";
import handleValidationError from "../errors/handleValidationError";
import { AppError } from "../errors/appErrors";
import config from "../config";
import handleDuplicateError from "../errors/handleDublicateError";

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  let errorMessage = "";
  let statusCode = 500;
  let message = err.message || "Something is wrong!";

  if (err instanceof ZodError) {
    const simplifiedZodError = handleZodError(err);
    statusCode = simplifiedZodError?.statusCode;
    message = simplifiedZodError.message;
  } else if (err?.name === "ValidationError") {
    const simplifiedValidationError = handleValidationError(err);
    statusCode = simplifiedValidationError.statusCode;
    message = simplifiedValidationError.message;
    errorMessage = simplifiedValidationError.errorMessage;
  } else if (err?.name === "CastError") {
    const simplifiedCastError = handleCastError(err);
    statusCode = simplifiedCastError?.statusCode;
    message = simplifiedCastError?.message;
    errorMessage = simplifiedCastError?.errorMessage;
  } else if (err instanceof AppError) {
    statusCode = err?.statusCode;
    message = err.message;
    errorMessage = err.message;
  } else if (err?.code === 11000) {
    const simplifiedError = handleDuplicateError(err);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorMessage = simplifiedError?.errorMessage;
  } else if (err instanceof Error) {
    message = err?.message;
    errorMessage = err?.message;
  }

  return res.status(statusCode).json({
    success: false,
    message,
    errorMessage,
    errorDetails: err,
    stack: config.NODE_ENV === "development" ? err?.stack : null,
  });
};

export default globalErrorHandler;
