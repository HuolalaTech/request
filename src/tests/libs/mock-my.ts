import { RequestController } from '../../RequestController';
import type { My, MyReq1, WxReq2 } from '../../types/libs';
import { UploadTaskImpl } from './UploadTaskImpl';
import { BaseMPO } from './mock-base';
import { readAsDataURL } from './readAsDataURL';

class MyConstructor extends BaseMPO implements My {
  request(req: MyReq1) {
    const task = new RequestController();
    const timer = setTimeout(async () => {
      const { headers, ...rest } = req;
      const { code, msg } = Object(headers);
      if (req.fail && (code || msg)) {
        return req.fail({ error: Number(code), errorMessage: msg });
      }
      req.success({
        statusCode: Number(Object(headers)['status-code']) || 200,
        headers: { server: 'mock' },
        data: this.makeData({ ...rest, headers }, rest.dataType),
      });
      task.abort = () => undefined;
    });
    task.abort = () => {
      clearTimeout(timer);
      if (req.fail) req.fail({ errMsg: 'request:fail abort' });
    };
    return task;
  }
  uploadFile(req: WxReq2) {
    const task = new UploadTaskImpl();
    const timer = setTimeout(async () => {
      const { header, name, filePath, formData, ...rest } = req;
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
      task.abort = () => undefined;
    });
    task.abort = () => {
      clearTimeout(timer);
      if (req.fail) req.fail({ errMsg: 'request:fail abort' });
    };
    return task;
  }
}

Object.defineProperty(global, 'my', { value: new MyConstructor() });
