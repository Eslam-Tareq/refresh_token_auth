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
exports.verifyTokenAsync = exports.createRefreshToken = exports.createAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const createAccessToken = (payload) => {
    return jsonwebtoken_1.default.sign({ userId: payload }, process.env.JWT_ACCESS_TOKEN_SECRET, {
        expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN,
    });
};
exports.createAccessToken = createAccessToken;
const createRefreshToken = (payload) => {
    return jsonwebtoken_1.default.sign({ email: payload }, process.env.JWT_REFRESH_TOKEN_SECRET, {
        expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN,
    });
};
exports.createRefreshToken = createRefreshToken;
const verifyTokenAsync = (token, tokenType) => __awaiter(void 0, void 0, void 0, function* () {
    const secret = tokenType == "access"
        ? process.env.JWT_ACCESS_TOKEN_SECRET
        : process.env.JWT_REFRESH_TOKEN_SECRET;
    return yield new Promise((resolve, reject) => {
        jsonwebtoken_1.default.verify(token, secret, (err, decoded) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(decoded);
            }
        });
    });
});
exports.verifyTokenAsync = verifyTokenAsync;
