import type { UploadParams } from '../../types/common';
import type { My, MyRequestParams } from '../../types/My';
import { UploadTaskImpl } from './UploadTaskImpl';
import { BaseMpoImpl } from './BaseMpoImpl';
import { readAsDataURL } from './readAsDataURL';
import { RequestTaskImpl } from './RequestTaskImpl';

class MyConstructor extends BaseMpoImpl implements My {
  request(req: MyRequestParams) {
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

Object.defineProperty(global, 'my', { value: new MyConstructor() });
