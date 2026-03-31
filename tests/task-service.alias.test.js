import test from 'node:test';
import assert from 'node:assert/strict';

/**
 * Loads a fresh task-service adapter module.
 * @returns {Promise<import('../src/services/task-service.js')>} Fresh adapter module.
 */
async function loadFreshAdapter() {
  const nonce = `${Date.now()}-${Math.random()}`;
  return import(`../src/services/task-service.js?nonce=${nonce}`);
}

test('addTask supports category and default category through adapter API', async () => {
  const service = await loadFreshAdapter();

  const explicit = service.addTask({ title: 'Adapter explicit', category: 'work' });
  const implicit = service.addTask({ title: 'Adapter implicit' });

  assert.equal(explicit.category, 'work');
  assert.equal(implicit.category, 'general');
});

test('adapter filterTasksByCategory returns only matching category', async () => {
  const service = await loadFreshAdapter();
  const category = `cat-${Date.now()}-${Math.random()}`;

  service.addTask({ title: 'Match one', category });
  service.addTask({ title: 'No match', category: 'other' });

  const filtered = service.filterTasksByCategory(category);

  assert.equal(filtered.length >= 1, true);
  assert.equal(filtered.every((task) => task.category === category), true);
});
