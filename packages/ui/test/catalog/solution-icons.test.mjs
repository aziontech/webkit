import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const read = (path) => readFileSync(new URL(path, import.meta.url), 'utf8')

const manifest = JSON.parse(read('../../../icons/src/icons.json'))
const taxonomy = JSON.parse(read('./azion-solutions.json'))
const solutionIcons = manifest.icons.filter(
  (icon) => icon.group === 'azion' && icon.category === 'solution'
)

const iconName = (shortName) =>
  shortName
    .replace(/\s*\([^)]*\)/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

test('the Solutions icons are exactly the Azion Solutions, in taxonomy order', () => {
  assert.deepEqual(
    solutionIcons.map((icon) => icon.name),
    taxonomy.solutions.map((entry) => iconName(entry.shortName))
  )
})

test('a Solution icon says which Solution it stands for, by its canonical name', () => {
  for (const entry of taxonomy.solutions) {
    const icon = solutionIcons.find((i) => i.name === iconName(entry.shortName))
    assert.ok(
      icon?.means.startsWith(entry.solution),
      `${entry.solution}: means is "${icon?.means}"`
    )
  }
})

test('every Solution icon is a font glyph', () => {
  for (const icon of solutionIcons) assert.equal(icon.set, 'mono', icon.name)
})
