import { AtRules, Style, StyleProperties } from "./style";

type AtRulesKey = `${AtRules}${string}`;

interface AtRulesProperties {
  [key: AtRulesKey]: StyleWithAtRules;
}

interface FakeChildrenProperty {
  "::children"?: StyleWithAtRules;
}

interface StylePropertiesObject {
  [key: string]: StyleProperties;
}

export type StyleWithAtRules = Style<AtRulesProperties & FakeChildrenProperty>;

export function style(style: StyleWithAtRules): string;
export function create<T>(styles: { [key in keyof T]: StyleWithAtRules }): {
  [key in keyof T]: string;
};
export function keyframes(rules: StylePropertiesObject): string;
