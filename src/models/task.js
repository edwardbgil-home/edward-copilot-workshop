import { randomUUID } from 'node:crypto';
import {
  validateIsoTimestamp,
  validateTaskCreateInput,
  validateTaskUpdateInput
} from '../utils/validators.js';

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
      priority: data.priority
    };

    const normalized = validateTaskCreateInput(createLikeInput);

    validateIsoTimestamp(data.createdAt, 'createdAt');
    validateIsoTimestamp(data.updatedAt, 'updatedAt');

    this.id = data.id;
    this.title = normalized.title;
    this.description = normalized.description;
    this.status = normalized.status;
    this.priority = normalized.priority;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  /**
   * Creates a new Task instance from user input.
   * @param {unknown} input The create payload.
   * @returns {Task} A new validated task.
   */
  static create(input) {
    const payload = validateTaskCreateInput(input);
    const timestamp = new Date().toISOString();

    return new Task({
      id: randomUUID(),
      title: payload.title,
      description: payload.description,
      status: payload.status,
      priority: payload.priority,
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
    const updates = validateTaskUpdateInput(input);

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

    this.updatedAt = new Date().toISOString();

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
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}
