import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { UserProfitService } from "./userProfit.service";

const getWorkerReferencedProfitCommision = catchAsync(async (req, res) => {
  const id = req.params.id;
  const query = req.query;
  const result =
    await UserProfitService.getWorkerReferencedProfitCommisionFromDB(query, id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Commision retrieved successfully",
    data: result,
  });
});
const singleUserProfitList = catchAsync(async (req, res) => {
  const id = req.params.id;
  const query = req.query;
  const result = await UserProfitService.singleUserProfitListFromBD(query, id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Single User Profit retrieved successfully",
    data: result,
  });
});
const getAllusersProfitHistory = catchAsync(async (req, res) => {
  const query = req.query;
  const result = await UserProfitService.getAllusersProfitHistoryFromDB(query);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "All User Profit retrieved successfully",
    data: result,
  });
});

export const userProfitController = {
  getWorkerReferencedProfitCommision,
  singleUserProfitList,
  getAllusersProfitHistory,
};
