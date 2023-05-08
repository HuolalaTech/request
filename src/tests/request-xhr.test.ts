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
  expect(res).resolves.toMatchObject({ data: 'bad json', headers: { server: 'mock' }, statusCode: 200 });
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

test(`withCredentials=false`, async () => {
  const params = { method: 'GET', url: '/test', withCredentials: false };
  const res = await requestWithXhr({ ...params });
  expect(res.data).toMatchObject(params);
});

test(`withCredentials=true`, async () => {
  const params = { method: 'GET', url: '/test', withCredentials: true };
  const res = await requestWithXhr({ ...params });
  expect(res.data).toMatchObject(params);
});

test(`withCredentials defaults to true`, async () => {
  const params = { method: 'GET', url: '/test' };
  const res = await requestWithXhr(params);
  expect(res.data).toMatchObject({ ...params, withCredentials: true });
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

test(`blob`, async () => {
  const params = { method: 'GET', url: '/test' };
  const res = await requestWithXhr({ ...params, responseType: 'blob' });
  const fr = new FileReader();
  fr.readAsText(res.data);
  await new Promise((f) => fr.addEventListener('load', f));
  expect(JSON.parse(fr.result as string)).toMatchObject(params);
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
