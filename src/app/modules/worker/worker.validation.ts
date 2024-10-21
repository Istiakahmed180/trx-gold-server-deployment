import { z } from "zod";
const workerValidationSchema = z.object({
  userId: z.string(),
});
const UpdateWorkerValidationSchema = z.object({
  workerLevel: z
    .string({ invalid_type_error: "Level Must Be String Type" })
    .optional(),
  commistionActive: z.boolean().optional(),
  commisionPercent: z.number().optional(),
});

// =========

export const workerValidation = {
  workerValidationSchema,
  UpdateWorkerValidationSchema,
};
