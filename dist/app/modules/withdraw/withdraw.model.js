"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Withdraw = void 0;
const mongoose_1 = require("mongoose");
const user_constant_1 = require("../user/user.constant");
const withdrawSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    withdrawDate: {
        type: Date,
        required: false,
    },
    withdrawalAmount: {
        type: Number,
        required: true,
    },
    approvalStatus: {
        type: String,
        enum: {
            values: user_constant_1.WITHDRAW_STATUS,
            message: "{VALUE} is not a valid status",
        },
        default: "pending",
    },
    paymentMethod: {
        type: String,
        required: false,
        default: "manualy",
    },
    accountNumber: {
        type: String,
        required: false,
        default: "no account",
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});
// Query Middleware
withdrawSchema.pre("find", function (next) {
    this.find({ isDeleted: { $ne: true } });
    next();
});
withdrawSchema.pre("findOne", function (next) {
    this.find({ isDeleted: { $ne: true } });
    next();
});
exports.Withdraw = (0, mongoose_1.model)("Withdraw", withdrawSchema);
