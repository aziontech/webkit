import assert from 'node:assert/strict'
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

const EXAMPLES = resolve(dirname(fileURLToPath(import.meta.url)), '../../examples')

const entries = readdirSync(EXAMPLES, { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && existsSync(join(EXAMPLES, entry.name, 'examples.json')))
  .flatMap((group) => {
    const data = JSON.parse(readFileSync(join(EXAMPLES, group.name, 'examples.json'), 'utf8'))
    return (data.site ?? [])
      .filter((example) => example.json)
      .map((example) => ({
        file: `${group.name}/${example.json}`,
        ...JSON.parse(readFileSync(join(EXAMPLES, group.name, example.json), 'utf8'))
      }))
  })

const of = (id) => entries.filter((entry) => entry._id === id)

function capabilityGridIconGaps(props) {
  const items = props.items ?? []
  const bare = items.filter((item) => !item.icon).length
  return bare > 0 && bare < items.length ? [`${bare} of ${items.length} items have no icon`] : []
}

function networkBenefitIconGaps(props) {
  return (props.benefits ?? [])
    .filter((benefit) => !benefit.icon)
    .map((benefit) => `benefit "${benefit.title}" has no icon`)
}

const RETIRED_MEDIA = [
  'codeTabs',
  'defaultFile',
  'copyAriaLabel',
  'diagram',
  'image',
  'imageAlt',
  'imageFramed'
]

const drawn = (media) =>
  Boolean(
    (media.scene && media.scene.component !== 'Diagram') || media.widget || media.illustration
  )

function mediaBandGaps(id, props) {
  const bands = id === 'media-split-stack-section' ? (props.bands ?? []) : [props]
  return bands.flatMap((band) => [
    ...(drawn(band) ? [] : [`"${band.title}" has no illustration, widget or scene`]),
    ...RETIRED_MEDIA.filter((key) => key in band).map((key) => `"${band.title}" sets ${key}`)
  ])
}

test('the site JSON holds site entries to check', () => {
  assert.ok(entries.length > 20)
})

test('a capability grid gives every item an icon or none (benefits vs resources and text columns)', () => {
  const gaps = of('capability-grid-section').flatMap((entry) =>
    capabilityGridIconGaps(entry.props ?? {}).map((gap) => `${entry.file}: ${gap}`)
  )
  assert.deepEqual(gaps, [])
})

test('every network-section benefit carries its icon', () => {
  const gaps = of('network-section').flatMap((entry) =>
    networkBenefitIconGaps(entry.props ?? {}).map((gap) => `${entry.file}: ${gap}`)
  )
  assert.deepEqual(gaps, [])
})

test('every media band has a drawn picture and no code or diagram', () => {
  const gaps = ['media-split-section', 'media-split-stack-section'].flatMap((id) =>
    of(id).flatMap((entry) =>
      mediaBandGaps(id, entry.props ?? {}).map((gap) => `${entry.file}: ${gap}`)
    )
  )
  assert.deepEqual(gaps, [])
})

test('the checks fire on a gap and stay silent on a whole grid', () => {
  assert.equal(capabilityGridIconGaps({ items: [{ icon: 'az az-bolt' }, {}] }).length, 1)
  assert.equal(capabilityGridIconGaps({ items: [{}, {}] }).length, 0)
  assert.equal(capabilityGridIconGaps({ items: [{ icon: 'a' }, { icon: 'b' }] }).length, 0)
  assert.equal(networkBenefitIconGaps({ benefits: [{ title: 'A' }] }).length, 1)
  assert.equal(
    networkBenefitIconGaps({ benefits: [{ title: 'A', icon: 'az az-globe' }] }).length,
    0
  )
})
