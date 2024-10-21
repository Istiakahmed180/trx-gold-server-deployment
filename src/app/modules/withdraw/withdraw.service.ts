/* eslint-disable @typescript-eslint/no-explicit-any */

import { AppError } from "../../errors/appErrors";
import httpStatus from "http-status";
import { User } from "../user/user.model";
import { Settings } from "../settings/settings.model";
import { TAcceptOrRejectWithdraw, TWithdraw } from "./withdraw.interface";
import mongoose from "mongoose";
import { UserProfit } from "../userProfit/userProfit.model";
import moment from "moment";
import { Withdraw } from "./withdraw.model";
import QueryBuilder from "../../builder/QueryBuilder";
import { Worker } from "../worker/worker.model";
import { Salary } from "../salary/salary.model";

// create withdraw request

const createWithdrawRequestIntoDb = async (payload: TWithdraw) => {
  const { minWithdraw, withdrawRequestLimitSingleDay } =
    (await Settings.find())[0] || {};

  const checkValidUser = await User.findOne({ _id: payload.userId });
  if (!checkValidUser) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  const objectId = new mongoose.Types.ObjectId(checkValidUser._id); // Convert string to ObjectId

  // Check if the requested withdrawal amount is less than the minimum
  if (payload.withdrawalAmount < minWithdraw) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `You can't withdraw less than $${minWithdraw}`
    );
  }

  // Aggregate user's total profit
  const result = await UserProfit.aggregate([
    {
      $match: { userId: objectId }, // Filter by userId as ObjectId
    },
    {
      $group: {
        _id: "$userId", // Group by userId
        totalUserProfitAmount: { $sum: "$userProfitAmount" }, // Sum of userProfitAmount
      },
    },
  ]);

  if (!result.length) {
    throw new AppError(httpStatus.NOT_FOUND, "No Profit Found");
  }

  // Fetch all withdrawal requests by this user
  const allWithdrawals = await Withdraw.find({ userId: payload.userId });

  // Check if the user has already sent the maximum allowed withdraw requests today
  const todayWithdrawals = allWithdrawals.filter(
    (withdraw) =>
      withdraw.withdrawDate >= moment().startOf("day").toDate() &&
      withdraw.withdrawDate <= moment().endOf("day").toDate()
  );

  if (todayWithdrawals.length >= withdrawRequestLimitSingleDay) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `You have already made ${withdrawRequestLimitSingleDay} withdrawal requests today. Please try again tomorrow.`
    );
  }

  // Calculate total pending withdrawal amount
  const pendingWithdrawals = allWithdrawals.filter(
    (withdraw) => withdraw.approvalStatus === "pending"
  );

  const pendingWithdrawalAmount = pendingWithdrawals.reduce(
    (sum, withdraw) => sum + withdraw.withdrawalAmount,
    0
  );
  // Calculate total already withdrawal amount

  const approvedWithdrawals = allWithdrawals.filter(
    (withdraw) => withdraw.approvalStatus === "approved"
  );

  const approvedWithdrawalAmount = approvedWithdrawals.reduce(
    (sum, withdraw) => sum + withdraw.withdrawalAmount,
    0
  );

  // Calculate remaining withdrawable amount
  const remainingWithdrawableAmount =
    result[0].totalUserProfitAmount -
    pendingWithdrawalAmount -
    approvedWithdrawalAmount;

  if (remainingWithdrawableAmount === 0) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Insufficient balance. You have no funds available for withdrawal at this time.`
    );
  }

  // Check if the requested withdrawal amount exceeds the total withdrawable amount
  if (payload.withdrawalAmount > remainingWithdrawableAmount) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `You can't withdraw more than $${remainingWithdrawableAmount}.`
    );
  }

  // Setting up to save the withdrawal request
  const withdrawDate = moment();
  const withdrawData: Partial<TWithdraw> = {
    withdrawalAmount: payload.withdrawalAmount,
    userId: payload.userId,
    approvalStatus: "pending",
    withdrawDate: withdrawDate.toDate(),
    paymentMethod: payload.paymentMethod,
    accountNumber: payload.accountNumber,
  };
  const data = await Withdraw.create(withdrawData);
  return data;
};

// crete worker withdraw

const createWorkerWithdrawRequestIntoDb = async (payload: TWithdraw) => {
  const { minWithdraw, withdrawRequestLimitSingleDay } =
    (await Settings.find())[0] || {};

  const checkValidUser = await User.findOne({ _id: payload.userId });
  if (!checkValidUser) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  // Validate role
  const chekValidWorker = await Worker.findOne({ userId: checkValidUser?._id });
  const objectId = new mongoose.Types.ObjectId(checkValidUser._id); // Convert string to ObjectId
  // Check if the requested withdrawal amount is less than the minimum
  if (payload.withdrawalAmount < minWithdraw) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `You can't withdraw less than $${minWithdraw}`
    );
  }

  // Aggregate user's total profit
  const result = await UserProfit.aggregate([
    {
      $match: { userId: objectId }, // Filter by userId as ObjectId
    },
    {
      $group: {
        _id: "$userId", // Group by userId
        totalUserProfitAmount: { $sum: "$userProfitAmount" }, // Sum of userProfitAmount
      },
    },
  ]);

  // Aggregate user's total salary
  const totalSalary = await Salary.aggregate([
    {
      $match: { userId: objectId }, // Filter by userId as ObjectId
    },
    {
      $group: {
        _id: "$userId", // Group by userId
        totalSalaryAmount: { $sum: "$salaryAmount" },
      },
    },
  ]);

  if (!result.length) {
    throw new AppError(httpStatus.NOT_FOUND, "No Profit Found");
  }

  // Fetch all withdrawal requests by this user
  const allWithdrawals = await Withdraw.find({ userId: payload.userId });

  // Check if the user has already sent the maximum allowed withdraw requests today
  const todayWithdrawals = allWithdrawals.filter(
    (withdraw) =>
      withdraw.withdrawDate >= moment().startOf("day").toDate() &&
      withdraw.withdrawDate <= moment().endOf("day").toDate()
  );

  if (todayWithdrawals.length > withdrawRequestLimitSingleDay) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `You have already made ${withdrawRequestLimitSingleDay} withdrawal requests today. Please try again tomorrow.`
    );
  }

  // Calculate total pending withdrawal amount
  const pendingWithdrawals = allWithdrawals.filter(
    (withdraw) => withdraw.approvalStatus === "pending"
  );

  const pendingWithdrawalAmount = pendingWithdrawals.reduce(
    (sum, withdraw) => sum + withdraw.withdrawalAmount,
    0
  );
  // Calculate total already withdrawal amount

  const approvedWithdrawals = allWithdrawals.filter(
    (withdraw) => withdraw.approvalStatus === "approved"
  );

  const approvedWithdrawalAmount = approvedWithdrawals.reduce(
    (sum, withdraw) => sum + withdraw.withdrawalAmount,
    0
  );

  let totalCommisionAmount = 0;
  if (
    checkValidUser.role === "worker" &&
    chekValidWorker?.accountStatus === "active"
  ) {
    // Get all users referred by the worker
    const referredUsers = await User.find({
      reference: chekValidWorker?.inviteID,
    });
    const referredUserIds = referredUsers.map((user) => user._id);
    if (referredUserIds.length) {
      const commissionData = await UserProfit.find({
        userId: { $in: referredUserIds }, // Use array of ObjectIds
        commistionActive: true, // Ensure commission is active
      });
      totalCommisionAmount = commissionData.reduce(
        (sum, record) => sum + (record.workerCommisitionAmount || 0), // Ensure field is present
        0
      );
    }

    // add sallary to the worker profit

    const totalSallaryAmount = totalSalary?.length
      ? totalSalary[0]?.totalSalaryAmount
      : 0;

    // Add commission & sallary to the worker's profit
    const totalProfitIncludingCommissionAndSallary = result?.length
      ? result[0].totalUserProfitAmount +
        totalCommisionAmount +
        totalSallaryAmount
      : totalCommisionAmount + totalSallaryAmount;

    const remainingWithdrawableAmount =
      totalProfitIncludingCommissionAndSallary -
      pendingWithdrawalAmount -
      approvedWithdrawalAmount;
    if (remainingWithdrawableAmount === 0) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `Insufficient balance. You have no funds available for withdrawal at this time.`
      );
    }

    // Check if the requested withdrawal amount exceeds the total withdrawable amount
    if (payload.withdrawalAmount > remainingWithdrawableAmount) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `You can't withdraw more than $${remainingWithdrawableAmount}.`
      );
    }

    // Setting up to save the withdrawal request
    const withdrawDate = moment();
    const withdrawData: Partial<TWithdraw> = {
      withdrawalAmount: payload.withdrawalAmount,
      userId: payload.userId,
      approvalStatus: "pending",
      withdrawDate: withdrawDate.toDate(),
      paymentMethod: payload.paymentMethod,
      accountNumber: payload.accountNumber,
    };
    const data = await Withdraw.create(withdrawData);
    return data;
  }
};

// get all withdraw history
const getAllWithdrawHistoryFromDB = async (query: Record<string, unknown>) => {
  const { filterQuery } = query;
  const filters: Record<string, unknown> = {};
  // Only apply the approvalStatus filter if filterQuery is provided
  if (filterQuery) {
    filters.approvalStatus = filterQuery;
  }
  const getAllApproveWithdraw = new QueryBuilder(
    Withdraw.find(filters).populate({
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

  const result = await getAllApproveWithdraw.modelQuery;
  // Transform the result, removing unwanted fields
  const transformedResult = result.map((item: any) => ({
    _id: item._id,
    withdrawDate: moment(item.withdrawDate).format("D MMMM h:mm A"),
    withdrawalAmount: item.withdrawalAmount,
    approvalStatus: item.approvalStatus,
    paymentMethod: item.paymentMethod,
    accountNumber: item.accountNumber,
    userId: item.userId._id, // Keep only userId as a separate field
    name: `${item.userId.firstName} ${item.userId.lastName}`,
    email: item.userId.email,
    reference: item.userId.reference,
  }));

  return transformedResult;
};

// get single user withdraw history
const getSingleUserWithdrawHistoryFromDB = async (
  userId: string,
  query: Record<string, unknown>
) => {
  const { filterQuery } = query;
  const filters: Record<string, unknown> = {
    userId: userId,
  };

  // Only apply the approvalStatus filter if filterQuery is provided
  if (filterQuery) {
    filters.approvalStatus = filterQuery;
  }
  const getAllApproveWithdraw = new QueryBuilder(
    Withdraw.find(filters).populate({
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

  const result = await getAllApproveWithdraw.modelQuery;
  // Transform the result, removing unwanted fields
  const transformedResult = result.map((item: any) => ({
    _id: item._id,
    withdrawDate: moment(item.withdrawDate).format("D MMMM h:mm A"),
    withdrawalAmount: item.withdrawalAmount,
    approvalStatus: item.approvalStatus,
    paymentMethod: item.paymentMethod,
    accountNumber: item.accountNumber,
    userId: item.userId._id, // Keep only userId as a separate field
    name: `${item.userId.firstName} ${item.userId.lastName}`,
    email: item.userId.email,
    reference: item.userId.reference,
  }));

  return transformedResult;
};

// accept-or-reject- withdraw request
const acceptOrRejectWithdrawRequestIntoDB = async (
  payload: TAcceptOrRejectWithdraw
) => {
  const id = payload.withdrawId;

  // Convert moment dates to JavaScript Date objects using moment().toDate()
  const withdrawDate = moment(); // current date
  // check if already approved or not

  const checkApprovedStatus = await Withdraw.findById(id);
  if (checkApprovedStatus?.approvalStatus === "approved") {
    throw new AppError(httpStatus.BAD_REQUEST, "Already Approved");
  }

  if (checkApprovedStatus?.approvalStatus === "rejected") {
    throw new AppError(httpStatus.BAD_REQUEST, "Already rejected");
  }

  const result = await Withdraw.findByIdAndUpdate(
    id,
    {
      approvalStatus: payload.approvalStatus,
      withdrawDate: withdrawDate,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, "Withdraw history not found");
  }

  return result;
};

export const WithdrawService = {
  createWithdrawRequestIntoDb,
  getAllWithdrawHistoryFromDB,
  createWorkerWithdrawRequestIntoDb,
  acceptOrRejectWithdrawRequestIntoDB,
  getSingleUserWithdrawHistoryFromDB,
};
