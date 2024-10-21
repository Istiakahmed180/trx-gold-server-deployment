"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Salary = void 0;
const mongoose_1 = require("mongoose");
const salarySchema = new mongoose_1.Schema({
    salaryAmount: {
        type: Number,
        required: true,
    },
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
    },
    salaryDate: {
        type: Date,
        required: true,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});
// Query Middleware
salarySchema.pre("find", function (next) {
    this.find({ isDeleted: { $ne: true } });
    next();
});
salarySchema.pre("findOne", function (next) {
    this.find({ isDeleted: { $ne: true } });
    next();
});
exports.Salary = (0, mongoose_1.model)("Salary", salarySchema);
