export function defaultValue(v: any, defaultValue: any) {
  if (v === undefined || v === null || v === "") {
    return defaultValue;
  }
  return v;
}
