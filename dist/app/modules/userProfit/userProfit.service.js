"use strict";
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
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
exports.UserProfitService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const appErrors_1 = require("../../errors/appErrors");
const userProfit_model_1 = require("./userProfit.model");
const user_model_1 = require("../user/user.model");
const worker_model_1 = require("../worker/worker.model");
const moment_1 = __importDefault(require("moment"));
const CreateUserProfitIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    //  logic will be here
    return true;
});
// get all user profits history
const getAllusersProfitHistoryFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const getAllApproveWithdraw = new QueryBuilder_1.default(userProfit_model_1.UserProfit.find().populate("depositId").populate("userId"), query)
        .search([])
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = yield getAllApproveWithdraw.modelQuery;
    // Transforming and formatting data
    const formattedResult = result.map((deposit) => {
        return {
            _id: deposit._id,
            userProfitAmount: deposit.userProfitAmount,
            workerCommisitionAmount: deposit.workerCommisitionAmount,
            totalAmount: deposit.totalAmount,
            depositAmount: deposit.depositId.depositAmount,
            name: `${deposit.userId.firstName} ${deposit.userId.lastName}`,
            email: deposit.userId.email,
            reference: deposit.reference || deposit.userId.reference,
            profitCratedDate: (0, moment_1.default)(deposit.profitCratedDate).format("DD MMMM h:mm A YYYY"), // Format date
        };
    });
    return formattedResult;
});
// worker referenced profit commision list
const getWorkerReferencedProfitCommisionFromDB = (query, id) => __awaiter(void 0, void 0, void 0, function* () {
    const checkValidUser = yield user_model_1.User.findOne({ _id: id });
    if (!checkValidUser) {
        throw new appErrors_1.AppError(http_status_1.default.NOT_FOUND, "User not found");
    }
    const chekValidWorker = yield worker_model_1.Worker.findOne({
        userId: checkValidUser === null || checkValidUser === void 0 ? void 0 : checkValidUser._id,
    });
    // new code
    const { filterQuery } = query;
    const filters = {
        reference: chekValidWorker === null || chekValidWorker === void 0 ? void 0 : chekValidWorker.inviteID,
    };
    // Only apply the approvalStatus filter if filterQuery is provided
    if (filterQuery) {
        filters.approvalStatus = filterQuery;
    }
    const getAllCommision = new QueryBuilder_1.default(userProfit_model_1.UserProfit.find(filters).populate({
        path: "userId",
        select: "firstName lastName email userId reference", // Specify the fields to include
    }), query)
        .search([]) // Adjust search conditions if needed
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = yield getAllCommision.modelQuery;
    // Transform the result, removing unwanted fields
    const transformedResult = result.map((item) => ({
        _id: item._id,
        profitCratedDate: (0, moment_1.default)(item.profitCratedDate).format("D MMMM h:mm A yyyy"),
        commision: item.workerCommisitionAmount,
        referralUser: `${item.userId.firstName} ${item.userId.lastName}`,
        email: item.userId.email,
    }));
    if (!transformedResult.length) {
        throw new appErrors_1.AppError(http_status_1.default.NOT_FOUND, "No Commision Found");
    }
    // how many profit i found i each user can you find it all
    return transformedResult;
});
// single user profit list
const singleUserProfitListFromBD = (query, id) => __awaiter(void 0, void 0, void 0, function* () {
    const getSignleUserProfit = new QueryBuilder_1.default(userProfit_model_1.UserProfit.find({ userId: id }).populate("depositId").populate("userId"), query)
        .search([])
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = yield getSignleUserProfit.modelQuery;
    if (!result.length) {
        throw new appErrors_1.AppError(http_status_1.default.NOT_FOUND, "No Profit Found");
    }
    // Transforming and formatting data
    const formattedResult = result.map((deposit) => {
        return {
            _id: deposit._id,
            userProfitAmount: deposit.userProfitAmount,
            workerCommisitionAmount: deposit.workerCommisitionAmount,
            totalAmount: deposit.totalAmount,
            depositAmount: deposit.depositId.depositAmount,
            name: `${deposit.userId.firstName} ${deposit.userId.lastName}`,
            email: deposit.userId.email,
            reference: deposit.reference || deposit.userId.reference,
            profitCratedDate: (0, moment_1.default)(deposit.profitCratedDate).format("DD MMMM h:mm A YYYY"), // Format date
        };
    });
    return formattedResult;
});
exports.UserProfitService = {
    CreateUserProfitIntoDB,
    getWorkerReferencedProfitCommisionFromDB,
    getAllusersProfitHistoryFromDB,
    singleUserProfitListFromBD,
};
