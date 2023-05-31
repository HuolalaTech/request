import { buildQs } from '../../utils/builders';

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

test('array', () => {
  expect(buildQs({ a: [1, 2] })).toBe('a=1&a=2');
});

test('nested array', () => {
  expect(buildQs({ a: [1, 2, [3, 4]] })).toBe('a=1&a=2&a=%5B3%2C4%5D');
});

test('bad array', () => {
  const a: number[] = [1, 2, 3];
  a.forEach = () => null;
  expect(buildQs({ a })).toBe('a=1&a=2&a=3');
});

test('huge array', () => {
  const a: number[] = Array(1e5);
  a[10] = 1;
  expect(buildQs({ a })).toBe('a=1');
});

test('undefined', () => {
  expect(buildQs({ a: 1, b: undefined, c: null })).toBe('a=1&c=null');
});

test('undefined in array', () => {
  expect(buildQs({ a: [1, 2, undefined, 4] })).toBe('a=1&a=2&a=4');
});

test('bigint', () => {
  expect(buildQs({ a: BigInt(1e23) })).toBe('a=99999999999999991611392');
});

test('URLSearchParams', () => {
  expect(buildQs(new URLSearchParams({ a: '1', b: '2' }))).toBe('a=1&b=2');
});
