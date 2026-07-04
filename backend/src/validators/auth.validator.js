import Joi from 'joi';

export const registerSchema = {
  body: Joi.object({
    name: Joi.string().trim().min(2).max(100).required()
      .messages({ 'any.required': 'Name is required' }),
    email: Joi.string().trim().email().required()
      .messages({ 'any.required': 'Email is required', 'string.email': 'Please provide a valid email' }),
    password: Joi.string().min(6).max(128).required()
      .messages({ 'any.required': 'Password is required', 'string.min': 'Password must be at least 6 characters' }),
    phone: Joi.string().trim().allow(''),
    studentId: Joi.string().trim().allow(''),
    department: Joi.string().hex().length(24).allow('', null),
  }),
};

export const loginSchema = {
  body: Joi.object({
    email: Joi.string().trim().email().required()
      .messages({ 'any.required': 'Email is required' }),
    password: Joi.string().required()
      .messages({ 'any.required': 'Password is required' }),
    rememberMe: Joi.boolean().default(false),
  }),
};

export const forgotPasswordSchema = {
  body: Joi.object({
    email: Joi.string().trim().email().required()
      .messages({ 'any.required': 'Email is required' }),
  }),
};

export const resetPasswordSchema = {
  params: Joi.object({
    token: Joi.string().required(),
  }),
  body: Joi.object({
    password: Joi.string().min(6).max(128).required()
      .messages({ 'string.min': 'Password must be at least 6 characters' }),
  }),
};

export const changePasswordSchema = {
  body: Joi.object({
    currentPassword: Joi.string().required()
      .messages({ 'any.required': 'Current password is required' }),
    newPassword: Joi.string().min(6).max(128).required()
      .messages({ 'string.min': 'New password must be at least 6 characters' }),
  }),
};

export const updateProfileSchema = {
  body: Joi.object({
    name: Joi.string().trim().min(2).max(100),
    phone: Joi.string().trim().allow(''),
    studentId: Joi.string().trim().allow(''),
    department: Joi.string().hex().length(24).allow('', null),
  }),
};
