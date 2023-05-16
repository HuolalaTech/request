import { assertNotNull } from '../../utils/assertions';

test('assertNotNull', () => {
  expect(() => {
    assertNotNull(null);
  }).toThrowError(TypeError);

  expect(() => {
    assertNotNull(1);
  }).not.toThrow();
});
