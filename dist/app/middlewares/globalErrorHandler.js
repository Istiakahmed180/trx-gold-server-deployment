"use strict";
/* eslint-disable @typescript-eslint/no-unused-vars */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const handleZodError_1 = __importDefault(require("../errors/handleZodError"));
const handleCastError_1 = __importDefault(require("../errors/handleCastError"));
const handleValidationError_1 = __importDefault(require("../errors/handleValidationError"));
const appErrors_1 = require("../errors/appErrors");
const config_1 = __importDefault(require("../config"));
const handleDublicateError_1 = __importDefault(require("../errors/handleDublicateError"));
const globalErrorHandler = (err, req, res, next) => {
    let errorMessage = "";
    let statusCode = 500;
    let message = err.message || "Something is wrong!";
    if (err instanceof zod_1.ZodError) {
        const simplifiedZodError = (0, handleZodError_1.default)(err);
        statusCode = simplifiedZodError === null || simplifiedZodError === void 0 ? void 0 : simplifiedZodError.statusCode;
        message = simplifiedZodError.message;
    }
    else if ((err === null || err === void 0 ? void 0 : err.name) === "ValidationError") {
        const simplifiedValidationError = (0, handleValidationError_1.default)(err);
        statusCode = simplifiedValidationError.statusCode;
        message = simplifiedValidationError.message;
        errorMessage = simplifiedValidationError.errorMessage;
    }
    else if ((err === null || err === void 0 ? void 0 : err.name) === "CastError") {
        const simplifiedCastError = (0, handleCastError_1.default)(err);
        statusCode = simplifiedCastError === null || simplifiedCastError === void 0 ? void 0 : simplifiedCastError.statusCode;
        message = simplifiedCastError === null || simplifiedCastError === void 0 ? void 0 : simplifiedCastError.message;
        errorMessage = simplifiedCastError === null || simplifiedCastError === void 0 ? void 0 : simplifiedCastError.errorMessage;
    }
    else if (err instanceof appErrors_1.AppError) {
        statusCode = err === null || err === void 0 ? void 0 : err.statusCode;
        message = err.message;
        errorMessage = err.message;
    }
    else if ((err === null || err === void 0 ? void 0 : err.code) === 11000) {
        const simplifiedError = (0, handleDublicateError_1.default)(err);
        statusCode = simplifiedError === null || simplifiedError === void 0 ? void 0 : simplifiedError.statusCode;
        message = simplifiedError === null || simplifiedError === void 0 ? void 0 : simplifiedError.message;
        errorMessage = simplifiedError === null || simplifiedError === void 0 ? void 0 : simplifiedError.errorMessage;
    }
    else if (err instanceof Error) {
        message = err === null || err === void 0 ? void 0 : err.message;
        errorMessage = err === null || err === void 0 ? void 0 : err.message;
    }
    return res.status(statusCode).json({
        success: false,
        message,
        errorMessage,
        errorDetails: err,
        stack: config_1.default.NODE_ENV === "development" ? err === null || err === void 0 ? void 0 : err.stack : null,
    });
};
exports.default = globalErrorHandler;
