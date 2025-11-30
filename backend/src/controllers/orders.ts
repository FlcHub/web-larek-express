import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import Joi from 'joi';
import { faker } from '@faker-js/faker';

import Product from '../models/product';
import BadRequestError from '../errors/bad-request-error';
import ServerError from '../errors/server-error';

const { ObjectId } = mongoose.Types;

// схема валидации
const oderSchema = Joi.object({
  payment: Joi.string().valid('card', 'online').required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
  address: Joi.string().required(),
  total: Joi.number().integer().required(),
  items: Joi.array().items(Joi.string().required()).min(1).required(),
});

export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  const { error, value } = oderSchema.validate(req.body);

  if (error) {
    return next(new BadRequestError(
      error.details.map((item) => item.message).join(';'),
    ));
  }

  try {
    const products = await Product.find({
      _id: { $in: value.items.map((id: string) => new ObjectId(id)) },
    });

    if (products.length !== value.items.length) {
      return next(new BadRequestError('Один или несколько товаров не найдены!'));
    }

    for (let i = 0; i < products.length; i += 1) {
      if (!products[i].price) {
        return next(new BadRequestError(`Товар ${products[i].title} не продаётся!`));
      }
    }

    const totalPriceFromDB = products.reduce((sum, el) => sum + (el.price || 0), 0);
    if (totalPriceFromDB !== value.total) {
      return next(new BadRequestError('Общая цена товаров указана неверно!'));
    }

    return res.status(201).send({
      id: faker.string.uuid(),
      total: totalPriceFromDB,
    });
  } catch (err) {
    return next(new ServerError('Произошла ошибка'));
  }
};
