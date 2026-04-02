await Bun.build({
  entrypoints: ["./game/main.ts"],
  outdir: "./dist",
  target: "browser",
  minify: true,
  sourcemap: "linked",
});

console.log("Build fertig!");
