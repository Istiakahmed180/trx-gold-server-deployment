import { Types } from "mongoose";

export interface TSalary {
  salaryAmount: number;
  userId: Types.ObjectId;
  salaryDate: Date;
  isDeleted: boolean;
}
