"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userProfitValidation = void 0;
const zod_1 = require("zod");
const userProfitValidationSchema = zod_1.z.object({
    depositId: zod_1.z.string(),
    userId: zod_1.z.string(),
    profitCratedDate: zod_1.z.string(),
    userProfitAmount: zod_1.z.number(),
    workerCommisitionAmount: zod_1.z.number(),
});
// =========
exports.userProfitValidation = {
    userProfitValidationSchema,
};
