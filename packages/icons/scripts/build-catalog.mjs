import { writeFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const CWD = process.cwd()
const CHARSET = 'utf-8'
const DIST_DIR = './dist'
const SVG_DIR = join(CWD, 'src/svg-raw')
// Only the woff2 font folders. Colored icons (ai-cor) are not part of the font
// and ship via dist/color-catalog.json — see scripts/build-color-catalog.mjs.
const FONT_FOLDERS = ['ai', 'pi']
const svgFolder = readdirSync(SVG_DIR).filter((folder) => FONT_FOLDERS.includes(folder))
const data = []

svgFolder.map(function (folder) {
  const iconsFolder = join(SVG_DIR, folder)
  const listIcons = readdirSync(iconsFolder)

  listIcons.map(function (iconName) {
    iconName = iconName.replace('.svg', '')

    data.push({
      icon: `${folder} ${iconName}`,
      keywords: '',
      name: `${iconName}`
    })
  })
})

writeFileSync(join(DIST_DIR, `catalog.json`), JSON.stringify(data, null, 2) + '\n', CHARSET)
