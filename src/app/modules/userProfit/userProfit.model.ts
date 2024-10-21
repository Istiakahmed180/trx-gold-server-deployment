import { Schema, model } from "mongoose";
import { TUserProfit } from "./userProfit.interface";

const userProfitSchema = new Schema<TUserProfit>(
  {
    depositId: {
      type: Schema.Types.ObjectId,
      ref: "Deposit",
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    profitCratedDate: {
      type: Date,
      required: true,
    },
    userProfitAmount: {
      type: Number,
      required: true,
    },
    workerCommisitionAmount: {
      type: Number,
      required: true,
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
    commistionActive: {
      type: Boolean,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Query Middleware
userProfitSchema.pre("find", function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

userProfitSchema.pre("findOne", function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

export const UserProfit = model<TUserProfit>("UserProfit", userProfitSchema);
