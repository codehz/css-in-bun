import { AtRules, Style, StyleProperties } from "./style";

type AtRulesKey = `${AtRules}${string}`;

interface AtRulesProperties {
  [key: AtRulesKey]: StyleWithAtRules;
}

interface StylePropertiesObject {
  [key: string]: StyleProperties;
}

export type StyleWithAtRules = Style<AtRulesProperties>;

export function style(style: StyleWithAtRules): string;
export function create<T>(styles: { [key in keyof T]: StyleWithAtRules }): {
  [key in keyof T]: string;
};
export function keyframes(rules: StylePropertiesObject): string;
