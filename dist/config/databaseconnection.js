"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
function databaseConnect() {
    const dbConnectionString = process.env.DATABASE_URL.replace("<db_password>", process.env.DATABASE_PASSWORD);
    mongoose_1.default
        .connect(dbConnectionString)
        .then((c) => {
        console.log(`Database connected successfully on ${c.connection.host}`);
    })
        .catch((e) => {
        console.log(`Database connection failed`);
    });
}
exports.default = databaseConnect;
