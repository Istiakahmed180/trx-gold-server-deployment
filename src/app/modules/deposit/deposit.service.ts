/* eslint-disable @typescript-eslint/no-explicit-any */
import { TAcceptOrRejectDiposit, TDeposit } from "./deposit.interface";
import { Deposit } from "./deposit.model";
import { TDepositActiveStatus } from "../../interface/global.interface";
import moment from "moment"; // Importing Moment.js
import QueryBuilder from "../../builder/QueryBuilder";
import { AppError } from "../../errors/appErrors";
import httpStatus from "http-status";
import { Settings } from "../settings/settings.model";
import { User } from "../user/user.model";
import mongoose from "mongoose";
import { UserProfit } from "../userProfit/userProfit.model";
import { Withdraw } from "../withdraw/withdraw.model";
import { Worker } from "../worker/worker.model";
import { Salary } from "../salary/salary.model";

const CreateDepositIntoDB = async (payload: TDeposit) => {
  const isValidUser = await User.findById(payload.userId);

  if (!isValidUser) {
    throw new AppError(httpStatus.BAD_REQUEST, "User Not Valid");
  }

  let validReference = "";

  if (isValidUser?.reference) {
    validReference = isValidUser?.reference;
  }

  const depositData: Partial<TDeposit> = {
    depositAmount: payload.depositAmount,
    userId: payload.userId,
    transactionId: payload.transactionId,
    paymentMethod: payload.paymentMethod,
    transactionWhere: payload.transactionWhere,
    reference: validReference,
  };

  // Calculate derived fields
  const totalAmount = depositData.depositAmount! * 2;
  const remainingProfitAmount = depositData.depositAmount! * 2;
  const activeStatus: TDepositActiveStatus = "pending";
  // Handle dates using Moment.js
  const depositStartDate = moment(); // current date
  const depositEndDate = moment(depositStartDate).add(2, "minutes"); // add 10 months
  const lastProfitDistribution = depositStartDate.clone(); // same as start date
  // Static values
  const profitPercent = 100;
  const monthlyProfitPercent = 10;
  const dipositDuration = 10;
  // Add calculated and static values to depositData, converting Moment.js objects to Date objects
  depositData.totalAmount = totalAmount;
  depositData.remainingProfitAmount = remainingProfitAmount;
  depositData.activeStatus = activeStatus;
  depositData.depositStartDate = depositStartDate.toDate(); // Convert to Date
  depositData.depositEndDate = depositEndDate.toDate(); // Convert to Date
  depositData.lastProfitDistribution = lastProfitDistribution.toDate(); // Convert to Date
  depositData.profitPercent = profitPercent;
  depositData.monthlyProfitPercent = monthlyProfitPercent;
  depositData.dipositDuration = dipositDuration;
  // Save to database

  const { minDiposit } = (await Settings.find())[0] || {};

  if (payload.depositAmount <= minDiposit) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Deposit Amount Must Be At Last $${minDiposit} `
    );
  }

  const result = await Deposit.create(depositData);
  return result;
};
// Get all deposit
const getAllDepositsFromDB = async (query: Record<string, unknown>) => {
  // New filter code
  const { filterQuery } = query;
  const filters: Record<string, unknown> = {};
  if (filterQuery) {
    filters.activeStatus = filterQuery;
  }

  const getAllApproveWithdraw = new QueryBuilder(
    Deposit.find(filters).populate("userId"),
    query
  )
    .search([])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await getAllApproveWithdraw.modelQuery;

  if (!result.length) {
    throw new AppError(httpStatus.NOT_FOUND, "No Deposit Found");
  }

  // Transforming and formatting data
  const formattedResult = result.map((deposit: any) => {
    return {
      _id: deposit._id,
      depositAmount: deposit.depositAmount,
      totalAmount: deposit.totalAmount,
      remainingProfitAmount: deposit.remainingProfitAmount,
      userId: deposit.userId._id, // Extract only the userId
      name: `${deposit.userId.firstName} ${deposit.userId.lastName}`,
      email: deposit.userId.email,
      reference: deposit.reference || deposit.userId.reference,
      activeStatus: deposit.activeStatus,
      depositStartDate: moment(deposit.depositStartDate).format(
        "DD MMMM h:mm A YYYY"
      ), // Format date
      depositEndDate: moment(deposit.depositEndDate).format(
        "DD MMMM h:mm A YYYY"
      ), // Format date
      lastProfitDistribution: moment(deposit.lastProfitDistribution).format(
        "DD MMMM h:mm A YYYY"
      ), // Format date
      profitPercent: deposit.profitPercent,
      monthlyProfitPercent: deposit.monthlyProfitPercent,
      transactionId: deposit.transactionId,
      paymentMethod: deposit.paymentMethod,
      dipositDuration: deposit.dipositDuration,
      transactionWhere: deposit.transactionWhere,
    };
  });

  return formattedResult;
};
// get single user deposit
const getSingleDepositsFromDB = async (
  query: Record<string, unknown>,
  userID: string
) => {
  // New filter code
  const { filterQuery } = query;
  const filters: Record<string, unknown> = {
    userId: userID, // Always filter by userId
  };
  if (filterQuery) {
    filters.activeStatus = filterQuery; // Apply additional filter if provided
  }

  const getAllApproveWithdraw = new QueryBuilder(
    Deposit.find(filters).populate("userId"),
    query
  )
    .search([])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await getAllApproveWithdraw.modelQuery;

  if (!result.length) {
    throw new AppError(httpStatus.NOT_FOUND, "No Deposit Found");
  }

  // Transforming and formatting data
  const formattedResult = result.map((deposit: any) => {
    return {
      _id: deposit._id,
      depositAmount: deposit.depositAmount,
      totalAmount: deposit.totalAmount,
      remainingProfitAmount: deposit.remainingProfitAmount,
      userId: deposit.userId._id, // Extract only the userId
      name: `${deposit.userId.firstName} ${deposit.userId.lastName}`,
      email: deposit.userId.email,
      reference: deposit.reference || deposit.userId.reference,
      activeStatus: deposit.activeStatus,
      depositStartDate: moment(deposit.depositStartDate).format(
        "DD MMMM h:mm A YYYY"
      ), // Format date
      depositEndDate: moment(deposit.depositEndDate).format(
        "DD MMMM h:mm A YYYY"
      ), // Format date
      lastProfitDistribution: moment(deposit.lastProfitDistribution).format(
        "DD MMMM h:mm A YYYY"
      ), // Format date
      profitPercent: deposit.profitPercent,
      monthlyProfitPercent: deposit.monthlyProfitPercent,
      transactionId: deposit.transactionId,
      paymentMethod: deposit.paymentMethod,
      dipositDuration:
        deposit.dipositDuration > 0
          ? `${deposit.dipositDuration} Month`
          : `Complete 10 Month`,
      transactionWhere: deposit.transactionWhere,
    };
  });

  return formattedResult;
};
// accept-or-deposit-request
const acceptOrRejectDepositRequestIntoDB = async (
  payload: TAcceptOrRejectDiposit
) => {
  const id = payload.depositId;

  // Convert moment dates to JavaScript Date objects using moment().toDate()
  const depositStartDate = moment(); // current date
  const depositEndDate = moment(depositStartDate).add(2, "minutes"); // add 10 months
  const lastProfitDistribution = depositStartDate.clone();

  // check if already approved or not

  const checkApprovedStatus = await Deposit.findById(id);
  if (checkApprovedStatus?.activeStatus === "active") {
    throw new AppError(httpStatus.BAD_REQUEST, "Already Approved");
  }
  if (checkApprovedStatus?.activeStatus === "deactivate") {
    throw new AppError(httpStatus.BAD_REQUEST, "Already deactivate");
  }
  if (checkApprovedStatus?.activeStatus === "rejected") {
    throw new AppError(httpStatus.BAD_REQUEST, "Already rejected");
  }

  const result = await Deposit.findByIdAndUpdate(
    id,
    {
      activeStatus: payload.activeStatus,
      depositStartDate, // Add if available
      depositEndDate, // Add if available
      lastProfitDistribution, // Add if available
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, "Deposit not found");
  }

  return result;
};

// get worker deposit summary
const getDepositSummaryFromDB = async (userId: string) => {
  // Validate user
  const checkValidUser = await User.findOne({ _id: userId });
  if (!checkValidUser) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  // Validate role
  const chekValidWorker = await Worker.findOne({ userId: checkValidUser?._id });
  const objectId = new mongoose.Types.ObjectId(checkValidUser._id); // Convert string to ObjectId
  // Aggregate user's total profit
  const result = await UserProfit.aggregate([
    {
      $match: { userId: objectId }, // Filter by userId as ObjectId
    },
    {
      $group: {
        _id: "$userId", // Group by userId
        totalUserProfitAmount: { $sum: "$userProfitAmount" },
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

  // neeed to fixed issue here , here no activeStatus: "pending" deposit amount not be count

  const deposit = await Deposit.aggregate([
    {
      $match: { userId: objectId, activeStatus: { $ne: "pending" } }, // Filter by userId as ObjectId
    },
    {
      $group: {
        _id: "$userId", // Group by userId
        totalDepositAmount: { $sum: "$depositAmount" },
        totalUserProfitWithDepositAmount: { $sum: "$totalAmount" },
      },
    },
  ]);

  const pendingDeposit = await Deposit.aggregate([
    {
      $match: { userId: objectId, activeStatus: "pending" }, // Filter by userId as ObjectId
    },
    {
      $group: {
        _id: "$userId", // Group by userId
        totalPendingDepositAmount: { $sum: "$depositAmount" },
      },
    },
  ]);

  // Fetch all withdrawal requests by this user
  const allWithdrawals = await Withdraw.find({ userId });

  // Calculate total pending withdrawal amount
  const pendingWithdrawals = allWithdrawals.filter(
    (withdraw) => withdraw.approvalStatus === "pending"
  );

  const pendingWithdrawalAmount = pendingWithdrawals.reduce(
    (sum, withdraw) => sum + withdraw.withdrawalAmount,
    0
  );

  // Calculate total already approved withdrawal amount
  const approvedWithdrawals = allWithdrawals.filter(
    (withdraw) => withdraw.approvalStatus === "approved"
  );

  const approvedWithdrawalAmount = approvedWithdrawals.reduce(
    (sum, withdraw) => sum + withdraw.withdrawalAmount,
    0
  );

  let totalCommisionAmount = 0;
  let totalReferredUser = 0;
  if (
    checkValidUser.role === "worker" &&
    chekValidWorker?.accountStatus === "active"
  ) {
    // Get all users referred by the worker
    const referredUsers = await User.find({
      reference: chekValidWorker?.inviteID,
    });

    const referredUserIds = referredUsers.map((user) => user._id);

    // Debugging: Check if referredUserIds contains valid data
    if (!referredUserIds.length) {
      totalReferredUser = 0;
    }

    totalReferredUser = referredUserIds.length;

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

  // Calculate remaining withdrawable amount after approved withdrawals
  const remainingWithdrawableAmount =
    totalProfitIncludingCommissionAndSallary -
    pendingWithdrawalAmount -
    approvedWithdrawalAmount;
  const userRoleData = {
    totalDepositAmount: deposit?.length ? deposit[0].totalDepositAmount : 0,
    totalDipositWithProfitAmount: deposit?.length
      ? deposit[0].totalUserProfitWithDepositAmount
      : 0,
    totalProfitAmount: result?.length ? result[0].totalUserProfitAmount : 0,
    totalPendingDepositAmount: pendingDeposit?.length
      ? pendingDeposit[0].totalPendingDepositAmount
      : 0,
    totalCommisionAmount, // Include the total commission
    remainingWithdrawableAmount,
    pendingWithdrawalAmount,
    totalSallaryAmount,
    amountAlreadyWithdrawn: approvedWithdrawalAmount,
    totalReferredUser,
    inviteId: chekValidWorker?.inviteID ? chekValidWorker?.inviteID : "",
  };

  // Return the summary
  return userRoleData;
};

export const DepostiServices = {
  CreateDepositIntoDB,
  getAllDepositsFromDB,
  getSingleDepositsFromDB,
  acceptOrRejectDepositRequestIntoDB,
  getDepositSummaryFromDB,
};
