# request · [![LICENSE](https://img.shields.io/npm/l/@huolala-tech/request)](LICENSE.txt)

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

| name    | type                                   | description     |
| ------- | -------------------------------------- | --------------- |
| method  | string                                 | Request method  |
| url     | string                                 | Request URL     |
| data    | any                                    | Request payload |
| timeout | number                                 | Request timeout |
| headers | Record<string, string>                 | Request header  |
| files   | Record<string, Blob \| File \| string> | Payload files   |

> NOTE 1: The `method` field
>
> 1. Some MiniProgram platforms can only support `"GET"` or `"POST"` methods, so using a RESTful API is not the best solution for MiniPrograms.

> NOTE 2: The `files` field
>
> 1. In browsers, the file is represented as a Blob or File object, whereas in other MiniProgram platforms, the file is represented as a string filePath.
> 2. NOTE: MiniProgram platforms doese not suport multiple files uploading in once.

## Return (Promise<?>)

| name       | type                   | description          |
| ---------- | ---------------------- | -------------------- |
| statusCode | number                 | Response status code |
| data       | any                    | Response body        |
| headers    | Record<string, string> | Response headers     |

## Demo

```typescript
import { request } from "@huolala-tech/request";

async function main() {
  const res = await request({
    method: "POST",
    url: "http://localhost/api",
    data: {
      xxx: "xxx",
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
import { request, interceptors } from "@huolala-tech/request";

// Add Authorization: xxx header for all requests.
interceptors.request.use((req) => {
  args.headers = { ...Object(args.headers), Authorization: "xxx" };
});

// If any request responds with a 401 code, go to login.
interceptors.response.use((res) => {
  if (res.statusCode === 401) {
    location.href = "http://blahblahblah/";
  }
});

request({ method: "POST", url: "http://localhost/api/user" });
```
