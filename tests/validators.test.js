import test from 'node:test';
import assert from 'node:assert/strict';

import {
  TASK_PRIORITIES,
  TASK_STATUSES,
  ensureObject,
  isNonEmptyString,
  validateDescription,
  validateIsoTimestamp,
  validateListOptions,
  validatePriority,
  validateReadonlyFields,
  validateStatus,
  validateTaskCreateInput,
  validateTaskId,
  validateTaskUpdateInput,
  validateTitle
} from '../src/utils/validators.js';

test('isNonEmptyString returns true for trimmed non-empty strings', () => {
  assert.equal(isNonEmptyString('  hello  '), true);
});

test('isNonEmptyString returns false for empty or non-string values', () => {
  assert.equal(isNonEmptyString('   '), false);
  assert.equal(isNonEmptyString(123), false);
});

test('ensureObject returns object when input is valid object', () => {
  const result = ensureObject({ a: 1 }, 'context');
  assert.equal(result.a, 1);
});

test('ensureObject throws for arrays or null', () => {
  assert.throws(() => ensureObject([], 'Input'), /Input must be an object/);
  assert.throws(() => ensureObject(null, 'Input'), /Input must be an object/);
});

test('validateTaskId accepts non-empty id', () => {
  assert.doesNotThrow(() => validateTaskId('abc-123'));
});

test('validateTaskId rejects invalid id', () => {
  assert.throws(() => validateTaskId('  '), /Task id must be a non-empty string/);
});

test('validateTitle trims and returns title', () => {
  const title = validateTitle('  My task  ', true);
  assert.equal(title, 'My task');
});

test('validateTitle returns undefined for optional missing title', () => {
  const title = validateTitle(undefined, false);
  assert.equal(title, undefined);
});

test('validateTitle throws for invalid required title', () => {
  assert.throws(
    () => validateTitle('', true),
    /title is required and must be a non-empty string/
  );
});

test('validateDescription returns string for valid description', () => {
  assert.equal(validateDescription('desc', true), 'desc');
});

test('validateDescription returns undefined for optional missing description', () => {
  assert.equal(validateDescription(undefined, false), undefined);
});

test('validateDescription throws for non-string values', () => {
  assert.throws(() => validateDescription(7, true), /description must be a string/);
});

test('validateStatus accepts allowed status', () => {
  assert.equal(validateStatus('done', true), 'done');
});

test('validateStatus throws for unsupported status', () => {
  assert.throws(
    () => validateStatus('blocked', true),
    /status must be one of: todo, in-progress, done/
  );
});

test('validatePriority accepts allowed priority', () => {
  assert.equal(validatePriority('high', true), 'high');
});

test('validatePriority throws for unsupported priority', () => {
  assert.throws(
    () => validatePriority('urgent', true),
    /priority must be one of: low, medium, high/
  );
});

test('validateIsoTimestamp accepts parseable timestamp strings', () => {
  assert.doesNotThrow(() => validateIsoTimestamp(new Date().toISOString(), 'createdAt'));
});

test('validateIsoTimestamp throws for invalid timestamp', () => {
  assert.throws(
    () => validateIsoTimestamp('bad-time', 'createdAt'),
    /createdAt must be a valid ISO 8601 timestamp/
  );
});

test('validateReadonlyFields allows input without readonly fields', () => {
  assert.doesNotThrow(() => validateReadonlyFields({ title: 'ok' }));
});

test('validateReadonlyFields throws when readonly field exists', () => {
  assert.throws(
    () => validateReadonlyFields({ id: 'x' }),
    /id is read-only and cannot be provided/
  );
});

test('validateTaskCreateInput returns sanitized payload with defaults', () => {
  const payload = validateTaskCreateInput({ title: '  Task  ' });

  assert.deepEqual(payload, {
    title: 'Task',
    description: '',
    status: 'todo',
    priority: 'medium'
  });
});

test('validateTaskCreateInput throws when input is not an object', () => {
  assert.throws(
    () => validateTaskCreateInput('bad'),
    /Task create input must be an object/
  );
});

test('validateTaskCreateInput accepts very long strings', () => {
  const longTitle = 'T'.repeat(5000);
  const longDescription = 'D'.repeat(10000);

  const payload = validateTaskCreateInput({
    title: longTitle,
    description: longDescription
  });

  assert.equal(payload.title, longTitle);
  assert.equal(payload.description, longDescription);
});

test('validateTaskCreateInput rejects numeric title type mismatch', () => {
  assert.throws(
    () => validateTaskCreateInput({ title: Number.MAX_SAFE_INTEGER }),
    /title is required and must be a non-empty string/
  );
});

test('validateTaskUpdateInput returns validated partial updates', () => {
  const payload = validateTaskUpdateInput({ status: 'in-progress', priority: 'low' });
  assert.deepEqual(payload, { status: 'in-progress', priority: 'low' });
});

test('validateTaskUpdateInput throws when no updatable fields are provided', () => {
  assert.throws(
    () => validateTaskUpdateInput({}),
    /update input must include at least one field/
  );
});

test('validateTaskUpdateInput throws when readonly fields are provided', () => {
  assert.throws(
    () => validateTaskUpdateInput({ updatedAt: new Date().toISOString() }),
    /updatedAt is read-only and cannot be provided/
  );
});

test('validateListOptions returns default sort when options missing', () => {
  const options = validateListOptions(undefined);
  assert.deepEqual(options, { sortBy: 'createdAt', sortOrder: 'asc' });
});

test('validateListOptions returns defaults for empty object', () => {
  const options = validateListOptions({});
  assert.deepEqual(options, {
    filterStatus: undefined,
    filterPriority: undefined,
    sortBy: 'createdAt',
    sortOrder: 'asc'
  });
});

test('validateListOptions validates filters and sorting', () => {
  const options = validateListOptions({
    filterStatus: 'todo',
    filterPriority: 'high',
    sortBy: 'priority',
    sortOrder: 'desc'
  });

  assert.deepEqual(options, {
    filterStatus: 'todo',
    filterPriority: 'high',
    sortBy: 'priority',
    sortOrder: 'desc'
  });
});

test('validateListOptions throws for invalid sortBy', () => {
  assert.throws(
    () => validateListOptions({ sortBy: 'title' }),
    /sortBy must be one of: priority, createdAt/
  );
});

test('validateListOptions throws for invalid sortOrder', () => {
  assert.throws(
    () => validateListOptions({ sortOrder: 'up' }),
    /sortOrder must be one of: asc, desc/
  );
});

test('TASK_STATUSES exports expected status values', () => {
  assert.deepEqual(TASK_STATUSES, ['todo', 'in-progress', 'done']);
});

test('TASK_PRIORITIES exports expected priority values', () => {
  assert.deepEqual(TASK_PRIORITIES, ['low', 'medium', 'high']);
});
