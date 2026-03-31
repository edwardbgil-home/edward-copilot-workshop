import { PRIORITIES, STATUSES } from '../constants/enums.js';

/**
 * Ensures a value is a plain object.
 * @param {unknown} value Value to validate.
 * @param {string} contextName Context label for errors.
 * @returns {Record<string, unknown>} Validated object.
 */
function ensureObject(value, contextName) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error(`${contextName} must be an object`);
  }

  return /** @type {Record<string, unknown>} */ (value);
}

/**
 * Validates title values.
 * @param {unknown} title Title input.
 * @param {boolean} required Whether the field is required.
 * @returns {string|undefined} Normalized title when provided.
 */
function validateTitle(title, required) {
  if (title === undefined && !required) {
    return undefined;
  }

  if (typeof title !== 'string' || title.trim().length === 0) {
    throw new Error('title is required and must be a non-empty string');
  }

  return title.trim();
}

/**
 * Validates description values.
 * @param {unknown} description Description input.
 * @param {boolean} required Whether the field is required.
 * @returns {string|undefined} Description when provided.
 */
function validateDescription(description, required) {
  if (description === undefined && !required) {
    return undefined;
  }

  if (typeof description !== 'string') {
    throw new Error('description must be a string');
  }

  return description;
}

/**
 * Validates status values.
 * @param {unknown} status Status input.
 * @param {boolean} required Whether the field is required.
 * @returns {string|undefined} Status when provided.
 */
function validateStatus(status, required) {
  if (status === undefined && !required) {
    return undefined;
  }

  if (typeof status !== 'string' || !STATUSES.includes(status)) {
    throw new Error(`status must be one of: ${STATUSES.join(', ')}`);
  }

  return status;
}

/**
 * Validates priority values.
 * @param {unknown} priority Priority input.
 * @param {boolean} required Whether the field is required.
 * @returns {string|undefined} Priority when provided.
 */
function validatePriority(priority, required) {
  if (priority === undefined && !required) {
    return undefined;
  }

  if (typeof priority !== 'string' || !PRIORITIES.includes(priority)) {
    throw new Error(`priority must be one of: ${PRIORITIES.join(', ')}`);
  }

  return priority;
}

/**
 * Validates category values.
 * @param {unknown} category Category input.
 * @param {boolean} required Whether the field is required.
 * @returns {string|undefined} Category when provided.
 */
function validateCategory(category, required) {
  if (category === undefined && !required) {
    return undefined;
  }

  if (typeof category !== 'string' || category.trim().length === 0) {
    throw new Error('category must be a non-empty string');
  }

  return category.trim();
}

/**
 * Rejects read-only fields from input payloads.
 * @param {Record<string, unknown>} payload Input object.
 */
function validateReadonlyFields(payload) {
  const readonlyFields = ['id', 'createdAt', 'updatedAt'];
  for (const field of readonlyFields) {
    if (field in payload) {
      throw new Error(`${field} is read-only and cannot be provided`);
    }
  }
}

/**
 * Validates task creation payloads.
 * @param {unknown} input Raw creation payload.
 * @returns {{ title: string, description: string, status: string, priority: string, category: string }} Sanitized payload.
 */
export function validateCreateInput(input) {
  const payload = ensureObject(input, 'Task create input');
  validateReadonlyFields(payload);

  const title = validateTitle(payload.title, true);
  const description = validateDescription(payload.description, false) ?? '';
  const status = validateStatus(payload.status, false) ?? 'todo';
  const priority = validatePriority(payload.priority, false) ?? 'medium';
  const category = validateCategory(payload.category, false) ?? 'general';

  return { title, description, status, priority, category };
}

/**
 * Validates task update payloads.
 * @param {unknown} input Raw update payload.
 * @returns {{ title?: string, description?: string, status?: string, priority?: string, category?: string }} Sanitized update payload.
 */
export function validateUpdateInput(input) {
  const payload = ensureObject(input, 'Task update input');
  validateReadonlyFields(payload);

  const allowedFields = ['title', 'description', 'status', 'priority', 'category'];
  const providedFields = Object.keys(payload).filter((field) => allowedFields.includes(field));

  if (providedFields.length === 0) {
    throw new Error('update input must include at least one field');
  }

  /** @type {{ title?: string, description?: string, status?: string, priority?: string, category?: string }} */
  const updates = {};

  if ('title' in payload) {
    updates.title = validateTitle(payload.title, true);
  }

  if ('description' in payload) {
    updates.description = validateDescription(payload.description, true);
  }

  if ('status' in payload) {
    updates.status = validateStatus(payload.status, true);
  }

  if ('priority' in payload) {
    updates.priority = validatePriority(payload.priority, true);
  }

  if ('category' in payload) {
    updates.category = validateCategory(payload.category, true);
  }

  return updates;
}

/**
 * Validates list/filter/sort options.
 * @param {unknown} options Raw list options.
 * @returns {{ filterStatus?: string, filterPriority?: string, filterCategory?: string, sortBy: string, sortOrder: string }} Sanitized options.
 */
export function validateListOptions(options) {
  if (options === undefined) {
    return { sortBy: 'createdAt', sortOrder: 'asc' };
  }

  const payload = ensureObject(options, 'List options');

  const filterStatus = validateStatus(payload.filterStatus, false);
  const filterPriority = validatePriority(payload.filterPriority, false);
  const filterCategory = validateCategory(payload.filterCategory, false);

  let sortBy = 'createdAt';
  if (payload.sortBy !== undefined) {
    if (typeof payload.sortBy !== 'string' || (payload.sortBy !== 'priority' && payload.sortBy !== 'createdAt')) {
      throw new Error('sortBy must be one of: priority, createdAt');
    }

    sortBy = payload.sortBy;
  }

  let sortOrder = 'asc';
  if (payload.sortOrder !== undefined) {
    if (typeof payload.sortOrder !== 'string' || (payload.sortOrder !== 'asc' && payload.sortOrder !== 'desc')) {
      throw new Error('sortOrder must be one of: asc, desc');
    }

    sortOrder = payload.sortOrder;
  }

  return { filterStatus, filterPriority, filterCategory, sortBy, sortOrder };
}
