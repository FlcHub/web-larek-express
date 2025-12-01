import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { Joi } from 'celebrate';

import Product from '../models/product';
import BadRequestError from '../errors/bad-request-error';
import ServerError from '../errors/server-error';

const { ObjectId } = mongoose.Types;

// схема валидации
export const oderSchema = Joi.object({
  payment: Joi.string()
    .valid('card', 'online')
    .required()
    .messages({
      'any.required': 'Поле "payment" должно быть заполнено',
      'any.only': 'Поле "payment" принимает одно из значений: "card", "online"',
    }),
  email: Joi.string()
    .required()
    .email()
    .messages({
      'any.required': 'Поле "email" должно быть заполнено',
      'string.email': 'В поле "email" должен быть введен адрес электронной почты',
    }),
  phone: Joi.string()
    .required()
    .messages({
      'any.required': 'Поле "phone" должно быть заполнено',
    }),
  address: Joi.string()
    .required()
    .messages({
      'any.required': 'Поле "address" должно быть заполнено',
    }),
  total: Joi.number().integer()
    .required()
    .messages({
      'any.required': 'Поле "total" должно быть заполнено',
    }),
  items: Joi.array()
    .required()
    .items(Joi.string().required())
    .min(1)
    .messages({
      'any.required': 'Поле "items" должно быть заполнено',
      'array.min': 'Список "items" должен состоять хотя бы из одного элемента',
      'array.includesRequiredUnknowns': 'Список "items" не может быть пустым',
    }),
});

export const validateOrder = async (req: Request, _res: Response, next: NextFunction) => {
  const { total, items } = req.body;

  try {
    const products = await Product.find({
      _id: { $in: items.map((id: string) => new ObjectId(id)) },
    });

    if (products.length !== items.length) {
      return next(new BadRequestError('Один или несколько товаров не найдены!'));
    }

    for (let i = 0; i < products.length; i += 1) {
      if (!products[i].price) {
        return next(new BadRequestError(`Товар ${products[i].title} не продаётся!`));
      }
    }

    const totalPriceFromDB = products.reduce((sum, el) => sum + (el.price || 0), 0);
    if (totalPriceFromDB !== total) {
      return next(new BadRequestError('Общая цена товаров указана неверно!'));
    }

    return next();
  } catch (err) {
    return next(new ServerError('Произошла ошибка'));
  }
};
