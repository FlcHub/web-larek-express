import { Joi } from 'celebrate';
import { model, Schema } from 'mongoose';

interface IImage {
  fileName: string;
  originalName: string;
}

interface IProduct {
  title: string;
  image: IImage;
  category: string;
  description: string;
  price: number | null;
}

export const imageSchemaValidation = Joi.object({
  fileName: Joi.string().required().messages({
    'any.required': 'Поле "fileName" должно быть заполнено',
  }),
  originalName: Joi.string().required().messages({
    'any.required': 'Поле "originalName" должно быть заполнено',
  }),
});

export const productSchemaValidation = Joi.object({
  title: Joi.string()
    .required()
    .min(2)
    .max(30)
    .messages({
      'any.required': 'Поле "title" должно быть заполнено',
      'string.min': 'Минимальная длина поля "title": 2',
      'string.max': 'Максимальная длина поля "title": 30',
    }),
  image: imageSchemaValidation.required().messages({
    'any.required': 'Поле "image" должно быть заполнено',
  }),
  category: Joi.string().required().messages({
    'any.required': 'Поле "category" должно быть заполнено',
  }),
  description: Joi.string(),
  price: Joi.number().min(0).messages({
    'number.min': 'Минимальное значение поля "price": 0',
  }),
});

const imageSchema = new Schema<IImage>({
  fileName: { type: String, required: [true, 'Поле "fileName" должно быть заполнено'] },
  originalName: { type: String, required: [true, 'Поле "originalName" должно быть заполнено'] },
});

const productSchema = new Schema<IProduct>({
  title: {
    type: String,
    required: [true, 'Поле "title" должно быть заполнено'],
    unique: true,
    validate: {
      validator(v: string) {
        return (v.length >= 2) && (v.length <= 30);
      },
      message: 'Длина поля "title" должна быть от 2 до 30 символов',
    },
  },
  image: {
    type: imageSchema,
    required: [true, 'Поле "image" должно быть заполнено'],
  },
  category: {
    type: String,
    required: [true, 'Поле "category" должно быть заполнено'],
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
    validate: {
      validator(v: number | null) {
        return (v === null) || (v >= 0);
      },
      message: 'Минимальное значение поля "price": 0',
    },
  },
});

export default model<IProduct>('product', productSchema);
