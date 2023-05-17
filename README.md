# request · [![LICENSE](https://img.shields.io/npm/l/@huolala-tech/request)](LICENSE.txt) [![codecov](https://codecov.io/gh/HuolalaTech/request/branch/main/graph/badge.svg?token=8Y5SCRGG7V)](https://codecov.io/gh/HuolalaTech/request)

This is just a request library to support browsers and MiniProgram platforms.

## Include

```bash
yarn add @huolala-tech/request
```

or

```bash
npm install @huolala-tech/request --save
```

## Params

| name              | type                                              | description                                            |
| ----------------- | ------------------------------------------------- | ------------------------------------------------------ |
| method (required) | string                                            | Request method                                         |
| url (required)    | string                                            | Request URL                                            |
| data              | any                                               | Request payload (or query string for GET/HEAD methods) |
| timeout           | number                                            | Request timeout in milliseconds                        |
| headers           | Record\<string, string\>                          | Request header                                         |
| files             | Record\<string, Blob \| File \| string\>          | Payload files                                          |
| responseType      | text \| json \| arraybuffer \| blob \| document   | Response type                                          |
| withCredentials   | boolean                                           | The withCredentials flag for XHR object                |
| signal            | AbortSignal                                       | An abort signal like fetch                             |
| onUploadProgress  | (info: { total: number, loaded: number }) => void | The uploading progress event                           |

> NOTE 1: The `method` field
>
> 1. Some MiniProgram platforms can only support `"GET"` or `"POST"` methods, so using a RESTful API is not the best solution for MiniPrograms.

> NOTE 2: The `files` field
>
> 1. In browsers, the file is represented as a Blob or File object, whereas in other MiniProgram platforms, the file is represented as a string filePath.
> 2. MiniProgram platforms doese not suport multiple files uploading in once.

> NOTE 3: The `responseType` field
>
> 1. The values of `blob` and `document` can only be used on browser.
> 2. The `responseType` can not be used with `files` on MiniProgram platforms.

> NOTE 4: The `withCredentials` field
>
> 1. This can only be used on browser.

## Return Promise<InvokeResult<T>>

The InvokeResult is

| name       | type                   | description          |
| ---------- | ---------------------- | -------------------- |
| statusCode | number                 | Response status code |
| data       | any                    | Response body        |
| headers    | Record<string, string> | Response headers     |

## Demo

```typescript
import { request } from '@huolala-tech/request';

async function main() {
  const res = await request({
    method: 'POST',
    url: 'http://localhost/api',
    data: {
      xxx: 'xxx',
    },
  });

  if (res.statusCode === 200) {
    console.log(res.data);
  }
}
```

## Advanced Features

#### 1. Interceptors

> Taking into account the learning cost, our interceptors API design is modeled after the Axios.

```typescript
import { request, interceptors } from '@huolala-tech/request';

// Add Authorization: xxx header for all requests.
interceptors.request.use((req) => {
  args.headers = { ...Object(args.headers), Authorization: 'xxx' };
});

// If any request responds with a 401 code, go to login.
interceptors.response.use((res) => {
  if (res.statusCode === 401) {
    location.href = 'http://blahblahblah/';
  }
});

request({ method: 'POST', url: 'http://localhost/api/user' });
```
