import type { My, MyReq1, WxReq2 } from "../../types/libs";
import { readAsDataURL } from "./readAsDataURL";

class MyConstructor implements My {
  request(req: MyReq1) {
    const { headers, ...rest } = req;
    setTimeout(() => {
      req.success({
        statusCode: 200,
        headers: { server: "mock" },
        data: { ...rest, headers },
      });
    });
  }
  uploadFile(req: WxReq2) {
    const { header, name, filePath, formData, ...rest } = req;
    setTimeout(async () => {
      req.success({
        statusCode: 200,
        header: { server: "mock" },
        data: {
          ...rest,
          data: formData,
          headers: header,
          files: { [name]: await readAsDataURL(filePath) },
        },
      });
    });
  }
}

Object.defineProperty(global, "my", { value: new MyConstructor() });
