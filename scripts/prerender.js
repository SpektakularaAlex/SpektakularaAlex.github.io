// Runs at the end of `npm run build`: renders the React page to HTML and puts it
// in dist/index.html, so the page is readable without JavaScript.
import { readFile, rm, writeFile } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const file = new URL("dist/index.html", root);
const marker = "<!--app-html-->";

const { render } = await import(new URL("dist-ssr/entry-server.js", root));
const template = await readFile(file, "utf8");
if (!template.includes(marker)) throw new Error(`${marker} not found in dist/index.html`);

await writeFile(file, template.replace(marker, () => render()));
await rm(new URL("dist-ssr/", root), { recursive: true });
console.log("Prerendered dist/index.html");
