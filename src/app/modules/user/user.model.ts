import { Schema, model } from "mongoose";
import { TUser } from "./user.interface";
import config from "../../config";
import bcrypt from "bcrypt";
import { ACCOUNT_STATUS, GENDER, USER_ROLE } from "./user.constant";

const userSchema = new Schema<TUser>(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: "",
      required: false,
    },
    phone: {
      type: String,
      required: false,
      default: "",
    },
    gender: {
      type: String,
      enum: {
        values: GENDER,
        message: "{VALUE} is not a valid gender",
      },
      required: false,
      default: "Male",
    },
    role: {
      type: String,
      enum: {
        values: USER_ROLE,
        message: "{VALUE} is not a valid role",
      },
      default: "user",
    },
    accountStatus: {
      type: String,
      enum: {
        values: ACCOUNT_STATUS,
        message: "{VALUE} is not a valid status",
      },
      default: "pending",
    },
    reference: {
      type: String,
      required: false,
      default: "",
    },
    bkashNumber: {
      type: String,
      required: false,
      default: "",
    },
    country: {
      type: String,
      required: false,
      default: "",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(
    this.password,
    Number(config.bcrypt_salt_rounds)
  );
  next();
});

userSchema.statics.isPasswordMatched = async function (
  plainTextPassword,
  hashedPassword
) {
  return await bcrypt.compare(plainTextPassword, hashedPassword);
};

// Query Middleware
userSchema.pre("find", function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

userSchema.pre("findOne", function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

export const User = model<TUser>("User", userSchema);
