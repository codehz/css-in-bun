import dts from "bun-plugin-dts";
import { spawnSync } from "node:child_process";
import { cp, readFile, rm } from "node:fs/promises";

await rm("dist", { recursive: true });

await Bun.build({
  target: "bun",
  outdir: "dist",
  minify: false,
  splitting: false,
  sourcemap: "inline",
  external: [
    "murmurhash-js",
    "known-css-properties",
    "fast-json-stable-stringify",
    "csstype",
  ],
  entrypoints: ["build.ts"],
  plugins: [dts()],
});

await Bun.build({
  target: "bun",
  outdir: "dist",
  minify: false,
  splitting: false,
  sourcemap: "inline",
  external: [
    "murmurhash-js",
    "known-css-properties",
    "fast-json-stable-stringify",
    "csstype",
  ],
  entrypoints: ["index.js"],
});

for (const file of ["index.d.ts", "style.d.ts", "tsconfig.json", "LICENSE", "README.md"]) {
  await cp(file, `dist/${file}`);
}

const contents = JSON.parse(await readFile("package.json", "utf-8"));

delete contents.private;
delete contents.scripts;
delete contents.devDependencies;
contents.version = spawnSync("git", ["describe", "--tags"], {
  encoding: "utf-8",
})
  .stdout.trim()
  .replace(/-[[:digit:]]\+-g/, "+")
  .replace(/^v/, "");
await Bun.write("dist/package.json", JSON.stringify(contents, null, 2));
