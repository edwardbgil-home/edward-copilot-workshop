/**
 * Formats a single task for terminal display.
 * @param {{ id: string, title: string, description: string, status: string, priority: string, category: string }} task Task value.
 * @returns {string} Single-line formatted task text.
 */
export function formatTask(task) {
  return `[${task.status}] (${task.priority}) ${task.title} - ${task.category} (#${task.id})`;
}

/**
 * Formats a list of tasks for terminal display.
 * @param {Array<{ id: string, title: string, description: string, status: string, priority: string, category: string }>} tasks Task list.
 * @returns {string} Multi-line list output.
 */
export function formatTaskList(tasks) {
  if (tasks.length === 0) {
    return 'No tasks found.';
  }

  return tasks.map((task) => formatTask(task)).join('\n');
}
