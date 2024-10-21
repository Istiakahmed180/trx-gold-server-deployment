import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { DepostiServices } from "./deposit.service";
const depositCreated = catchAsync(async (req, res) => {
  const data = req.body;
  const result = await DepostiServices.CreateDepositIntoDB(data);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Deposit Created Successfull",
    data: result,
  });
});
// accept or reject deposit
const acceptOrRejectDepositRequest = catchAsync(async (req, res) => {
  const data = req.body;
  const result = await DepostiServices.acceptOrRejectDepositRequestIntoDB(data);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Deposit Status Update Successfull",
    data: result,
  });
});
const getAllDeposits = catchAsync(async (req, res) => {
  const quiery = req.query;
  const result = await DepostiServices.getAllDepositsFromDB(quiery);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Deposits Retrived Successfull",
    data: result,
  });
});
const getSingleUserDeposit = catchAsync(async (req, res) => {
  const quiery = req.query;
  const userId = req.params.id;
  const result = await DepostiServices.getSingleDepositsFromDB(quiery, userId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Deposits Signle User Retrived Successfull",
    data: result,
  });
});

const getDepositSummary = catchAsync(async (req, res) => {
  const payload = req.params.id;
  const result = await DepostiServices.getDepositSummaryFromDB(payload);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Deposits Summary Retrived Successfull",
    data: result,
  });
});

export const depositController = {
  depositCreated,
  getAllDeposits,
  getSingleUserDeposit,
  acceptOrRejectDepositRequest,
  getDepositSummary,
};
