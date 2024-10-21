"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSearchableFields = exports.WITHDRAW_STATUS = exports.DEPOSIT_ACTIVE_STATUS = exports.ACCOUNT_STATUS = exports.GENDER = exports.USER_ROLE = exports.PASSWORD_REGEX = void 0;
exports.PASSWORD_REGEX = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/;
exports.USER_ROLE = ["admin", "user", "worker"];
exports.GENDER = ["Female", "Male"];
exports.ACCOUNT_STATUS = [
    "active",
    "deactivate",
    "pending",
    "rejected",
];
exports.DEPOSIT_ACTIVE_STATUS = [
    "active",
    "deactivate",
    "pending",
    "rejected",
];
exports.WITHDRAW_STATUS = [
    "approved",
    "pending",
    "rejected",
];
exports.userSearchableFields = ["email", "name"];
