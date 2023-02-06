export const parseRawHeaderAsMap = (rh: string) => {
  const re = /^(.*?): (.*)$/gm;
  const map: Record<string, string> = {};
  for (;;) {
    const a = re.exec(rh);
    if (!a) break;
    const [, key, value] = a;
    map[key.toLocaleLowerCase()] = value;
  }
  return map;
};
