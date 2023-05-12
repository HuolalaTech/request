import type { RequestParams, UploadParams } from '../../types/common';
import type { Swan } from '../../types/Swan';
import { UploadTaskImpl } from './UploadTaskImpl';
import { BaseMpoImpl } from './BaseMpoImpl';
import { readAsDataURL } from './readAsDataURL';
import { RequestTaskImpl } from './RequestTaskImpl';

class SwanConstructor extends BaseMpoImpl implements Swan {
  request(req: RequestParams) {
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
    });
    return new RequestTaskImpl(() => {
      clearTimeout(timer);
      if (req.fail) req.fail({ errMsg: 'request:fail abort' });
    });
  }
  uploadFile(req: UploadParams) {
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
    }, 100);
    return new UploadTaskImpl(() => {
      clearTimeout(timer);
      if (req.fail) req.fail({ errMsg: 'request:fail abort' });
    });
  }
}

Object.defineProperty(global, 'swan', { value: new SwanConstructor() });
