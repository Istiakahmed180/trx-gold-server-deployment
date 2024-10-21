"use strict";
/* eslint-disable @typescript-eslint/no-unused-vars */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalaryService = void 0;
const appErrors_1 = require("../../errors/appErrors");
const http_status_1 = __importDefault(require("http-status"));
const moment_1 = __importDefault(require("moment"));
const worker_model_1 = require("../worker/worker.model");
const salary_model_1 = require("./salary.model");
const CreateSalaryIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const sallarydate = (0, moment_1.default)();
    // it's worker model id for find the worker userId
    const id = payload.userId;
    console.log({ id });
    const validWorker = yield worker_model_1.Worker.findById(id);
    if ((validWorker === null || validWorker === void 0 ? void 0 : validWorker.accountStatus) === "deactivate" ||
        (validWorker === null || validWorker === void 0 ? void 0 : validWorker.accountStatus) === "rejected") {
        throw new appErrors_1.AppError(http_status_1.default.BAD_REQUEST, "Account is not active, you can't send salary");
    }
    if (!(validWorker === null || validWorker === void 0 ? void 0 : validWorker._id)) {
        throw new appErrors_1.AppError(http_status_1.default.BAD_REQUEST, "Worker not found");
    }
    const sallaryObj = {
        salaryAmount: payload.salaryAmount,
        userId: validWorker === null || validWorker === void 0 ? void 0 : validWorker.userId,
        salaryDate: sallarydate.toDate(),
    };
    const result = yield salary_model_1.Salary.create(sallaryObj);
    if (!result) {
        throw new appErrors_1.AppError(http_status_1.default.BAD_REQUEST, "Something is wrong");
    }
    return result;
});
exports.SalaryService = {
    CreateSalaryIntoDB,
};
