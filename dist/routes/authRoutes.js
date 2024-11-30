"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authControllers_1 = require("../controllers/authControllers");
const authServices_1 = require("../services/authServices");
const authRouter = express_1.default.Router();
authRouter.post("/signup", authControllers_1.signUp);
authRouter.post("/logIn", authControllers_1.logIn);
authRouter.post("/logout", authServices_1.protect, authControllers_1.logOut);
authRouter.get("/getMe", authServices_1.protect, authControllers_1.getMe);
exports.default = authRouter;
