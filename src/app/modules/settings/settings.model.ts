import { Schema, model } from "mongoose";
import { TSettings } from "./settings.interface";

const settingsSchema = new Schema<TSettings>(
    {
        commisionPercent: {
            type: Number,
            default: 0
        },
        siteLogo: {
            type: String,
            required: false
        },
        minWithdraw: {
            type: Number,
            default: 0
        },
        minDiposit: {
            type: Number,
            default: 0
        },
        withdrawRequestLimitSingleDay: {
            type: Number,
            default: 0
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

// Query Middleware
settingsSchema.pre("find", function (next) {
    this.find({ isDeleted: { $ne: true } });
    next();
});

settingsSchema.pre("findOne", function (next) {
    this.find({ isDeleted: { $ne: true } });
    next();
});

export const Settings = model<TSettings>("Settings", settingsSchema);
