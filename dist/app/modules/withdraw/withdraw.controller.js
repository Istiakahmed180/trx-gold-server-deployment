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
exports.withdrawController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const withdraw_service_1 = require("./withdraw.service");
const createWithdrawRequest = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = req.body;
    const result = yield withdraw_service_1.WithdrawService.createWithdrawRequestIntoDb(payload);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.CREATED,
        message: "User Withdraw request sent Successfull",
        data: result,
    });
}));
const createWorkerWithdrawRequest = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = req.body;
    const result = yield withdraw_service_1.WithdrawService.createWorkerWithdrawRequestIntoDb(payload);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.CREATED,
        message: "Worker Withdraw request sent Successfull",
        data: result,
    });
}));
// accept Or Reject Withdraw Request
const acceptOrRejectWithdrawRequest = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = req.body;
    const result = yield withdraw_service_1.WithdrawService.acceptOrRejectWithdrawRequestIntoDB(payload);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.CREATED,
        message: "Withdraw request updated Successfull",
        data: result,
    });
}));
const getAllWithdrawHistory = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const quiery = req.query;
    const result = yield withdraw_service_1.WithdrawService.getAllWithdrawHistoryFromDB(quiery);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Withdraw History Retrived Successfull",
        data: result,
    });
}));
const getSingleUserWithdrawHistory = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const quiery = req.query;
    const id = req.params.id;
    const result = yield withdraw_service_1.WithdrawService.getSingleUserWithdrawHistoryFromDB(id, quiery);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Single User Withdraw History Retrived Successfull",
        data: result,
    });
}));
exports.withdrawController = {
    createWithdrawRequest,
    getAllWithdrawHistory,
    createWorkerWithdrawRequest,
    acceptOrRejectWithdrawRequest,
    getSingleUserWithdrawHistory,
};
