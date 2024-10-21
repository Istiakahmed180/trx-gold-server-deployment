import { Router } from "express";
import { withdrawController } from "./withdraw.controller";
import validateRequest from "../../middlewares/validateRequest";
import { withdrawValidation } from "./withdraw.validation";

// import adminTokenVerify from "../../middlewares/adminVerify";
const router = Router();
router.post(
  "/withdraw-request",
  validateRequest(withdrawValidation.createWithdrawValidationSchema),
  withdrawController.createWithdrawRequest
);
router.post(
  "/worker-withdraw-request",
  validateRequest(withdrawValidation.createWithdrawValidationSchema),
  withdrawController.createWorkerWithdrawRequest
);
router.get(
  "/single-user-withdraw-list/:id",
  withdrawController.getSingleUserWithdrawHistory
);

export const withdrawRouter = router;
