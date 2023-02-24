import { toDataString } from "./toDataString";

export const buildQs = (data: unknown) => {
  const obj = Object(data);
  return Object.keys(obj)
    .map((key) =>
      []
        .concat(obj[key])
        .map((v) => {
          return (
            encodeURIComponent(key) + "=" + encodeURIComponent(toDataString(v))
          );
        })
        .join("&")
    )
    .join("&");
};
