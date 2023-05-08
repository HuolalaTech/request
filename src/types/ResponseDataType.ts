import { InvokeParams } from './InvokeParams';

interface TypeMap {
  blob: Blob;
  arraybuffer: ArrayBuffer;
  text: string;
}

export type ResponseDataType<T, P extends InvokeParams> = P['responseType'] extends keyof TypeMap
  ? TypeMap[P['responseType']]
  : T;
