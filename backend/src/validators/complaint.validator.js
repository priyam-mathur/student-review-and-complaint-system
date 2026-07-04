import Joi from 'joi';
import { COMPLAINT_STATUSES, PRIORITIES } from '../models/Complaint.model.js';

export const createComplaintSchema = {
  body: Joi.object({
    subject: Joi.string().trim().min(5).max(200).required()
      .messages({ 'any.required': 'Subject is required', 'string.min': 'Subject must be at least 5 characters' }),
    description: Joi.string().trim().min(10).max(5000).required()
      .messages({ 'any.required': 'Description is required', 'string.min': 'Description must be at least 10 characters' }),
    category: Joi.string().hex().length(24).allow('', null),
    department: Joi.string().hex().length(24).allow('', null),
    priority: Joi.string().valid(...PRIORITIES).default('medium'),
    isAnonymous: Joi.boolean().default(false),
    expectedResolution: Joi.date().iso().allow(null),
    status: Joi.string().valid('draft', 'submitted').default('submitted'),
  }),
};

export const updateComplaintSchema = {
  body: Joi.object({
    subject: Joi.string().trim().min(5).max(200),
    description: Joi.string().trim().min(10).max(5000),
    category: Joi.string().hex().length(24).allow('', null),
    department: Joi.string().hex().length(24).allow('', null),
    priority: Joi.string().valid(...PRIORITIES),
    isAnonymous: Joi.boolean(),
    expectedResolution: Joi.date().iso().allow(null),
  }),
};

export const updateStatusSchema = {
  body: Joi.object({
    status: Joi.string().valid(...COMPLAINT_STATUSES).required()
      .messages({ 'any.required': 'Status is required' }),
    note: Joi.string().trim().max(500).allow(''),
    resolutionNote: Joi.string().trim().max(2000).allow(''),
  }),
};

export const assignComplaintSchema = {
  body: Joi.object({
    assignedTo: Joi.string().hex().length(24).required()
      .messages({ 'any.required': 'Admin ID is required for assignment' }),
    note: Joi.string().trim().max(500).allow(''),
  }),
};

export const addNoteSchema = {
  body: Joi.object({
    note: Joi.string().trim().min(1).max(2000).required()
      .messages({ 'any.required': 'Note content is required' }),
  }),
};

export const listComplaintsSchema = {
  query: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    status: Joi.string().valid(...COMPLAINT_STATUSES),
    priority: Joi.string().valid(...PRIORITIES),
    department: Joi.string().hex().length(24),
    category: Joi.string().hex().length(24),
    assignedTo: Joi.string().hex().length(24),
    search: Joi.string().trim().max(200),
    sortBy: Joi.string().valid('createdAt', 'updatedAt', 'priority', 'status').default('createdAt'),
    sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
    dateFrom: Joi.date().iso(),
    dateTo: Joi.date().iso(),
  }),
};
