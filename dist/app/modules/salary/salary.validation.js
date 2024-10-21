"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.salaryValidation = void 0;
const zod_1 = require("zod");
const createSalaryValidationSchema = zod_1.z.object({
    salaryAmount: zod_1.z.number({
        invalid_type_error: "Salary amount must be number",
    }),
    userId: zod_1.z.string({ invalid_type_error: "worker id must be string" }),
});
// =========
exports.salaryValidation = {
    createSalaryValidationSchema,
};
