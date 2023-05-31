import { buildQs } from '../../utils/builders';

const usp = new URLSearchParams({ a: '1', b: '2' });

Object.defineProperty(window, 'URLSearchParams', {
  configurable: true,
  value: null,
});

test('URLSearchParams', () => {
  expect(buildQs(usp)).toBe('');
});
