/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import httpStatus from "http-status";
import { User } from "../modules/user/user.model";
const userTokenVerify = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { authorization } = req.headers;

    if (!authorization) {
      return res
        .status(httpStatus.FORBIDDEN)
        .send({ message: "JWT Authorization Header Missing" });
    }

    const token = authorization.split(" ")[1];

    let decoded;
    try {
      decoded = jwt.verify(token, `${process.env.JWT_ACCESS_SECRET}`) as {
        email: string;
      };
    } catch (err: any) {
      return res.status(httpStatus.UNAUTHORIZED).send({
        success: false,
        message: "",
        errorMessage: "Token is not valid",
        errorDetails: "Privet API",
      });
    }

    const { email } = decoded;
    const validUser = await User.findOne({ email: email });

    if (
      validUser?.isVerified === true &&
      validUser?.accountStatus === "active" &&
      (validUser?.role === "admin" ||
        validUser?.role === "worker" ||
        validUser?.role === "user")
    ) {
      next();
    } else {
      return res
        .status(httpStatus.FORBIDDEN)
        .send({ message: "ACCESS DENIED" });
    }
  } catch (err: any) {
    return next("Private Api");
  }
};

export default userTokenVerify;
