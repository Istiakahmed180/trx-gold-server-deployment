"use strict";
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const user_model_1 = require("./user.model");
const appErrors_1 = require("../../errors/appErrors");
const http_status_1 = __importDefault(require("http-status"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const verification_utils_1 = __importDefault(require("../verification/verification.utils"));
const moment_1 = __importDefault(require("moment"));
const config_1 = __importDefault(require("../../config"));
const mongoose_1 = __importDefault(require("mongoose"));
const verification_model_1 = require("../verification/verification.model");
const user_utils_1 = require("./user.utils");
const worker_model_1 = require("../worker/worker.model");
const CreateUserIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const alreayExist = yield user_model_1.User.findOne({ email: payload.email });
    if (alreayExist) {
        throw new appErrors_1.AppError(http_status_1.default.BAD_REQUEST, "User Is Already Exist");
    }
    else {
        const validationCode = yield (0, verification_utils_1.default)();
        const expiredTime = (0, moment_1.default)().add(5, "minutes");
        const sendValidationCode = {
            email: payload.email,
            code: validationCode,
            expiredTime: expiredTime,
        };
        if (payload.reference) {
            const validRefeff = yield worker_model_1.Worker.findOne({ inviteID: payload.reference });
            if (validRefeff) {
                payload.reference = validRefeff.inviteID;
            }
            else {
                throw new appErrors_1.AppError(http_status_1.default.BAD_REQUEST, "reference is not valid");
            }
        }
        // default data save
        const token = jsonwebtoken_1.default.sign({ email: payload.email, code: validationCode, expiredTime }, `${config_1.default.jwt_code_secret}`, { expiresIn: "5m" });
        payload.userId = yield (0, user_utils_1.generateUserId)(payload);
        const result = yield user_model_1.User.create(payload);
        if (result === null || result === void 0 ? void 0 : result._id) {
            yield verification_model_1.Verification.create(sendValidationCode);
        }
        /*
    
        here i want to apply the email sent functionalty  and i want to send
        "validationCode"
        in "payload.email"
    
        */
        return token;
    }
});
const emailVerifyIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const secretKey = config_1.default.jwt_code_secret || "fallbackSecret";
        const user = jsonwebtoken_1.default.verify(payload.token, secretKey);
        const userEmail = user.email;
        const verifyCode = user.code;
        // Retrieve user data and verification data from the database
        const userdata = yield user_model_1.User.findOne({ email: userEmail })
            .select("-password")
            .session(session);
        const verifyFromDB = yield verification_model_1.Verification.findOne({
            email: userEmail,
            code: verifyCode,
        }).session(session);
        // Check if user data and verification data exist
        if ((userdata === null || userdata === void 0 ? void 0 : userdata.email) === userEmail && (verifyFromDB === null || verifyFromDB === void 0 ? void 0 : verifyFromDB.code) === payload.code) {
            // Check if verification code is expired
            const expiredTime = (0, moment_1.default)(verifyFromDB === null || verifyFromDB === void 0 ? void 0 : verifyFromDB.expiredTime); // Convert MongoDB date string to Moment object
            const currentTime = (0, moment_1.default)();
            if (expiredTime.isBefore(currentTime)) {
                throw new appErrors_1.AppError(http_status_1.default.BAD_REQUEST, "Verification code has expired");
            }
            else {
                const updateUserStatus = yield user_model_1.User.findOneAndUpdate({ email: userdata.email }, {
                    $set: {
                        isVerified: true,
                        accountStatus: "active",
                    },
                }, {
                    new: true,
                    upsert: true,
                }).session(session);
                // Delete all verification documents for the same email address
                yield verification_model_1.Verification.deleteMany({ email: userEmail }).session(session);
                yield session.commitTransaction();
                session.endSession();
                const result = {
                    updateUserStatus,
                };
                return result;
            }
        }
        else {
            throw new appErrors_1.AppError(http_status_1.default.BAD_REQUEST, "Code or jwt secrect not valid");
        }
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
// otp when user will forgot password
const otpCodeVerify = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const secretKey = config_1.default.jwt_code_secret || "fallbackSecret";
        const user = jsonwebtoken_1.default.verify(payload.token, secretKey);
        const userEmail = user === null || user === void 0 ? void 0 : user.email;
        const verifyCode = user === null || user === void 0 ? void 0 : user.code;
        // Retrieve user data and verification data from the database
        const userdata = yield user_model_1.User.findOne({ email: userEmail })
            .select("-password")
            .session(session);
        const verifyFromDB = yield verification_model_1.Verification.findOne({
            email: userEmail,
            code: verifyCode,
        }).session(session);
        // Check if user data and verification data exist
        if ((userdata === null || userdata === void 0 ? void 0 : userdata.email) === userEmail && (verifyFromDB === null || verifyFromDB === void 0 ? void 0 : verifyFromDB.code) === (payload === null || payload === void 0 ? void 0 : payload.code)) {
            // Check if verification code is expired
            const expiredTime = (0, moment_1.default)(verifyFromDB === null || verifyFromDB === void 0 ? void 0 : verifyFromDB.expiredTime); // Convert MongoDB date string to Moment object
            const currentTime = (0, moment_1.default)();
            if (expiredTime.isBefore(currentTime)) {
                throw new appErrors_1.AppError(http_status_1.default.BAD_REQUEST, "Verification code has expired");
            }
            else {
                // Delete all verification documents for the same email address
                yield verification_model_1.Verification.deleteMany({ email: userEmail }).session(session);
                //  add varification Login here
                const validationCode = yield (0, verification_utils_1.default)();
                const expiredTime = (0, moment_1.default)().add(1, "day");
                const sendValidationCode = {
                    email: userEmail,
                    code: validationCode,
                    expiredTime: expiredTime,
                };
                yield verification_model_1.Verification.create(sendValidationCode);
                // genarate new otp and token for update password
                const token = jsonwebtoken_1.default.sign({ email: userdata.email, code: validationCode, expiredTime }, `${config_1.default.jwt_code_secret}`, { expiresIn: "1day" });
                const result = {
                    token,
                };
                yield session.commitTransaction();
                session.endSession();
                return result;
            }
        }
        else {
            throw new appErrors_1.AppError(http_status_1.default.BAD_REQUEST, "Wrong OTP");
        }
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
const resendCodeIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findOne({ email: payload.email });
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set time to beginning of the day
    // Find verifications for the current day
    const verificationsToday = yield verification_model_1.Verification.find({
        email: payload.email,
        createdAt: { $gte: today },
    });
    // Check if the user has reached the limit for today
    if (verificationsToday.length >= 5) {
        throw new appErrors_1.AppError(http_status_1.default.REQUESTED_RANGE_NOT_SATISFIABLE, "Verification limit reached for today");
    }
    if (user) {
        const validationCode = yield (0, verification_utils_1.default)();
        const expiredTime = (0, moment_1.default)().add(5, "minutes");
        const sendValidationCode = {
            email: payload.email,
            code: validationCode,
            expiredTime: expiredTime,
        };
        yield verification_model_1.Verification.create(sendValidationCode);
        const token = jsonwebtoken_1.default.sign({ email: user.email, code: validationCode, expiredTime }, `${config_1.default.jwt_code_secret}`, { expiresIn: "5m" });
        const result = {
            token,
        };
        return result;
    }
    else {
        throw new appErrors_1.AppError(http_status_1.default.BAD_REQUEST, "Enter Valid Email");
    }
});
const changePasswrdIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const secretKey = config_1.default.jwt_code_secret || "fallbackSecret";
        const user = jsonwebtoken_1.default.verify(payload.token, secretKey);
        const userEmail = user.email;
        const verifyCode = user.code;
        // Retrieve user data and verification data from the database
        const userdata = yield user_model_1.User.findOne({ email: userEmail }).session(session);
        const verifyFromDB = yield verification_model_1.Verification.findOne({
            email: userEmail,
            code: verifyCode,
        }).session(session);
        // Check if user data and verification data exist
        if ((userdata === null || userdata === void 0 ? void 0 : userdata.email) === userEmail && (verifyFromDB === null || verifyFromDB === void 0 ? void 0 : verifyFromDB.code) == payload.code) {
            // Check if verification code is expired
            const expiredTime = (0, moment_1.default)(verifyFromDB.expiredTime); // Convert MongoDB date string to Moment object
            const currentTime = (0, moment_1.default)();
            if (expiredTime.isBefore(currentTime)) {
                throw new appErrors_1.AppError(http_status_1.default.BAD_REQUEST, "Verification code has expired");
            }
            else {
                // password change logic here
                const encryptedPassword = yield bcrypt_1.default.hash(payload.password, Number(config_1.default.bcrypt_salt_rounds));
                const updateUserStatus = yield user_model_1.User.findOneAndUpdate({ email: userdata.email }, {
                    $set: {
                        password: encryptedPassword,
                    },
                }, {
                    new: true,
                    upsert: true,
                }).session(session);
                // Delete all verification documents for the same email address
                yield verification_model_1.Verification.deleteMany({ email: userEmail }).session(session);
                yield session.commitTransaction();
                session.endSession();
                const result = {
                    updateUserStatus,
                };
                return result;
            }
        }
        else {
            throw new appErrors_1.AppError(http_status_1.default.BAD_REQUEST, "Worng OTP");
        }
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
const LoginFromDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const validuser = yield user_model_1.User.findOne({ email: payload.email });
    if ((validuser === null || validuser === void 0 ? void 0 : validuser.isVerified) === false) {
        throw new appErrors_1.AppError(http_status_1.default.FORBIDDEN, "Email not verified");
    }
    if (validuser) {
        const validPass = yield bcrypt_1.default.compare(payload.password, validuser.password);
        if (validPass) {
            const token = jsonwebtoken_1.default.sign({ email: validuser.email, role: validuser.role }, `${config_1.default.jwt_access_secret}`, { expiresIn: "1d" });
            return token;
        }
        else {
            throw new appErrors_1.AppError(http_status_1.default.BAD_REQUEST, "password not Match");
        }
    }
    else {
        throw new appErrors_1.AppError(http_status_1.default.NOT_FOUND, "user not Valid");
    }
});
const getUserInfoFromDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const secretKey = process.env.JWT_ACCESS_SECRET || "fallbackSecret";
    const user = jsonwebtoken_1.default.verify(payload.token, secretKey);
    const userEmail = user.email;
    const userdata = yield user_model_1.User.findOne({ email: userEmail }).select("-password");
    if (userdata) {
        return userdata;
    }
    else {
        throw new appErrors_1.AppError(http_status_1.default.BAD_REQUEST, "Not Valid User");
    }
});
const getAllUserFormDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const userQuery = new QueryBuilder_1.default(user_model_1.User.find({ role: { $in: ["user"] } }).select("_id firstName lastName email image phone gender accountStatus reference country bkashNumber"), // Select specific fields
    query)
        .search(["email", "firstName", "lastName"])
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = yield userQuery.modelQuery;
    if (!result.length) {
        throw new appErrors_1.AppError(http_status_1.default.BAD_REQUEST, "No User Found In Database");
    }
    return result;
});
const updateuserIntoDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { password, email, reference } = payload, updateableData = __rest(payload, ["password", "email", "reference"]);
    const modifiedUpdatedData = Object.assign({}, updateableData);
    const result = yield user_model_1.User.findByIdAndUpdate(id, modifiedUpdatedData, {
        new: true,
        runValidators: true,
    });
    if (!result) {
        throw new appErrors_1.AppError(http_status_1.default.BAD_REQUEST, "User not found");
    }
    return result;
});
const deleteUserFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const deletedUser = yield user_model_1.User.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    if (!deletedUser) {
        throw new appErrors_1.AppError(http_status_1.default.BAD_REQUEST, "Failed to delete User");
    }
    return deletedUser;
});
const updateuserPictureIntoDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.User.findByIdAndUpdate(id, { image: payload }, {
        new: true,
        runValidators: true,
    });
    if (!result) {
        throw new appErrors_1.AppError(http_status_1.default.BAD_REQUEST, "User not found");
    }
    return result;
});
exports.UserService = {
    CreateUserIntoDB,
    LoginFromDB,
    getUserInfoFromDB,
    getAllUserFormDB,
    updateuserIntoDB,
    deleteUserFromDB,
    updateuserPictureIntoDB,
    emailVerifyIntoDB,
    resendCodeIntoDB,
    changePasswrdIntoDB,
    otpCodeVerify,
};
