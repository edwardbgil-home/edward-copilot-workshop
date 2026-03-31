import test from 'node:test';
import assert from 'node:assert/strict';

/**
 * Loads a fresh taskService module instance so each test has isolated in-memory state.
 * @returns {Promise<import('../src/services/taskService.js')>} Fresh service module.
 */
async function loadFreshService() {
  const nonce = `${Date.now()}-${Math.random()}`;
  return import(`../src/services/taskService.js?nonce=${nonce}`);
}

test('createTask stores and returns created task', async () => {
  const service = await loadFreshService();

  const created = service.createTask({
    title: 'Write tests',
    status: 'todo',
    priority: 'high'
  });

  const all = service.listTasks();
  assert.equal(created.title, 'Write tests');
  assert.equal(all.length, 1);
  assert.equal(all[0].id, created.id);
});

test('getTask returns a task by id', async () => {
  const service = await loadFreshService();
  const created = service.createTask({ title: 'Lookup task' });

  const loaded = service.getTask(created.id);
  assert.equal(loaded.id, created.id);
});

test('getTask throws when id is not found', async () => {
  const service = await loadFreshService();

  assert.throws(
    () => service.getTask('missing-id'),
    /Task not found: missing-id/
  );
});

test('updateTask mutates task fields', async () => {
  const service = await loadFreshService();
  const created = service.createTask({ title: 'Original', priority: 'low' });

  const updated = service.updateTask(created.id, {
    title: 'Updated',
    status: 'done',
    priority: 'high'
  });

  assert.equal(updated.title, 'Updated');
  assert.equal(updated.status, 'done');
  assert.equal(updated.priority, 'high');
});

test('updateTask throws when task does not exist', async () => {
  const service = await loadFreshService();

  assert.throws(
    () => service.updateTask('missing-id', { title: 'x' }),
    /Task not found: missing-id/
  );
});

test('deleteTask removes task from store', async () => {
  const service = await loadFreshService();
  const created = service.createTask({ title: 'To delete' });

  const removed = service.deleteTask(created.id);
  const all = service.listTasks();

  assert.equal(removed.id, created.id);
  assert.equal(all.length, 0);
});

test('deleteTask throws when task does not exist', async () => {
  const service = await loadFreshService();

  assert.throws(
    () => service.deleteTask('missing-id'),
    /Task not found: missing-id/
  );
});

test('listTasks filters by status', async () => {
  const service = await loadFreshService();
  service.createTask({ title: 'Todo one', status: 'todo' });
  service.createTask({ title: 'Done one', status: 'done' });

  const filtered = service.listTasks({ filterStatus: 'done' });
  assert.equal(filtered.length, 1);
  assert.equal(filtered[0].status, 'done');
});

test('listTasks filters by priority', async () => {
  const service = await loadFreshService();
  service.createTask({ title: 'Low', priority: 'low' });
  service.createTask({ title: 'High', priority: 'high' });

  const filtered = service.listTasks({ filterPriority: 'high' });
  assert.equal(filtered.length, 1);
  assert.equal(filtered[0].priority, 'high');
});

test('listTasks sorts by priority ascending', async () => {
  const service = await loadFreshService();
  service.createTask({ title: 'High task', priority: 'high' });
  service.createTask({ title: 'Low task', priority: 'low' });
  service.createTask({ title: 'Medium task', priority: 'medium' });

  const sorted = service.listTasks({ sortBy: 'priority', sortOrder: 'asc' });
  assert.deepEqual(
    sorted.map((task) => task.priority),
    ['low', 'medium', 'high']
  );
});

test('listTasks sorts by creation date descending', async () => {
  const service = await loadFreshService();
  const first = service.createTask({ title: 'First' });
  await new Promise((resolve) => setTimeout(resolve, 5));
  const second = service.createTask({ title: 'Second' });

  const sorted = service.listTasks({ sortBy: 'createdAt', sortOrder: 'desc' });
  assert.equal(sorted[0].id, second.id);
  assert.equal(sorted[1].id, first.id);
});

test('service operations validate id input', async () => {
  const service = await loadFreshService();

  assert.throws(() => service.getTask('   '), /Task id must be a non-empty string/);
});

test('listTasks returns empty array when there are no tasks', async () => {
  const service = await loadFreshService();

  const all = service.listTasks();
  assert.deepEqual(all, []);
});

test('listTasks returns empty array when filters match no tasks', async () => {
  const service = await loadFreshService();
  service.createTask({ title: 'Only todo', status: 'todo' });

  const filtered = service.listTasks({ filterStatus: 'done' });
  assert.deepEqual(filtered, []);
});

test('createTask allows duplicate titles with distinct ids', async () => {
  const service = await loadFreshService();

  const first = service.createTask({ title: 'Duplicate title' });
  const second = service.createTask({ title: 'Duplicate title' });

  assert.equal(first.title, second.title);
  assert.notEqual(first.id, second.id);
});

test('iterating listed tasks is stable while new tasks are added', async () => {
  const service = await loadFreshService();
  service.createTask({ title: 'A' });
  service.createTask({ title: 'B' });

  const snapshot = service.listTasks();
  const iteratedIds = [];

  for (const task of snapshot) {
    iteratedIds.push(task.id);
    service.createTask({ title: `extra-${iteratedIds.length}` });
  }

  assert.equal(iteratedIds.length, 2);
  assert.equal(service.listTasks().length, 4);
});

test('createTask supports missing optional description', async () => {
  const service = await loadFreshService();

  const created = service.createTask({ title: 'No description' });
  assert.equal(created.description, '');
});
