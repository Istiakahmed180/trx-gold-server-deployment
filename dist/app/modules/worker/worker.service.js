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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkerService = void 0;
const appErrors_1 = require("../../errors/appErrors");
const http_status_1 = __importDefault(require("http-status"));
const worker_model_1 = require("./worker.model");
const worker_utils_1 = __importDefault(require("./worker.utils"));
const user_model_1 = require("../user/user.model");
const settings_model_1 = require("../settings/settings.model");
const userProfit_model_1 = require("../userProfit/userProfit.model");
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const moment_1 = __importDefault(require("moment"));
const CreateWorkerIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const alreayExist = yield worker_model_1.Worker.findOne({ userId: payload.userId });
    // find in user in User Model
    const isExistInUser = yield user_model_1.User.findById(payload.userId);
    if (!isExistInUser || (isExistInUser === null || isExistInUser === void 0 ? void 0 : isExistInUser.accountStatus) !== "active") {
        throw new appErrors_1.AppError(http_status_1.default.BAD_REQUEST, "User Not Valid For Make to Worker");
    }
    else {
        const id = isExistInUser === null || isExistInUser === void 0 ? void 0 : isExistInUser._id;
        if (alreayExist) {
            throw new appErrors_1.AppError(http_status_1.default.BAD_REQUEST, "Worker Is Already Exist");
        }
        else {
            const { commisionPercent: commisionPercentValue } = (yield settings_model_1.Settings.find())[0] || {};
            yield user_model_1.User.findByIdAndUpdate({ _id: id }, { role: "worker" }, { new: true, runValidators: true });
            payload.inviteID = yield (0, worker_utils_1.default)();
            payload.commisionPercent = commisionPercentValue || 5;
            const result = yield worker_model_1.Worker.create(payload);
            return result;
        }
    }
});
const updateWorkerIntoDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { commistionActive } = payload, remainingData = __rest(payload, ["commistionActive"]);
    const inviteID = yield worker_model_1.Worker.findById(id);
    // Check if commistionActive is true and update the commissions if necessary
    if (commistionActive === true) {
        // Update all referenced commissions to set commistionActive to true
        yield userProfit_model_1.UserProfit.updateMany({ reference: inviteID === null || inviteID === void 0 ? void 0 : inviteID.inviteID }, { $set: { commistionActive: true } });
    }
    // Update the worker's remaining data
    const result = yield worker_model_1.Worker.findOneAndUpdate({ _id: id }, // Corrected to use _id for MongoDB
    payload, {
        new: true,
        runValidators: true,
    });
    // Return the updated worker and the referenced commissions
    return result;
});
const getAllWorkerFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const getAllWorker = new QueryBuilder_1.default(worker_model_1.Worker.find().populate({
        path: "userId",
        select: "firstName lastName email userId reference", // Specify the fields to include
    }), query)
        .search([]) // Adjust search conditions if needed
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = yield getAllWorker.modelQuery;
    // Transform the result, removing unwanted fields
    const transformedResult = result.map((item) => ({
        _id: item._id,
        joinDate: (0, moment_1.default)(item.createdAt).format("D MMMM h:mm A"),
        commistionActive: item.commistionActive,
        accountStatus: item.accountStatus,
        commisionPercent: item.commisionPercent,
        inviteId: item.inviteID,
        workerLevel: item.workerLevel,
        name: `${item.userId.firstName} ${item.userId.lastName}`,
        email: item.userId.email,
        phone: item.userId.phone,
    }));
    return transformedResult;
});
const getWorkerReferelUsersFromDB = (query, userId) => __awaiter(void 0, void 0, void 0, function* () {
    // Validate user
    const checkValidUser = yield user_model_1.User.findOne({ _id: userId });
    if (!checkValidUser) {
        throw new appErrors_1.AppError(http_status_1.default.NOT_FOUND, "User not found");
    }
    // Validate role
    const chekValidWorker = yield worker_model_1.Worker.findOne({ userId: checkValidUser === null || checkValidUser === void 0 ? void 0 : checkValidUser._id });
    // New Code for filtering
    const { filterQuery } = query;
    const filters = {
        reference: chekValidWorker === null || chekValidWorker === void 0 ? void 0 : chekValidWorker.inviteID,
    };
    // Apply the approvalStatus filter if it's provided in the query
    if (filterQuery) {
        filters.approvalStatus = filterQuery;
    }
    // Build the query to fetch referred users
    const getAllCommision = new QueryBuilder_1.default(user_model_1.User.find(filters).populate({
        path: "userId",
        select: "firstName lastName email userId reference", // Specify the fields to include
    }), query)
        .search([]) // Adjust search conditions if needed
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = yield getAllCommision.modelQuery;
    // Loop through the result to fetch total commission for each user from UserProfit model
    const transformedResult = yield Promise.all(result.map((item) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        // Fetch the total commission from the UserProfit model for this user
        const totalCommision = yield userProfit_model_1.UserProfit.aggregate([
            {
                $match: { userId: item._id }, // Match the UserProfit documents by userId
            },
            {
                $group: {
                    _id: null,
                    totalCommision: { $sum: "$workerCommisitionAmount" }, // Sum the commission amounts
                },
            },
        ]);
        return {
            userId: item._id,
            accountOpenDate: (0, moment_1.default)(item.createdAt).format("D MMMM h:mm A yyyy"),
            commision: item.workerCommisitionAmount,
            totalCommision: ((_a = totalCommision === null || totalCommision === void 0 ? void 0 : totalCommision[0]) === null || _a === void 0 ? void 0 : _a.totalCommision) || 0, // Add the total commission or default to 0
            referralUser: `${item.firstName} ${item.lastName}`,
            email: item.email,
        };
    })));
    // If no results are found, throw an error
    if (!transformedResult.length) {
        throw new appErrors_1.AppError(http_status_1.default.NOT_FOUND, "No Commission Found");
    }
    return transformedResult;
});
exports.WorkerService = {
    CreateWorkerIntoDB,
    updateWorkerIntoDB,
    getAllWorkerFromDB,
    getWorkerReferelUsersFromDB,
};
