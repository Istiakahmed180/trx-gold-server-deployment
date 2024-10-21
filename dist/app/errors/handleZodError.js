"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_1 = __importDefault(require("http-status"));
const handleZodError = (err) => {
    let errorMessage = '';
    err.issues.map((issue) => {
        return errorMessage += `${(issue === null || issue === void 0 ? void 0 : issue.path[issue.path.length - 1])} is ${issue.message}.`;
    });
    const statusCode = http_status_1.default.NOT_ACCEPTABLE;
    return {
        statusCode,
        message: "Validation Error",
        errorMessage,
    };
};
exports.default = handleZodError;
