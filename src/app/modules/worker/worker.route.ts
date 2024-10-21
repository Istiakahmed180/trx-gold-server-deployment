import { Router } from "express";
import { userProfitController } from "../userProfit/userProfit.controller";
import { workerController } from "./worker.controller";
// import adminTokenVerify from "../../middlewares/adminVerify";
const router = Router();

router.get(
  "/worker-commision/:id",
  userProfitController.getWorkerReferencedProfitCommision
);
router.get(
  "/worker-referral-users/:id",
  workerController.getWorkerReferelUsers
);

export const workerRouter = router;
