import type { Swan, WxReq1, WxReq2 } from "../../types/libs";
import { readAsDataURL } from "./readAsDataURL";

class SwanConstructor implements Swan {
  request(req: WxReq1) {
    const { header, ...rest } = req;
    setTimeout(() => {
      req.success({
        statusCode: 200,
        header: { server: "mock" },
        data: { ...rest, headers: header },
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

Object.defineProperty(global, "swan", { value: new SwanConstructor() });
