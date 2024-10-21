/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import httpStatus from "http-status";
import { User } from "../modules/user/user.model";

const adminTokenVerify = async (
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
    const decoded = (await jwt.verify(
      token,
      `${process.env.JWT_ACCESS_SECRET}`
    )) as {
      email: string;
    };

    const { email } = decoded;
    const validUser = await User.findOne({ email: email });

    if (
      validUser?.accountStatus === "active" &&
      validUser?.isVerified === true &&
      validUser?.role === "admin"
    ) {
      next();
    } else {
      return res
        .status(httpStatus.FORBIDDEN)
        .send({ message: "ACCESS DENIED" });
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err: any) {
    return next("Private Api");
  }
};

export default adminTokenVerify;
