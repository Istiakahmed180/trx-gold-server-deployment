/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { AppError } from "../../errors/appErrors";
import httpStatus from "http-status";
import { TWorker } from "./worker.interface";
import { Worker } from "./worker.model";
import generateReferCode from "./worker.utils";
import { User } from "../user/user.model";
import { Settings } from "../settings/settings.model";
import { UserProfit } from "../userProfit/userProfit.model";
import mongoose from "mongoose";
import QueryBuilder from "../../builder/QueryBuilder";
import moment from "moment";

const CreateWorkerIntoDB = async (payload: TWorker) => {
  const alreayExist = await Worker.findOne({ userId: payload.userId });
  // find in user in User Model
  const isExistInUser = await User.findById(payload.userId);
  if (!isExistInUser || isExistInUser?.accountStatus !== "active") {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "User Not Valid For Make to Worker"
    );
  } else {
    const id = isExistInUser?._id;
    if (alreayExist) {
      throw new AppError(httpStatus.BAD_REQUEST, "Worker Is Already Exist");
    } else {
      const { commisionPercent: commisionPercentValue } =
        (await Settings.find())[0] || {};

      await User.findByIdAndUpdate(
        { _id: id },
        { role: "worker" },
        { new: true, runValidators: true }
      );

      payload.inviteID = await generateReferCode();
      payload.commisionPercent = commisionPercentValue || 5;
      const result = await Worker.create(payload);
      return result;
    }
  }
};

const updateWorkerIntoDB = async (id: string, payload: Partial<TWorker>) => {
  const { commistionActive, ...remainingData } = payload;
  const inviteID = await Worker.findById(id);
  // Check if commistionActive is true and update the commissions if necessary
  if (commistionActive === true) {
    // Update all referenced commissions to set commistionActive to true
    await UserProfit.updateMany(
      { reference: inviteID?.inviteID },
      { $set: { commistionActive: true } }
    );
  }
  // Update the worker's remaining data
  const result = await Worker.findOneAndUpdate(
    { _id: id }, // Corrected to use _id for MongoDB
    payload,
    {
      new: true,
      runValidators: true,
    }
  );
  // Return the updated worker and the referenced commissions
  return result;
};
const getAllWorkerFromDB = async (query: Record<string, unknown>) => {
  const getAllWorker = new QueryBuilder(
    Worker.find().populate({
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

  const result = await getAllWorker.modelQuery;
  // Transform the result, removing unwanted fields
  const transformedResult = result.map((item: any) => ({
    _id: item._id,
    joinDate: moment(item.createdAt).format("D MMMM h:mm A"),
    commistionActive: item.commistionActive,
    accountStatus: item.accountStatus,
    commisionPercent: item.commisionPercent,
    inviteId: item.inviteID,
    workerLevel: item.workerLevel,
    name: `${item.userId.firstName} ${item.userId.lastName}`,
    email: item.userId.email,
    phone: item.userId.phone,
  }));

  return transformedResult;
};

const getWorkerReferelUsersFromDB = async (
  query: Record<string, unknown>,
  userId: string
) => {
  // Validate user
  const checkValidUser = await User.findOne({ _id: userId });
  if (!checkValidUser) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  // Validate role
  const chekValidWorker = await Worker.findOne({ userId: checkValidUser?._id });

  // New Code for filtering
  const { filterQuery } = query;
  const filters: Record<string, unknown> = {
    reference: chekValidWorker?.inviteID,
  };

  // Apply the approvalStatus filter if it's provided in the query
  if (filterQuery) {
    filters.approvalStatus = filterQuery;
  }

  // Build the query to fetch referred users
  const getAllCommision = new QueryBuilder(
    User.find(filters).populate({
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

  // Loop through the result to fetch total commission for each user from UserProfit model
  const transformedResult = await Promise.all(
    result.map(async (item: any) => {
      // Fetch the total commission from the UserProfit model for this user
      const totalCommision = await UserProfit.aggregate([
        {
          $match: { userId: item._id }, // Match the UserProfit documents by userId
        },
        {
          $group: {
            _id: null,
            totalCommision: { $sum: "$workerCommisitionAmount" }, // Sum the commission amounts
          },
        },
      ]);

      return {
        userId: item._id,
        accountOpenDate: moment(item.createdAt).format("D MMMM h:mm A yyyy"),
        commision: item.workerCommisitionAmount,
        totalCommision: totalCommision?.[0]?.totalCommision || 0, // Add the total commission or default to 0
        referralUser: `${item.firstName} ${item.lastName}`,
        email: item.email,
      };
    })
  );

  // If no results are found, throw an error
  if (!transformedResult.length) {
    throw new AppError(httpStatus.NOT_FOUND, "No Commission Found");
  }

  return transformedResult;
};

export const WorkerService = {
  CreateWorkerIntoDB,
  updateWorkerIntoDB,
  getAllWorkerFromDB,
  getWorkerReferelUsersFromDB,
};
