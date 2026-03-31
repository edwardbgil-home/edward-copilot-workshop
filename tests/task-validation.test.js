import test from 'node:test';
import assert from 'node:assert/strict';

import {
  validateCreateInput,
  validateListOptions,
  validateUpdateInput
} from '../src/validation/task-validation.js';

test('validateCreateInput defaults category to general', () => {
  const payload = validateCreateInput({ title: 'Task' });

  assert.equal(payload.category, 'general');
});

test('validateCreateInput trims category', () => {
  const payload = validateCreateInput({ title: 'Task', category: '  work  ' });

  assert.equal(payload.category, 'work');
});

test('validateCreateInput rejects empty category', () => {
  assert.throws(
    () => validateCreateInput({ title: 'Task', category: '   ' }),
    /category must be a non-empty string/
  );
});

test('validateUpdateInput accepts category updates', () => {
  const updates = validateUpdateInput({ category: 'personal' });

  assert.equal(updates.category, 'personal');
});

test('validateListOptions returns filterCategory when provided', () => {
  const options = validateListOptions({ filterCategory: 'work' });

  assert.equal(options.filterCategory, 'work');
});
