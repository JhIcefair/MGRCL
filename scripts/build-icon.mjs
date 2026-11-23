import fs from "node:fs";
import path from "node:path";
import pngToIco from "png-to-ico";

const root = path.resolve(import.meta.dirname, "..");
const src = path.resolve(root, "assets", "icons");
const sizes = [16, 24, 32, 48, 64, 128, 256];
const files = sizes.map((size) => path.join(src, `${size}.png`));

for (const file of files) {
  if (!fs.existsSync(file)) {
    throw new Error(`missing icon source: ${file}`);
  }
}

const toIco = typeof pngToIco === "function" ? pngToIco : pngToIco.default;
if (typeof toIco !== "function") {
  throw new Error("png-to-ico does not export a function");
}

fs.mkdirSync(path.join(root, "build"), { recursive: true });
const buf = await toIco(files);
const out = path.join(root, "build", "icon.ico");
fs.writeFileSync(out, buf);

const reserved = buf.readUInt16LE(0);
const type = buf.readUInt16LE(2);
const count = buf.readUInt16LE(4);
if (reserved !== 0 || type !== 1) {
  throw new Error(`invalid ICO header: reserved=${reserved}, type=${type}`);
}

const entries = [];
for (let index = 0; index < count; index += 1) {
  const offset = 6 + index * 16;
  const width = buf[offset] === 0 ? 256 : buf[offset];
  const height = buf[offset + 1] === 0 ? 256 : buf[offset + 1];
  entries.push({ width, height });
}

const actualSizes = entries.map((entry) => entry.width).sort((a, b) => a - b);
const expectedSizes = [...sizes].sort((a, b) => a - b);
const mismatch =
  count !== 7 ||
  JSON.stringify(actualSizes) !== JSON.stringify(expectedSizes) ||
  entries.some((entry) => entry.width !== entry.height);

if (mismatch) {
  throw new Error(`unexpected ICO entries: ${JSON.stringify(entries)}`);
}

console.log(`icon.ico written: ${out}`);
console.log(`bytes: ${buf.length}`);
console.log(`entries: ${count} [${actualSizes.join(", ")}]`);
