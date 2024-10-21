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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const http_status_1 = __importDefault(require("http-status"));
const user_model_1 = require("../modules/user/user.model");
const userTokenVerify = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { authorization } = req.headers;
        if (!authorization) {
            return res
                .status(http_status_1.default.FORBIDDEN)
                .send({ message: "JWT Authorization Header Missing" });
        }
        const token = authorization.split(" ")[1];
        let decoded;
        try {
            decoded = jsonwebtoken_1.default.verify(token, `${process.env.JWT_ACCESS_SECRET}`);
        }
        catch (err) {
            return res.status(http_status_1.default.UNAUTHORIZED).send({
                success: false,
                message: "",
                errorMessage: "Token is not valid",
                errorDetails: "Privet API",
            });
        }
        const { email } = decoded;
        const validUser = yield user_model_1.User.findOne({ email: email });
        if ((validUser === null || validUser === void 0 ? void 0 : validUser.isVerified) === true &&
            (validUser === null || validUser === void 0 ? void 0 : validUser.accountStatus) === "active" &&
            ((validUser === null || validUser === void 0 ? void 0 : validUser.role) === "admin" ||
                (validUser === null || validUser === void 0 ? void 0 : validUser.role) === "worker" ||
                (validUser === null || validUser === void 0 ? void 0 : validUser.role) === "user")) {
            next();
        }
        else {
            return res
                .status(http_status_1.default.FORBIDDEN)
                .send({ message: "ACCESS DENIED" });
        }
    }
    catch (err) {
        return next("Private Api");
    }
});
exports.default = userTokenVerify;
