export function mapObject<T extends Record<string, unknown>, F>(
  object: T,
  cb: (items: [keyof T, T[keyof T]], index: number) => [string, F]
): Record<string, F> {
  return Object.fromEntries(Object.entries(object).map(cb as any) as any);
}

export function mapObjectValues<T extends Record<string, unknown>, F>(
  object: T,
  cb: (input: T[keyof T]) => F
): Record<keyof T, F> {
  return mapObject(object, ([key, value]) => [
    key as keyof T & string,
    cb(value as T[keyof T]),
  ]) as any;
}

export function removeDuplicates<T>(list: T[]) {
  return list.filter((prop, index, array) => array.indexOf(prop) === index);
}

export function filterObjectKeys<T extends Record<string, unknown>>(
  obj: T,
  keys: (keyof T)[]
) {
  const newObj: Partial<T> = {};

  // Iterate in existing order
  for (const key in obj) {
    if (keys.includes(key)) {
      newObj[key] = obj[key];
    }
  }

  return newObj;
}
