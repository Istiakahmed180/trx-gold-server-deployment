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
exports.depositController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const deposit_service_1 = require("./deposit.service");
const depositCreated = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    const result = yield deposit_service_1.DepostiServices.CreateDepositIntoDB(data);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.CREATED,
        message: "Deposit Created Successfull",
        data: result,
    });
}));
// accept or reject deposit
const acceptOrRejectDepositRequest = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    const result = yield deposit_service_1.DepostiServices.acceptOrRejectDepositRequestIntoDB(data);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.CREATED,
        message: "Deposit Status Update Successfull",
        data: result,
    });
}));
const getAllDeposits = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const quiery = req.query;
    const result = yield deposit_service_1.DepostiServices.getAllDepositsFromDB(quiery);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Deposits Retrived Successfull",
        data: result,
    });
}));
const getSingleUserDeposit = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const quiery = req.query;
    const userId = req.params.id;
    const result = yield deposit_service_1.DepostiServices.getSingleDepositsFromDB(quiery, userId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Deposits Signle User Retrived Successfull",
        data: result,
    });
}));
const getDepositSummary = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = req.params.id;
    const result = yield deposit_service_1.DepostiServices.getDepositSummaryFromDB(payload);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.CREATED,
        message: "Deposits Summary Retrived Successfull",
        data: result,
    });
}));
exports.depositController = {
    depositCreated,
    getAllDeposits,
    getSingleUserDeposit,
    acceptOrRejectDepositRequest,
    getDepositSummary,
};
