import test from 'node:test';
import assert from 'node:assert/strict';

import { Task } from '../src/models/task.js';

test('Task.create returns a valid task with defaults', () => {
  const task = Task.create({ title: '  Plan sprint  ' });
  const json = task.toJSON();

  assert.equal(typeof json.id, 'string');
  assert.ok(json.id.length > 0);
  assert.equal(json.title, 'Plan sprint');
  assert.equal(json.description, '');
  assert.equal(json.status, 'todo');
  assert.equal(json.priority, 'medium');
  assert.equal(typeof json.createdAt, 'string');
  assert.equal(typeof json.updatedAt, 'string');
});

test('Task constructor rejects invalid id', () => {
  assert.throws(
    () => new Task({
      id: '',
      title: 'Title',
      description: '',
      status: 'todo',
      priority: 'low',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }),
    /id is required and must be a non-empty string/
  );
});

test('Task constructor rejects invalid createdAt timestamp', () => {
  assert.throws(
    () => new Task({
      id: 'task-1',
      title: 'Title',
      description: '',
      status: 'todo',
      priority: 'low',
      createdAt: 'not-a-date',
      updatedAt: new Date().toISOString()
    }),
    /createdAt must be a valid ISO 8601 timestamp/
  );
});

test('Task.update applies valid fields and updates updatedAt', async () => {
  const task = Task.create({ title: 'Before', priority: 'low' });
  const before = task.updatedAt;

  await new Promise((resolve) => setTimeout(resolve, 5));
  task.update({ title: 'After', status: 'in-progress', priority: 'high' });

  assert.equal(task.title, 'After');
  assert.equal(task.status, 'in-progress');
  assert.equal(task.priority, 'high');
  assert.notEqual(task.updatedAt, before);
});

test('Task.update rejects empty updates', () => {
  const task = Task.create({ title: 'Task' });

  assert.throws(
    () => task.update({}),
    /update input must include at least one field/
  );
});

test('Task.create rejects read-only fields in input', () => {
  assert.throws(
    () => Task.create({ title: 'Task', id: 'manual-id' }),
    /id is read-only and cannot be provided/
  );
});

test('Task.create accepts very long title and description', () => {
  const longTitle = 'T'.repeat(5000);
  const longDescription = 'D'.repeat(10000);

  const task = Task.create({
    title: longTitle,
    description: longDescription
  });

  assert.equal(task.title, longTitle);
  assert.equal(task.description, longDescription);
});

test('Task.update rejects type mismatch for title', () => {
  const task = Task.create({ title: 'Task' });

  assert.throws(
    () => task.update({ title: Number.MAX_SAFE_INTEGER }),
    /title is required and must be a non-empty string/
  );
});
