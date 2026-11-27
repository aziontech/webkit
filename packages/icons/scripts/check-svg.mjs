import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { geometryIssues } from './lib/svg-geometry.mjs'

const SVG_DIRS = ['./src/svg-raw/az/']
const GEOMETRY_DIRS = ['az', 'az-color']

const issues = {
  placeholder: [],
  stroke: [],
  geometry: [],
  filenameSpace: [],
  noPath: [],
  clipPath: [],
  fillBlack: []
}

for (const dir of SVG_DIRS) {
  const files = readdirSync(dir).filter((f) => f.endsWith('.svg'))

  for (const file of files) {
    const filePath = join(dir, file)
    const content = readFileSync(filePath, 'utf-8')

    if (file.includes(' ')) {
      issues.filenameSpace.push({ file: filePath, detail: `"${file}"` })
    }

    if (content.includes('<rect') && content.includes('<text') && content.includes('?')) {
      issues.placeholder.push({
        file: filePath,
        detail: 'Contains placeholder <rect>+<text> with "?"'
      })
    }

    if (!content.includes('<path')) {
      issues.noPath.push({ file: filePath, detail: 'No <path> element found' })
    }

    if (content.includes('stroke=')) {
      const strokeColors = [...content.matchAll(/stroke="([^"]*)"/g)].map((m) => m[1])
      issues.stroke.push({
        file: filePath,
        detail: `stroke="${strokeColors.join(', ')}"`
      })
    }

    const fillBlackMatches = [...content.matchAll(/fill="(black|#000|#000000)"/g)]
    if (fillBlackMatches.length > 0) {
      issues.fillBlack.push({
        file: filePath,
        detail: `fill="${fillBlackMatches[0][1]}" — should use "currentColor"`
      })
    }

    if (content.includes('<clipPath') || content.includes('clip-path=')) {
      issues.clipPath.push({
        file: filePath,
        detail: 'Uses <clipPath> — may not render in icon font'
      })
    }
  }
}

for (const set of GEOMETRY_DIRS) {
  const dir = `./src/svg-raw/${set}/`
  for (const file of readdirSync(dir).filter((f) => f.endsWith('.svg'))) {
    for (const detail of geometryIssues(readFileSync(join(dir, file), 'utf-8'), `${set}/${file}`)) {
      issues.geometry.push({ file: join(dir, file), detail })
    }
  }
}

console.log('╔══════════════════════════════════════════════════════╗')
console.log('║           SVG ICON VALIDATION REPORT                ║')
console.log('╚══════════════════════════════════════════════════════╝\n')

const printSection = (title, items, severity) => {
  const icon = severity === 'error' ? '❌' : severity === 'warn' ? '⚠️' : 'ℹ️'
  console.log(`${icon}  ${title} (${items.length})`)
  if (items.length > 0) {
    for (const item of items) {
      console.log(`   ${item.file} — ${item.detail}`)
    }
  }
  console.log()
}

printSection('PLACEHOLDER / INCOMPLETE SVGs (missing real icon art)', issues.placeholder, 'error')
printSection('NO <path> ELEMENT (icon will be empty in font)', issues.noPath, 'error')
printSection('FILENAME WITH SPACES (build may fail)', issues.filenameSpace, 'error')
printSection('STROKE-BASED PATHS (icon fonts only support fills)', issues.stroke, 'warn')
printSection('fill="black" (should use "currentColor" for theming)', issues.fillBlack, 'warn')
printSection('CLIP-PATH USAGE (may not render in icon font)', issues.clipPath, 'warn')
printSection(
  'DISTORTED GEOMETRY (canvas, viewBox, scaling, drawn proportions)',
  issues.geometry,
  'error'
)

const errorCount =
  issues.placeholder.length +
  issues.noPath.length +
  issues.filenameSpace.length +
  issues.geometry.length
const warnCount = issues.stroke.length + issues.fillBlack.length + issues.clipPath.length

console.log('────────────────────────────────────────────────────────')
console.log(`Summary: ${errorCount} errors, ${warnCount} warnings`)

if (errorCount > 0) {
  console.log('\n🔴 There are critical issues that must be fixed before build.')
  process.exit(1)
}
if (warnCount > 0) {
  console.log('\n🟡 There are warnings that may affect icon rendering.')
}
