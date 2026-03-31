import test from 'node:test';
import assert from 'node:assert/strict';

import { formatTask, formatTaskList } from '../src/utils/format.js';

test('formatTask includes category in output', () => {
  const output = formatTask({
    id: 'task-1',
    title: 'Write docs',
    description: '',
    status: 'todo',
    priority: 'medium',
    category: 'work'
  });

  assert.match(output, /work/);
});

test('formatTaskList returns fallback text for empty input', () => {
  const output = formatTaskList([]);

  assert.equal(output, 'No tasks found.');
});

test('formatTaskList renders one line per task', () => {
  const output = formatTaskList([
    {
      id: 'task-1',
      title: 'First',
      description: '',
      status: 'todo',
      priority: 'low',
      category: 'general'
    },
    {
      id: 'task-2',
      title: 'Second',
      description: '',
      status: 'done',
      priority: 'high',
      category: 'work'
    }
  ]);

  const lines = output.split('\n');
  assert.equal(lines.length, 2);
});
