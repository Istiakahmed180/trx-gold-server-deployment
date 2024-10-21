 

import { Types } from "mongoose";
import { TWithdrawStatus } from "../../interface/global.interface";

export interface TWithdraw {
  withdrawalAmount: number;
  paymentMethod: string;
  accountNumber: string;
  userId: Types.ObjectId;
  approvalStatus: TWithdrawStatus;
  withdrawDate: Date;
  isDeleted: boolean;
}

export interface TAcceptOrRejectWithdraw {
  approvalStatus: TWithdrawStatus;
  withdrawId: Types.ObjectId;
}
