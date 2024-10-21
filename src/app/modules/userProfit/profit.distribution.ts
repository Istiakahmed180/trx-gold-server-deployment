import mongoose from "mongoose";
import moment from "moment"; // Import moment
import { Deposit } from "../deposit/deposit.model";
import { UserProfit } from "./userProfit.model";
import { User } from "../user/user.model";
import { Worker as WorkerModel } from "../worker/worker.model";
import { AppError } from "../../errors/appErrors";
import httpStatus from "http-status";
export const distributeMonthlyProfit = async () => {
  const session = await mongoose.startSession(); // Start a Mongoose session
  session.startTransaction(); // Begin the transaction

  try {
    const currentDate = moment(); // Use moment for current date

    // Get all active deposits
    const deposits = await Deposit.find({ activeStatus: "active" }).session(
      session
    ); // Use session for transaction

    for (const deposit of deposits) {
      const {
        userId,
        remainingProfitAmount,
        totalAmount, // Total amount for profit calculation
        depositStartDate,
        dipositDuration,
        lastProfitDistribution,
        reference,
      } = deposit;

      // Calculate the last distribution date using moment
      const lastDistributionDate = lastProfitDistribution
        ? moment(lastProfitDistribution) // Convert to moment
        : moment(depositStartDate); // Convert to moment
      const nextDistributionDate = lastDistributionDate
        .clone()
        .add(2, "minutes"); // Add one month

      // Check if the next distribution date has passed
      if (currentDate.isSameOrAfter(nextDistributionDate)) {
        // Calculate the profit amount as 10% of totalAmount
        const profitAmount = (totalAmount * 10) / 100; // 10% of totalAmount
        const user = await User.findById(userId);

        let workerCommissionAmount = 0;
        let workerCommistionActive = false;
        // Default commission to 0

        // Check if the user has a reference
        if (user?.reference) {
          const worker = await WorkerModel.findOne({
            inviteID: user.reference,
          }).session(session);
          if (worker) {
            workerCommistionActive = worker?.commistionActive;
            const commissionPercentage = worker.commisionPercent || 0; // Default commissionPercentage to 0
            workerCommissionAmount = (totalAmount * commissionPercentage) / 100; // Calculate commission amount
          }
        }

        // Check if there is remaining profit to distribute and if duration is still valid
        if (remainingProfitAmount > 0 && dipositDuration > 0) {
          // Deduct the profit from remaining balance
          const updatedRemainingBalance = remainingProfitAmount - profitAmount;

          // Update the remaining balance and distribution date in the Deposit collection
          await Deposit.updateOne(
            { _id: deposit._id },
            {
              $set: {
                remainingProfitAmount: updatedRemainingBalance,
                lastProfitDistribution: currentDate.toDate(), // Update last distribution date
                dipositDuration: dipositDuration - 1, // Decrement the duration
              },
            },
            { session } // Include the session
          );

          // Create the UserProfit entry
          const newUserProfit = new UserProfit({
            depositId: deposit._id,
            userId: userId,
            profitCratedDate: currentDate.toDate(), // Store profit date in JS Date format
            userProfitAmount: profitAmount, // Store profit in Tk
            workerCommisitionAmount: workerCommissionAmount, // Commission calculated based on totalAmount
            commistionActive: workerCommistionActive,
            reference: reference,
          });

          // Save the profit transaction to UserProfit collection
          await newUserProfit.save({ session }); // Include the session

          // If the remaining balance is 0 or below, mark the deposit as inactive
          if (updatedRemainingBalance <= 0) {
            await Deposit.updateOne(
              { _id: deposit._id },
              {
                $set: { activeStatus: "deactivate", remainingProfitAmount: 0 },
              },
              { session } // Include the session
            );
          }
        }
      }
    }

    await session.commitTransaction(); // Commit the transaction
    console.log("Monthly profit distribution completed successfully.");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    await session.abortTransaction(); // Rollback transaction on error
    throw new AppError(httpStatus.EXPECTATION_FAILED, "Faield to send deposit");
  } finally {
    session.endSession(); // End the session
  }
};
