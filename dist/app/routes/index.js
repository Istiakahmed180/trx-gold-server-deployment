"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_route_1 = require("../modules/user/user.route");
const worker_route_1 = require("../modules/worker/worker.route");
const settings_route_1 = require("../modules/settings/settings.route");
const deposit_route_1 = require("../modules/deposit/deposit.route");
const userProfit_route_1 = require("../modules/userProfit/userProfit.route");
const admin_route_1 = require("../modules/admin/admin.route");
const withdraw_route_1 = require("../modules/withdraw/withdraw.route");
const router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: "/auth",
        route: user_route_1.userRouter,
    },
    {
        path: "/worker",
        route: worker_route_1.workerRouter,
    },
    {
        path: "/settings",
        route: settings_route_1.siteSettingsRouter,
    },
    {
        path: "/deposit",
        route: deposit_route_1.depositRouter,
    },
    {
        path: "/profit",
        route: userProfit_route_1.userProfitRouter,
    },
    {
        path: "/admin",
        route: admin_route_1.adminRouter,
    },
    {
        path: "/withdraw",
        route: withdraw_route_1.withdrawRouter,
    },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
