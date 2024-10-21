 

import { Date } from 'mongoose';

export interface TVerificaiton {
  email: string;
  code: number;
  expiredTime: Date;
  isDeleted?: boolean;
}
 
