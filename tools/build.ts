import Bun from "bun";

// Build
await Bun.build({
  entrypoints: ["./game/main.ts"],
  outdir: "./dist",
  target: "browser",
  minify: false,       // für Dev besser false
  sourcemap: "linked",
});

console.log("Build fertig! Starte Dev Server...");

// Dev Server starten
const server = Bun.serve({
  port: 3000,
  fetch(req) {
    let url = new URL(req.url);
    let path = url.pathname === "/" ? "/index.html" : url.pathname;
    try {
      const file = Bun.file(`.${path}`);
      return new Response(file, {
        headers: {
          "Content-Type": getContentType(path),
        },
      });
    } catch {
      return new Response("Not Found", { status: 404 });
    }
  },
});

console.log("Dev Server läuft auf [http://localhost:3000]");

// Helper: Content-Type setzen
function getContentType(path: string) {
  if (path.endsWith(".js")) return "application/javascript";
  if (path.endsWith(".ts")) return "application/typescript";
  if (path.endsWith(".html")) return "text/html";
  if (path.endsWith(".css")) return "text/css";
  if (path.endsWith(".png")) return "image/png";
  return "text/plain";
}
