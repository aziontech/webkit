import { readdirSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'

const CHARSET = 'utf-8'
const DIST_DIR = './dist'
const COLOR_DIR = './src/svg-raw/ai-cor'

mkdirSync(DIST_DIR, { recursive: true })

const files = readdirSync(COLOR_DIR)
  .filter((f) => f.endsWith('.svg'))
  .sort()

const data = files.map((file) => {
  const name = file.replace('.svg', '')

  return {
    icon: `ai-cor ${name}`,
    keywords: '',
    name,
    colored: true,
    svg: readFileSync(join(COLOR_DIR, file), CHARSET).trim()
  }
})

writeFileSync(join(DIST_DIR, 'color-catalog.json'), JSON.stringify(data, null, 2) + '\n', CHARSET)

console.log(`  ✔ dist/color-catalog.json created (${data.length} colored icons)`)
