import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { SalaryService } from "./salary.service";
const salaryCreate = catchAsync(async (req, res) => {
  const data = req.body;
  const result = await SalaryService.CreateSalaryIntoDB(data);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Salary Send Successfull",
    data: result,
  });
});

export const salaryController = {
  salaryCreate,
};
