 

import { Date, Types } from "mongoose";

export interface TUserProfit {
  depositId: Types.ObjectId;
  userId: Types.ObjectId;
  profitCratedDate: Date;
  userProfitAmount: number;
  commistionActive: boolean;
  workerCommisitionAmount: number;
  reference: string;
  isDeleted: boolean;
}
