import {
  isAtRule,
  isPseudoSelector,
  normalizePseudoElements,
} from "../utils/styles";

type MaybeArray<T> = T | T[];

function flattenStyle({
  name,
  value,
  atRules,
  pseudoSelectors,
}: {
  name: string;
  value: any;
  atRules: string[];
  pseudoSelectors: string[];
}): MaybeArray<{
  name: string;
  value: any;
  atRules: string[];
  pseudoSelectors: string[];
}> {
  if (isAtRule(name)) {
    return flattenStyles(value, {
      atRules: [...atRules, name],
      pseudoSelectors,
    });
  }

  if (isPseudoSelector(name)) {
    const normalizedName = normalizePseudoElements(name, true);
    return flattenStyles(value, {
      pseudoSelectors: [...pseudoSelectors, normalizedName],
      atRules,
    });
  }

  return { name, value, atRules, pseudoSelectors };
}

export default function flattenStyles(
  styles: Record<string, unknown>,
  {
    atRules = [],
    pseudoSelectors = [],
  }: { atRules?: string[]; pseudoSelectors?: string[] } = {}
): {
  name: string;
  value: any;
  atRules: string[];
  pseudoSelectors: string[];
}[] {
  return Object.entries(styles).flatMap(([name, value]) =>
    flattenStyle({ name, value, atRules, pseudoSelectors })
  );
}
