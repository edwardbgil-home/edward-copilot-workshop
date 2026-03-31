/**
 * Allowed task status values.
 * @type {string[]}
 */
export const STATUSES = ['todo', 'in-progress', 'done'];

/**
 * Allowed task priority values.
 * @type {string[]}
 */
export const PRIORITIES = ['low', 'medium', 'high'];

/**
 * Numeric ranking used for priority sorting.
 * @type {Record<string, number>}
 */
export const SORT_PRIORITY_ORDER = {
  low: 0,
  medium: 1,
  high: 2
};
