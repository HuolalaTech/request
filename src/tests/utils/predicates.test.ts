import { APPLICATION_JSON, MULTIPART_FORM_DATA, WWW_FORM_URLENCODED } from '../../constants';
import { isApplicationJson, isMultipartFormData, isWwwFormUrlEncoded } from '../../utils/predicates';

test('isApplicationJson', () => {
  expect(isApplicationJson(APPLICATION_JSON)).toBeTruthy();
  expect(isApplicationJson(`${APPLICATION_JSON}; charset=UTF-8`)).toBeTruthy();
  expect(isApplicationJson('wtf')).toBeFalsy();
});

test('isMultipartFormData', () => {
  expect(isMultipartFormData(MULTIPART_FORM_DATA)).toBeTruthy();
  expect(isMultipartFormData(`${MULTIPART_FORM_DATA}; boundary=---zzzzzzzzz`)).toBeTruthy();
  expect(isMultipartFormData('wtf')).toBeFalsy();
});

test('isWwwFormUrlEncoded', () => {
  expect(isWwwFormUrlEncoded(WWW_FORM_URLENCODED)).toBeTruthy();
  expect(isWwwFormUrlEncoded(`${WWW_FORM_URLENCODED}; charset=UTF-8`)).toBeTruthy();
  expect(isWwwFormUrlEncoded('wtf')).toBeFalsy();
});
