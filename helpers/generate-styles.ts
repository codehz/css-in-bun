import { getDeclaration } from "../utils/styles";
import flattenStyles from "./flatten-styles";

export default function generateStyles(
  styles: Record<string, Record<string, unknown>>
) {
  return Object.values(styles).flatMap((props) =>
    flattenStyles(props).map((obj: any) => getDeclaration(obj))
  );
}
