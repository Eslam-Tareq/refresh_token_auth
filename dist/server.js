"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app_1 = __importDefault(require("./app"));
const databaseconnection_1 = __importDefault(require("./config/databaseconnection"));
// database connection
const port = process.env.PORT || 3000;
(0, databaseconnection_1.default)();
app_1.default.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
