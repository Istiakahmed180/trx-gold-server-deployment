import {
  TAccountStatus,
  TDepositActiveStatus,
  TGender,
  TWithdrawStatus,
} from "../../interface/global.interface";
import { TRole } from "./user.interface";

export const PASSWORD_REGEX =
  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/;

export const USER_ROLE: TRole[] = ["admin", "user", "worker"];
export const GENDER: TGender[] = ["Female", "Male"];
export const ACCOUNT_STATUS: TAccountStatus[] = [
  "active",
  "deactivate",
  "pending",
  "rejected",
];
export const DEPOSIT_ACTIVE_STATUS: TDepositActiveStatus[] = [
  "active",
  "deactivate",
  "pending",
  "rejected",
];
export const WITHDRAW_STATUS: TWithdrawStatus[] = [
  "approved",
  "pending",
  "rejected",
];

export const userSearchableFields = ["email", "name"];
