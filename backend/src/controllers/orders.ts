import { Request, Response, NextFunction } from 'express';
import { faker } from '@faker-js/faker';

import ServerError from '../errors/server-error';

const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  const { total } = req.body;

  try {
    return res.status(200).send({
      id: faker.string.uuid(),
      total,
    });
  } catch (err) {
    return next(new ServerError('Произошла ошибка'));
  }
};

export default createOrder;
