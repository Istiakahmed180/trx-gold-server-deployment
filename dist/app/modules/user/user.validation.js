"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidation = void 0;
const zod_1 = require("zod");
const userValidationSchema = zod_1.z.object({
    firstName: zod_1.z.string({
        invalid_type_error: "firstName must be a string",
        required_error: "firstName is required",
    }),
    lastName: zod_1.z.string({
        invalid_type_error: "firstName must be a string",
        required_error: "firstName is required",
    }),
    email: zod_1.z.string().email(),
    password: zod_1.z.string().max(20),
    image: zod_1.z.string().optional(),
    phone: zod_1.z.string().optional(),
    gender: zod_1.z.string().optional(),
    country: zod_1.z.string().optional(),
    reference: zod_1.z.string().optional(),
});
const UpdateuserValidationSchema = zod_1.z.object({
    firstName: zod_1.z
        .string({
        invalid_type_error: "firstName must be a string",
        required_error: "firstName is required",
    })
        .optional(),
    lastName: zod_1.z
        .string({
        invalid_type_error: "firstName must be a string",
        required_error: "firstName is required",
    })
        .optional(),
    image: zod_1.z.string().optional(),
    bkashNumber: zod_1.z.string().optional(),
    gender: zod_1.z.string().optional(),
    country: zod_1.z.string().optional(),
});
// =========
const loginValidationSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().max(20),
});
const emailVerifySchema = zod_1.z.object({
    code: zod_1.z.number(),
    token: zod_1.z.string(),
});
const resendCodeValidationSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
});
const forgotPasswordValidation = zod_1.z.object({
    password: zod_1.z.string(),
    code: zod_1.z.number(),
    token: zod_1.z.string(),
});
const getUserValidationSchema = zod_1.z.object({
    token: zod_1.z.string(),
});
exports.UserValidation = {
    userValidationSchema,
    loginValidationSchema,
    emailVerifySchema,
    UpdateuserValidationSchema,
    resendCodeValidationSchema,
    forgotPasswordValidation,
    getUserValidationSchema,
};
