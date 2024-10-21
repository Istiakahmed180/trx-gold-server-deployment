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
const worker_model_1 = require("./worker.model");
// Function to generate a random 9-character alphanumeric string
const generateRandomInviteID = () => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"; // Pool of characters to choose from
    let inviteID = "";
    // Generate a random string of 9 characters
    for (let i = 0; i < 9; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        inviteID += characters[randomIndex];
    }
    return inviteID;
};
const generateReferCode = () => __awaiter(void 0, void 0, void 0, function* () {
    let referID = ""; // Initialize the inviteID
    let isUnique = false;
    // Keep generating until a unique inviteID is found
    while (!isUnique) {
        const randomCode = generateRandomInviteID();
        referID = randomCode;
        // Check if the inviteID already exists in the database
        const existingCode = yield worker_model_1.Worker.findOne({ inviteID: referID }).lean();
        // If the inviteID doesn't exist, mark it as unique
        if (!existingCode) {
            isUnique = true;
        }
    }
    return referID;
});
exports.default = generateReferCode;
