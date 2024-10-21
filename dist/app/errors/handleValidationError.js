"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_1 = __importDefault(require("http-status"));
const handleValidationError = (err) => {
    let errorMessage = '';
    Object.values(err.errors).map((val) => {
        return errorMessage += val === null || val === void 0 ? void 0 : val.message;
    });
    const statusCode = http_status_1.default.NOT_ACCEPTABLE;
    return {
        statusCode,
        message: 'Validation Error',
        errorMessage,
    };
};
exports.default = handleValidationError;
