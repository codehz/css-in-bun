import { mapObject, mapObjectValues } from "../utils/helpers";
import { isNestedStyles, isAtRuleObject } from "../utils/styles";

export function flatten(
  type: string,
  object: Record<string, unknown>
): Record<string, unknown> {
  return mapObject(object, ([key, value]) => {
    return [`${type} ${key}`, flattenObjectAtRules(value)];
  });
}

export function flattenObjectAtRules(styles: any): Record<string, unknown> {
  const entries = Object.entries(styles).flatMap(([name, value]) => {
    if (!isNestedStyles(value)) {
      return [[name, value]];
    }

    if (isAtRuleObject(name)) {
      return Object.entries(flatten(name, value as Record<string, unknown>));
    }

    return [[name, flattenObjectAtRules(value)]];
  });

  return Object.fromEntries(entries);
}

export function flattenAtRules(obj: Record<string, unknown>) {
  return mapObjectValues(obj, flattenObjectAtRules);
}
