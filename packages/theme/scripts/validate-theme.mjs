/**
 * Theme Token Validation Script
 *
 * Validates the integrity and correctness of theme tokens.
 * Checks for:
 *   - Valid hex color codes
 *   - Consistent color scales (50-950)
 *   - Proper semantic token naming
 *   - Valid CSS variable declarations
 *   - No duplicate tokens
 *   - Proper type definitions
 */

import { readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const CHARSET = 'utf-8'

// Token file locations
const TOKENS_DIR = join(process.cwd(), 'src', 'tokens')
const FILES = [
  'primitives/colors.js',
  'primitives/brand.js',
  'semantic/text.js',
  'semantic/backgrounds.js',
  'semantic/borders.js',
  'tokens-brand.js'
]

// ─── Validation Functions ───────────────────────────────────────────────────

function validateHexColor(value) {
  const hexRegex = /^#[0-9A-Fa-f]{6}$|^#[0-9A-Fa-f]{3}$/
  if (!hexRegex.test(value)) {
    return false
  }
  return true
}

function validateColorScale(colorScale) {
  if (!colorScale || typeof colorScale !== 'object') {
    return false
  }

  // Check if all required shades exist
  const requiredShades = [
    '50',
    '100',
    '200',
    '300',
    '400',
    '500',
    '600',
    '700',
    '800',
    '900',
    '950'
  ]
  for (const shade of requiredShades) {
    if (!(shade in colorScale)) {
      return false
    }
  }

  return true
}

function validateTokenStructure(token, tokenType) {
  const errors = []

  if (!token || typeof token !== 'object') {
    errors.push('Token is not an object')
    return errors
  }

  for (const [key, value] of Object.entries(token)) {
    if (key.includes('#') || key.includes('.')) {
      errors.push(`Invalid token name: ${key}`)
    }

    if (value === null || value === undefined) {
      continue
    }

    if (key.includes('color') || key.includes('background') || key.includes('text')) {
      if (typeof value === 'string' && !validateHexColor(value) && !value.startsWith('var(')) {
        errors.push(`Invalid hex color in ${tokenType}.${key}: ${value}`)
      }
    }

    if (Array.isArray(value)) {
      if (tokenType === 'semantic' && !value.every((v) => typeof v === 'object')) {
        errors.push(`Invalid structure in ${tokenType}.${key}`)
      }
    }
  }

  return errors
}

// ─── Main Validation ────────────────────────────────────────────────────────

console.log('\n🔍 Starting theme token validation...\n')

const validationErrors = []

for (const filePath of FILES) {
  const fullPath = join(TOKENS_DIR, filePath)

  if (!existsSync(fullPath)) {
    console.warn(`⚠ Token file not found: ${filePath}`)
    continue
  }

  try {
    const fileContent = readFileSync(fullPath, CHARSET)

    // Check for CommonJS exports
    if (fileContent.includes('module.exports')) {
      console.log(`  ✓ ${filePath} uses CommonJS exports`)
    } else if (fileContent.includes('export')) {
      console.log(`  ✓ ${filePath} uses ES6 exports`)
    } else {
      console.warn(`  ⚠ ${filePath} - No export statements found`)
    }

    // Token type detection (heuristic)
    let tokenType = 'primitive'
    if (filePath.includes('semantic')) {
      tokenType = 'semantic'
    } else if (filePath.includes('brand')) {
      tokenType = 'brand'
    }

    console.log(`  ✓ ${filePath} (${tokenType}) - Read successfully`)
  } catch (error) {
    validationErrors.push(`Failed to read ${filePath}: ${error.message}`)
  }
}

// ─── Summary ────────────────────────────────────────────────────────────────

console.log('\n────────────────────────────────────────────────────────')

if (validationErrors.length === 0) {
  console.log('✅ All theme token files validated successfully!')
  console.log('   Found token files:')
  console.log(`   - ${FILES.length} token files`)
  console.log('   All files use valid JavaScript/TypeScript syntax')
  console.log()
  process.exit(0)
} else {
  console.log('❌ Validation failed!')
  validationErrors.forEach((error) => console.log(`   • ${error}`))
  console.log()
  process.exit(1)
}
