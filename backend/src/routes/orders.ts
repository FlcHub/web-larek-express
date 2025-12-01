import { Router } from 'express';
import { celebrate, Segments } from 'celebrate';
import createOrder from '../controllers/orders';
import { validateOrder, oderSchema } from '../middlewares/validators';

const router = Router();
router.post(
  '/',
  celebrate({
    [Segments.BODY]: oderSchema,
  }),
  validateOrder,
  createOrder,
);

export default router;
