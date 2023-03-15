import { buildQs } from '../../utils/buildQs';

test('basic', () => {
  expect(buildQs({ a: 1 })).toBe('a=1');
  expect(buildQs({ a: 1, b: 2 })).toBe('a=1&b=2');
  expect(buildQs({ b: 2, a: 1 })).toBe('b=2&a=1');
  expect(buildQs({ x: true, y: 123, z: 'str' })).toBe('x=true&y=123&z=str');
});

test('encode', () => {
  expect(buildQs({ '%': '%' })).toBe('%25=%25');
});

test('empty key', () => {
  expect(buildQs({ '': 'value' })).toBe('=value');
});

test('empty value', () => {
  expect(buildQs({ key: '' })).toBe('key=');
});

test('object', () => {
  expect(buildQs({ o: { a: 1 } })).toBe(`o=%7B%22a%22%3A1%7D`);
});

test('date', () => {
  const t = new Date();
  expect(buildQs({ t })).toBe(`t=${encodeURIComponent(t.toJSON())}`);
});

test('non-object', () => {
  expect(buildQs(undefined)).toBe('');
  expect(buildQs(123)).toBe('');
  expect(buildQs(true)).toBe('');
  expect(buildQs(null)).toBe('');
  expect(buildQs('hehe')).toBe('');
});

test('special', () => {
  expect(buildQs(() => 0)).toBe('');
  expect(buildQs(/hehe/)).toBe('');
});
