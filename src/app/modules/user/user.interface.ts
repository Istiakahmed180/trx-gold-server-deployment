import { TAccountStatus, TGender } from "../../interface/global.interface";

export type TRole = "admin" | "user" | "worker";
export interface TUser {
  firstName: string;
  lastName: string;
  email: string;
  userId: string;
  password: string;
  image: string;
  phone: string;
  gender: TGender;
  country: string;
  role: TRole;
  reference: string;
  bkashNumber: string;
  accountStatus: TAccountStatus;
  isVerified: boolean;
  isDeleted: boolean;
}
export interface TLogin {
  email: string;
  password: string;
}
export interface Ttoken {
  token: string;
}
export interface TresendCode {
  email: string;
}

export interface TEmailVerify {
  code: number;
  token: string;
}

export interface TchangePassword {
  password: string;
  code: number;
  token: string;
}
