"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Worker = void 0;
const mongoose_1 = require("mongoose");
const user_constant_1 = require("../user/user.constant");
const workerSchema = new mongoose_1.Schema({
    inviteID: {
        type: String,
        required: false,
    },
    workerLevel: {
        type: String,
        required: false,
        default: "1st",
    },
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
    },
    accountStatus: {
        type: String,
        enum: {
            values: user_constant_1.ACCOUNT_STATUS,
            message: "{VALUE} is not a valid role",
        },
        default: "active",
        required: false,
    },
    commistionActive: {
        type: Boolean,
        default: false,
    },
    commisionPercent: {
        type: Number,
        required: false,
        default: 0,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});
// Query Middleware
workerSchema.pre("find", function (next) {
    this.find({ isDeleted: { $ne: true } });
    next();
});
workerSchema.pre("findOne", function (next) {
    this.find({ isDeleted: { $ne: true } });
    next();
});
exports.Worker = (0, mongoose_1.model)("Worker", workerSchema);
