"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = require("express");
const user_controller_1 = require("./user.controller");
const user_validation_1 = require("./user.validation");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const router = (0, express_1.Router)();
router.post("/register", (0, validateRequest_1.default)(user_validation_1.UserValidation.userValidationSchema), user_controller_1.userController.userCreated);
// email verification
// old route /verify
router.put("/email-verify", (0, validateRequest_1.default)(user_validation_1.UserValidation.emailVerifySchema), user_controller_1.userController.emailVerify);
// use it when user will forgot his password
router.post("/verify-otp", (0, validateRequest_1.default)(user_validation_1.UserValidation.emailVerifySchema), user_controller_1.userController.otpCode);
// it will use for two case , befor forgot password , or resend code for otp
router.post("/resend-code", (0, validateRequest_1.default)(user_validation_1.UserValidation.resendCodeValidationSchema), user_controller_1.userController.resendCode);
router.post("/login", (0, validateRequest_1.default)(user_validation_1.UserValidation.loginValidationSchema), user_controller_1.userController.userLogin);
router.post("/user-info", (0, validateRequest_1.default)(user_validation_1.UserValidation.getUserValidationSchema), user_controller_1.userController.getloginUser);
router.put("/update-profile/:id", (0, validateRequest_1.default)(user_validation_1.UserValidation.UpdateuserValidationSchema), user_controller_1.userController.updateUserInfo);
router.put("/upload-profile", user_controller_1.userController.updateUserPictureInfo);
router.put("/forgot-password", (0, validateRequest_1.default)(user_validation_1.UserValidation.forgotPasswordValidation), user_controller_1.userController.changePassword);
exports.userRouter = router;
