import type { My, MyReq1, WxReq2 } from '../../types/libs';
import { UploadTaskImpl } from './UploadTaskImpl';
import { BaseMPO } from './mock-base';
import { readAsDataURL } from './readAsDataURL';

class MyConstructor extends BaseMPO implements My {
  request(req: MyReq1) {
    const { headers, ...rest } = req;
    setTimeout(async () => {
      const { code, msg } = Object(headers);
      if (req.fail && (code || msg)) {
        await Promise.resolve();
        return req.fail({ error: Number(code), errorMessage: msg });
      }

      await Promise.resolve();
      req.success({
        statusCode: Number(Object(headers)['status-code']) || 200,
        headers: { server: 'mock' },
        data: this.makeData({ ...rest, headers }, rest.dataType),
      });
    });
    return new AbortController();
  }
  uploadFile(req: WxReq2) {
    const { header, name, filePath, formData, ...rest } = req;
    setTimeout(async () => {
      req.success({
        statusCode: Number(Object(header)['status-code']) || 200,
        header: { server: 'mock' },
        data: {
          ...rest,
          data: formData,
          headers: header,
          files: { [name]: await readAsDataURL(filePath) },
        },
      });
    });
    return new UploadTaskImpl();
  }
}

Object.defineProperty(global, 'my', { value: new MyConstructor() });
