import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest";
import { depositValidation } from "./deposit.validation";
import { depositController } from "./deposit.controller";
// import userTokenVerify from "../../middlewares/userVerify";

const router = Router();

// add deposit amount by user or worker
router.post(
  "/add-deposit",
  // userTokenVerify,
  validateRequest(depositValidation.depositValidationSchema),
  depositController.depositCreated
);
router.get("/single-user-deposits/:id", depositController.getSingleUserDeposit);

router.get("/deposit-summary/:id", depositController.getDepositSummary);

export const depositRouter = router;
