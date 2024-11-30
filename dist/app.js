"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const error_middleWare_1 = require("./middlewares/error.middleWare");
const routes_1 = __importDefault(require("./routes"));
const app = (0, express_1.default)();
const corsOptions = {
    origin: true,
    credentials: true, //access-control-allow-credentials:true
    optionSuccessStatus: 200,
};
app.use((0, cors_1.default)(corsOptions));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
(0, routes_1.default)(app);
app.all("*", (req, res, next) => {
    res.status(404).json({
        success: false,
        message: `cant find ${req.url}`,
    });
});
app.use(error_middleWare_1.globalErrorHandler);
exports.default = app;
