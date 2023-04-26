import { APPLICATION_JSON, MULTIPART_FORM_DATA, WWW_FORM_URLENCODED } from '../constants';
import { ContentError, FailedToRequest } from '../errors';
import { requestWithXhr } from '../requestWithXhr';

import './libs/mock-xhr';

test(`bad json`, async () => {
  const res = requestWithXhr({
    method: 'GET',
    url: '/test',
    headers: {
      'response-body': 'bad json',
    },
  });
  expect(res).rejects.toBeInstanceOf(SyntaxError);
});

test(`content error`, async () => {
  const res = requestWithXhr({
    method: 'POST',
    url: '/test',
    headers: { 'Content-Type': APPLICATION_JSON },
    files: { f1: new Blob() },
  });
  expect(res).rejects.toBeInstanceOf(ContentError);
});

test(`send with json`, async () => {
  const res = requestWithXhr({
    method: 'POST',
    url: '/test',
    headers: { 'Content-Type': APPLICATION_JSON },
    data: { a: 1 },
  });
  expect(res).resolves.toMatchObject({
    data: {
      data: { a: 1 },
      files: {},
      headers: { 'Content-Type': APPLICATION_JSON },
      method: 'POST',
      url: '/test',
    },
    headers: { server: 'mock' },
    statusCode: 200,
  });
});

test(`send with form`, async () => {
  const res = requestWithXhr({
    method: 'POST',
    url: '/test',
    headers: {
      'Content-Type': WWW_FORM_URLENCODED,
    },
    data: { a: 1 },
  });
  expect(res).resolves.toMatchObject({
    data: {
      data: 'a=1',
      files: {},
      headers: { 'Content-Type': WWW_FORM_URLENCODED },
      method: 'POST',
      url: '/test',
    },
    headers: { server: 'mock' },
    statusCode: 200,
  });
});

test(`send with multipart`, async () => {
  const res = requestWithXhr({
    method: 'POST',
    url: '/test',
    headers: {
      'Content-Type': MULTIPART_FORM_DATA,
    },
    data: { a: 1 },
  });
  expect(res).resolves.toMatchObject({
    data: {
      data: { a: '1' },
      files: {},
      headers: { 'Content-Type': `${MULTIPART_FORM_DATA}; boundary=----WebKitFormBoundaryHehehehe` },
      method: 'POST',
      url: '/test',
    },
    headers: { server: 'mock' },
    statusCode: 200,
  });
});

test(`error`, async () => {
  const res = requestWithXhr({ method: 'GET', url: '/', headers: { event: 'error' } });
  expect(res).rejects.toThrowError(FailedToRequest);
  expect(res).rejects.toMatchObject({ type: 'error' });
});

test(`timeout`, async () => {
  const res = requestWithXhr({ method: 'GET', url: '/', headers: { event: 'timeout' } });
  expect(res).rejects.toThrowError(FailedToRequest);
  expect(res).rejects.toMatchObject({ type: 'timeout' });
});

test(`abort`, async () => {
  const res = requestWithXhr({ method: 'GET', url: '/', headers: { event: 'abort' } });
  expect(res).rejects.toThrowError(FailedToRequest);
  expect(res).rejects.toMatchObject({ type: 'abort' });
});
