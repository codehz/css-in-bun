import fastJsonStableStringify from "fast-json-stable-stringify";
import { all as cssProperties } from "known-css-properties";
import hash from "murmurhash-js";
import { COMMA_SEPARATED_LIST_PROPERTIES, UNITLESS_NUMBERS } from "./constants";

const BASE_FONT_SIZE_PX = 16;

function isCustomProperty(name: string) {
  return name.startsWith("--");
}

function mapValue(prop: string, value: any) {
  if (typeof value === "number") {
    if (prop === "fontSize") return `${value / BASE_FONT_SIZE_PX}rem`;
    if (!UNITLESS_NUMBERS.includes(prop)) return `${value}px`;
  }

  if (prop === "transitionProperty") {
    return camelToHyphen(value);
  }

  return value;
}

function joinValues(prop: string, list: string[]) {
  const separator = COMMA_SEPARATED_LIST_PROPERTIES.includes(prop) ? "," : " ";

  return list.join(separator);
}

function normalizeValue(prop: string, value: any) {
  if (isCustomProperty(prop)) return value;

  if (Array.isArray(value)) {
    const mappedValues = value.map((val) => mapValue(prop, val));
    return joinValues(prop, mappedValues);
  }

  return mapValue(prop, value);
}

// given a code (0 <= code <= 51), return a character in a-zA-Z
const getAlphabeticChar = (code: number) =>
  String.fromCharCode(code + (code > 25 ? 39 /* 65 - 26 */ : 97));

function getHashClass(...args: any[]) {
  const code = hash(fastJsonStableStringify(args));

  let className = "";
  let x = 0;

  for (x = Math.abs(code); x > 52; x = (x / 52) | 0) {
    className = getAlphabeticChar(x % 52) + className;
  }

  className = getAlphabeticChar(x % 52) + className;

  // replace ad with a_d
  return className.replace(/(a)(d)/gi, "$1_$2");
}

export function getClass(args: any) {
  return getHashClass(args);
}

export function camelToHyphen(string: string) {
  if (isCustomProperty(string)) return string;
  return string.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);
}

export function getDeclaration({
  name,
  value,
  atRules,
  pseudoSelectors,
}: {
  name: string;
  value: any;
  atRules: string[];
  pseudoSelectors: string[];
}) {
  const cls = getClass({ name, value, atRules, pseudoSelectors });

  return (
    atRules.map((rule) => rule + "{").join("") +
    "." +
    cls +
    pseudoSelectors.join("") +
    "{" +
    camelToHyphen(name) +
    ":" +
    normalizeValue(name, value) +
    "}" +
    atRules.map(() => "}").join("")
  );
}

function normalizeTime(time: string) {
  if (time === "from") return "0%";
  if (time === "to") return "100%";
  return time;
}

function stringifyKeyframe(time: string, frame: any) {
  if (!Object.keys(frame).length) return "";

  const props = Object.entries(frame).map(([key, value]) => {
    return `${camelToHyphen(key)}:${normalizeValue(key, value)}`;
  });

  return `${normalizeTime(time)}{${props.join(";")}}`;
}

function stringifyKeyframes(rules: any) {
  return Object.entries(rules)
    .map(([time, frame]) => stringifyKeyframe(time, frame))
    .join("");
}

export function getKeyframes(rules: any) {
  const rulesString = stringifyKeyframes(rules);
  const name = getClass(rulesString);
  const declaration = `@keyframes ${name}{${rulesString}}`;
  return { name, declaration };
}

const LEGACY_PSEUDO_ELEMENTS = [
  ":before",
  ":after",
  ":first-letter",
  ":first-line",
];

export function normalizePseudoElements(string: string, handleSpecial = false) {
  if (LEGACY_PSEUDO_ELEMENTS.includes(string)) {
    return ":" + string;
  } else if (handleSpecial && string.includes("::children")) {
    return string.replaceAll("::children", ">*");
  }

  return string;
}

export function minifyProperty(name: string) {
  const hyphenName = camelToHyphen(name);
  if (cssProperties.includes(hyphenName)) {
    return cssProperties.indexOf(hyphenName).toString(36);
  }

  return getHashClass(hyphenName);
}

// Values can be primitives or arrays, nested styles are plain objects
export function isNestedStyles(item: any) {
  return typeof item === "object" && !Array.isArray(item);
}

export function isAtRule(string: string) {
  return string.startsWith("@");
}

export function isPseudoSelector(string: string) {
  return string.startsWith(":");
}

export function isAtRuleObject(name: string) {
  return name === "@media" || name === "@supports" || name === "@container";
}
