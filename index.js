import { flattenAtRules } from "./helpers/flat-at-rules";
import flattenStyles from "./helpers/flatten-styles";
import generateClasses from "./helpers/generate-classes";
import generateStyles from "./helpers/generate-styles";
import { get_defnitions, insert_definition, reset_database } from "./utils/db";
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
  insert_definition.run(JSON.stringify(generated));
  return classes;
}

export function keyframes(obj) {
  const { name, declaration } = getKeyframes(obj);
  insert_definition.run(JSON.stringify([declaration]));
  return name;
}

export function getGeneratedCss() {
  return get_defnitions.values().flat().join("");
}

export function resetCache() {
  reset_database.run();
}
