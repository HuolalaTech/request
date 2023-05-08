import { TextEncoder } from 'util';

const stringify = (data: unknown) => (typeof data !== 'string' ? JSON.stringify(data) : data);

export abstract class BaseMPO {
  canIUse(name: string) {
    if (name === 'request') return true;
    return false;
  }

  protected makeData<T>(data: T, type?: string) {
    if (type === 'text' || type === 'string') return stringify(data);
    if (type === 'arraybuffer') return new TextEncoder().encode(stringify(data)).buffer;
    return data;
  }
}
