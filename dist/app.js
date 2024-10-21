"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-explicit-any */
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = __importDefault(require("./app/routes"));
const globalErrorHandler_1 = __importDefault(require("./app/middlewares/globalErrorHandler"));
const notFound_1 = __importDefault(require("./app/middlewares/notFound"));
const config_1 = __importDefault(require("./app/config"));
const app = (0, express_1.default)();
const node_cron_1 = __importDefault(require("node-cron"));
const profit_distribution_1 = require("./app/modules/userProfit/profit.distribution");
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_json_1 = __importDefault(require("./swagger.json"));
//persers
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
const determineOrigin = (requestOrigin) => {
    if (requestOrigin === "http://localhost:3000") {
        return "http://localhost:3000";
    }
    else if (requestOrigin === "https://trx-gold-client-cxtu.vercel.app") {
        return "https://trx-gold-client-cxtu.vercel.app";
    }
    else {
        return false;
    }
};
// Middleware configuration
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        const allowedOrigin = determineOrigin(origin);
        callback(null, allowedOrigin);
    },
    credentials: true,
}));
app.use("/api/v1", routes_1.default);
app.use("/api/v1/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_json_1.default));
app.get("/", (req, res) => {
    res.json({
        projectName: "Trx Gold Server Is Running !!",
        portNumber: `running the port number ${config_1.default.port}`,
    });
});
node_cron_1.default.schedule("*/1 * * * *", profit_distribution_1.distributeMonthlyProfit);
//global-error
app.use(globalErrorHandler_1.default);
//api not found
app.use(notFound_1.default);
exports.default = app;
