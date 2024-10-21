/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import {
  TEmailVerify,
  TLogin,
  TUser,
  TchangePassword,
  TresendCode,
  Ttoken,
} from "./user.interface";
import { User } from "./user.model";
import { AppError } from "../../errors/appErrors";
import httpStatus from "http-status";
import jwt, { Secret } from "jsonwebtoken";
import bcrypt from "bcrypt";
import QueryBuilder from "../../builder/QueryBuilder";
import generateValidationCode from "../verification/verification.utils";
import moment from "moment";
import config from "../../config";
import mongoose from "mongoose";
import { Verification } from "../verification/verification.model";
import { generateUserId } from "./user.utils";
import { Worker } from "../worker/worker.model";

const CreateUserIntoDB = async (payload: TUser) => {
  const alreayExist = await User.findOne({ email: payload.email });
  if (alreayExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "User Is Already Exist");
  } else {
    const validationCode = await generateValidationCode();
    const expiredTime = moment().add(5, "minutes");
    const sendValidationCode = {
      email: payload.email,
      code: validationCode,
      expiredTime: expiredTime,
    };

    if (payload.reference) {
      const validRefeff = await Worker.findOne({ inviteID: payload.reference });
      if (validRefeff) {
        payload.reference = validRefeff.inviteID;
      } else {
        throw new AppError(httpStatus.BAD_REQUEST, "reference is not valid");
      }
    }
    // default data save
    const token = jwt.sign(
      { email: payload.email, code: validationCode, expiredTime },
      `${config.jwt_code_secret}`,
      { expiresIn: "5m" }
    );
    payload.userId = await generateUserId(payload);
    const result = await User.create(payload);
    if (result?._id) {
      await Verification.create(sendValidationCode);
    }

    /*

    here i want to apply the email sent functionalty  and i want to send 
    "validationCode"
    in "payload.email"

    */

    return token;
  }
};

const emailVerifyIntoDB = async (payload: TEmailVerify) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const secretKey: Secret = config.jwt_code_secret || "fallbackSecret";
    const user = jwt.verify(payload.token, secretKey) as {
      email: string;
      code: number;
    };

    const userEmail = user.email;
    const verifyCode = user.code;
    // Retrieve user data and verification data from the database
    const userdata = await User.findOne({ email: userEmail })
      .select("-password")
      .session(session);
    const verifyFromDB = await Verification.findOne({
      email: userEmail,
      code: verifyCode,
    }).session(session);

    // Check if user data and verification data exist
    if (userdata?.email === userEmail && verifyFromDB?.code === payload.code) {
      // Check if verification code is expired

      const expiredTime = moment(verifyFromDB?.expiredTime as any); // Convert MongoDB date string to Moment object
      const currentTime = moment();

      if (expiredTime.isBefore(currentTime)) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          "Verification code has expired"
        );
      } else {
        const updateUserStatus = await User.findOneAndUpdate(
          { email: userdata.email },
          {
            $set: {
              isVerified: true,
              accountStatus: "active",
            },
          },
          {
            new: true,
            upsert: true,
          }
        ).session(session);

        // Delete all verification documents for the same email address
        await Verification.deleteMany({ email: userEmail }).session(session);

        await session.commitTransaction();
        session.endSession();

        const result = {
          updateUserStatus,
        };
        return result;
      }
    } else {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Code or jwt secrect not valid"
      );
    }
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};
// otp when user will forgot password

const otpCodeVerify = async (payload: TEmailVerify) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const secretKey: Secret = config.jwt_code_secret || "fallbackSecret";
    const user = jwt.verify(payload.token, secretKey) as {
      email: string;
      code: number;
    };

    const userEmail = user?.email;
    const verifyCode = user?.code;

    // Retrieve user data and verification data from the database
    const userdata = await User.findOne({ email: userEmail })
      .select("-password")
      .session(session);

    const verifyFromDB = await Verification.findOne({
      email: userEmail,
      code: verifyCode,
    }).session(session);

    // Check if user data and verification data exist
    if (userdata?.email === userEmail && verifyFromDB?.code === payload?.code) {
      // Check if verification code is expired
      const expiredTime = moment(verifyFromDB?.expiredTime as any); // Convert MongoDB date string to Moment object
      const currentTime = moment();

      if (expiredTime.isBefore(currentTime)) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          "Verification code has expired"
        );
      } else {
        // Delete all verification documents for the same email address
        await Verification.deleteMany({ email: userEmail }).session(session);
        //  add varification Login here
        const validationCode = await generateValidationCode();
        const expiredTime = moment().add(1, "day");
        const sendValidationCode = {
          email: userEmail,
          code: validationCode,
          expiredTime: expiredTime,
        };

        await Verification.create(sendValidationCode);

        // genarate new otp and token for update password

        const token = jwt.sign(
          { email: userdata.email, code: validationCode, expiredTime },
          `${config.jwt_code_secret}`,
          { expiresIn: "1day" }
        );
        const result = {
          token,
        };

        await session.commitTransaction();
        session.endSession();
        return result;
      }
    } else {
      throw new AppError(httpStatus.BAD_REQUEST, "Wrong OTP");
    }
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const resendCodeIntoDB = async (payload: TresendCode) => {
  const user = await User.findOne({ email: payload.email });
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set time to beginning of the day

  // Find verifications for the current day
  const verificationsToday = await Verification.find({
    email: payload.email,
    createdAt: { $gte: today },
  });

  // Check if the user has reached the limit for today
  if (verificationsToday.length >= 5) {
    throw new AppError(
      httpStatus.REQUESTED_RANGE_NOT_SATISFIABLE,
      "Verification limit reached for today"
    );
  }

  if (user) {
    const validationCode = await generateValidationCode();
    const expiredTime = moment().add(5, "minutes");
    const sendValidationCode = {
      email: payload.email,
      code: validationCode,
      expiredTime: expiredTime,
    };
    await Verification.create(sendValidationCode);
    const token = jwt.sign(
      { email: user.email, code: validationCode, expiredTime },
      `${config.jwt_code_secret}`,
      { expiresIn: "5m" }
    );
    const result = {
      token,
    };
    return result;
  } else {
    throw new AppError(httpStatus.BAD_REQUEST, "Enter Valid Email");
  }
};

const changePasswrdIntoDB = async (payload: TchangePassword) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const secretKey: Secret = config.jwt_code_secret || "fallbackSecret";
    const user = jwt.verify(payload.token, secretKey) as {
      email: string;
      code: number;
    };
    const userEmail = user.email;
    const verifyCode = user.code;

    // Retrieve user data and verification data from the database
    const userdata = await User.findOne({ email: userEmail }).session(session);
    const verifyFromDB = await Verification.findOne({
      email: userEmail,
      code: verifyCode,
    }).session(session);

    // Check if user data and verification data exist
    if (userdata?.email === userEmail && verifyFromDB?.code == payload.code) {
      // Check if verification code is expired

      const expiredTime = moment(verifyFromDB.expiredTime as any); // Convert MongoDB date string to Moment object
      const currentTime = moment();

      if (expiredTime.isBefore(currentTime)) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          "Verification code has expired"
        );
      } else {
        // password change logic here
        const encryptedPassword = await bcrypt.hash(
          payload.password,
          Number(config.bcrypt_salt_rounds)
        );
        const updateUserStatus = await User.findOneAndUpdate(
          { email: userdata.email },
          {
            $set: {
              password: encryptedPassword,
            },
          },
          {
            new: true,
            upsert: true,
          }
        ).session(session);
        // Delete all verification documents for the same email address
        await Verification.deleteMany({ email: userEmail }).session(session);
        await session.commitTransaction();
        session.endSession();
        const result = {
          updateUserStatus,
        };

        return result;
      }
    } else {
      throw new AppError(httpStatus.BAD_REQUEST, "Worng OTP");
    }
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const LoginFromDB = async (payload: TLogin) => {
  const validuser = await User.findOne({ email: payload.email });
  if (validuser?.isVerified === false) {
    throw new AppError(httpStatus.FORBIDDEN, "Email not verified");
  }

  if (validuser) {
    const validPass = await bcrypt.compare(
      payload.password,
      validuser.password
    );

    if (validPass) {
      const token = jwt.sign(
        { email: validuser.email, role: validuser.role },
        `${config.jwt_access_secret}`,
        { expiresIn: "1d" }
      );
      return token;
    } else {
      throw new AppError(httpStatus.BAD_REQUEST, "password not Match");
    }
  } else {
    throw new AppError(httpStatus.NOT_FOUND, "user not Valid");
  }
};
const getUserInfoFromDB = async (payload: Ttoken) => {
  const secretKey: Secret = process.env.JWT_ACCESS_SECRET || "fallbackSecret";
  const user = jwt.verify(payload.token, secretKey) as { email: string };
  const userEmail = user.email;
  const userdata = await User.findOne({ email: userEmail }).select("-password");
  if (userdata) {
    return userdata;
  } else {
    throw new AppError(httpStatus.BAD_REQUEST, "Not Valid User");
  }
};

const getAllUserFormDB = async (query: Record<string, unknown>) => {
  const userQuery = new QueryBuilder(
    User.find({ role: { $in: ["user"] } }).select(
      "_id firstName lastName email image phone gender accountStatus reference country bkashNumber"
    ), // Select specific fields
    query
  )
    .search(["email", "firstName", "lastName"])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await userQuery.modelQuery;

  if (!result.length) {
    throw new AppError(httpStatus.BAD_REQUEST, "No User Found In Database");
  }

  return result;
};

const updateuserIntoDB = async (id: string, payload: Partial<TUser>) => {
  const { password, email, reference, ...updateableData } = payload;

  const modifiedUpdatedData: Record<string, unknown> = {
    ...updateableData,
  };

  const result = await User.findByIdAndUpdate(id, modifiedUpdatedData, {
    new: true,
    runValidators: true,
  });
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, "User not found");
  }
  return result;
};

const deleteUserFromDB = async (id: string) => {
  const deletedUser = await User.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true }
  );

  if (!deletedUser) {
    throw new AppError(httpStatus.BAD_REQUEST, "Failed to delete User");
  }

  return deletedUser;
};

const updateuserPictureIntoDB = async (id: string, payload: string) => {
  const result = await User.findByIdAndUpdate(
    id,
    { image: payload },
    {
      new: true,
      runValidators: true,
    }
  );
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, "User not found");
  }
  return result;
};

export const UserService = {
  CreateUserIntoDB,
  LoginFromDB,
  getUserInfoFromDB,
  getAllUserFormDB,
  updateuserIntoDB,
  deleteUserFromDB,
  updateuserPictureIntoDB,
  emailVerifyIntoDB,
  resendCodeIntoDB,
  changePasswrdIntoDB,
  otpCodeVerify,
};
