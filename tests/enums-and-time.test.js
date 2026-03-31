import test from 'node:test';
import assert from 'node:assert/strict';

import { PRIORITIES, SORT_PRIORITY_ORDER, STATUSES } from '../src/constants/enums.js';
import { now } from '../src/utils/time.js';

test('STATUSES exports expected values', () => {
  assert.deepEqual(STATUSES, ['todo', 'in-progress', 'done']);
});

test('PRIORITIES exports expected values', () => {
  assert.deepEqual(PRIORITIES, ['low', 'medium', 'high']);
});

test('SORT_PRIORITY_ORDER maps priorities correctly', () => {
  assert.deepEqual(SORT_PRIORITY_ORDER, { low: 0, medium: 1, high: 2 });
});

test('now returns parseable ISO timestamp string', () => {
  const timestamp = now();

  assert.equal(typeof timestamp, 'string');
  assert.equal(Number.isNaN(Date.parse(timestamp)), false);
});
