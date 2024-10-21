import { Schema, model } from "mongoose";
import { TSalary } from "./salary.interface";

const salarySchema = new Schema<TSalary>(
  {
    salaryAmount: {
      type: Number,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    salaryDate: {
      type: Date,
      required: true,
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
salarySchema.pre("find", function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

salarySchema.pre("findOne", function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

export const Salary = model<TSalary>("Salary", salarySchema);
