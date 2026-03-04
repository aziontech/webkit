import { writeFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const CWD = process.cwd()
const CHARSET = 'utf-8'
const DIST_DIR = './dist'
const SVG_DIR = join(CWD, 'src/svg-raw')
const svgFolder = readdirSync(SVG_DIR)
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
