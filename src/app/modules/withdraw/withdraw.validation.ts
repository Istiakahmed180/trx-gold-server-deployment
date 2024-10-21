import { z } from "zod";
const createWithdrawValidationSchema = z.object({
  userId: z.string({
    invalid_type_error: "userId must be string",
    required_error: "user Id is required",
  }),
  withdrawalAmount: z
    .number({
      invalid_type_error: "Amount must be number",
    })
    .optional(),
  paymentMethod: z
    .string({
      invalid_type_error: "Payment method must be string",
    })
    .optional(),
  accountNumber: z.string({
    invalid_type_error: "Account number must be string",
    required_error: "Account number is required",
  }),
});

const acceptOrRejectWithdraw = z.object({
  withdrawId: z.string({
    invalid_type_error: "withdrawId must be string",
    required_error: "user Id is required",
  }),

  approvalStatus: z.string({
    invalid_type_error: "Approval Status must be string",
  }),
});

// =========

export const withdrawValidation = {
  createWithdrawValidationSchema,
  acceptOrRejectWithdraw,
};
