import { RequestController } from '../../RequestController';
import type { Wx, WxReq1, WxReq2 } from '../../types/libs';
import { UploadTaskImpl } from './UploadTaskImpl';
import { BaseMPO } from './mock-base';
import { readAsDataURL } from './readAsDataURL';

class WxConstructor extends BaseMPO implements Wx {
  request(req: WxReq1) {
    const task = new RequestController();
    const timer = setTimeout(async () => {
      const { header, ...rest } = req;
      const { code, msg } = Object(header);
      if (req.fail && (code || msg)) {
        return req.fail({ errno: Number(code), errMsg: msg });
      }
      req.success({
        statusCode: Number(Object(header)['status-code']) || 200,
        header: { server: 'mock' },
        data: this.makeData({ ...rest, headers: header }, rest.dataType || rest.responseType),
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

Object.defineProperty(global, 'wx', { value: new WxConstructor() });
