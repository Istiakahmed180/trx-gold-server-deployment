"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.siteSettingsValidation = void 0;
const zod_1 = require("zod");
const createSiteSettingsValidationSchema = zod_1.z.object({
    commisionPercent: zod_1.z.number(),
    minWithdraw: zod_1.z.number(),
    minDiposit: zod_1.z.number(),
    withdrawRequestLimitSingleDay: zod_1.z.number(),
    siteLogo: zod_1.z.string(),
});
const updatesiteSettingsValidationSchema = zod_1.z.object({
    commisionPercent: zod_1.z.number().optional(),
    minWithdraw: zod_1.z.number().optional(),
    minDiposit: zod_1.z.number().optional(),
    withdrawRequestLimitSingleDay: zod_1.z.number().optional(),
    siteLogo: zod_1.z.string().optional(),
});
exports.siteSettingsValidation = {
    createSiteSettingsValidationSchema,
    updatesiteSettingsValidationSchema,
};
