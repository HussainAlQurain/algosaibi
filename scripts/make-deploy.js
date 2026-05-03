/**
 * Creates a self-contained _deploy/ folder ready to zip and upload.
 * Contains: all HTML files (EN + AR) + assets/ (CSS, JS, images)
 */
const fs = require("fs");
const path = require("path");

const ROOT   = path.join(__dirname, "..");
const OUT    = path.join(ROOT, "_out");
const ASSETS = path.join(ROOT, "assets");
const DEPLOY = path.join(ROOT, "_deploy");

// Wipe and recreate _deploy/
fs.rmSync(DEPLOY, { recursive: true, force: true });
fs.mkdirSync(DEPLOY, { recursive: true });

// Copy all HTML from _out/ into _deploy/
function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath  = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

copyDir(OUT, DEPLOY);

// Copy assets/ into _deploy/assets/
copyDir(ASSETS, path.join(DEPLOY, "assets"));

console.log("✔ Deploy folder ready: _deploy/");
console.log("  Zip the _deploy/ folder and upload its contents to your server.");
