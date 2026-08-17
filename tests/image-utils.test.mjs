import test from 'node:test';
import assert from 'node:assert/strict';

import { isValidImageFile, isValidImageType } from '../src/imageUtils.js';

test('isValidImageType accepts only PNG and JPEG files', () => {
  assert.equal(isValidImageType('image/png'), true);
  assert.equal(isValidImageType('image/jpeg'), true);
  assert.equal(isValidImageType('image/webp'), false);
  assert.equal(isValidImageType('image/gif'), false);
});

test('isValidImageFile rejects unsupported image formats', () => {
  assert.equal(isValidImageFile({ type: 'image/png' }), true);
  assert.equal(isValidImageFile({ type: 'image/jpeg' }), true);
  assert.equal(isValidImageFile({ type: 'image/webp' }), false);
  assert.equal(isValidImageFile(null), false);
});
