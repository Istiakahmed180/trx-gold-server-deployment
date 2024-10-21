"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.distributeMonthlyProfit = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const moment_1 = __importDefault(require("moment")); // Import moment
const deposit_model_1 = require("../deposit/deposit.model");
const userProfit_model_1 = require("./userProfit.model");
const user_model_1 = require("../user/user.model");
const worker_model_1 = require("../worker/worker.model");
const appErrors_1 = require("../../errors/appErrors");
const http_status_1 = __importDefault(require("http-status"));
const distributeMonthlyProfit = () => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession(); // Start a Mongoose session
    session.startTransaction(); // Begin the transaction
    try {
        const currentDate = (0, moment_1.default)(); // Use moment for current date
        // Get all active deposits
        const deposits = yield deposit_model_1.Deposit.find({ activeStatus: "active" }).session(session); // Use session for transaction
        for (const deposit of deposits) {
            const { userId, remainingProfitAmount, totalAmount, // Total amount for profit calculation
            depositStartDate, dipositDuration, lastProfitDistribution, reference, } = deposit;
            // Calculate the last distribution date using moment
            const lastDistributionDate = lastProfitDistribution
                ? (0, moment_1.default)(lastProfitDistribution) // Convert to moment
                : (0, moment_1.default)(depositStartDate); // Convert to moment
            const nextDistributionDate = lastDistributionDate
                .clone()
                .add(2, "minutes"); // Add one month
            // Check if the next distribution date has passed
            if (currentDate.isSameOrAfter(nextDistributionDate)) {
                // Calculate the profit amount as 10% of totalAmount
                const profitAmount = (totalAmount * 10) / 100; // 10% of totalAmount
                const user = yield user_model_1.User.findById(userId);
                let workerCommissionAmount = 0;
                let workerCommistionActive = false;
                // Default commission to 0
                // Check if the user has a reference
                if (user === null || user === void 0 ? void 0 : user.reference) {
                    const worker = yield worker_model_1.Worker.findOne({
                        inviteID: user.reference,
                    }).session(session);
                    if (worker) {
                        workerCommistionActive = worker === null || worker === void 0 ? void 0 : worker.commistionActive;
                        const commissionPercentage = worker.commisionPercent || 0; // Default commissionPercentage to 0
                        workerCommissionAmount = (totalAmount * commissionPercentage) / 100; // Calculate commission amount
                    }
                }
                // Check if there is remaining profit to distribute and if duration is still valid
                if (remainingProfitAmount > 0 && dipositDuration > 0) {
                    // Deduct the profit from remaining balance
                    const updatedRemainingBalance = remainingProfitAmount - profitAmount;
                    // Update the remaining balance and distribution date in the Deposit collection
                    yield deposit_model_1.Deposit.updateOne({ _id: deposit._id }, {
                        $set: {
                            remainingProfitAmount: updatedRemainingBalance,
                            lastProfitDistribution: currentDate.toDate(), // Update last distribution date
                            dipositDuration: dipositDuration - 1, // Decrement the duration
                        },
                    }, { session } // Include the session
                    );
                    // Create the UserProfit entry
                    const newUserProfit = new userProfit_model_1.UserProfit({
                        depositId: deposit._id,
                        userId: userId,
                        profitCratedDate: currentDate.toDate(), // Store profit date in JS Date format
                        userProfitAmount: profitAmount, // Store profit in Tk
                        workerCommisitionAmount: workerCommissionAmount, // Commission calculated based on totalAmount
                        commistionActive: workerCommistionActive,
                        reference: reference,
                    });
                    // Save the profit transaction to UserProfit collection
                    yield newUserProfit.save({ session }); // Include the session
                    // If the remaining balance is 0 or below, mark the deposit as inactive
                    if (updatedRemainingBalance <= 0) {
                        yield deposit_model_1.Deposit.updateOne({ _id: deposit._id }, {
                            $set: { activeStatus: "deactivate", remainingProfitAmount: 0 },
                        }, { session } // Include the session
                        );
                    }
                }
            }
        }
        yield session.commitTransaction(); // Commit the transaction
        console.log("Monthly profit distribution completed successfully.");
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    }
    catch (error) {
        yield session.abortTransaction(); // Rollback transaction on error
        throw new appErrors_1.AppError(http_status_1.default.EXPECTATION_FAILED, "Faield to send deposit");
    }
    finally {
        session.endSession(); // End the session
    }
});
exports.distributeMonthlyProfit = distributeMonthlyProfit;
