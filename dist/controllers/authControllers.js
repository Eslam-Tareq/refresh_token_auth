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
exports.getMe = exports.logOut = exports.logIn = exports.signUp = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const userModel_1 = __importDefault(require("../models/userModel"));
const authServices_1 = require("../services/authServices");
exports.signUp = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newUser = yield (0, authServices_1.signUpService)(req);
        res.status(201).json({
            success: true,
            message: "User created successfully, please login again",
        });
    }
    catch (err) {
        return next(err);
    }
}));
exports.logIn = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [isActivated, token, refreshToken, user] = yield (0, authServices_1.logInService)(req, res, req.body.email, req.body.password);
        if (isActivated) {
            res.status(200).json({
                success: true,
                user,
                accessToken: token,
                refreshToken,
            });
        }
        else {
            res.status(200).json({
                success: true,
                message: "activation code sent, please check your mail box",
                activationToken: token,
            });
        }
    }
    catch (err) {
        return next(err);
    }
}));
exports.logOut = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const refreshToken = req.cookies.refreshToken;
    const user = yield userModel_1.default.findById((_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
    if (user) {
        user.refreshTokens = user.refreshTokens.filter((rt) => rt !== refreshToken);
        yield user.save();
    }
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.status(200).json({
        success: true,
        message: "logged out successfully",
    });
}));
exports.getMe = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.status(200).json({
            success: true,
            user: req.user,
        });
    }
    catch (err) {
        return next(err);
    }
}));
