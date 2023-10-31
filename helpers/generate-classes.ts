import { mapObject, mapObjectValues } from "../utils/helpers";
import {
  getClass,
  isAtRule,
  isPseudoSelector,
  normalizePseudoElements,
} from "../utils/styles";

function getClassValues(
  styles: Record<string, unknown>,
  {
    atRules = [],
    pseudoSelectors = [],
  }: {
    atRules?: string[];
    pseudoSelectors?: string[];
  } = {}
): Record<string, unknown> {
  return mapObject(styles, ([name, value]) => {
    if (isAtRule(name)) {
      const newValue = getClassValues(value as Record<string, unknown>, {
        atRules: [...atRules, name],
        pseudoSelectors,
      });
      return [name, newValue as any];
    }

    if (isPseudoSelector(name)) {
      const normalizedName = normalizePseudoElements(name);
      const newValue = getClassValues(value as Record<string, unknown>, {
        pseudoSelectors: [...pseudoSelectors, normalizedName],
        atRules,
      });
      return [normalizedName, newValue];
    }

    const newValue = getClass({ name, value, atRules, pseudoSelectors });
    return [name, newValue];
  });
}

export default function generateClasses(
  obj: Record<string, Record<string, unknown>>
) {
  return mapObjectValues(obj, (value) => getClassValues(value));
}
