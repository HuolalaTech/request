import { isValidMPO } from '../../utils/isValidMPO';

test('basic', () => {
  expect(isValidMPO(null)).toBeFalsy();
  expect(isValidMPO(undefined)).toBeFalsy();
  expect(isValidMPO(0)).toBeFalsy();
  expect(isValidMPO(1)).toBeFalsy();
  expect(isValidMPO({})).toBeFalsy();
  expect(isValidMPO({ request: null })).toBeFalsy();

  expect(
    isValidMPO({
      request: () => void 0,
    }),
  ).toBeFalsy();

  expect(
    isValidMPO({
      canIUse: () => true,
    }),
  ).toBeFalsy();

  expect(
    isValidMPO({
      canIUse: () => {
        throw new Error('hehe');
      },
    }),
  ).toBeFalsy();

  expect(
    isValidMPO({
      get request() {
        throw new Error('hehe');
      },
    }),
  ).toBeFalsy();

  expect(
    isValidMPO({
      request: () => void 0,
      canIUse: () => 1,
    }),
  ).toBeFalsy();

  expect(
    isValidMPO({
      request: () => void 0,
      canIUse: () => true,
    }),
  ).toBeTruthy();
});
