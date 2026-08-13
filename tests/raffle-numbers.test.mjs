import test from 'node:test';
import assert from 'node:assert/strict';

import { createNumberPool, reserveNumberForEvent, isNumberAvailable } from '../src/raffleNumbers.js';

test('createNumberPool generates 100 unique numbers', () => {
  const pool = createNumberPool();
  assert.equal(pool.length, 100);
  assert.deepEqual(pool.slice(0, 3), [1, 2, 3]);
  assert.deepEqual(pool.slice(-3), [98, 99, 100]);
});

test('reserveNumberForEvent prevents duplicates and marks sold numbers', () => {
  const event = { numbers: createNumberPool().map(number => ({ number, status: 'available', ownerId: null })) };

  assert.equal(isNumberAvailable(event, 12), true);
  assert.equal(reserveNumberForEvent(event, 12, 'user-1'), true);
  assert.equal(isNumberAvailable(event, 12), false);
  assert.equal(reserveNumberForEvent(event, 12, 'user-2'), false);
});
