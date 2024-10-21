import { z } from "zod";
const userValidationSchema = z.object({
  firstName: z.string({
    invalid_type_error: "firstName must be a string",
    required_error: "firstName is required",
  }),
  lastName: z.string({
    invalid_type_error: "firstName must be a string",
    required_error: "firstName is required",
  }),
  email: z.string().email(),
  password: z.string().max(20),
  image: z.string().optional(),
  phone: z.string().optional(),
  gender: z.string().optional(),
  country: z.string().optional(),
  reference: z.string().optional(),
});
const UpdateuserValidationSchema = z.object({
  firstName: z
    .string({
      invalid_type_error: "firstName must be a string",
      required_error: "firstName is required",
    })
    .optional(),
  lastName: z
    .string({
      invalid_type_error: "firstName must be a string",
      required_error: "firstName is required",
    })
    .optional(),
  image: z.string().optional(),
  bkashNumber: z.string().optional(),
  gender: z.string().optional(),
  country: z.string().optional(),
});

// =========

const loginValidationSchema = z.object({
  email: z.string().email(),
  password: z.string().max(20),
});
const emailVerifySchema = z.object({
  code: z.number(),
  token: z.string(),
});
const resendCodeValidationSchema = z.object({
  email: z.string().email(),
});
const forgotPasswordValidation = z.object({
  password: z.string(),
  code: z.number(),
  token: z.string(),
});
const getUserValidationSchema = z.object({
  token: z.string(),
});
export const UserValidation = {
  userValidationSchema,
  loginValidationSchema,
  emailVerifySchema,
  UpdateuserValidationSchema,
  resendCodeValidationSchema,
  forgotPasswordValidation,
  getUserValidationSchema,
};
