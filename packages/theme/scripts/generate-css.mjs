/**
 * CSS Generation Script for Theme Tokens
 *
 * Generates CSS files containing CSS variables for theme tokens.
 * Creates:
 *   - tokens.css (CSS variables for light/dark themes)
 *   - light.css (light theme CSS variables)
 *   - dark.css (dark theme CSS variables)
 */

import { writeFileSync, readFileSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const CHARSET = 'utf-8'

// Get current directory
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Paths
const TOKENS_DIR = join(process.cwd(), 'src', 'tokens')
const BUILD_DIR = join(process.cwd(), 'build')

// ─── CSS Variable Generator ──────────────────────────────────────────────────

function generateCSSVars(primitives, brand, semantic) {
  let cssVars = '/* Theme Tokens - CSS Variables */\n\n'

  // Generate brand colors
  cssVars += '/* Brand Colors */\n'
  for (const [name, value] of Object.entries(brand)) {
    if (name !== 'brand' && typeof value === 'object' && !Array.isArray(value)) {
      cssVars += `:root {\n`
      cssVars += `  --${name}: ${value['default']};\n`
      cssVars += '}\n\n'
    } else if (typeof value === 'string') {
      cssVars += `:root {\n`
      cssVars += `  --${name}: ${value};\n`
      cssVars += '}\n\n'
    }
  }

  // Generate primitive color palettes
  cssVars += '/* Color Palettes */\n'
  for (const [name, scale] of Object.entries(primitives.colors)) {
    cssVars += `/* ${name.toUpperCase()} Palette */\n`
    for (const shade of [
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
    ]) {
      const hexColor = scale[shade] || scale[shade.replace('0', '')] || scale[shade]
      if (hexColor) {
        cssVars += `:root {\n`
        cssVars += `  --${name}-${shade}: ${hexColor};\n`
        cssVars += '}\n\n'
      }
    }
  }

  // Generate semantic text colors
  cssVars += '/* Semantic Text Colors */\n'
  for (const [name, colors] of Object.entries(semantic.text)) {
    cssVars += `/* ${name.toUpperCase()} - Text */\n`
    cssVars += `:root {\n`
    cssVars += `  --${name}: ${colors.light};\n`
    cssVars += '}\n'
    cssVars += `.dark {\n`
    cssVars += `  --${name}: ${colors.dark};\n`
    cssVars += '}\n\n'
  }

  // Generate semantic background colors
  cssVars += '/* Semantic Background Colors */\n'
  for (const [name, colors] of Object.entries(semantic.backgrounds)) {
    cssVars += `/* ${name.toUpperCase()} - Background */\n`
    cssVars += `:root {\n`
    cssVars += `  --${name}: ${colors.light};\n`
    cssVars += '}\n'
    cssVars += `.dark {\n`
    cssVars += `  --${name}: ${colors.dark};\n`
    cssVars += '}\n\n'
  }

  // Generate semantic border colors
  cssVars += '/* Semantic Border Colors */\n'
  for (const [name, colors] of Object.entries(semantic.borders)) {
    cssVars += `/* ${name.toUpperCase()} - Border */\n`
    cssVars += `:root {\n`
    cssVars += `  --${name}: ${colors.light};\n`
    cssVars += '}\n'
    cssVars += `.dark {\n`
    cssVars += `  --${name}: ${colors.dark};\n`
    cssVars += '}\n\n'
  }

  return cssVars
}

// ─── Main CSS Generation ────────────────────────────────────────────────────

console.log('\n🎨 Generating CSS files for theme tokens...\n')

try {
  // Determine if we need to read token files or use production files
  let primitives = {}
  let brand = {}
  let semantic = {
    text: {},
    backgrounds: {},
    borders: {}
  }

  // Try to read production token files
  const prodColorsPath = join(TOKENS_DIR, 'primitives', 'colors.js')
  const prodBrandPath = join(TOKENS_DIR, 'primitives', 'brand.js')

  if (existsSync(prodColorsPath) && existsSync(prodBrandPath)) {
    console.log('  ✓ Using production token files')
    const colorsContent = readFileSync(prodColorsPath, CHARSET)
    const brandContent = readFileSync(prodBrandPath, CHARSET)

    // Simple extraction using regex
    const colorsMatch = colorsContent.match(/export const colors = ({[\s\S]*?});/)
    const brandMatch = brandContent.match(/export const brand = ({[\s\S]*?});/)

    if (colorsMatch && brandMatch) {
      primitives = JSON.parse(colorsMatch[1]) || {}
      brand = JSON.parse(brandMatch[1]) || {}
    } else {
      console.warn('  ⚠ Could not extract token objects using regex')
    }
  } else {
    console.warn('  ⚠ Production token files not found, using empty structure')
  }

  // Generate CSS variables
  const cssVars = generateCSSVars(primitives, brand, semantic)

  // Write main CSS file
  const mainCSS = `
/**
 * Theme Tokens - CSS Variables
 *
 * Auto-generated CSS variables for theme tokens.
 * Use with the theme plugin or import the CSS directly.
 */

${cssVars}

/* Theme Switch Support */
:root, [data-theme=light], .azion.azion-light {
  /* Light theme defaults */
}

[data-theme=dark], .dark, .azion.azion-dark {
  /* Dark theme overrides */
}
`

  const distCSSPath = join(process.cwd(), 'dist', 'tokens', 'tokens.css')
  writeFileSync(distCSSPath, mainCSS, CHARSET)
  console.log('  ✔ Generated tokens.css')

  // Write light CSS (light theme defaults)
  const lightCSS = `
/**
 * Theme Tokens - Light Theme CSS Variables
 *
 * CSS variables specifically for light theme mode.
 */

${cssVars.substring(0, cssVars.indexOf('.dark'))}

/* Light theme is already default in :root */
`
  const distLightPath = join(process.cwd(), 'dist', 'tokens', 'light.css')
  writeFileSync(distLightPath, lightCSS, CHARSET)
  console.log('  ✔ Generated light.css')

  // Write dark CSS (dark theme overrides)
  const darkCSS = `
/**
 * Theme Tokens - Dark Theme CSS Variables
 *
 * CSS variables specifically for dark theme mode.
 */

:root, [data-theme=light], .azion.azion-light {
  /* Light theme defaults (from main CSS) */
}

[data-theme=dark], .dark, .azion.azion-dark {
  /* Dark theme overrides */
${cssVars.substring(cssVars.indexOf('.dark'))}
}
`
  const distDarkPath = join(process.cwd(), 'dist', 'tokens', 'dark.css')
  writeFileSync(distDarkPath, darkCSS, CHARSET)
  console.log('  ✔ Generated dark.css')

  console.log('\n✅ CSS files generated successfully!')
  console.log(`   Generated 3 CSS files:`)
  console.log('      - tokens.css (main, includes both light and dark)')
  console.log('      - light.css (light theme only)')
  console.log('      - dark.css (dark theme only)')
} catch (error) {
  console.error(`\n❌ CSS generation failed: ${error.message}`)
  process.exit(1)
}
