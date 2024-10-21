/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import httpStatus from "http-status";
import QueryBuilder from "../../builder/QueryBuilder";
import { AppError } from "../../errors/appErrors";
import { TUserProfit } from "./userProfit.interface";
import { UserProfit } from "./userProfit.model";
import mongoose from "mongoose";
import { User } from "../user/user.model";
import { Worker } from "../worker/worker.model";
import moment from "moment";
const CreateUserProfitIntoDB = async (payload: TUserProfit) => {
  //  logic will be here
  return true;
};

// get all user profits history
const getAllusersProfitHistoryFromDB = async (
  query: Record<string, unknown>
) => {
  const getAllApproveWithdraw = new QueryBuilder(
    UserProfit.find().populate("depositId").populate("userId"),
    query
  )
    .search([])
    .filter()
    .sort()
    .paginate()
    .fields();
  const result = await getAllApproveWithdraw.modelQuery;

  // Transforming and formatting data
  const formattedResult = result.map((deposit: any) => {
    return {
      _id: deposit._id,
      userProfitAmount: deposit.userProfitAmount,
      workerCommisitionAmount: deposit.workerCommisitionAmount,
      totalAmount: deposit.totalAmount,
      depositAmount: deposit.depositId.depositAmount,
      name: `${deposit.userId.firstName} ${deposit.userId.lastName}`,
      email: deposit.userId.email,
      reference: deposit.reference || deposit.userId.reference,
      profitCratedDate: moment(deposit.profitCratedDate).format(
        "DD MMMM h:mm A YYYY"
      ), // Format date
    };
  });

  return formattedResult;
};

// worker referenced profit commision list
const getWorkerReferencedProfitCommisionFromDB = async (
  query: Record<string, unknown>,
  id: string
) => {
  const checkValidUser = await User.findOne({ _id: id });

  if (!checkValidUser) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  const chekValidWorker = await Worker.findOne({
    userId: checkValidUser?._id,
  });

  // new code
  const { filterQuery } = query;
  const filters: Record<string, unknown> = {
    reference: chekValidWorker?.inviteID,
  };
  // Only apply the approvalStatus filter if filterQuery is provided
  if (filterQuery) {
    filters.approvalStatus = filterQuery;
  }
  const getAllCommision = new QueryBuilder(
    UserProfit.find(filters).populate({
      path: "userId",
      select: "firstName lastName email userId reference", // Specify the fields to include
    }),
    query
  )
    .search([]) // Adjust search conditions if needed
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await getAllCommision.modelQuery;
  // Transform the result, removing unwanted fields
  const transformedResult = result.map((item: any) => ({
    _id: item._id,
    profitCratedDate: moment(item.profitCratedDate).format(
      "D MMMM h:mm A yyyy"
    ),
    commision: item.workerCommisitionAmount,
    referralUser: `${item.userId.firstName} ${item.userId.lastName}`,
    email: item.userId.email,
  }));

  if (!transformedResult.length) {
    throw new AppError(httpStatus.NOT_FOUND, "No Commision Found");
  }

  // how many profit i found i each user can you find it all

  return transformedResult;
};
// single user profit list

const singleUserProfitListFromBD = async (
  query: Record<string, unknown>,
  id: string
) => {
  const getSignleUserProfit = new QueryBuilder(
    UserProfit.find({ userId: id }).populate("depositId").populate("userId"),
    query
  )
    .search([])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await getSignleUserProfit.modelQuery;

  if (!result.length) {
    throw new AppError(httpStatus.NOT_FOUND, "No Profit Found");
  }

  // Transforming and formatting data
  const formattedResult = result.map((deposit: any) => {
    return {
      _id: deposit._id,
      userProfitAmount: deposit.userProfitAmount,
      workerCommisitionAmount: deposit.workerCommisitionAmount,
      totalAmount: deposit.totalAmount,
      depositAmount: deposit.depositId.depositAmount,
      name: `${deposit.userId.firstName} ${deposit.userId.lastName}`,
      email: deposit.userId.email,
      reference: deposit.reference || deposit.userId.reference,
      profitCratedDate: moment(deposit.profitCratedDate).format(
        "DD MMMM h:mm A YYYY"
      ), // Format date
    };
  });

  return formattedResult;
};

export const UserProfitService = {
  CreateUserProfitIntoDB,
  getWorkerReferencedProfitCommisionFromDB,
  getAllusersProfitHistoryFromDB,
  singleUserProfitListFromBD,
};
