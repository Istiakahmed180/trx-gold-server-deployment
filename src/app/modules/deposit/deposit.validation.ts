import { z } from "zod";
const depositValidationSchema = z.object({
  userId: z.string({ required_error: "user id is required" }),
  depositAmount: z.number({
    invalid_type_error: "Deposit amount must be number type",
    required_error: "Deposit is required",
  }),
  transactionWhere: z
    .string({
      invalid_type_error: "transaction were must be string type",
      required_error: "transactionWhere is required",
    })
    .optional(),
  paymentMethod: z
    .string({
      invalid_type_error: "Payment method must be string type",
      required_error: "Payment method is required",
    })
    .optional(),
  transactionId: z
    .string({
      invalid_type_error: "Transaction Id must be string type",
      required_error: "Transaction Id is required",
    })
    .optional(),
});
const updateDepositValidationSchema = z.object({
  depositAmount: z
    .number({
      invalid_type_error: "Deposit amount must be number type",
      required_error: "Deposit is required",
    })
    .optional(),
  transactionWhere: z
    .string({
      invalid_type_error: "transaction were must be string type",
      required_error: "transactionWhere is required",
    })
    .optional(),
  paymentMethod: z
    .string({
      invalid_type_error: "Payment method must be string type",
      required_error: "Payment method is required",
    })
    .optional(),
  transactionId: z
    .string({
      invalid_type_error: "Transaction Id must be string type",
      required_error: "Transaction Id is required",
    })
    .optional(),
});
const approvedOrRejectDepositValidationSchema = z.object({
  depositId: z.string({ required_error: "deposit id is required" }),
  activeStatus: z.string({ required_error: "Active status required" }),
});

// =========

export const depositValidation = {
  depositValidationSchema,
  updateDepositValidationSchema,
  approvedOrRejectDepositValidationSchema,
};
