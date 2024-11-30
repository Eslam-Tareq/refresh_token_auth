"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = void 0;
const devError = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        name: err.name,
        message: err.message,
        details: err.stack,
    });
};
const sendValidationError = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        name: err.name,
        message: err.message,
        details: err.validatorErrors,
    });
};
const sendErrorProduction = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        name: err.name,
        message: err.message,
    });
};
const globalErrorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    if (err.message === 'validationErrors') {
        sendValidationError(err, res);
    }
    else if (process.env.NODE_ENV === 'development') {
        devError(err, res);
    }
    else {
        sendErrorProduction(err, res);
    }
};
exports.globalErrorHandler = globalErrorHandler;
