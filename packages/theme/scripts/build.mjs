/**
 * Theme Package Build Script
 *
 * Orchestrates the full theme build pipeline:
 *   1. Validate theme tokens
 *   2. Clean dist/ output directory
 *   3. Compile tokens into distribution format
 *   4. Generate CSS files for tokens
 *   5. Generate dist/package.json for npm publish
 *   6. Copy LICENSE and README.md into dist/
 *   7. Generate type definitions (if TypeScript is configured)
 *
 * After running this script, preview with:
 *   cd dist && npm pack --dry-run   (preview)
 *   cd dist && npm publish           (publish)
 *
 * Usage: node scripts/build.mjs
 */

import { execSync } from 'node:child_process'
import { rmSync, mkdirSync, copyFileSync, writeFileSync, readFileSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const CHARSET = 'utf-8'
const DIST_DIR = './dist'

// Get current directory
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// ─── Step 1: Validate Theme Tokens ───────────────────────────────────────────

console.log('\n🔍 Step 1/7 — Validating theme tokens...\n')

try {
  execSync('node scripts/validate-theme.mjs', { stdio: 'inherit' })
} catch {
  console.error('\n🔴 Theme validation failed. Fix the errors above before building.\n')
  process.exit(1)
}

// ─── Step 2: Clean dist/ ────────────────────────────────────────────────────

console.log('\n🧹 Step 2/7 — Cleaning dist/ directory...\n')
rmSync(DIST_DIR, { recursive: true, force: true })
mkdirSync(DIST_DIR, { recursive: true })

// ─── Step 3: Compile Tokens into Distribution Format ────────────────────────

console.log('⚙️  Step 3/7 — Compiling theme tokens...\n')

try {
  execSync('node scripts/compile-tokens.mjs', { stdio: 'inherit' })
} catch {
  console.error('\n🔴 Token compilation failed.\n')
  process.exit(1)
}

// ─── Step 4: Generate CSS Files for Tokens ───────────────────────────────────

console.log('🎨 Step 4/7 — Generating CSS files for theme tokens...\n')

try {
  execSync('node scripts/generate-css.mjs', { stdio: 'inherit' })
} catch {
  console.error('\n🔴 CSS generation failed.\n')
  process.exit(1)
}

// ─── Step 5: Generate dist/package.json ─────────────────────────────────────

console.log('\n📋 Step 5/7 — Generating dist/package.json...\n')

const rootPkg = JSON.parse(readFileSync(join(__dirname, '..', 'package.json'), CHARSET))
const distPkg = {
  name: rootPkg.name,
  version: rootPkg.version,
  description: rootPkg.description,
  license: rootPkg.license,
  repository: rootPkg.repository,
  publishConfig: rootPkg.publishConfig ?? { access: 'public' },
  main: './tokens/index.js',
  style: './tokens/tokens.css',
  types: './tokens/index.d.ts',
  exports: {
    '.': {
      import: './tokens/index.js',
      require: './tokens/index.js',
      default: './tokens/tokens.css'
    },
    './tokens': './tokens/index.js',
    './primitives': './tokens/primitives/colors.js',
    './semantic': './tokens/semantic/',
    './tokens/light.css': './tokens/tokens.css',
    './tokens/dark.css': './tokens/tokens.css'
  },
  files: ['tokens/', 'LICENSE', 'README.md'],
  keywords: ['design-tokens', 'theme', 'css', 'css-vars', 'tailwind-css', 'branding', 'ui-kit'],
  scripts: rootPkg.scripts
}

writeFileSync(join(DIST_DIR, 'package.json'), JSON.stringify(distPkg, null, 2) + '\n', CHARSET)
console.log('  ✔ dist/package.json created')

// ─── Step 6: Copy LICENSE and README.md ─────────────────────────────────────

console.log('\n📄 Step 6/7 — Copying LICENSE and README.md into dist/...\n')

if (existsSync(join(__dirname, '..', 'LICENSE'))) {
  copyFileSync(join(__dirname, '..', 'LICENSE'), join(DIST_DIR, 'LICENSE'))
  console.log('  ✔ LICENSE copied')
} else {
  console.log('  ⚠ LICENSE not found — skipped')
}

if (existsSync(join(__dirname, '..', 'README.md'))) {
  copyFileSync(join(__dirname, '..', 'README.md'), join(DIST_DIR, 'README.md'))
  console.log('  ✔ README.md copied')
} else {
  console.log('  ⚠ README.md not found — skipped')
}

// ─── Step 7: Generate Type Definitions (if TypeScript configured) ────────────

console.log('\n📄 Step 7/7 — Generating TypeScript type definitions...\n')

try {
  execSync('npx tsc --emitDeclarationOnly --outDir dist/tokens', {
    stdio: 'inherit',
    cwd: join(__dirname, '..')
  })
  console.log('  ✔ TypeScript declarations generated')
} catch (error) {
  console.warn('  ⚠ TypeScript declaration generation skipped (optional)')
}

// ─── Done ───────────────────────────────────────────────────────────────────

console.log('\n────────────────────────────────────────────────────────')
const distFiles = readdirSync(DIST_DIR)
console.log(`\n✅ Package built successfully! dist/ contains ${distFiles.length} files:`)
for (const f of distFiles) {
  console.log(`   ${f}`)
}
console.log('\nPreview:  npm run pack:dry')
console.log('Publish:  npm run publish\n')
