"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Verification = void 0;
const mongoose_1 = require("mongoose");
const verficationSchema = new mongoose_1.Schema({
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
}, {
    timestamps: true,
});
// Query Middleware
verficationSchema.pre('find', function (next) {
    this.find({ isDeleted: { $ne: true } });
    next();
});
verficationSchema.pre('findOne', function (next) {
    this.find({ isDeleted: { $ne: true } });
    next();
});
exports.Verification = (0, mongoose_1.model)('Verification', verficationSchema);
