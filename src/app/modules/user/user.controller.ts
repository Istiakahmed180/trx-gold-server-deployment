import httpStatus from "http-status";
import { UserService } from "./user.services";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";

const userCreated = catchAsync(async (req, res) => {
  const userData = req.body;
  const result = await UserService.CreateUserIntoDB(userData);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Register SuccessFull",
    data: result,
  });
});

//email verify
const emailVerify = catchAsync(async (req, res) => {
  const quiery = req.body;
  const result = await UserService.emailVerifyIntoDB(quiery);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Email Verificaiton SuccessFull",
    data: result,
  });
});
const otpCode = catchAsync(async (req, res) => {
  const quiery = req.body;
  const result = await UserService.otpCodeVerify(quiery);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Otp Verified SuccessFull",
    data: result,
  });
});
const resendCode = catchAsync(async (req, res) => {
  const quiery = req.body;
  const result = await UserService.resendCodeIntoDB(quiery);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Code Send SuccessFull",
    data: result,
  });
});
const changePassword = catchAsync(async (req, res) => {
  const quiery = req.body;
  const result = await UserService.changePasswrdIntoDB(quiery);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Password Change SuccessFull",
    data: result,
  });
});

const userLogin = catchAsync(async (req, res) => {
  const quiery = req.body;
  const result = await UserService.LoginFromDB(quiery);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Login Successful",
    data: result,
  });
});
const getloginUser = catchAsync(async (req, res) => {
  const quiery = req.body;
  const result = await UserService.getUserInfoFromDB(quiery);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "successfull",
    data: result,
  });
});
const getAllUsers = catchAsync(async (req, res) => {
  const quiery = req.query;
  const result = await UserService.getAllUserFormDB(quiery);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Get All Users Successfull",
    data: result,
  });
});
const updateUserInfo = catchAsync(async (req, res) => {
  const quiery = req.body;
  const id = req.params.id;
  const result = await UserService.updateuserIntoDB(id, quiery);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Update User Info complete",
    data: result,
  });
});
const deleteUserInfo = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await UserService.deleteUserFromDB(id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User deleted successfully",
    data: result,
  });
});
const updateUserPictureInfo = catchAsync(async (req, res) => {
  const id = req.query.id;
  const { image } = req.body;
  const result = await UserService.updateuserPictureIntoDB(id as string, image);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "update complete",
    data: result,
  });
});

export const userController = {
  userCreated,
  userLogin,
  getloginUser,
  getAllUsers,
  updateUserInfo,
  deleteUserInfo,
  updateUserPictureInfo,
  emailVerify,
  resendCode,
  changePassword,
  otpCode,
};
