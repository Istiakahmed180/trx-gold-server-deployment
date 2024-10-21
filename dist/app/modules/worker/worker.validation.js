"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.workerValidation = void 0;
const zod_1 = require("zod");
const workerValidationSchema = zod_1.z.object({
    userId: zod_1.z.string(),
});
const UpdateWorkerValidationSchema = zod_1.z.object({
    workerLevel: zod_1.z
        .string({ invalid_type_error: "Level Must Be String Type" })
        .optional(),
    commistionActive: zod_1.z.boolean().optional(),
    commisionPercent: zod_1.z.number().optional(),
});
// =========
exports.workerValidation = {
    workerValidationSchema,
    UpdateWorkerValidationSchema,
};
