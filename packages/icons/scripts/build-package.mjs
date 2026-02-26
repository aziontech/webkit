/**
 * Build Package Script
 *
 * Orchestrates the full icon font build pipeline:
 *   1. Validate SVG source files
 *   2. Clean dist/ output directory
 *   3. Generate icon fonts via fantasticon
 *   4. Create index.css barrel file
 *   5. Generate dist/package.json for npm publish
 *   6. Copy LICENSE and README.md into dist/
 *   7. Sync generated fonts back to src/icon-fonts/ for dev app
 *
 * After running this script, publish with:
 *   cd dist && npm pack --dry-run   (preview)
 *   cd dist && npm publish           (publish)
 *
 * Usage: node scripts/build-package.js
 */

import { execSync } from "node:child_process";
import {
  rmSync,
  mkdirSync,
  copyFileSync,
  writeFileSync,
  readFileSync,
  readdirSync,
  existsSync,
} from "node:fs";
import { join } from "node:path";

const CHARSET = "utf-8";
const DIST_DIR = "./dist";
const ICON_FONTS_DIR = "./src/icon-fonts";

// ─── Step 1: Validate SVGs ──────────────────────────────────────────────────

console.log("\n🔍 Step 1/7 — Validating SVG files...\n");

try {
  execSync("node scripts/validate.mjs", { stdio: "inherit" });
} catch {
  console.error(
    "\n🔴 SVG validation failed. Fix the errors above before building.\n"
  );
  process.exit(1);
}

// ─── Step 2: Clean dist/ ────────────────────────────────────────────────────

console.log("\n🧹 Step 2/7 — Cleaning dist/ directory...\n");

rmSync(DIST_DIR, { recursive: true, force: true });
mkdirSync(DIST_DIR, { recursive: true });

// ─── Step 3: Generate fonts ─────────────────────────────────────────────────

console.log("⚙️  Step 3/7 — Generating icon fonts via fantasticon...\n");

try {
  execSync("node scripts/build.mjs", { stdio: "inherit" });
} catch {
  console.error("\n🔴 Font generation failed.\n");
  process.exit(1);
}

// ─── Step 4: Create index.css barrel ────────────────────────────────────────

console.log("\n📦 Step 4/7 — Creating dist/index.css barrel file...\n");

const barrelContent = `@import './azionicons.css';
@import './primeicons.css';
`;

writeFileSync(join(DIST_DIR, "index.css"), barrelContent, CHARSET);
console.log("  ✔ dist/index.css created");

// ─── Step 5: Generate dist/package.json ─────────────────────────────────────

console.log("\n📋 Step 5/7 — Generating dist/package.json...\n");

const rootPkg = JSON.parse(readFileSync("./package.json", CHARSET));
const distPkg = {
  name: rootPkg.name,
  version: rootPkg.version,
  description: rootPkg.description,
  keywords: ["icons", "icon-font", "azion", "primeicons", "css", "woff2"],
  license: rootPkg.license,
  repository: rootPkg.repository,
  publishConfig: rootPkg.publishConfig ?? { access: "public" },
  style: "index.css",
  main: "index.css",
  exports: {
    ".": "./index.css",
    "./azionicons": "./azionicons.css",
    "./primeicons": "./primeicons.css"
  }
}

writeFileSync(
  join(DIST_DIR, "package.json"),
  JSON.stringify(distPkg, null, 2) + "\n",
  CHARSET
);
console.log("  ✔ dist/package.json created");

// ─── Step 6: Copy LICENSE and README.md ─────────────────────────────────────

console.log("\n📄 Step 6/7 — Copying LICENSE and README.md into dist/...\n");

if (existsSync("./LICENSE")) {
  copyFileSync("./LICENSE", join(DIST_DIR, "LICENSE"));
  console.log("  ✔ LICENSE copied");
} else {
  console.log("  ⚠ LICENSE not found — skipped");
}

if (existsSync("./README.md")) {
  copyFileSync("./README.md", join(DIST_DIR, "README.md"));
  console.log("  ✔ README.md copied");
} else {
  console.log("  ⚠ README.md not found — skipped");
}

// ─── Step 7: Sync to src/icon-fonts/ ─────────────────────────────────

console.log(
  "\n🔄 Step 7/7 — Syncing fonts to src/icon-fonts/ for dev app...\n"
);

mkdirSync(ICON_FONTS_DIR, { recursive: true });

const filesToSync = readdirSync(DIST_DIR).filter(
  (f) => f.endsWith(".css") || f.endsWith(".woff2")
);

for (const file of filesToSync) {
  // Skip the barrel index.css — the dev app imports each CSS individually via SCSS
  if (file === "index.css") continue;
  copyFileSync(join(DIST_DIR, file), join(ICON_FONTS_DIR, file));
  console.log(`  ✔ ${file} → ${ICON_FONTS_DIR}/${file}`);
}

// ─── Done ───────────────────────────────────────────────────────────────────

console.log("\n────────────────────────────────────────────────────────");

const distFiles = readdirSync(DIST_DIR);
console.log(
  `\n✅ Package built successfully! dist/ contains ${distFiles.length} files:`
);
for (const f of distFiles) {
  console.log(`   ${f}`);
}
console.log("\nPreview:  npm run pack:dry");
console.log("Publish:  npm run publish:package\n");
