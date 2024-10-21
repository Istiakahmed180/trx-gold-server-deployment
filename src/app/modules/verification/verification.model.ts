import { Schema, model } from 'mongoose';
import { TVerificaiton } from './verification.interface';
const verficationSchema = new Schema<TVerificaiton>(
  {
    email: {
      type: String,
      required: true,
    },
    code: {
      type: Number,
      required: true,   
    },
    expiredTime: {
      type: Date,
      required: true,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

// Query Middleware
verficationSchema.pre('find', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

verficationSchema.pre('findOne', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

export const Verification = model<TVerificaiton>(
  'Verification',
  verficationSchema,
);
