/**
 * Post-build script: copies HTML output from _out/ to root.
 * Eleventy cannot output directly to the project root when .eleventy.js lives there.
 */
const fs = require("fs");
const path = require("path");

const SRC = path.join(__dirname, "..", "_out");
const DEST = path.join(__dirname, "..");

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      // Skip asset passthrough folders (already in root assets/)
      if (entry.name === "assets") continue;
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

copyDir(SRC, DEST);
console.log("✔ Copied _out/ → root");
