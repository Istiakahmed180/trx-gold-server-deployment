"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.depositValidation = void 0;
const zod_1 = require("zod");
const depositValidationSchema = zod_1.z.object({
    userId: zod_1.z.string({ required_error: "user id is required" }),
    depositAmount: zod_1.z.number({
        invalid_type_error: "Deposit amount must be number type",
        required_error: "Deposit is required",
    }),
    transactionWhere: zod_1.z
        .string({
        invalid_type_error: "transaction were must be string type",
        required_error: "transactionWhere is required",
    })
        .optional(),
    paymentMethod: zod_1.z
        .string({
        invalid_type_error: "Payment method must be string type",
        required_error: "Payment method is required",
    })
        .optional(),
    transactionId: zod_1.z
        .string({
        invalid_type_error: "Transaction Id must be string type",
        required_error: "Transaction Id is required",
    })
        .optional(),
});
const updateDepositValidationSchema = zod_1.z.object({
    depositAmount: zod_1.z
        .number({
        invalid_type_error: "Deposit amount must be number type",
        required_error: "Deposit is required",
    })
        .optional(),
    transactionWhere: zod_1.z
        .string({
        invalid_type_error: "transaction were must be string type",
        required_error: "transactionWhere is required",
    })
        .optional(),
    paymentMethod: zod_1.z
        .string({
        invalid_type_error: "Payment method must be string type",
        required_error: "Payment method is required",
    })
        .optional(),
    transactionId: zod_1.z
        .string({
        invalid_type_error: "Transaction Id must be string type",
        required_error: "Transaction Id is required",
    })
        .optional(),
});
const approvedOrRejectDepositValidationSchema = zod_1.z.object({
    depositId: zod_1.z.string({ required_error: "deposit id is required" }),
    activeStatus: zod_1.z.string({ required_error: "Active status required" }),
});
// =========
exports.depositValidation = {
    depositValidationSchema,
    updateDepositValidationSchema,
    approvedOrRejectDepositValidationSchema,
};
