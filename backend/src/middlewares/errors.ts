import { Request, Response } from 'express';

interface ErrorWithCode extends Error {
  statusCode: number;
}

const errorHandler = (
  err: ErrorWithCode,
  req: Request,
  res: Response,
) => res.status(err.statusCode).send({
  error: {
    message: err.message,
  },
});
export default errorHandler;
