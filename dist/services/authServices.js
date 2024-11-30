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
exports.protect = exports.logInService = exports.signUpService = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
const appError_1 = __importDefault(require("../utils/appError"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const jwt_1 = require("../utils/jwt");
const password_1 = require("../utils/password");
const signUpService = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = req.body;
    // hashing password before saving it in data base
    const hashedPassword = yield (0, password_1.hashingPassword)(password);
    //1- create user
    const newUser = yield userModel_1.default.create({
        name,
        email,
        password: hashedPassword,
    });
    return newUser;
});
exports.signUpService = signUpService;
const logInService = (req, res, email, password) => __awaiter(void 0, void 0, void 0, function* () {
    //console.log(typeof req.query.limit, typeof req.query.page);
    //1- find user by email
    const user = yield userModel_1.default.findOne({ email });
    if (!user) {
        throw new appError_1.default("email or password is incorrect", 400);
    }
    if (!user.password) {
        throw new appError_1.default("email or password is incorrect", 400);
    }
    //2- checking password correction
    const isPassCorrect = yield (0, password_1.isCorrectPassword)(password, user.password);
    if (!isPassCorrect) {
        throw new appError_1.default("email or password is incorrect", 400);
    }
    //login success
    const [accessToken, refreshToken, updatedUser] = yield createTokensForLoggedInUser(user, req, res);
    return [true, accessToken, refreshToken, updatedUser];
});
exports.logInService = logInService;
exports.protect = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let user;
    try {
        const [refreshTokenDecodedEmail, foundedUser] = yield refreshTokenHandler(req);
        let token;
        if (req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[0];
        }
        else {
            token = req.cookies.accessToken;
        }
        if (!token) {
            throw new appError_1.default("there is no access token", 401);
        }
        user = foundedUser;
        const decoded = (yield (0, jwt_1.verifyTokenAsync)(token, "access"));
        user = yield userModel_1.default.findById(decoded.userId);
        if (!user) {
            throw new appError_1.default("user belong to that token does not exist", 401);
        }
        if (user.email !== refreshTokenDecodedEmail) {
            throw new appError_1.default("malicious user try to access with refresh token and access token not belong to the same user", 403);
        }
        // imagine we have a change current password endpoint
        if (user.passwordChangedAt) {
            const passChangedAtTimeStamp = parseInt(`${user.passwordChangedAt.getTime() / 1000}`, 10);
            if (passChangedAtTimeStamp > decoded.iat) {
                throw new appError_1.default("password is changed please login again", 401);
            }
        }
        req.user = user; // for letting user to use protected routes
        next();
    }
    catch (err) {
        if (err.message === "jwt expired") {
            // from access expiration
            // token rotation
            const accessToken = (0, jwt_1.createAccessToken)(user === null || user === void 0 ? void 0 : user.id);
            const refreshToken = (0, jwt_1.createRefreshToken)(user === null || user === void 0 ? void 0 : user.email);
            const newRefreshTokens = user.refreshTokens;
            const refreshTokenList = [];
            for (const rt of newRefreshTokens) {
                if (rt !== req.cookies.refreshToken)
                    refreshTokenList.push(rt);
            }
            user.refreshTokens = [...refreshTokenList, refreshToken];
            yield user.save();
            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: true,
                maxAge: 10 * 24 * 60 * 60 * 1000,
            });
            res.cookie("accessToken", accessToken, {
                httpOnly: true,
                secure: true,
                maxAge: 10 * 24 * 60 * 60 * 1000,
            });
            req.user = user;
            next();
        }
        else {
            let customError = new appError_1.default(//any error is caught except 'jwt expired' it will display the same message in order to prevent attacker from knowing any thing about the error
            "you are not logged in, please login to access this route", 401);
            customError.stack = err.stack; //to know from where the error is occurred
            return next(customError);
        }
    }
}));
const refreshTokenHandler = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let refreshToken;
        if (req.cookies.refreshToken) {
            refreshToken = req.cookies.refreshToken;
        }
        else {
            throw new appError_1.default("there is no refresh token", 403);
        }
        const foundUser = yield userModel_1.default.findOne({ refreshTokens: refreshToken });
        // detect reuse of refreshToken
        if (!foundUser) {
            const decoded = yield (0, jwt_1.verifyTokenAsync)(refreshToken, "refresh");
            const hackedUser = yield userModel_1.default.findOne({
                email: decoded.email,
            });
            if (hackedUser) {
                //signout all users
                hackedUser.refreshTokens = [];
                yield hackedUser.save();
            }
            throw new appError_1.default("reuse detection", 403);
        }
        const decoded = yield (0, jwt_1.verifyTokenAsync)(refreshToken, "refresh");
        return [decoded.email, foundUser];
    }
    catch (err) {
        if (err.message === "jwt expired") {
            throw new appError_1.default("Expired refresh token", 403);
        }
        else if (err.message === "invalid signature") {
            throw new appError_1.default("Invalid refresh token", 403);
        }
        else
            throw err;
    }
});
const createTokensForLoggedInUser = (user, req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const accessToken = (0, jwt_1.createAccessToken)(user.id);
    const refreshToken = (0, jwt_1.createRefreshToken)(user.email);
    //try to login and he already logged in
    const cookies = req.cookies;
    let newRefreshTokens = !(cookies === null || cookies === void 0 ? void 0 : cookies.refreshToken)
        ? user.refreshTokens
        : user.refreshTokens.filter((rt) => rt !== cookies.refreshToken);
    user.refreshTokens = [...newRefreshTokens, refreshToken];
    yield user.save();
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        maxAge: 10 * 24 * 60 * 60 * 1000,
    });
    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: true,
        maxAge: 10 * 24 * 60 * 60 * 1000,
    });
    user.refreshTokens = [];
    return [accessToken, refreshToken, user];
});
