# CSS-in-Bun macro inspired by Meta's stylex (and johanholmerin/style9)

Usage:
```tsx
// build.ts
import { getGeneratedCss } from "css-in-bun/build";

const res = await Bun.build({
  entrypoints: ["./src/index.ts"],
  outdir: "dist",
});

const css = getGeneratedCss();

await Bun.write("./dist/style.css", css);

// component.tsx
import { create } from "css-in-bun" assert { type: "macro" };
const styles = create({
  test: {
    color: "red",
    backgroundColor: "green",
    "@media (min-width: 80em)": {
      color: "purple",
      ":hover": {
        color: "black",
      },
    },
    ":hover": {
      color: "yellow",
    },
  },
});

const Test = () => <div className={styles.test}></div>
```

Due to bun's bug(https://github.com/oven-sh/bun/issues/6014), use keyframes may cause bun crash.