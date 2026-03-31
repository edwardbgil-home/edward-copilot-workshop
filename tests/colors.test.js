import test from 'node:test';
import assert from 'node:assert/strict';

import { colorizeStatus, colorizePriority } from '../src/utils/colors.js';

// colorizeStatus

test('colorizeStatus wraps done in green ANSI escape', () => {
  const result = colorizeStatus('done');
  assert.ok(result.includes('done'));
  assert.notEqual(result, 'done');
});

test('colorizeStatus wraps in-progress in yellow ANSI escape', () => {
  const result = colorizeStatus('in-progress');
  assert.ok(result.includes('in-progress'));
  assert.notEqual(result, 'in-progress');
});

test('colorizeStatus wraps todo in cyan ANSI escape', () => {
  const result = colorizeStatus('todo');
  assert.ok(result.includes('todo'));
  assert.notEqual(result, 'todo');
});

test('colorizeStatus returns unknown status unchanged', () => {
  assert.equal(colorizeStatus('unknown'), 'unknown');
});

test('colorizeStatus returns empty string unchanged', () => {
  assert.equal(colorizeStatus(''), '');
});

// colorizePriority

test('colorizePriority wraps high in bold red ANSI escape', () => {
  const result = colorizePriority('high');
  assert.ok(result.includes('high'));
  assert.notEqual(result, 'high');
});

test('colorizePriority wraps medium in bold yellow ANSI escape', () => {
  const result = colorizePriority('medium');
  assert.ok(result.includes('medium'));
  assert.notEqual(result, 'medium');
});

test('colorizePriority wraps low in dim ANSI escape', () => {
  const result = colorizePriority('low');
  assert.ok(result.includes('low'));
  assert.notEqual(result, 'low');
});

test('colorizePriority returns unknown priority unchanged', () => {
  assert.equal(colorizePriority('urgent'), 'urgent');
});

test('colorizePriority returns empty string unchanged', () => {
  assert.equal(colorizePriority(''), '');
});
