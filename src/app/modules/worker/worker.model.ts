import { Schema, model } from "mongoose";

import { ACCOUNT_STATUS } from "../user/user.constant";
import { TWorker } from "./worker.interface";

const workerSchema = new Schema<TWorker>(
  {
    inviteID: {
      type: String,
      required: false,
    },
    workerLevel: {
      type: String,
      required: false,
      default: "1st",
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    accountStatus: {
      type: String,
      enum: {
        values: ACCOUNT_STATUS,
        message: "{VALUE} is not a valid role",
      },
      default: "active",
      required: false,
    },
    commistionActive: {
      type: Boolean,
      default: false,
    },
    commisionPercent: {
      type: Number,
      required: false,
      default: 0,
    },
    isVerified: {
      type: Boolean,
      default: false,
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
workerSchema.pre("find", function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

workerSchema.pre("findOne", function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

export const Worker = model<TWorker>("Worker", workerSchema);
