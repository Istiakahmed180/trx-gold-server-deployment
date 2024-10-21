import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { WorkerService } from "./worker.service";

const workerCreated = catchAsync(async (req, res) => {
  const workerData = req.body;
  const result = await WorkerService.CreateWorkerIntoDB(workerData);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Worker Created SuccessFull",
    data: result,
  });
});
const workerUpdate = catchAsync(async (req, res) => {
  const workerData = req.body;
  const id = req.params.id;
  const result = await WorkerService.updateWorkerIntoDB(id, workerData);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Worker Update SuccessFull",
    data: result,
  });
});

const getAllWorker = catchAsync(async (req, res) => {
  const query = req.query;
  const result = await WorkerService.getAllWorkerFromDB(query);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Workers Retrieved Successfully",
    data: result,
  });
});

// worker refereal users

const getWorkerReferelUsers = catchAsync(async (req, res) => {
  const id = req.params.id;
  const query = req.query;
  const result = await WorkerService.getWorkerReferelUsersFromDB(query, id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Workers Refere Users Successfully",
    data: result,
  });
});

export const workerController = {
  workerCreated,
  workerUpdate,
  getAllWorker,
  getWorkerReferelUsers,
};
