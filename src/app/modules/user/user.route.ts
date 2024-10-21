import { Router } from "express";
import { userController } from "./user.controller";
import { UserValidation } from "./user.validation";
import validateRequest from "../../middlewares/validateRequest";

const router = Router();

router.post(
  "/register",
  validateRequest(UserValidation.userValidationSchema),
  userController.userCreated
);
// email verification
// old route /verify
router.put(
  "/email-verify",
  validateRequest(UserValidation.emailVerifySchema),
  userController.emailVerify
);
// use it when user will forgot his password
router.post(
  "/verify-otp",
  validateRequest(UserValidation.emailVerifySchema),
  userController.otpCode
);

// it will use for two case , befor forgot password , or resend code for otp

router.post(
  "/resend-code",
  validateRequest(UserValidation.resendCodeValidationSchema),
  userController.resendCode
);

router.post(
  "/login",
  validateRequest(UserValidation.loginValidationSchema),
  userController.userLogin
);
router.post(
  "/user-info",
  validateRequest(UserValidation.getUserValidationSchema),
  userController.getloginUser
);

router.put(
  "/update-profile/:id",
  validateRequest(UserValidation.UpdateuserValidationSchema),
  userController.updateUserInfo
);

router.put("/upload-profile", userController.updateUserPictureInfo);
router.put(
  "/forgot-password",
  validateRequest(UserValidation.forgotPasswordValidation),
  userController.changePassword
);

export const userRouter = router;
