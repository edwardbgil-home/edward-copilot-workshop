import { Task } from '../models/task.js';
import { TASK_PRIORITIES, validateCategory, validateListOptions, validateTaskId } from '../utils/validators.js';

/** @type {Task[]} */
const tasks = [];

const priorityRank = TASK_PRIORITIES.reduce((accumulator, priority, index) => {
  accumulator[priority] = index;
  return accumulator;
}, {});

/**
 * Creates and stores a new task.
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
export function createTask(input) {
  const task = Task.create(input);
  tasks.push(task);
  return task.toJSON();
}

/**
 * Lists tasks with optional filtering and sorting.
 * @param {unknown} options Filter and sort options.
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
export function listTasks(options) {
  const { filterStatus, filterPriority, filterCategory, sortBy, sortOrder } = validateListOptions(options);

  const filteredTasks = tasks.filter((task) => {
    if (filterStatus && task.status !== filterStatus) {
      return false;
    }

    if (filterPriority && task.priority !== filterPriority) {
      return false;
    }

    if (filterCategory && task.category !== filterCategory) {
      return false;
    }

    return true;
  });

  const sortedTasks = [...filteredTasks].sort((leftTask, rightTask) => {
    if (sortBy === 'priority') {
      const leftRank = priorityRank[leftTask.priority];
      const rightRank = priorityRank[rightTask.priority];
      return sortOrder === 'asc' ? leftRank - rightRank : rightRank - leftRank;
    }

    const leftTime = Date.parse(leftTask.createdAt);
    const rightTime = Date.parse(rightTask.createdAt);
    return sortOrder === 'asc' ? leftTime - rightTime : rightTime - leftTime;
  });

  return sortedTasks.map((task) => task.toJSON());
}

/**
 * Lists all tasks that belong to a specific category.
 * @param {unknown} category Category name.
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
export function filterTasksByCategory(category) {
  const normalizedCategory = validateCategory(category, true);

  return tasks
    .filter((task) => task.category === normalizedCategory)
    .map((task) => task.toJSON());
}

/**
 * Lists unique task categories.
 * @returns {string[]} Unique category names sorted alphabetically.
 */
export function listCategories() {
  const categories = tasks.map((task) => task.category);
  return [...new Set(categories)].sort((leftCategory, rightCategory) => leftCategory.localeCompare(rightCategory));
}

/**
 * Gets a single task by id.
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
export function getTask(id) {
  validateTaskId(id);

  const task = tasks.find((currentTask) => currentTask.id === id);

  if (!task) {
    throw new Error(`Task not found: ${id}`);
  }

  return task.toJSON();
}

/**
 * Updates an existing task.
 * @param {unknown} id Task id.
 * @param {unknown} input Task update input.
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
export function updateTask(id, input) {
  validateTaskId(id);

  const task = tasks.find((currentTask) => currentTask.id === id);

  if (!task) {
    throw new Error(`Task not found: ${id}`);
  }

  task.update(input);
  return task.toJSON();
}

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
export function deleteTask(id) {
  validateTaskId(id);

  const taskIndex = tasks.findIndex((currentTask) => currentTask.id === id);

  if (taskIndex === -1) {
    throw new Error(`Task not found: ${id}`);
  }

  const [deletedTask] = tasks.splice(taskIndex, 1);
  return deletedTask.toJSON();
}
