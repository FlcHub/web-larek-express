import { Request, Response, NextFunction } from 'express';

import Product from '../models/product';
import ServerError from '../errors/server-error';
import ConflictError from '../errors/conflict-error';

export const getProducts = (_req: Request, res: Response, next: NextFunction) => Product.find({})
  .then((products) => res.send({
    items: products.map((el) => ({
      _id: el._id,
      title: el.title,
      category: el.category,
      description: el.description,
      price: el.price,
      image: { fileName: el.image.fileName, originalName: el.image.originalName },
    })),
    total: products.length,
  }))
  .catch(() => next(new ServerError('Произошла ошибка')));

export const createProduct = (req: Request, res: Response, next: NextFunction) => {
  const {
    title, image, category, description, price,
  } = req.body;

  return Product.create({
    title,
    image,
    category,
    description,
    price,
  })
    .then((product) => {
      const {
        _id,
        title: titleDb, // чтобы успокоить линтер
        image: imageDb,
        category: categoryDb,
        description: descriptionDb,
        price: priceDb,
      } = product;
      res.status(201).send({
        _id,
        title: titleDb,
        image: imageDb,
        category: categoryDb,
        description: descriptionDb,
        price: priceDb,
      });
    })
    .catch((err) => {
      if (err instanceof Error && err.message.includes('E11000')) {
        return next(new ConflictError(err.message));
      }
      return next(new ServerError(err.message));
    });
};
