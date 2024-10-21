import { Schema, model } from "mongoose";
import { TWithdraw } from "./withdraw.interface";
import { WITHDRAW_STATUS } from "../user/user.constant";

const withdrawSchema = new Schema<TWithdraw>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    withdrawDate: {
      type: Date,
      required: false,
    },
    withdrawalAmount: {
      type: Number,
      required: true,
    },
    approvalStatus: {
      type: String,
      enum: {
        values: WITHDRAW_STATUS,
        message: "{VALUE} is not a valid status",
      },
      default: "pending",
    },
    paymentMethod: {
      type: String,
      required: false,
      default: "manualy",
    },
    accountNumber: {
      type: String,
      required: false,
      default: "no account",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Query Middleware
withdrawSchema.pre("find", function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

withdrawSchema.pre("findOne", function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

export const Withdraw = model<TWithdraw>("Withdraw", withdrawSchema);
