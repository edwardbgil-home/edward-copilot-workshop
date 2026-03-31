import {
  createTask,
  deleteTask,
  filterTasksByCategory,
  getTask,
  listCategories,
  listTasks,
  updateTask
} from './taskService.js';

/**
 * Adds a new task to the store.
 * @param {unknown} input Task creation input.
 * @returns {{
 * id: string,
 * title: string,
 * description: string,
 * status: string,
 * priority: string,
 * category: string,
 * createdAt: string,
 * updatedAt: string
 * }} Created task.
 */
export function addTask(input) {
  return createTask(input);
}

/**
 * Gets a task by id.
 * @param {unknown} id Task id.
 * @returns {{
 * id: string,
 * title: string,
 * description: string,
 * status: string,
 * priority: string,
 * category: string,
 * createdAt: string,
 * updatedAt: string
 * }} Matching task.
 */
export { getTask };

/**
 * Lists tasks with optional filtering and sorting.
 * @param {unknown} options List options.
 * @returns {Array<{
 * id: string,
 * title: string,
 * description: string,
 * status: string,
 * priority: string,
 * category: string,
 * createdAt: string,
 * updatedAt: string
 * }>} Matching tasks.
 */
export { listTasks };

/**
 * Filters tasks by category.
 * @param {unknown} category Category to match.
 * @returns {Array<{
 * id: string,
 * title: string,
 * description: string,
 * status: string,
 * priority: string,
 * category: string,
 * createdAt: string,
 * updatedAt: string
 * }>} Matching tasks.
 */
export { filterTasksByCategory };

/**
 * Lists unique category values.
 * @returns {string[]} Sorted categories.
 */
export { listCategories };

/**
 * Updates a task by id.
 * @param {unknown} id Task id.
 * @param {unknown} input Update payload.
 * @returns {{
 * id: string,
 * title: string,
 * description: string,
 * status: string,
 * priority: string,
 * category: string,
 * createdAt: string,
 * updatedAt: string
 * }} Updated task.
 */
export { updateTask };

/**
 * Deletes a task by id.
 * @param {unknown} id Task id.
 * @returns {{
 * id: string,
 * title: string,
 * description: string,
 * status: string,
 * priority: string,
 * category: string,
 * createdAt: string,
 * updatedAt: string
 * }} Deleted task.
 */
export { deleteTask };
