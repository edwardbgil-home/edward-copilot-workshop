import { addTask, filterTasksByCategory, listCategories, listTasks } from '../services/task-service.js';
import { printHelp } from './help.js';
import { formatTask, formatTaskList } from '../utils/format.js';

/**
 * Runs the CLI command dispatcher.
 */
function run() {
  const [, , command, ...args] = process.argv;

  if (!command || command === 'help') {
    printHelp();
    return;
  }

  if (command === 'add') {
    const [title, description, status, priority, category] = args;
    const task = addTask({ title, description, status, priority, category });
    console.log('Created task:');
    console.log(formatTask(task));
    return;
  }

  if (command === 'list') {
    console.log(formatTaskList(listTasks()));
    return;
  }

  if (command === 'list-categories') {
    const categories = listCategories();
    console.log(categories.length === 0 ? 'No categories found.' : categories.join('\n'));
    return;
  }

  if (command === 'filter-category') {
    const [category] = args;
    console.log(formatTaskList(filterTasksByCategory(category)));
    return;
  }

  printHelp();
}

try {
  run();
} catch (error) {
  const message = error instanceof Error ? error.message : 'Unknown error';
  console.error(message);
  process.exitCode = 1;
}
