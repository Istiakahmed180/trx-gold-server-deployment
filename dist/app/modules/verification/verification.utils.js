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
const verification_model_1 = require("./verification.model"); // Assuming you have a Verification model
const generateValidationCode = () => __awaiter(void 0, void 0, void 0, function* () {
    let validationCode = ''; // Initialize validation code
    // Generate a 6-digit random number
    const generateRandomNumber = () => {
        return Math.floor(100000 + Math.random() * 900000);
    };
    let isUnique = false;
    // Keep generating until a unique validation code is found
    while (!isUnique) {
        const randomCode = generateRandomNumber();
        validationCode = randomCode.toString();
        // Check if the validation code exists in the database
        const existingCode = yield verification_model_1.Verification.findOne({ code: validationCode }).lean();
        // If the code doesn't exist, set isUnique to true to exit the loop
        if (!existingCode) {
            isUnique = true;
        }
    }
    return validationCode;
});
exports.default = generateValidationCode;
