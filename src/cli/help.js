/**
 * Prints usage instructions for the Task Manager CLI.
 */
export function printHelp() {
  console.log('Task Manager CLI');
  console.log('Usage: node src/cli/index.js <command> [args]');
  console.log('');
  console.log('Commands:');
  console.log('  help');
  console.log("  add <title> [description] [status] [priority] [category]");
  console.log('  list');
  console.log('  list-categories');
  console.log('  filter-category <category>');
  console.log('');
  console.log("Examples:");
  console.log("  node src/cli/index.js add 'Write docs' 'Draft schema' todo high work");
  console.log('  node src/cli/index.js list-categories');
}
