import { Router } from "express";
import { userProfitController } from "./userProfit.controller";
const router = Router();
// single user profit
router.get("/user-profit/:id", userProfitController.singleUserProfitList);

export const userProfitRouter = router;
