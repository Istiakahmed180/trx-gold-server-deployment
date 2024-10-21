/* eslint-disable @typescript-eslint/no-unused-vars */

import { AppError } from "../../errors/appErrors";
import httpStatus from "http-status";
import { TSalary } from "./salary.interface";
import moment from "moment";
import { Worker } from "../worker/worker.model";
import { Salary } from "./salary.model";
const CreateSalaryIntoDB = async (payload: TSalary) => {
  const sallarydate = moment();
  // it's worker model id for find the worker userId
  const id = payload.userId;
  console.log({ id });
  const validWorker = await Worker.findById(id);
  if (
    validWorker?.accountStatus === "deactivate" ||
    validWorker?.accountStatus === "rejected"
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Account is not active, you can't send salary"
    );
  }
  if (!validWorker?._id) {
    throw new AppError(httpStatus.BAD_REQUEST, "Worker not found");
  }

  const sallaryObj = {
    salaryAmount: payload.salaryAmount,
    userId: validWorker?.userId,
    salaryDate: sallarydate.toDate(),
  };

  const result = await Salary.create(sallaryObj);
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, "Something is wrong");
  }

  return result;
};

export const SalaryService = {
  CreateSalaryIntoDB,
};
