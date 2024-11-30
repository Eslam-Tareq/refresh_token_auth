import { NextFunction, Request, Response } from 'express';
import AppError from '../utils/appError';

const devError = (err: AppError, res: Response) => {
    res.status(err.statusCode!).json({
        status: err.status,
        name: err.name,
        message: err.message,
        details: err.stack,
    });
};
const sendValidationError = (err: AppError, res: Response) => {
    res.status(err.statusCode!).json({
        status: err.status,
        name: err.name,
        message: err.message,
        details: err.validatorErrors,
    });
};
const sendErrorProduction = (err: AppError, res: Response) => {
    res.status(err.statusCode!).json({
        status: err.status,
        name: err.name,
        message: err.message,
    });
};
export const globalErrorHandler = (
    err: AppError,
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    err.statusCode = err.statusCode || 500;
    if (err.message === 'validationErrors') {
        sendValidationError(err, res);
    } else if (process.env.NODE_ENV === 'development') {
        devError(err, res);
    } else {
        sendErrorProduction(err, res);
    }
};
