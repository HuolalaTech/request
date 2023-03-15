import { buildFormData } from '../../utils/buildFormData';

test('basic', () => {
  const fd = buildFormData({ a: 1, b: 'two' });
  expect(fd.get('a')).toBe('1');
  expect(fd.get('b')).toBe('two');
});

test('Nothing to do for FormData', () => {
  const ofd = new FormData();
  const fd = buildFormData(ofd);
  expect(fd).toBe(ofd);
});

test('undefined', () => {
  const fd = buildFormData();
  expect(fd).toBeInstanceOf(FormData);
  expect(Array.from(fd.keys())).toHaveLength(0);
});
