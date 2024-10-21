import { z } from "zod";
const userProfitValidationSchema = z.object({
  depositId: z.string(),
  userId: z.string(),
  profitCratedDate: z.string(),
  userProfitAmount: z.number(),
  workerCommisitionAmount: z.number(),
});

// =========

export const userProfitValidation = {
  userProfitValidationSchema,
};
