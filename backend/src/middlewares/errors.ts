import { CelebrateError } from 'celebrate';
import { Request, Response, NextFunction } from 'express';

export interface ErrorWithCode extends Error {
  statusCode?: number;
  details?: string[];
}

const errorHandler = (
  err: ErrorWithCode,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (err instanceof CelebrateError && err.details) {
    const msg = Array.from(err.details.values())
      .flatMap((e) => e)
      .join('; ');

    return res.status(err.statusCode || 400).send({
      error: {
        message: msg,
      },
    });
  }

  return res.status(err.statusCode || 500).send({
    error: {
      message: err.message,
    },
  });
};

export default errorHandler;
