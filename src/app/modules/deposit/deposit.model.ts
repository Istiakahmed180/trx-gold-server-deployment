import { Schema, model } from "mongoose";
import { TDeposit } from "./deposit.interface";
import { DEPOSIT_ACTIVE_STATUS } from "../user/user.constant";

const depositSchema = new Schema<TDeposit>(
  {
    depositAmount: {
      type: Number,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: false,
      default: 0,
    },
    remainingProfitAmount: {
      type: Number,
      required: false,
      default: 0,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    activeStatus: {
      type: String,
      enum: {
        values: DEPOSIT_ACTIVE_STATUS,
        message: "{VALUE} is not a valid status",
      },
      default: "pending",
      required: false,
    },
    depositStartDate: {
      type: Date, // Use Mongoose's Date type (compatible with Moment.js)
      required: false,
    },
    depositEndDate: {
      type: Date, // Use Mongoose's Date type (compatible with Moment.js)
      required: false,
    },
    lastProfitDistribution: {
      type: Date, // Use Mongoose's Date type (compatible with Moment.js)
      required: false,
    },
    profitPercent: {
      type: Number,
      default: 0,
      required: false,
    },
    monthlyProfitPercent: {
      type: Number,
      default: 0,
      required: false,
    },
    transactionId: {
      type: String,
      required: false,
      default: "",
    },
    paymentMethod: {
      type: String,
      required: false,
      default: "",
    },
    dipositDuration: {
      type: Number,
      required: false,
      default: 0,
    },
    transactionWhere: {
      type: String,
      required: false,
      default: "",
    },
    reference: {
      type: String,
      required: false,
      default: "",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Query Middleware to exclude deleted documents
depositSchema.pre("find", function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

depositSchema.pre("findOne", function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

export const Deposit = model<TDeposit>("Deposit", depositSchema);
