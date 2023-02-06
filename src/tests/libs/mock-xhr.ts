import { EventEmitter } from "events";

global.FormData = class {
  readonly entries: any[] = [];
  forEach(fn: (v: any, k: string) => void) {
    this.entries.forEach(([key, value]) => fn(value, key));
  }
  append(key: string, value: any) {
    this.entries.push([key, value]);
  }
  toJSON() {
    return Object.fromEntries(this.entries);
  }
} as any;

global.File = class {
  readonly name: string;
  readonly data: any;
  constructor(fileBits: BlobPart[], fileName: string) {
    this.data = fileBits;
    this.name = fileName;
  }
} as any;

global.XMLHttpRequest = class {
  em = new EventEmitter();
  openArgs: any = null;
  readyState = 0;
  status = 0;
  responseText = "";
  headers: any = {};
  open(...args: any[]) {
    this.openArgs = args;
    this.readyState = 1;
  }
  send(body: string | FormData) {
    const files: Record<string, File> = {};
    let data: any = body;
    if (typeof data === "string") {
      data = JSON.parse(data);
    } else if (body instanceof FormData) {
      data = {};
      body.forEach((v, k) => {
        if (v instanceof File) {
          files[k] = v;
        } else {
          data[k] = v;
        }
      });
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
} as any;
