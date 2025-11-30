import { Request, Response, NextFunction } from 'express';

import Product from '../models/product';
import ServerError from '../errors/server-error';
import ConflictError from '../errors/conflict-error';

export const getProducts = (req: Request, res: Response, next: NextFunction) => Product.find({})
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
      _id, title, image, category, description, price,
    } = product;
    res.status(201).send({
      _id,
      title,
      image,
      category,
      description,
      price,
    });
  })
  .catch((err) => {
    if (err instanceof Error && err.message.includes('E11000')) {
      next(new ConflictError(err.message));
    } else {
      next(new ServerError(err.message));
    }
  });
};
