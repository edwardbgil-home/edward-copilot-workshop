import { randomUUID } from 'node:crypto';
import { validateCreateInput, validateUpdateInput } from '../validation/task-validation.js';
import { now } from '../utils/time.js';

/**
 * Validates a timestamp is parseable ISO 8601.
 * @param {unknown} timestamp Timestamp candidate.
 * @param {string} fieldName Field label for error messages.
 */
function validateIsoTimestamp(timestamp, fieldName) {
  if (typeof timestamp !== 'string' || Number.isNaN(Date.parse(timestamp))) {
    throw new Error(`${fieldName} must be a valid ISO 8601 timestamp`);
  }
}

/**
 * Represents a task entity and enforces validation rules.
 */
export class Task {
  /**
   * Creates a validated Task instance from persisted task fields.
   * @param {{
   * id: string,
   * title: string,
   * description: string,
   * status: string,
   * priority: string,
  * category: string,
   * createdAt: string,
   * updatedAt: string
   * }} data Full task payload.
   */
  constructor(data) {
    if (typeof data.id !== 'string' || data.id.length === 0) {
      throw new Error('id is required and must be a non-empty string');
    }

    const createLikeInput = {
      title: data.title,
      description: data.description,
      status: data.status,
      priority: data.priority,
      category: data.category
    };

    const normalized = validateCreateInput(createLikeInput);

    validateIsoTimestamp(data.createdAt, 'createdAt');
    validateIsoTimestamp(data.updatedAt, 'updatedAt');

    this.id = data.id;
    this.title = normalized.title;
    this.description = normalized.description;
    this.status = normalized.status;
    this.priority = normalized.priority;
    this.category = normalized.category;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  /**
   * Creates a new Task instance from user input.
   * @param {unknown} input The create payload.
   * @returns {Task} A new validated task.
   */
  static create(input) {
    const payload = validateCreateInput(input);
    const timestamp = now();

    return new Task({
      id: randomUUID(),
      title: payload.title,
      description: payload.description,
      status: payload.status,
      priority: payload.priority,
      category: payload.category,
      createdAt: timestamp,
      updatedAt: timestamp
    });
  }

  /**
   * Applies a validated partial update to the task.
   * @param {unknown} input The update payload.
   * @returns {Task} The current task instance.
   */
  update(input) {
    const updates = validateUpdateInput(input);

    if (updates.title !== undefined) {
      this.title = updates.title;
    }

    if (updates.description !== undefined) {
      this.description = updates.description;
    }

    if (updates.status !== undefined) {
      this.status = updates.status;
    }

    if (updates.priority !== undefined) {
      this.priority = updates.priority;
    }

    if (updates.category !== undefined) {
      this.category = updates.category;
    }

    this.updatedAt = now();

    return this;
  }

  /**
   * Converts the Task instance to a plain object.
   * @returns {{
   * id: string,
   * title: string,
   * description: string,
   * status: string,
   * priority: string,
  * category: string,
   * createdAt: string,
   * updatedAt: string
   * }} Plain task object.
   */
  toJSON() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      status: this.status,
      priority: this.priority,
      category: this.category,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

/**
 * Creates a task object from user input.
 * @param {unknown} input Create payload.
 * @returns {{
 * id: string,
 * title: string,
 * description: string,
 * status: string,
 * priority: string,
 * category: string,
 * createdAt: string,
 * updatedAt: string
 * }} New task object.
 */
export function createTask(input) {
  return Task.create(input).toJSON();
}
