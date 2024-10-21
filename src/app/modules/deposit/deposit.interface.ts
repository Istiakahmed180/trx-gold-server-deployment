 
import { Types } from "mongoose";
import { TDepositActiveStatus } from "../../interface/global.interface";

export interface TDeposit {
  depositAmount: number;
  totalAmount: number;
  remainingProfitAmount: number;
  userId: Types.ObjectId;
  activeStatus: TDepositActiveStatus;
  depositStartDate: Date; // Still use JavaScript Date
  depositEndDate: Date; // Still use JavaScript Date
  lastProfitDistribution: Date; // Still use JavaScript Date
  profitPercent: number;
  monthlyProfitPercent: number;
  transactionId: string;
  paymentMethod: string;
  dipositDuration: number;
  transactionWhere: string;
  reference: string;
  isDeleted: boolean;
}

export interface TAcceptOrRejectDiposit {
  activeStatus: TDepositActiveStatus;
  depositId: Types.ObjectId;
}
