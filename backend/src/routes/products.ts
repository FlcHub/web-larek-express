import { Router } from 'express';
import { celebrate, Segments } from 'celebrate';
import { getProducts, createProduct } from '../controllers/products';
import { productSchemaValidation } from '../models/product';

const router = Router();
router.get('/', getProducts);
router.post(
  '/',
  celebrate({
    [Segments.BODY]: productSchemaValidation,
  }),
  createProduct,
);

export default router;
