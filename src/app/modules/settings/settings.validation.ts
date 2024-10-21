import { z } from "zod";
const createSiteSettingsValidationSchema = z.object({
  commisionPercent: z.number(),
  minWithdraw: z.number(),
  minDiposit: z.number(),
  withdrawRequestLimitSingleDay: z.number(),
  siteLogo: z.string(),
});
const updatesiteSettingsValidationSchema = z.object({
  commisionPercent: z.number().optional(),
  minWithdraw: z.number().optional(),
  minDiposit: z.number().optional(),
  withdrawRequestLimitSingleDay: z.number().optional(),
  siteLogo: z.string().optional(),
});

export const siteSettingsValidation = {
  createSiteSettingsValidationSchema,
  updatesiteSettingsValidationSchema,
};
