import { execSync } from 'node:child_process'
import { rmSync, mkdirSync, writeFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const CHARSET = 'utf-8'
const DIST_DIR = './dist'

console.log('\n🔍 Step 1/7 — Validating SVG files...\n')
try {
  execSync('node scripts/check-svg.mjs', { stdio: 'inherit' })
} catch {
  console.error('\n🔴 SVG validation failed. Fix the errors above before building.\n')
  process.exit(1)
}

console.log('\n🧹 Step 2/7 — Cleaning dist/ directory...\n')
rmSync(DIST_DIR, { recursive: true, force: true })
mkdirSync(DIST_DIR, { recursive: true })

console.log('⚙️  Step 3/7 — Generating icon fonts via fantasticon...\n')
try {
  execSync('node scripts/build-woff2.mjs', { stdio: 'inherit' })
} catch {
  console.error('\n🔴 Font generation failed.\n')
  process.exit(1)
}

console.log('\n📦 Step 4/7 — Creating dist/index.css barrel file...\n')
const barrelContent = `@import './azionicons.css';
@import './azionicons-color.css';
`
writeFileSync(join(DIST_DIR, 'index.css'), barrelContent, CHARSET)
console.log('  ✔ dist/index.css created')
writeFileSync(join(DIST_DIR, 'index.d.ts'), 'export {}\n', CHARSET)
console.log('  ✔ dist/index.d.ts created')

console.log('\n📦 Step 5/7 — Generating dist/catalog.json + dist/color-catalog.json...\n')
try {
  execSync('node scripts/build-catalog.mjs', { stdio: 'inherit' })
  console.log('  ✔ dist/catalog.json created')
} catch {
  console.error('\n🔴 Icons catalog generation failed. Fix the errors above before building.\n')
  process.exit(1)
}

console.log('\n📦 Step 6/7 — Generating dist/catalog.json + dist/color-catalog.json...\n')
try {
  execSync('node scripts/build-color-catalog.mjs', { stdio: 'inherit' })
  console.log('  ✔ dist/color-catalog.json created')
} catch {
  console.error(
    '\n🔴 Icons colored catalog generation failed. Fix the errors above before building.\n'
  )
  process.exit(1)
}

console.log('\n📦 Step 7/7 — Generating dist/azionicons.css ...\n')
try {
  execSync('node scripts/build-color-css.mjs', { stdio: 'inherit' })
  console.log('  ✔ dist/azionicons-color.css created')
} catch {
  console.error(
    '\n🔴 CSS Icons colored catalog generation failed. Fix the errors above before building.\n'
  )
  process.exit(1)
}

console.log('\n────────────────────────────────────────────────────────')
const distFiles = readdirSync(DIST_DIR)
console.log(`\n✅ Package built successfully! dist/ contains ${distFiles.length} files:`)
for (const f of distFiles) {
  console.log(`   ${f}`)
}
