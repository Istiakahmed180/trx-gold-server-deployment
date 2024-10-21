"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.depositRouter = void 0;
const express_1 = require("express");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const deposit_validation_1 = require("./deposit.validation");
const deposit_controller_1 = require("./deposit.controller");
// import userTokenVerify from "../../middlewares/userVerify";
const router = (0, express_1.Router)();
// add deposit amount by user or worker
router.post("/add-deposit", 
// userTokenVerify,
(0, validateRequest_1.default)(deposit_validation_1.depositValidation.depositValidationSchema), deposit_controller_1.depositController.depositCreated);
router.get("/single-user-deposits/:id", deposit_controller_1.depositController.getSingleUserDeposit);
router.get("/deposit-summary/:id", deposit_controller_1.depositController.getDepositSummary);
exports.depositRouter = router;
