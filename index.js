import { flattenAtRules } from "./helpers/flat-at-rules";
import flattenStyles from "./helpers/flatten-styles";
import generateClasses from "./helpers/generate-classes";
import generateStyles from "./helpers/generate-styles";
import { insert } from "./utils/channel";
import { mapObjectValues } from "./utils/helpers";
import { getKeyframes } from "./utils/styles";

export function style(temp) {
  return create({ temp }).temp;
}

export function create(obj) {
  const styleDefinitions = flattenAtRules(obj);
  const styleClasses = generateClasses(styleDefinitions);
  const classes = mapObjectValues(styleClasses, (value) =>
    flattenStyles(value)
      .map((x) => x.value)
      .join(" ")
  );
  const generated = generateStyles(styleDefinitions);
  generated.forEach(insert);
  return classes;
}

export function keyframes(obj) {
  const { name, declaration } = getKeyframes(obj);
  insert(declaration);
  return name;
}
