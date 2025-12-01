import winston from 'winston';
import expressWinston from 'express-winston';
import { Request, Response, NextFunction } from 'express';
import { ErrorWithCode } from './errors';

// логгер запросов
const requestLogger = expressWinston.logger({
  transports: [
    new winston.transports.File({ filename: './logs/request.log' }),
  ],
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    winston.format.json(),
  ),
});

// логгер ошибок
const errorLogger = expressWinston.errorLogger({
  transports: [
    new winston.transports.File({ filename: './logs/error.log' }),
  ],
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    winston.format.json(),
  ),
});

export const logRequest = (
  req: Request,
  res: Response,
  next: NextFunction,
) => requestLogger(req, res, next);

export const logError = (
  err: ErrorWithCode,
  req: Request,
  res: Response,
  next: NextFunction,
) => errorLogger(err, req, res, next);
