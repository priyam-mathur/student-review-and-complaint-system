import Joi from 'joi';

export const sendMessageSchema = {
  body: Joi.object({
    complaint: Joi.string().hex().length(24).required()
      .messages({ 'any.required': 'Complaint ID is required' }),
    receiver: Joi.string().hex().length(24).required()
      .messages({ 'any.required': 'Receiver ID is required' }),
    content: Joi.string().trim().min(1).max(2000).required()
      .messages({ 'any.required': 'Message content is required' }),
  }),
};

export const listMessagesSchema = {
  query: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
  }),
};
