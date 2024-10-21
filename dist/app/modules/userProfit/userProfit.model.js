"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserProfit = void 0;
const mongoose_1 = require("mongoose");
const userProfitSchema = new mongoose_1.Schema({
    depositId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Deposit",
    },
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
    },
    profitCratedDate: {
        type: Date,
        required: true,
    },
    userProfitAmount: {
        type: Number,
        required: true,
    },
    workerCommisitionAmount: {
        type: Number,
        required: true,
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
    commistionActive: {
        type: Boolean,
        required: true,
    },
}, {
    timestamps: true,
});
// Query Middleware
userProfitSchema.pre("find", function (next) {
    this.find({ isDeleted: { $ne: true } });
    next();
});
userProfitSchema.pre("findOne", function (next) {
    this.find({ isDeleted: { $ne: true } });
    next();
});
exports.UserProfit = (0, mongoose_1.model)("UserProfit", userProfitSchema);
