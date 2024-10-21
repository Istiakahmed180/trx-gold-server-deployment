"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const config_1 = __importDefault(require("../../config"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_constant_1 = require("./user.constant");
const userSchema = new mongoose_1.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        default: "",
        required: false,
    },
    phone: {
        type: String,
        required: false,
        default: "",
    },
    gender: {
        type: String,
        enum: {
            values: user_constant_1.GENDER,
            message: "{VALUE} is not a valid gender",
        },
        required: false,
        default: "Male",
    },
    role: {
        type: String,
        enum: {
            values: user_constant_1.USER_ROLE,
            message: "{VALUE} is not a valid role",
        },
        default: "user",
    },
    accountStatus: {
        type: String,
        enum: {
            values: user_constant_1.ACCOUNT_STATUS,
            message: "{VALUE} is not a valid status",
        },
        default: "pending",
    },
    reference: {
        type: String,
        required: false,
        default: "",
    },
    bkashNumber: {
        type: String,
        required: false,
        default: "",
    },
    country: {
        type: String,
        required: false,
        default: "",
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});
userSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        this.password = yield bcrypt_1.default.hash(this.password, Number(config_1.default.bcrypt_salt_rounds));
        next();
    });
});
userSchema.statics.isPasswordMatched = function (plainTextPassword, hashedPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcrypt_1.default.compare(plainTextPassword, hashedPassword);
    });
};
// Query Middleware
userSchema.pre("find", function (next) {
    this.find({ isDeleted: { $ne: true } });
    next();
});
userSchema.pre("findOne", function (next) {
    this.find({ isDeleted: { $ne: true } });
    next();
});
exports.User = (0, mongoose_1.model)("User", userSchema);
