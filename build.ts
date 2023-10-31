import { get_defnitions, reset_database } from "./utils/db";

export function getGeneratedCss() {
  return get_defnitions.values().flat().join("");
}
export function resetCssCache() {
  reset_database.run();
}
