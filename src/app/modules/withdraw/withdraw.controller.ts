import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { WithdrawService } from "./withdraw.service";

const createWithdrawRequest = catchAsync(async (req, res) => {
  const payload = req.body;
  const result = await WithdrawService.createWithdrawRequestIntoDb(payload);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "User Withdraw request sent Successfull",
    data: result,
  });
});
const createWorkerWithdrawRequest = catchAsync(async (req, res) => {
  const payload = req.body;
  const result = await WithdrawService.createWorkerWithdrawRequestIntoDb(
    payload
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Worker Withdraw request sent Successfull",
    data: result,
  });
});

// accept Or Reject Withdraw Request
const acceptOrRejectWithdrawRequest = catchAsync(async (req, res) => {
  const payload = req.body;
  const result = await WithdrawService.acceptOrRejectWithdrawRequestIntoDB(
    payload
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Withdraw request updated Successfull",
    data: result,
  });
});

const getAllWithdrawHistory = catchAsync(async (req, res) => {
  const quiery = req.query;
  const result = await WithdrawService.getAllWithdrawHistoryFromDB(quiery);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Withdraw History Retrived Successfull",
    data: result,
  });
});
const getSingleUserWithdrawHistory = catchAsync(async (req, res) => {
  const quiery = req.query;
  const id = req.params.id;
  const result = await WithdrawService.getSingleUserWithdrawHistoryFromDB(
    id,
    quiery
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Single User Withdraw History Retrived Successfull",
    data: result,
  });
});

export const withdrawController = {
  createWithdrawRequest,
  getAllWithdrawHistory,
  createWorkerWithdrawRequest,
  acceptOrRejectWithdrawRequest,
  getSingleUserWithdrawHistory,
};
