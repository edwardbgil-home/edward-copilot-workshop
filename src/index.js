import {
  createTask,
  deleteTask,
  filterTasksByCategory,
  getTask,
  listCategories,
  listTasks,
  updateTask
} from './services/taskService.js';
import { colorizeStatus, colorizePriority } from './utils/colors.js';

/**
 * Returns a copy of a task with status and priority replaced by colorized strings.
 * @param {object} task The task object to format.
 * @returns {object} A shallow copy of the task with colorized status and priority.
 */
function formatTask(task) {
  return {
    ...task,
    status: colorizeStatus(task.status),
    priority: colorizePriority(task.priority),
  };
}

/**
 * Logs a section header and value for demo readability.
 * Task objects and arrays of task objects are printed with colorized status and priority.
 * @param {string} title Section title.
 * @param {unknown} value Value to print.
 */
function printSection(title, value) {
  console.log(`\n=== ${title} ===`);
  if (Array.isArray(value)) {
    value.forEach(task => console.log(formatTask(task)));
  } else if (value && typeof value === 'object' && 'status' in value && 'priority' in value) {
    console.log(formatTask(value));
  } else {
    console.log(value);
  }
}

/**
 * Runs a full demo of Task Manager features.
 */
function runDemo() {
  const firstTask = createTask({
    title: 'Write workshop docs',
    description: 'Draft the README and exercise guidance',
    status: 'todo',
    priority: 'high',
    category: 'work'
  });

  const secondTask = createTask({
    title: 'Review project plan',
    description: 'Confirm milestones with stakeholders',
    status: 'in-progress',
    priority: 'medium',
    category: 'work'
  });

  const thirdTask = createTask({
    title: 'Archive old notes',
    description: '',
    status: 'done',
    priority: 'low',
    category: 'personal'
  });

  printSection('Create tasks', [firstTask, secondTask, thirdTask]);
  printSection('List all tasks', listTasks());
  printSection('Filter by status: todo', listTasks({ filterStatus: 'todo' }));
  printSection('Filter by priority: high', listTasks({ filterPriority: 'high' }));
  printSection('Filter by category: work', filterTasksByCategory('work'));
  printSection('List categories', listCategories());
  printSection('Sort by priority asc', listTasks({ sortBy: 'priority', sortOrder: 'asc' }));
  printSection('Sort by creation date desc', listTasks({ sortBy: 'createdAt', sortOrder: 'desc' }));

  const updatedTask = updateTask(firstTask.id, {
    status: 'in-progress',
    priority: 'medium',
    title: 'Write and review workshop docs'
  });
  printSection('Update task', updatedTask);

  const loadedTask = getTask(secondTask.id);
  printSection('Get task by id', loadedTask);

  const removedTask = deleteTask(thirdTask.id);
  printSection('Delete task', removedTask);

  printSection('Final task list', listTasks());
}

try {
  runDemo();
} catch (error) {
  const message = error instanceof Error ? error.message : 'Unknown error';
  console.error(`Task Manager demo failed: ${message}`);
  process.exitCode = 1;
}
