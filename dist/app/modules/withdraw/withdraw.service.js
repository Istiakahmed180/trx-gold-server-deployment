"use strict";
/* eslint-disable @typescript-eslint/no-explicit-any */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WithdrawService = void 0;
const appErrors_1 = require("../../errors/appErrors");
const http_status_1 = __importDefault(require("http-status"));
const user_model_1 = require("../user/user.model");
const settings_model_1 = require("../settings/settings.model");
const mongoose_1 = __importDefault(require("mongoose"));
const userProfit_model_1 = require("../userProfit/userProfit.model");
const moment_1 = __importDefault(require("moment"));
const withdraw_model_1 = require("./withdraw.model");
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const worker_model_1 = require("../worker/worker.model");
const salary_model_1 = require("../salary/salary.model");
// create withdraw request
const createWithdrawRequestIntoDb = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { minWithdraw, withdrawRequestLimitSingleDay } = (yield settings_model_1.Settings.find())[0] || {};
    const checkValidUser = yield user_model_1.User.findOne({ _id: payload.userId });
    if (!checkValidUser) {
        throw new appErrors_1.AppError(http_status_1.default.NOT_FOUND, "User not found");
    }
    const objectId = new mongoose_1.default.Types.ObjectId(checkValidUser._id); // Convert string to ObjectId
    // Check if the requested withdrawal amount is less than the minimum
    if (payload.withdrawalAmount < minWithdraw) {
        throw new appErrors_1.AppError(http_status_1.default.BAD_REQUEST, `You can't withdraw less than $${minWithdraw}`);
    }
    // Aggregate user's total profit
    const result = yield userProfit_model_1.UserProfit.aggregate([
        {
            $match: { userId: objectId }, // Filter by userId as ObjectId
        },
        {
            $group: {
                _id: "$userId", // Group by userId
                totalUserProfitAmount: { $sum: "$userProfitAmount" }, // Sum of userProfitAmount
            },
        },
    ]);
    if (!result.length) {
        throw new appErrors_1.AppError(http_status_1.default.NOT_FOUND, "No Profit Found");
    }
    // Fetch all withdrawal requests by this user
    const allWithdrawals = yield withdraw_model_1.Withdraw.find({ userId: payload.userId });
    // Check if the user has already sent the maximum allowed withdraw requests today
    const todayWithdrawals = allWithdrawals.filter((withdraw) => withdraw.withdrawDate >= (0, moment_1.default)().startOf("day").toDate() &&
        withdraw.withdrawDate <= (0, moment_1.default)().endOf("day").toDate());
    if (todayWithdrawals.length >= withdrawRequestLimitSingleDay) {
        throw new appErrors_1.AppError(http_status_1.default.BAD_REQUEST, `You have already made ${withdrawRequestLimitSingleDay} withdrawal requests today. Please try again tomorrow.`);
    }
    // Calculate total pending withdrawal amount
    const pendingWithdrawals = allWithdrawals.filter((withdraw) => withdraw.approvalStatus === "pending");
    const pendingWithdrawalAmount = pendingWithdrawals.reduce((sum, withdraw) => sum + withdraw.withdrawalAmount, 0);
    // Calculate total already withdrawal amount
    const approvedWithdrawals = allWithdrawals.filter((withdraw) => withdraw.approvalStatus === "approved");
    const approvedWithdrawalAmount = approvedWithdrawals.reduce((sum, withdraw) => sum + withdraw.withdrawalAmount, 0);
    // Calculate remaining withdrawable amount
    const remainingWithdrawableAmount = result[0].totalUserProfitAmount -
        pendingWithdrawalAmount -
        approvedWithdrawalAmount;
    if (remainingWithdrawableAmount === 0) {
        throw new appErrors_1.AppError(http_status_1.default.BAD_REQUEST, `Insufficient balance. You have no funds available for withdrawal at this time.`);
    }
    // Check if the requested withdrawal amount exceeds the total withdrawable amount
    if (payload.withdrawalAmount > remainingWithdrawableAmount) {
        throw new appErrors_1.AppError(http_status_1.default.BAD_REQUEST, `You can't withdraw more than $${remainingWithdrawableAmount}.`);
    }
    // Setting up to save the withdrawal request
    const withdrawDate = (0, moment_1.default)();
    const withdrawData = {
        withdrawalAmount: payload.withdrawalAmount,
        userId: payload.userId,
        approvalStatus: "pending",
        withdrawDate: withdrawDate.toDate(),
        paymentMethod: payload.paymentMethod,
        accountNumber: payload.accountNumber,
    };
    const data = yield withdraw_model_1.Withdraw.create(withdrawData);
    return data;
});
// crete worker withdraw
const createWorkerWithdrawRequestIntoDb = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { minWithdraw, withdrawRequestLimitSingleDay } = (yield settings_model_1.Settings.find())[0] || {};
    const checkValidUser = yield user_model_1.User.findOne({ _id: payload.userId });
    if (!checkValidUser) {
        throw new appErrors_1.AppError(http_status_1.default.NOT_FOUND, "User not found");
    }
    // Validate role
    const chekValidWorker = yield worker_model_1.Worker.findOne({ userId: checkValidUser === null || checkValidUser === void 0 ? void 0 : checkValidUser._id });
    const objectId = new mongoose_1.default.Types.ObjectId(checkValidUser._id); // Convert string to ObjectId
    // Check if the requested withdrawal amount is less than the minimum
    if (payload.withdrawalAmount < minWithdraw) {
        throw new appErrors_1.AppError(http_status_1.default.BAD_REQUEST, `You can't withdraw less than $${minWithdraw}`);
    }
    // Aggregate user's total profit
    const result = yield userProfit_model_1.UserProfit.aggregate([
        {
            $match: { userId: objectId }, // Filter by userId as ObjectId
        },
        {
            $group: {
                _id: "$userId", // Group by userId
                totalUserProfitAmount: { $sum: "$userProfitAmount" }, // Sum of userProfitAmount
            },
        },
    ]);
    // Aggregate user's total salary
    const totalSalary = yield salary_model_1.Salary.aggregate([
        {
            $match: { userId: objectId }, // Filter by userId as ObjectId
        },
        {
            $group: {
                _id: "$userId", // Group by userId
                totalSalaryAmount: { $sum: "$salaryAmount" },
            },
        },
    ]);
    if (!result.length) {
        throw new appErrors_1.AppError(http_status_1.default.NOT_FOUND, "No Profit Found");
    }
    // Fetch all withdrawal requests by this user
    const allWithdrawals = yield withdraw_model_1.Withdraw.find({ userId: payload.userId });
    // Check if the user has already sent the maximum allowed withdraw requests today
    const todayWithdrawals = allWithdrawals.filter((withdraw) => withdraw.withdrawDate >= (0, moment_1.default)().startOf("day").toDate() &&
        withdraw.withdrawDate <= (0, moment_1.default)().endOf("day").toDate());
    if (todayWithdrawals.length > withdrawRequestLimitSingleDay) {
        throw new appErrors_1.AppError(http_status_1.default.BAD_REQUEST, `You have already made ${withdrawRequestLimitSingleDay} withdrawal requests today. Please try again tomorrow.`);
    }
    // Calculate total pending withdrawal amount
    const pendingWithdrawals = allWithdrawals.filter((withdraw) => withdraw.approvalStatus === "pending");
    const pendingWithdrawalAmount = pendingWithdrawals.reduce((sum, withdraw) => sum + withdraw.withdrawalAmount, 0);
    // Calculate total already withdrawal amount
    const approvedWithdrawals = allWithdrawals.filter((withdraw) => withdraw.approvalStatus === "approved");
    const approvedWithdrawalAmount = approvedWithdrawals.reduce((sum, withdraw) => sum + withdraw.withdrawalAmount, 0);
    let totalCommisionAmount = 0;
    if (checkValidUser.role === "worker" &&
        (chekValidWorker === null || chekValidWorker === void 0 ? void 0 : chekValidWorker.accountStatus) === "active") {
        // Get all users referred by the worker
        const referredUsers = yield user_model_1.User.find({
            reference: chekValidWorker === null || chekValidWorker === void 0 ? void 0 : chekValidWorker.inviteID,
        });
        const referredUserIds = referredUsers.map((user) => user._id);
        if (referredUserIds.length) {
            const commissionData = yield userProfit_model_1.UserProfit.find({
                userId: { $in: referredUserIds }, // Use array of ObjectIds
                commistionActive: true, // Ensure commission is active
            });
            totalCommisionAmount = commissionData.reduce((sum, record) => sum + (record.workerCommisitionAmount || 0), // Ensure field is present
            0);
        }
        // add sallary to the worker profit
        const totalSallaryAmount = (totalSalary === null || totalSalary === void 0 ? void 0 : totalSalary.length)
            ? (_a = totalSalary[0]) === null || _a === void 0 ? void 0 : _a.totalSalaryAmount
            : 0;
        // Add commission & sallary to the worker's profit
        const totalProfitIncludingCommissionAndSallary = (result === null || result === void 0 ? void 0 : result.length)
            ? result[0].totalUserProfitAmount +
                totalCommisionAmount +
                totalSallaryAmount
            : totalCommisionAmount + totalSallaryAmount;
        const remainingWithdrawableAmount = totalProfitIncludingCommissionAndSallary -
            pendingWithdrawalAmount -
            approvedWithdrawalAmount;
        if (remainingWithdrawableAmount === 0) {
            throw new appErrors_1.AppError(http_status_1.default.BAD_REQUEST, `Insufficient balance. You have no funds available for withdrawal at this time.`);
        }
        // Check if the requested withdrawal amount exceeds the total withdrawable amount
        if (payload.withdrawalAmount > remainingWithdrawableAmount) {
            throw new appErrors_1.AppError(http_status_1.default.BAD_REQUEST, `You can't withdraw more than $${remainingWithdrawableAmount}.`);
        }
        // Setting up to save the withdrawal request
        const withdrawDate = (0, moment_1.default)();
        const withdrawData = {
            withdrawalAmount: payload.withdrawalAmount,
            userId: payload.userId,
            approvalStatus: "pending",
            withdrawDate: withdrawDate.toDate(),
            paymentMethod: payload.paymentMethod,
            accountNumber: payload.accountNumber,
        };
        const data = yield withdraw_model_1.Withdraw.create(withdrawData);
        return data;
    }
});
// get all withdraw history
const getAllWithdrawHistoryFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { filterQuery } = query;
    const filters = {};
    // Only apply the approvalStatus filter if filterQuery is provided
    if (filterQuery) {
        filters.approvalStatus = filterQuery;
    }
    const getAllApproveWithdraw = new QueryBuilder_1.default(withdraw_model_1.Withdraw.find(filters).populate({
        path: "userId",
        select: "firstName lastName email userId reference", // Specify the fields to include
    }), query)
        .search([]) // Adjust search conditions if needed
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = yield getAllApproveWithdraw.modelQuery;
    // Transform the result, removing unwanted fields
    const transformedResult = result.map((item) => ({
        _id: item._id,
        withdrawDate: (0, moment_1.default)(item.withdrawDate).format("D MMMM h:mm A"),
        withdrawalAmount: item.withdrawalAmount,
        approvalStatus: item.approvalStatus,
        paymentMethod: item.paymentMethod,
        accountNumber: item.accountNumber,
        userId: item.userId._id, // Keep only userId as a separate field
        name: `${item.userId.firstName} ${item.userId.lastName}`,
        email: item.userId.email,
        reference: item.userId.reference,
    }));
    return transformedResult;
});
// get single user withdraw history
const getSingleUserWithdrawHistoryFromDB = (userId, query) => __awaiter(void 0, void 0, void 0, function* () {
    const { filterQuery } = query;
    const filters = {
        userId: userId,
    };
    // Only apply the approvalStatus filter if filterQuery is provided
    if (filterQuery) {
        filters.approvalStatus = filterQuery;
    }
    const getAllApproveWithdraw = new QueryBuilder_1.default(withdraw_model_1.Withdraw.find(filters).populate({
        path: "userId",
        select: "firstName lastName email userId reference", // Specify the fields to include
    }), query)
        .search([]) // Adjust search conditions if needed
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = yield getAllApproveWithdraw.modelQuery;
    // Transform the result, removing unwanted fields
    const transformedResult = result.map((item) => ({
        _id: item._id,
        withdrawDate: (0, moment_1.default)(item.withdrawDate).format("D MMMM h:mm A"),
        withdrawalAmount: item.withdrawalAmount,
        approvalStatus: item.approvalStatus,
        paymentMethod: item.paymentMethod,
        accountNumber: item.accountNumber,
        userId: item.userId._id, // Keep only userId as a separate field
        name: `${item.userId.firstName} ${item.userId.lastName}`,
        email: item.userId.email,
        reference: item.userId.reference,
    }));
    return transformedResult;
});
// accept-or-reject- withdraw request
const acceptOrRejectWithdrawRequestIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const id = payload.withdrawId;
    // Convert moment dates to JavaScript Date objects using moment().toDate()
    const withdrawDate = (0, moment_1.default)(); // current date
    // check if already approved or not
    const checkApprovedStatus = yield withdraw_model_1.Withdraw.findById(id);
    if ((checkApprovedStatus === null || checkApprovedStatus === void 0 ? void 0 : checkApprovedStatus.approvalStatus) === "approved") {
        throw new appErrors_1.AppError(http_status_1.default.BAD_REQUEST, "Already Approved");
    }
    if ((checkApprovedStatus === null || checkApprovedStatus === void 0 ? void 0 : checkApprovedStatus.approvalStatus) === "rejected") {
        throw new appErrors_1.AppError(http_status_1.default.BAD_REQUEST, "Already rejected");
    }
    const result = yield withdraw_model_1.Withdraw.findByIdAndUpdate(id, {
        approvalStatus: payload.approvalStatus,
        withdrawDate: withdrawDate,
    }, {
        new: true,
        runValidators: true,
    });
    if (!result) {
        throw new appErrors_1.AppError(http_status_1.default.BAD_REQUEST, "Withdraw history not found");
    }
    return result;
});
exports.WithdrawService = {
    createWithdrawRequestIntoDb,
    getAllWithdrawHistoryFromDB,
    createWorkerWithdrawRequestIntoDb,
    acceptOrRejectWithdrawRequestIntoDB,
    getSingleUserWithdrawHistoryFromDB,
};
