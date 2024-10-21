"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.withdrawRouter = void 0;
const express_1 = require("express");
const withdraw_controller_1 = require("./withdraw.controller");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const withdraw_validation_1 = require("./withdraw.validation");
// import adminTokenVerify from "../../middlewares/adminVerify";
const router = (0, express_1.Router)();
router.post("/withdraw-request", (0, validateRequest_1.default)(withdraw_validation_1.withdrawValidation.createWithdrawValidationSchema), withdraw_controller_1.withdrawController.createWithdrawRequest);
router.post("/worker-withdraw-request", (0, validateRequest_1.default)(withdraw_validation_1.withdrawValidation.createWithdrawValidationSchema), withdraw_controller_1.withdrawController.createWorkerWithdrawRequest);
router.get("/single-user-withdraw-list/:id", withdraw_controller_1.withdrawController.getSingleUserWithdrawHistory);
exports.withdrawRouter = router;
