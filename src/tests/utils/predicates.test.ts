import { isApplicationJson, isMultipartFormData, isWwwFormUrlEncoded } from '../../utils/predicates';

test('isApplicationJson', () => {
  expect(isApplicationJson('application/json')).toBeTruthy();
  expect(isApplicationJson('application/json; charset=UTF-8')).toBeTruthy();
  expect(isApplicationJson('wtf')).toBeFalsy();
});

test('isMultipartFormData', () => {
  expect(isMultipartFormData('multipart/form-data')).toBeTruthy();
  expect(isMultipartFormData('multipart/form-data; boundary=---zzzzzzzzz')).toBeTruthy();
  expect(isMultipartFormData('wtf')).toBeFalsy();
});

test('isWwwFormUrlEncoded', () => {
  expect(isWwwFormUrlEncoded('application/x-www-form-urlencoded')).toBeTruthy();
  expect(isWwwFormUrlEncoded('application/x-www-form-urlencoded; charset=UTF-8')).toBeTruthy();
  expect(isWwwFormUrlEncoded('wtf')).toBeFalsy();
});
