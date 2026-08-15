import test from 'node:test';
import assert from 'node:assert/strict';

import { findCartItemIndex } from './cartMatcher.js';

const itemA = {
  _id: '507f1f77bcf86cd799439011',
  productid: '6a6f127fd3e56afc88014036',
  origin: 'Main',
  quantity: 1,
};

const itemB = {
  _id: '90ab1f77bcf86cd799439022',
  productid: { _id: 'aabbccddeeff001122334455' },
  origin: 'Variant',
  quantity: 2,
};

test('matches cart item by its own generated id', () => {
  assert.equal(findCartItemIndex([itemA, itemB], '507f1f77bcf86cd799439011'), 0);
});

test('matches cart item by product id even when nested object is passed', () => {
  assert.equal(findCartItemIndex([itemA, itemB], 'aabbccddeeff001122334455'), 1);
});

test('returns -1 when no matching cart item exists', () => {
  assert.equal(findCartItemIndex([itemA, itemB], '000000000000000000000000'), -1);
});
