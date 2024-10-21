"use strict";
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
exports.DepostiServices = void 0;
const deposit_model_1 = require("./deposit.model");
const moment_1 = __importDefault(require("moment")); // Importing Moment.js
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const appErrors_1 = require("../../errors/appErrors");
const http_status_1 = __importDefault(require("http-status"));
const settings_model_1 = require("../settings/settings.model");
const user_model_1 = require("../user/user.model");
const mongoose_1 = __importDefault(require("mongoose"));
const userProfit_model_1 = require("../userProfit/userProfit.model");
const withdraw_model_1 = require("../withdraw/withdraw.model");
const worker_model_1 = require("../worker/worker.model");
const salary_model_1 = require("../salary/salary.model");
const CreateDepositIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isValidUser = yield user_model_1.User.findById(payload.userId);
    if (!isValidUser) {
        throw new appErrors_1.AppError(http_status_1.default.BAD_REQUEST, "User Not Valid");
    }
    let validReference = "";
    if (isValidUser === null || isValidUser === void 0 ? void 0 : isValidUser.reference) {
        validReference = isValidUser === null || isValidUser === void 0 ? void 0 : isValidUser.reference;
    }
    const depositData = {
        depositAmount: payload.depositAmount,
        userId: payload.userId,
        transactionId: payload.transactionId,
        paymentMethod: payload.paymentMethod,
        transactionWhere: payload.transactionWhere,
        reference: validReference,
    };
    // Calculate derived fields
    const totalAmount = depositData.depositAmount * 2;
    const remainingProfitAmount = depositData.depositAmount * 2;
    const activeStatus = "pending";
    // Handle dates using Moment.js
    const depositStartDate = (0, moment_1.default)(); // current date
    const depositEndDate = (0, moment_1.default)(depositStartDate).add(2, "minutes"); // add 10 months
    const lastProfitDistribution = depositStartDate.clone(); // same as start date
    // Static values
    const profitPercent = 100;
    const monthlyProfitPercent = 10;
    const dipositDuration = 10;
    // Add calculated and static values to depositData, converting Moment.js objects to Date objects
    depositData.totalAmount = totalAmount;
    depositData.remainingProfitAmount = remainingProfitAmount;
    depositData.activeStatus = activeStatus;
    depositData.depositStartDate = depositStartDate.toDate(); // Convert to Date
    depositData.depositEndDate = depositEndDate.toDate(); // Convert to Date
    depositData.lastProfitDistribution = lastProfitDistribution.toDate(); // Convert to Date
    depositData.profitPercent = profitPercent;
    depositData.monthlyProfitPercent = monthlyProfitPercent;
    depositData.dipositDuration = dipositDuration;
    // Save to database
    const { minDiposit } = (yield settings_model_1.Settings.find())[0] || {};
    if (payload.depositAmount <= minDiposit) {
        throw new appErrors_1.AppError(http_status_1.default.BAD_REQUEST, `Deposit Amount Must Be At Last $${minDiposit} `);
    }
    const result = yield deposit_model_1.Deposit.create(depositData);
    return result;
});
// Get all deposit
const getAllDepositsFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    // New filter code
    const { filterQuery } = query;
    const filters = {};
    if (filterQuery) {
        filters.activeStatus = filterQuery;
    }
    const getAllApproveWithdraw = new QueryBuilder_1.default(deposit_model_1.Deposit.find(filters).populate("userId"), query)
        .search([])
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = yield getAllApproveWithdraw.modelQuery;
    if (!result.length) {
        throw new appErrors_1.AppError(http_status_1.default.NOT_FOUND, "No Deposit Found");
    }
    // Transforming and formatting data
    const formattedResult = result.map((deposit) => {
        return {
            _id: deposit._id,
            depositAmount: deposit.depositAmount,
            totalAmount: deposit.totalAmount,
            remainingProfitAmount: deposit.remainingProfitAmount,
            userId: deposit.userId._id, // Extract only the userId
            name: `${deposit.userId.firstName} ${deposit.userId.lastName}`,
            email: deposit.userId.email,
            reference: deposit.reference || deposit.userId.reference,
            activeStatus: deposit.activeStatus,
            depositStartDate: (0, moment_1.default)(deposit.depositStartDate).format("DD MMMM h:mm A YYYY"), // Format date
            depositEndDate: (0, moment_1.default)(deposit.depositEndDate).format("DD MMMM h:mm A YYYY"), // Format date
            lastProfitDistribution: (0, moment_1.default)(deposit.lastProfitDistribution).format("DD MMMM h:mm A YYYY"), // Format date
            profitPercent: deposit.profitPercent,
            monthlyProfitPercent: deposit.monthlyProfitPercent,
            transactionId: deposit.transactionId,
            paymentMethod: deposit.paymentMethod,
            dipositDuration: deposit.dipositDuration,
            transactionWhere: deposit.transactionWhere,
        };
    });
    return formattedResult;
});
// get single user deposit
const getSingleDepositsFromDB = (query, userID) => __awaiter(void 0, void 0, void 0, function* () {
    // New filter code
    const { filterQuery } = query;
    const filters = {
        userId: userID, // Always filter by userId
    };
    if (filterQuery) {
        filters.activeStatus = filterQuery; // Apply additional filter if provided
    }
    const getAllApproveWithdraw = new QueryBuilder_1.default(deposit_model_1.Deposit.find(filters).populate("userId"), query)
        .search([])
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = yield getAllApproveWithdraw.modelQuery;
    if (!result.length) {
        throw new appErrors_1.AppError(http_status_1.default.NOT_FOUND, "No Deposit Found");
    }
    // Transforming and formatting data
    const formattedResult = result.map((deposit) => {
        return {
            _id: deposit._id,
            depositAmount: deposit.depositAmount,
            totalAmount: deposit.totalAmount,
            remainingProfitAmount: deposit.remainingProfitAmount,
            userId: deposit.userId._id, // Extract only the userId
            name: `${deposit.userId.firstName} ${deposit.userId.lastName}`,
            email: deposit.userId.email,
            reference: deposit.reference || deposit.userId.reference,
            activeStatus: deposit.activeStatus,
            depositStartDate: (0, moment_1.default)(deposit.depositStartDate).format("DD MMMM h:mm A YYYY"), // Format date
            depositEndDate: (0, moment_1.default)(deposit.depositEndDate).format("DD MMMM h:mm A YYYY"), // Format date
            lastProfitDistribution: (0, moment_1.default)(deposit.lastProfitDistribution).format("DD MMMM h:mm A YYYY"), // Format date
            profitPercent: deposit.profitPercent,
            monthlyProfitPercent: deposit.monthlyProfitPercent,
            transactionId: deposit.transactionId,
            paymentMethod: deposit.paymentMethod,
            dipositDuration: deposit.dipositDuration > 0
                ? `${deposit.dipositDuration} Month`
                : `Complete 10 Month`,
            transactionWhere: deposit.transactionWhere,
        };
    });
    return formattedResult;
});
// accept-or-deposit-request
const acceptOrRejectDepositRequestIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const id = payload.depositId;
    // Convert moment dates to JavaScript Date objects using moment().toDate()
    const depositStartDate = (0, moment_1.default)(); // current date
    const depositEndDate = (0, moment_1.default)(depositStartDate).add(2, "minutes"); // add 10 months
    const lastProfitDistribution = depositStartDate.clone();
    // check if already approved or not
    const checkApprovedStatus = yield deposit_model_1.Deposit.findById(id);
    if ((checkApprovedStatus === null || checkApprovedStatus === void 0 ? void 0 : checkApprovedStatus.activeStatus) === "active") {
        throw new appErrors_1.AppError(http_status_1.default.BAD_REQUEST, "Already Approved");
    }
    if ((checkApprovedStatus === null || checkApprovedStatus === void 0 ? void 0 : checkApprovedStatus.activeStatus) === "deactivate") {
        throw new appErrors_1.AppError(http_status_1.default.BAD_REQUEST, "Already deactivate");
    }
    if ((checkApprovedStatus === null || checkApprovedStatus === void 0 ? void 0 : checkApprovedStatus.activeStatus) === "rejected") {
        throw new appErrors_1.AppError(http_status_1.default.BAD_REQUEST, "Already rejected");
    }
    const result = yield deposit_model_1.Deposit.findByIdAndUpdate(id, {
        activeStatus: payload.activeStatus,
        depositStartDate, // Add if available
        depositEndDate, // Add if available
        lastProfitDistribution, // Add if available
    }, {
        new: true,
        runValidators: true,
    });
    if (!result) {
        throw new appErrors_1.AppError(http_status_1.default.BAD_REQUEST, "Deposit not found");
    }
    return result;
});
// get worker deposit summary
const getDepositSummaryFromDB = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // Validate user
    const checkValidUser = yield user_model_1.User.findOne({ _id: userId });
    if (!checkValidUser) {
        throw new appErrors_1.AppError(http_status_1.default.NOT_FOUND, "User not found");
    }
    // Validate role
    const chekValidWorker = yield worker_model_1.Worker.findOne({ userId: checkValidUser === null || checkValidUser === void 0 ? void 0 : checkValidUser._id });
    const objectId = new mongoose_1.default.Types.ObjectId(checkValidUser._id); // Convert string to ObjectId
    // Aggregate user's total profit
    const result = yield userProfit_model_1.UserProfit.aggregate([
        {
            $match: { userId: objectId }, // Filter by userId as ObjectId
        },
        {
            $group: {
                _id: "$userId", // Group by userId
                totalUserProfitAmount: { $sum: "$userProfitAmount" },
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
    // neeed to fixed issue here , here no activeStatus: "pending" deposit amount not be count
    const deposit = yield deposit_model_1.Deposit.aggregate([
        {
            $match: { userId: objectId, activeStatus: { $ne: "pending" } }, // Filter by userId as ObjectId
        },
        {
            $group: {
                _id: "$userId", // Group by userId
                totalDepositAmount: { $sum: "$depositAmount" },
                totalUserProfitWithDepositAmount: { $sum: "$totalAmount" },
            },
        },
    ]);
    const pendingDeposit = yield deposit_model_1.Deposit.aggregate([
        {
            $match: { userId: objectId, activeStatus: "pending" }, // Filter by userId as ObjectId
        },
        {
            $group: {
                _id: "$userId", // Group by userId
                totalPendingDepositAmount: { $sum: "$depositAmount" },
            },
        },
    ]);
    // Fetch all withdrawal requests by this user
    const allWithdrawals = yield withdraw_model_1.Withdraw.find({ userId });
    // Calculate total pending withdrawal amount
    const pendingWithdrawals = allWithdrawals.filter((withdraw) => withdraw.approvalStatus === "pending");
    const pendingWithdrawalAmount = pendingWithdrawals.reduce((sum, withdraw) => sum + withdraw.withdrawalAmount, 0);
    // Calculate total already approved withdrawal amount
    const approvedWithdrawals = allWithdrawals.filter((withdraw) => withdraw.approvalStatus === "approved");
    const approvedWithdrawalAmount = approvedWithdrawals.reduce((sum, withdraw) => sum + withdraw.withdrawalAmount, 0);
    let totalCommisionAmount = 0;
    let totalReferredUser = 0;
    if (checkValidUser.role === "worker" &&
        (chekValidWorker === null || chekValidWorker === void 0 ? void 0 : chekValidWorker.accountStatus) === "active") {
        // Get all users referred by the worker
        const referredUsers = yield user_model_1.User.find({
            reference: chekValidWorker === null || chekValidWorker === void 0 ? void 0 : chekValidWorker.inviteID,
        });
        const referredUserIds = referredUsers.map((user) => user._id);
        // Debugging: Check if referredUserIds contains valid data
        if (!referredUserIds.length) {
            totalReferredUser = 0;
        }
        totalReferredUser = referredUserIds.length;
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
    // Calculate remaining withdrawable amount after approved withdrawals
    const remainingWithdrawableAmount = totalProfitIncludingCommissionAndSallary -
        pendingWithdrawalAmount -
        approvedWithdrawalAmount;
    const userRoleData = {
        totalDepositAmount: (deposit === null || deposit === void 0 ? void 0 : deposit.length) ? deposit[0].totalDepositAmount : 0,
        totalDipositWithProfitAmount: (deposit === null || deposit === void 0 ? void 0 : deposit.length)
            ? deposit[0].totalUserProfitWithDepositAmount
            : 0,
        totalProfitAmount: (result === null || result === void 0 ? void 0 : result.length) ? result[0].totalUserProfitAmount : 0,
        totalPendingDepositAmount: (pendingDeposit === null || pendingDeposit === void 0 ? void 0 : pendingDeposit.length)
            ? pendingDeposit[0].totalPendingDepositAmount
            : 0,
        totalCommisionAmount, // Include the total commission
        remainingWithdrawableAmount,
        pendingWithdrawalAmount,
        totalSallaryAmount,
        amountAlreadyWithdrawn: approvedWithdrawalAmount,
        totalReferredUser,
        inviteId: (chekValidWorker === null || chekValidWorker === void 0 ? void 0 : chekValidWorker.inviteID) ? chekValidWorker === null || chekValidWorker === void 0 ? void 0 : chekValidWorker.inviteID : "",
    };
    // Return the summary
    return userRoleData;
});
exports.DepostiServices = {
    CreateDepositIntoDB,
    getAllDepositsFromDB,
    getSingleDepositsFromDB,
    acceptOrRejectDepositRequestIntoDB,
    getDepositSummaryFromDB,
};
