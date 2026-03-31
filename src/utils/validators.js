const TASK_STATUSES = ['todo', 'in-progress', 'done'];
const TASK_PRIORITIES = ['low', 'medium', 'high'];
const SORT_FIELDS = ['priority', 'createdAt'];
const SORT_ORDERS = ['asc', 'desc'];

/**
 * Checks whether the provided value is a non-empty string after trimming.
 * @param {unknown} value The value to test.
 * @returns {boolean} True when value is a non-empty string.
 */
export function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

/**
 * Ensures a value is a plain object.
 * @param {unknown} value The value to validate.
 * @param {string} contextName The name to include in error messages.
 * @returns {Record<string, unknown>} The validated object.
 */
export function ensureObject(value, contextName) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error(`${contextName} must be an object`);
  }

  return /** @type {Record<string, unknown>} */ (value);
}

/**
 * Validates that a task id is a non-empty string.
 * @param {unknown} id The value to validate.
 */
export function validateTaskId(id) {
  if (!isNonEmptyString(id)) {
    throw new Error('Task id must be a non-empty string');
  }
}

/**
 * Validates title according to task rules.
 * @param {unknown} title The title to validate.
 * @param {boolean} required Whether title is required.
 * @returns {string|undefined} The trimmed title when provided.
 */
export function validateTitle(title, required) {
  if (title === undefined && !required) {
    return undefined;
  }

  if (typeof title !== 'string' || title.trim().length === 0) {
    throw new Error('title is required and must be a non-empty string');
  }

  return title.trim();
}

/**
 * Validates description according to task rules.
 * @param {unknown} description The description to validate.
 * @param {boolean} required Whether description is required.
 * @returns {string|undefined} The description when provided.
 */
export function validateDescription(description, required) {
  if (description === undefined && !required) {
    return undefined;
  }

  if (typeof description !== 'string') {
    throw new Error('description must be a string');
  }

  return description;
}

/**
 * Validates status value.
 * @param {unknown} status The status to validate.
 * @param {boolean} required Whether status is required.
 * @returns {string|undefined} The validated status.
 */
export function validateStatus(status, required) {
  if (status === undefined && !required) {
    return undefined;
  }

  if (typeof status !== 'string' || !TASK_STATUSES.includes(status)) {
    throw new Error(`status must be one of: ${TASK_STATUSES.join(', ')}`);
  }

  return status;
}

/**
 * Validates priority value.
 * @param {unknown} priority The priority to validate.
 * @param {boolean} required Whether priority is required.
 * @returns {string|undefined} The validated priority.
 */
export function validatePriority(priority, required) {
  if (priority === undefined && !required) {
    return undefined;
  }

  if (typeof priority !== 'string' || !TASK_PRIORITIES.includes(priority)) {
    throw new Error(`priority must be one of: ${TASK_PRIORITIES.join(', ')}`);
  }

  return priority;
}

/**
 * Validates a timestamp is a valid ISO 8601 date-time string.
 * @param {unknown} timestamp The timestamp to validate.
 * @param {string} fieldName The field name for error messages.
 */
export function validateIsoTimestamp(timestamp, fieldName) {
  if (typeof timestamp !== 'string' || Number.isNaN(Date.parse(timestamp))) {
    throw new Error(`${fieldName} must be a valid ISO 8601 timestamp`);
  }
}

/**
 * Prevents callers from setting read-only task fields.
 * @param {Record<string, unknown>} input The user input object.
 */
export function validateReadonlyFields(input) {
  const readonlyFields = ['id', 'createdAt', 'updatedAt'];
  for (const field of readonlyFields) {
    if (field in input) {
      throw new Error(`${field} is read-only and cannot be provided`);
    }
  }
}

/**
 * Validates task creation input.
 * @param {unknown} input The input to validate.
 * @returns {{ title: string, description: string, status: string, priority: string }} Sanitized create payload.
 */
export function validateTaskCreateInput(input) {
  const payload = ensureObject(input, 'Task create input');
  validateReadonlyFields(payload);

  const title = validateTitle(payload.title, true);
  const description = validateDescription(payload.description, false) ?? '';
  const status = validateStatus(payload.status, false) ?? 'todo';
  const priority = validatePriority(payload.priority, false) ?? 'medium';

  return { title, description, status, priority };
}

/**
 * Validates task update input.
 * @param {unknown} input The input to validate.
 * @returns {{ title?: string, description?: string, status?: string, priority?: string }} Sanitized update payload.
 */
export function validateTaskUpdateInput(input) {
  const payload = ensureObject(input, 'Task update input');
  validateReadonlyFields(payload);

  const allowedFields = ['title', 'description', 'status', 'priority'];
  const providedFields = Object.keys(payload).filter((key) => allowedFields.includes(key));

  if (providedFields.length === 0) {
    throw new Error('update input must include at least one field');
  }

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

  return updates;
}

/**
 * Validates list/filter/sort options.
 * @param {unknown} options The options to validate.
 * @returns {{ filterStatus?: string, filterPriority?: string, sortBy: string, sortOrder: string }} Sanitized list options.
 */
export function validateListOptions(options) {
  if (options === undefined) {
    return { sortBy: 'createdAt', sortOrder: 'asc' };
  }

  const payload = ensureObject(options, 'List options');

  const filterStatus = validateStatus(payload.filterStatus, false);
  const filterPriority = validatePriority(payload.filterPriority, false);

  let sortBy = 'createdAt';
  if (payload.sortBy !== undefined) {
    if (typeof payload.sortBy !== 'string' || !SORT_FIELDS.includes(payload.sortBy)) {
      throw new Error(`sortBy must be one of: ${SORT_FIELDS.join(', ')}`);
    }

    sortBy = payload.sortBy;
  }

  let sortOrder = 'asc';
  if (payload.sortOrder !== undefined) {
    if (typeof payload.sortOrder !== 'string' || !SORT_ORDERS.includes(payload.sortOrder)) {
      throw new Error(`sortOrder must be one of: ${SORT_ORDERS.join(', ')}`);
    }

    sortOrder = payload.sortOrder;
  }

  return { filterStatus, filterPriority, sortBy, sortOrder };
}

export { TASK_PRIORITIES, TASK_STATUSES };
