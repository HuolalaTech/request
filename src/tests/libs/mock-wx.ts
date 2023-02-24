import type { Wx, WxReq1, WxReq2 } from "../../types/libs";

class WxConstructor implements Wx {
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
    setTimeout(() => {
      req.success({
        statusCode: 200,
        header: { server: "mock" },
        data: {
          ...rest,
          data: formData,
          headers: header,
          files: { [name]: filePath },
        },
      });
    });
  }
}

Object.defineProperty(global, "wx", { value: new WxConstructor() });
