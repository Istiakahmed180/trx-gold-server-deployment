"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Deposit = void 0;
const mongoose_1 = require("mongoose");
const user_constant_1 = require("../user/user.constant");
const depositSchema = new mongoose_1.Schema({
    depositAmount: {
        type: Number,
        required: true,
    },
    totalAmount: {
        type: Number,
        required: false,
        default: 0,
    },
    remainingProfitAmount: {
        type: Number,
        required: false,
        default: 0,
    },
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    activeStatus: {
        type: String,
        enum: {
            values: user_constant_1.DEPOSIT_ACTIVE_STATUS,
            message: "{VALUE} is not a valid status",
        },
        default: "pending",
        required: false,
    },
    depositStartDate: {
        type: Date, // Use Mongoose's Date type (compatible with Moment.js)
        required: false,
    },
    depositEndDate: {
        type: Date, // Use Mongoose's Date type (compatible with Moment.js)
        required: false,
    },
    lastProfitDistribution: {
        type: Date, // Use Mongoose's Date type (compatible with Moment.js)
        required: false,
    },
    profitPercent: {
        type: Number,
        default: 0,
        required: false,
    },
    monthlyProfitPercent: {
        type: Number,
        default: 0,
        required: false,
    },
    transactionId: {
        type: String,
        required: false,
        default: "",
    },
    paymentMethod: {
        type: String,
        required: false,
        default: "",
    },
    dipositDuration: {
        type: Number,
        required: false,
        default: 0,
    },
    transactionWhere: {
        type: String,
        required: false,
        default: "",
    },
    reference: {
        type: String,
        required: false,
        default: "",
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
});
// Query Middleware to exclude deleted documents
depositSchema.pre("find", function (next) {
    this.find({ isDeleted: { $ne: true } });
    next();
});
depositSchema.pre("findOne", function (next) {
    this.find({ isDeleted: { $ne: true } });
    next();
});
exports.Deposit = (0, mongoose_1.model)("Deposit", depositSchema);
