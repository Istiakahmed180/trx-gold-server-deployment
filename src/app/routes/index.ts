import { Router } from "express";
import { userRouter } from "../modules/user/user.route";
import { workerRouter } from "../modules/worker/worker.route";
import { siteSettingsRouter } from "../modules/settings/settings.route";
import { depositRouter } from "../modules/deposit/deposit.route";
import { userProfitRouter } from "../modules/userProfit/userProfit.route";
import { adminRouter } from "../modules/admin/admin.route";
import { withdrawRouter } from "../modules/withdraw/withdraw.route";

const router = Router();
const moduleRoutes = [
  {
    path: "/auth",
    route: userRouter,
  },
  {
    path: "/worker",
    route: workerRouter,
  },
  {
    path: "/settings",
    route: siteSettingsRouter,
  },
  {
    path: "/deposit",
    route: depositRouter,
  },
  {
    path: "/profit",
    route: userProfitRouter,
  },
  {
    path: "/admin",
    route: adminRouter,
  },
  {
    path: "/withdraw",
    route: withdrawRouter,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
