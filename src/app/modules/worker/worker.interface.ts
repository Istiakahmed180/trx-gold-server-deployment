 

import { Types } from "mongoose";
import { TAccountStatus } from "../../interface/global.interface";

export interface TWorker {
  inviteID: string;
  userId: Types.ObjectId;
  workerLevel: string;
  commistionActive: boolean;
  commisionPercent: number;
  accountStatus: TAccountStatus;
  isVerified: boolean;
  isDeleted: boolean;
}
