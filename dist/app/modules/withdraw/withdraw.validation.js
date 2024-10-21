"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withdrawValidation = void 0;
const zod_1 = require("zod");
const createWithdrawValidationSchema = zod_1.z.object({
    userId: zod_1.z.string({
        invalid_type_error: "userId must be string",
        required_error: "user Id is required",
    }),
    withdrawalAmount: zod_1.z
        .number({
        invalid_type_error: "Amount must be number",
    })
        .optional(),
    paymentMethod: zod_1.z
        .string({
        invalid_type_error: "Payment method must be string",
    })
        .optional(),
    accountNumber: zod_1.z.string({
        invalid_type_error: "Account number must be string",
        required_error: "Account number is required",
    }),
});
const acceptOrRejectWithdraw = zod_1.z.object({
    withdrawId: zod_1.z.string({
        invalid_type_error: "withdrawId must be string",
        required_error: "user Id is required",
    }),
    approvalStatus: zod_1.z.string({
        invalid_type_error: "Approval Status must be string",
    }),
});
// =========
exports.withdrawValidation = {
    createWithdrawValidationSchema,
    acceptOrRejectWithdraw,
};
