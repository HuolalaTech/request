import { EventEmitter } from 'events';
import { readAsDataURL } from './readAsDataURL';
import { isContentType } from '../../utils/predicates';
import { APPLICATION_JSON, CONTENT_TYPE, MULTIPART_FORM_DATA } from '../../constants';
import { TextEncoder } from 'util';

/**
 * Get a value by a case-insensitive key
 */
const getHeader = <T>(headers: Record<string, T>, name: string) => {
  if (!headers) return undefined;
  const found = Object.entries(headers).find(
    ([key]) => key.localeCompare(name, undefined, { sensitivity: 'accent' }) === 0,
  );
  if (found) return found[1];
  return undefined;
};

global.XMLHttpRequest = class implements Partial<XMLHttpRequest> {
  private em = new EventEmitter();
  private method = 'GET';
  private url = '';
  private headers: Record<string, string> = {};
  public readyState = 0;
  public status = 0;
  public timeout = 0;
  public withCredentials = false;
  public response: unknown;
  public responseText = '';
  public responseType: XMLHttpRequestResponseType = '';

  public open(method: string, url: string) {
    this.method = method;
    this.url = url;
    this.readyState = 1;
    this.em.emit('readystatechange');
  }

  public abort() {
    this.em.emit('abort', new Event('abort'));
  }

  public async send(body: string | FormData) {
    const { method, url, timeout, withCredentials, headers } = this;
    this.readyState = 3;
    this.status = Number(getHeader(headers, 'status-code')) || 200;
    this.em.emit('readystatechange');

    const mockEvent = getHeader(headers, 'event');
    if (mockEvent) {
      this.readyState = 4;
      this.em.emit('readystatechange');
      this.em.emit(mockEvent, new ProgressEvent(mockEvent));
      return;
    }

    const mockResponse = getHeader(headers, 'response-body');
    if (mockResponse) {
      this.makeDone(mockResponse);
      return;
    }

    await Promise.resolve();
    const files: Record<string, string> = {};
    let data: Record<string, unknown> | string | undefined;
    if (typeof body === 'string') {
      try {
        data = JSON.parse(body);
      } catch (error) {
        data = body;
      }
    } else if (body instanceof FormData) {
      if (!Object.keys(this.headers).some(isContentType)) {
        this.headers[CONTENT_TYPE] = `${MULTIPART_FORM_DATA}; boundary=----WebKitFormBoundaryHehehehe`;
      }
      const temp: Record<string, unknown> = {};
      const tasks = Array.from(body, async ([k, v]) => {
        if (v instanceof File) {
          files[k] = await readAsDataURL(v);
        } else {
          temp[k] = v;
        }
      });
      await Promise.all(tasks);
      data = temp;
    }
    await Promise.resolve();
    const raw = JSON.stringify({ method, url, timeout, withCredentials, headers, data, files });
    this.makeDone(raw);
  }

  private makeDone(text: string) {
    this.responseText = text;
    if (this.responseType === 'blob') {
      this.response = new Blob([text]);
    } else if (this.responseType === 'arraybuffer') {
      this.response = new TextEncoder().encode(text).buffer;
    } else {
      this.response = text;
    }
    this.readyState = 4;
    this.em.emit('readystatechange');
    this.em.emit('load');
  }

  public addEventListener(e: string, h: (...a: unknown[]) => void) {
    this.em.addListener(e, h);
  }

  public setRequestHeader(key: string, value: string) {
    this.headers[key] = value;
  }

  public getResponseHeader(key: string) {
    if (key === CONTENT_TYPE) return APPLICATION_JSON;
    return null;
  }

  public getAllResponseHeaders() {
    return 'server: mock\r\n';
  }
} as unknown as typeof XMLHttpRequest;
