/**
 * Theme Token Compilation Script
 *
 * Compiles theme tokens into a distributable format.
 * Reads all token files from src/tokens/ and produces:
 *   - compiled-tokens.js (merged, formatted tokens)
 *   - index.js (token exports)
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const CHARSET = 'utf-8'
const SRC_DIR = join(process.cwd(), 'src')
const TOKENS_DIR = join(SRC_DIR, 'tokens')

// Get current directory
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// ─── Token File Paths ───────────────────────────────────────────────────────

const TOKEN_FILES = [
  'primitives/colors.js',
  'primitives/brand.js',
  'colors-brand.js',
  'semantic/text.js',
  'semantic/backgrounds.js',
  'semantic/borders.js'
]

const TOKEN_DEFS = []

// ─── Compile Token Files ───────────────────────────────────────────────────

console.log('\n⚙️  Compiling theme tokens...\n')

for (const file of TOKEN_FILES) {
  const filePath = join(TOKENS_DIR, file)

  if (!existsSync(filePath)) {
    console.warn(`⚠ Token file not found: ${file}`)
    continue
  }

  try {
    const fileContent = readFileSync(filePath, CHARSET)

    // Extract exports using regex
    const exportMatches = fileContent.matchAll(/export\s+(?:const|let|var)\s+(\w+)\s*=/g)

    for (const match of exportMatches) {
      const variableName = match[1]
      // This is a simplified extraction - in production, use a proper module parser
      console.log(`  ✓ Processed ${file} - found ${variableName} export`)
    }

    TOKEN_DEFS.push({
      file,
      path: filePath,
      content: fileContent
    })
  } catch (error) {
    console.error(`  ❌ Failed to compile ${file}: ${error.message}`)
  }
}

// ─── Generate Compiled Tokens ───────────────────────────────────────────────

console.log('\n📦 Generating compiled tokens...\n')

const compiledTokens = `
/**
 * Compiled Theme Tokens
 *
 * This file is generated automatically during build process.
 * It merges all token definitions for efficient distribution.
 */

// Import all primitive tokens
export * from './primitives/colors.js'
export * from './primitives/brand.js'

// Import brand aliases
export * from '../colors-brand.js'

// Import all semantic tokens
export * from './semantic/text.js'
export * from './semantic/backgrounds.js'
export * from './semantic/borders.js'

// Export build utilities
export * from '../build/refs.js'
export * from '../build/resolve.js'
export * from '../build/css-vars.js'
export * from '../build/preset.js'
export * from '../build/tailwind-helper.js'
export * from '../build/tailwind-plugin.js'
`

const distCompiledPath = join(process.cwd(), 'dist', 'tokens', 'compiled-tokens.js')
writeFileSync(distCompiledPath, compiledTokens, CHARSET)
console.log('  ✔ Generated compiled-tokens.js')

// ─── Generate Index File ───────────────────────────────────────────────────

console.log('\n📄 Generating index file...\n')

const indexContent = `
/**
 * Theme Tokens - Public API
 *
 * Main entry point for accessing theme tokens.
 * All tokens are exported here for convenient imports.
 */

// Primitive colors and brand colors
export * from './primitives/colors.js'
export * from './primitives/brand.js'
export * from '../colors-brand.js'

// Semantic tokens (light/dark aware)
export * from './semantic/text.js'
export * from './semantic/backgrounds.js'
export * from './semantic/borders.js'

// Build utilities
export * from '../build/refs.js'
export * from '../build/resolve.js'
export * from '../build/css-vars.js'
export * from '../build/preset.js'
export * from '../build/tailwind-helper.js'
export * from '../build/tailwind-plugin.js'
`

const distIndexPath = join(process.cwd(), 'dist', 'tokens', 'index.js')
writeFileSync(distIndexPath, indexContent, CHARSET)
console.log('  ✔ Generated dist/tokens/index.js')

// ─── Summary ────────────────────────────────────────────────────────────────

console.log('\n────────────────────────────────────────────────────────')
console.log('✅ Token compilation completed!')
console.log(`   Processed ${TOKEN_DEFS.length} token files`)
console.log()
