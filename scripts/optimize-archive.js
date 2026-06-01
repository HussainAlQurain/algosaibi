/**
 * One-off: resize the heavy newspaper scans into web-friendly JPEGs with
 * clean ASCII filenames, sorted chronologically. Also pulls in the existing
 * newspaper.jpeg (2 Nov 1998) so it becomes one of the flipbook pages.
 *
 * Output: assets/images/archive/archive-NN-YYYY-MM-DD.jpg
 */
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const ROOT = path.join(__dirname, "..");
const SRC_DIR = path.join(ROOT, "assets/images/newspaper");
const EXTRA = path.join(ROOT, "assets/images/newspaper.jpeg");
const OUT_DIR = path.join(ROOT, "assets/images/archive");

// Map the Arabic source filenames -> ISO date.
const SOURCES = [
  { file: "2مارس1988 o.jpg", date: "1988-03-02" },
  { file: "28يونيو 1989 o.jpg", date: "1989-06-28" },
  { file: "31ديسمبر1990 o.jpg", date: "1990-12-31" },
  { file: "12اغسطس 1992 o.jpg", date: "1992-08-12" },
  { file: "17اغسطس 1992 o.jpg", date: "1992-08-17" },
  { file: "14نوفمبر1992 o.jpg", date: "1992-11-14" },
  { file: "15نوفمبر1992 o.jpg", date: "1992-11-15" },
  { file: "28يونيو 1994 o.jpg", date: "1994-06-28" },
  { file: "8فبراير 1995 o.jpg", date: "1995-02-08" },
  { file: "__EXTRA__", date: "1998-11-02" }, // existing newspaper.jpeg
  { file: "6فبراير2000 o.jpg", date: "2000-02-06" },
  { file: "10يوليو2001 o.jpg", date: "2001-07-10" },
  { file: "3فبراير 2002 o.jpg", date: "2002-02-03" },
  { file: "10فبراير 2002 o.jpg", date: "2002-02-10" },
  { file: "18مارس 2002 o.jpg", date: "2002-03-18" },
];

const MONTHS_EN = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const MONTHS_AR = ["يناير","فبراير","مارس","أبريل","مايو","يونيو","يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر"];

async function run() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const sorted = [...SOURCES].sort((a, b) => a.date.localeCompare(b.date));
  const manifest = [];

  for (let i = 0; i < sorted.length; i++) {
    const { file, date } = sorted[i];
    const srcPath = file === "__EXTRA__" ? EXTRA : path.join(SRC_DIR, file);
    if (!fs.existsSync(srcPath)) {
      console.warn("MISSING:", srcPath);
      continue;
    }
    const idx = String(i + 1).padStart(2, "0");
    const outName = `archive-${idx}-${date}.jpg`;
    const outPath = path.join(OUT_DIR, outName);

    const meta = await sharp(srcPath).metadata();
    await sharp(srcPath)
      .rotate()
      .resize({ width: 2000, withoutEnlargement: true })
      .jpeg({ quality: 82, mozjpeg: true })
      .toFile(outPath);

    const outMeta = await sharp(outPath).metadata();
    const [y, m, d] = date.split("-").map(Number);
    manifest.push({
      img: `assets/images/archive/${outName}`,
      iso: date,
      dateEn: `${d} ${MONTHS_EN[m - 1]} ${y}`,
      dateAr: `${d} ${MONTHS_AR[m - 1]} ${y}`,
      w: outMeta.width,
      h: outMeta.height,
    });
    const kb = Math.round(fs.statSync(outPath).size / 1024);
    console.log(`${outName}  ${outMeta.width}x${outMeta.height}  ${kb}KB  (src ${meta.width}x${meta.height})`);
  }

  const dataPath = path.join(ROOT, "src/_data/archive.json");
  fs.writeFileSync(dataPath, JSON.stringify({ pages: manifest }, null, 2));
  console.log(`\nWrote ${manifest.length} pages -> src/_data/archive.json`);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
