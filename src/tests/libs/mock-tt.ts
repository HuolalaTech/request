import { RequestController } from '../../RequestController';
import type { RequestParams, UploadParams } from '../../types/common';
import { UploadTaskImpl } from './UploadTaskImpl';
import { BaseMpoImpl } from './BaseMpoImpl';
import { readAsDataURL } from './readAsDataURL';
import { Tt } from '../../types/Tt';

class TtConstructor extends BaseMpoImpl implements Tt {
  request(req: RequestParams) {
    const task = new RequestController();
    const timer = setTimeout(async () => {
      const { header, ...rest } = req;
      const { code, msg } = Object(header);
      if (req.fail && (code || msg)) {
        return req.fail({ errCode: Number(code), errMsg: msg });
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
  uploadFile(req: UploadParams) {
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

Object.defineProperty(global, 'tt', { value: new TtConstructor() });
