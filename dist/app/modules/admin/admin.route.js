"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminRouter = void 0;
const express_1 = require("express");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const worker_validation_1 = require("../worker/worker.validation");
const worker_controller_1 = require("../worker/worker.controller");
const deposit_validation_1 = require("../deposit/deposit.validation");
const deposit_controller_1 = require("../deposit/deposit.controller");
const settings_validation_1 = require("../settings/settings.validation");
const settings_controller_1 = require("../settings/settings.controller");
const user_controller_1 = require("../user/user.controller");
const userProfit_controller_1 = require("../userProfit/userProfit.controller");
const withdraw_controller_1 = require("../withdraw/withdraw.controller");
const withdraw_validation_1 = require("../withdraw/withdraw.validation");
const salary_validation_1 = require("../salary/salary.validation");
const salary_controller_1 = require("../salary/salary.controller");
// import adminTokenVerify from "../../middlewares/adminVerify";
const router = (0, express_1.Router)();
router.post("/add-worker", 
// adminTokenVerify,
(0, validateRequest_1.default)(worker_validation_1.workerValidation.workerValidationSchema), worker_controller_1.workerController.workerCreated);
// admin verify
router.patch("/update-worker/:id", 
// adminTokenVerify,
(0, validateRequest_1.default)(worker_validation_1.workerValidation.UpdateWorkerValidationSchema), worker_controller_1.workerController.workerUpdate);
// admin verify
router.get("/all-worker", // adminTokenVerify,
worker_controller_1.workerController.getAllWorker);
// accept or reject upcomming deposit from user
router.patch("/accept-or-reject-deposits", (0, validateRequest_1.default)(deposit_validation_1.depositValidation.approvedOrRejectDepositValidationSchema), deposit_controller_1.depositController.acceptOrRejectDepositRequest);
router.post("/create-site-settings", 
//   adminTokenVerify,
(0, validateRequest_1.default)(settings_validation_1.siteSettingsValidation.createSiteSettingsValidationSchema), settings_controller_1.SiteSettingsController.SiteSettingsCreated);
router.get("/all-users", user_controller_1.userController.getAllUsers);
router.delete("/delete-user/:id", user_controller_1.userController.deleteUserInfo);
router.post("/add-worker", 
// adminTokenVerify,
(0, validateRequest_1.default)(worker_validation_1.workerValidation.workerValidationSchema), worker_controller_1.workerController.workerCreated);
router.post("/create-salary", 
// adminTokenVerify,
(0, validateRequest_1.default)(salary_validation_1.salaryValidation.createSalaryValidationSchema), salary_controller_1.salaryController.salaryCreate);
router.get("/get-deposits", deposit_controller_1.depositController.getAllDeposits);
router.get("/all-user-profit", userProfit_controller_1.userProfitController.getAllusersProfitHistory);
// all-withdraw-request?filterQuery=pending need to required any "filterQuery"
router.get("/all-withdraw", withdraw_controller_1.withdrawController.getAllWithdrawHistory);
//
router.patch("/action-withdraw-request", (0, validateRequest_1.default)(withdraw_validation_1.withdrawValidation.acceptOrRejectWithdraw), withdraw_controller_1.withdrawController.acceptOrRejectWithdrawRequest);
exports.adminRouter = router;
