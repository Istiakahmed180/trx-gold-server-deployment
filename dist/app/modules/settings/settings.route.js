"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.siteSettingsRouter = void 0;
const express_1 = require("express");
const settings_controller_1 = require("./settings.controller");
const router = (0, express_1.Router)();
router.get("/get-site-settings", settings_controller_1.SiteSettingsController.SiteSettingsGet // <-- New route for GET request
);
exports.siteSettingsRouter = router;
