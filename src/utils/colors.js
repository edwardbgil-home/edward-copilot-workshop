import chalk from 'chalk';

/**
 * Wraps a task status value in the appropriate chalk color.
 * - 'done' → green
 * - 'in-progress' → yellow
 * - 'todo' → red
 * @param {string} status The task status value.
 * @returns {string} The colorized status string.
 */
export function colorizeStatus(status) {
  switch (status) {
    case 'done':
      return chalk.green(status);
    case 'in-progress':
      return chalk.yellow(status);
    case 'todo':
      return chalk.red(status);
    default:
      return status;
  }
}

/**
 * Wraps a task priority value in the appropriate chalk style.
 * - 'high' → bold red
 * - 'medium' → bold yellow
 * - 'low' → dim
 * @param {string} priority The task priority value.
 * @returns {string} The styled priority string.
 */
export function colorizePriority(priority) {
  switch (priority) {
    case 'high':
      return chalk.bold.red(priority);
    case 'medium':
      return chalk.bold.yellow(priority);
    case 'low':
      return chalk.dim(priority);
    default:
      return priority;
  }
}
