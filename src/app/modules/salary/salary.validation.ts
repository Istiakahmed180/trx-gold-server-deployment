import { z } from "zod";
const createSalaryValidationSchema = z.object({
  salaryAmount: z.number({
    invalid_type_error: "Salary amount must be number",
  }),
  userId: z.string({ invalid_type_error: "worker id must be string" }),
});

// =========

export const salaryValidation = {
  createSalaryValidationSchema,
};
