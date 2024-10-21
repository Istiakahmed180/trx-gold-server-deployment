import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest";
import { workerValidation } from "../worker/worker.validation";
import { workerController } from "../worker/worker.controller";
import { depositValidation } from "../deposit/deposit.validation";
import { depositController } from "../deposit/deposit.controller";
import { siteSettingsValidation } from "../settings/settings.validation";
import { SiteSettingsController } from "../settings/settings.controller";
import { userController } from "../user/user.controller";
import { userProfitController } from "../userProfit/userProfit.controller";
import { withdrawController } from "../withdraw/withdraw.controller";
import { withdrawValidation } from "../withdraw/withdraw.validation";
import { salaryValidation } from "../salary/salary.validation";
import { salaryController } from "../salary/salary.controller";
// import adminTokenVerify from "../../middlewares/adminVerify";
const router = Router();
router.post(
  "/add-worker",
  // adminTokenVerify,
  validateRequest(workerValidation.workerValidationSchema),
  workerController.workerCreated
);
// admin verify
router.patch(
  "/update-worker/:id",
  // adminTokenVerify,
  validateRequest(workerValidation.UpdateWorkerValidationSchema),
  workerController.workerUpdate
);
// admin verify
router.get(
  "/all-worker", // adminTokenVerify,
  workerController.getAllWorker
);

// accept or reject upcomming deposit from user
router.patch(
  "/accept-or-reject-deposits",
  validateRequest(depositValidation.approvedOrRejectDepositValidationSchema),
  depositController.acceptOrRejectDepositRequest
);

router.post(
  "/create-site-settings",
  //   adminTokenVerify,
  validateRequest(siteSettingsValidation.createSiteSettingsValidationSchema),
  SiteSettingsController.SiteSettingsCreated
);

router.get("/all-users", userController.getAllUsers);
router.delete("/delete-user/:id", userController.deleteUserInfo);

router.post(
  "/add-worker",
  // adminTokenVerify,
  validateRequest(workerValidation.workerValidationSchema),
  workerController.workerCreated
);
router.post(
  "/create-salary",
  // adminTokenVerify,
  validateRequest(salaryValidation.createSalaryValidationSchema),
  salaryController.salaryCreate
);

router.get("/get-deposits", depositController.getAllDeposits);
router.get("/all-user-profit", userProfitController.getAllusersProfitHistory);
// all-withdraw-request?filterQuery=pending need to required any "filterQuery"
router.get("/all-withdraw", withdrawController.getAllWithdrawHistory);
//
router.patch(
  "/action-withdraw-request",
  validateRequest(withdrawValidation.acceptOrRejectWithdraw),
  withdrawController.acceptOrRejectWithdrawRequest
);
export const adminRouter = router;
