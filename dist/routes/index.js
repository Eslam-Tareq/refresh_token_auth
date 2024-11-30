"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const authRoutes_1 = __importDefault(require("./authRoutes"));
const mountRoutes = (app) => {
    const prefixUrl = '/api/v1';
    app.use(prefixUrl + '/auth', authRoutes_1.default);
};
exports.default = mountRoutes;
