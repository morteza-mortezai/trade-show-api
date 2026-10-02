import Joi from 'joi';

export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  PORT: Joi.number().integer().min(1).max(65535).default(4000),
  API_PREFIX: Joi.string().default('api'),
  DB_HOST: Joi.string().default('localhost'),
  DB_NAME: Joi.string().default('expense-sharing.db'),
}).unknown(true);
