"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Settings = void 0;
const mongoose_1 = require("mongoose");
const settingsSchema = new mongoose_1.Schema({
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
}, {
    timestamps: true,
});
// Query Middleware
settingsSchema.pre("find", function (next) {
    this.find({ isDeleted: { $ne: true } });
    next();
});
settingsSchema.pre("findOne", function (next) {
    this.find({ isDeleted: { $ne: true } });
    next();
});
exports.Settings = (0, mongoose_1.model)("Settings", settingsSchema);
