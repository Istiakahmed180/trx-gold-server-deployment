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
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateUserId = void 0;
const user_model_1 = require("./user.model");
const findLastUserId = () => __awaiter(void 0, void 0, void 0, function* () {
    const lastuser = yield user_model_1.User.findOne({ role: "user" })
        .sort({ createdAt: -1 })
        .lean();
    return lastuser === null || lastuser === void 0 ? void 0 : lastuser.userId;
});
const generateUserId = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    let currentId = "0000"; // Set a default starting value
    const lastStudentId = yield findLastUserId();
    let fname = payload.firstName.toLowerCase(); // Convert to lowercase to avoid case sensitivity issues
    let lname = payload.lastName.toLowerCase(); // Convert to lowercase to avoid case sensitivity issues
    // Limit first name and last name to first 3 and last 3 characters, respectively
    fname = fname.substring(0, 3);
    lname = lname.substring(Math.max(0, lname.length - 3));
    let lastNumber = 0; // Initialize lastNumber to handle NaN case
    if (lastStudentId) {
        const lastIdSubstring = lastStudentId.substring(fname.length + lname.length); // Get the numeric part
        lastNumber = parseInt(lastIdSubstring, 10);
    }
    // If lastNumber is NaN or not a number, default it to 0
    if (isNaN(lastNumber)) {
        lastNumber = 0;
    }
    const nextNumber = lastNumber + 1;
    currentId = nextNumber.toString().padStart(4, "0");
    return `${fname}${lname}${currentId}`;
});
exports.generateUserId = generateUserId;
