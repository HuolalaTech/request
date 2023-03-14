import { EventEmitter } from "events";
import { readAsDataURL } from "./readAsDataURL";

global.XMLHttpRequest = class {
  em = new EventEmitter();
  openArgs: unknown[] = [];
  readyState = 0;
  status = 0;
  responseText = "";
  headers: Record<string, string> = {};
  open(...args: unknown[]) {
    this.openArgs = args;
    this.readyState = 1;
  }
  async send(body: string | FormData) {
    const files: Record<string, string> = {};
    let data: Record<string, unknown> = {};
    if (typeof body === "string") {
      data = JSON.parse(body);
    } else if (body instanceof FormData) {
      const tasks = Array.from(body, async ([k, v]) => {
        if (v instanceof File) {
          files[k] = await readAsDataURL(v);
        } else {
          data[k] = v;
        }
      });
      await Promise.all(tasks);
    }
    const { openArgs, headers } = this;
    setTimeout(() => {
      this.readyState = 4;
      this.status = 200;
      this.responseText = JSON.stringify({
        method: openArgs[0],
        url: openArgs[1],
        headers,
        data,
        files,
      });
      this.em.emit("readystatechange");
    });
  }
  addEventListener(e: string, h: () => void) {
    this.em.addListener(e, h);
  }
  setRequestHeader(key: string, value: string) {
    this.headers[key] = value;
  }
  getResponseHeader(key: string) {
    if (key === "Content-Type") return "application/json";
    return null;
  }
  getAllResponseHeaders() {
    return "server: mock\r\n";
  }
} as unknown as typeof XMLHttpRequest;
