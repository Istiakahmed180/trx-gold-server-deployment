"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userProfitRouter = void 0;
const express_1 = require("express");
const userProfit_controller_1 = require("./userProfit.controller");
const router = (0, express_1.Router)();
// single user profit
router.get("/user-profit/:id", userProfit_controller_1.userProfitController.singleUserProfitList);
exports.userProfitRouter = router;
