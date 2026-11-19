import assert from 'node:assert/strict'
import { readdirSync, readFileSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

import {
  BACKDROP_SCENES,
  GRAPHIC_COMPONENTS,
  scanTextureBackdrop,
  textureBackdropApplies
} from '../../src/eslint-plugin/lib/texture-backdrop.js'

const WEBKIT = resolve(dirname(fileURLToPath(import.meta.url)), '../..')

const sfc = (template) => `<template>\n${template}\n</template>\n`
const vue = (template) => scanTextureBackdrop(sfc(template), 'packages/webkit/examples/x/x.vue')
const json = (data) =>
  scanTextureBackdrop(JSON.stringify(data), 'packages/webkit/examples/x/page-entry.json')

const chartScene = {
  component: 'Chart',
  props: { ariaLabel: 'Requests' },
  children: [{ component: 'ChartLine' }]
}

test('fires on a graphic next to a Texture', () => {
  for (const template of [
    '<div class="relative"><Texture variant="pixelate" /><div><Chart aria-label="Requests" /></div></div>',
    '<div><Texture /><FlowDiagram :nodes="nodes" /></div>',
    '<div><texture variant="dots" /><section><stat-tile-group><stat-tile label="Requests" /></stat-tile-group></section></div>',
    '<div><Texture :variant="variant" /><BarList :items="items" /></div>'
  ]) {
    assert.deepEqual(vue(template), ['graphic-on-texture'], template)
  }
})

test('fires on a graphic in a slot a section paints a texture under', () => {
  for (const template of [
    '<ConsoleShowcaseSection title="Firewall"><template #scene><Chart /></template></ConsoleShowcaseSection>',
    '<ConsoleShowcaseSection variant="console" texture="pixelate"><template #scene><MapChart /></template></ConsoleShowcaseSection>',
    '<MediaSplitSection title="Requests"><DonutChart /></MediaSplitSection>',
    '<MediaSplit><template #media><GaugeChart /></template></MediaSplit>',
    '<Hero floor-texture="pixelate"><template #bottom><Tracker /></template></Hero>',
    '<Backdrop><SparkChart /></Backdrop>'
  ]) {
    assert.deepEqual(vue(template), ['graphic-on-texture'], template)
  }
})

test('stays silent on text, on a plain ground and on a framed window', () => {
  for (const template of [
    '<div><Texture variant="pixelate" /><div><h2>Watch every threat</h2><p>Every five minutes.</p></div></div>',
    '<div><Texture variant="none" /><Chart /></div>',
    '<div><Texture /></div><Chart />',
    '<ConsoleShowcaseSection variant="diagram"><template #scene><Chart /></template></ConsoleShowcaseSection>',
    '<ConsoleShowcaseSection texture="none"><template #scene><FlowDiagram /></template></ConsoleShowcaseSection>',
    '<MediaSplit texture="none"><template #media><Chart /></template></MediaSplit>',
    '<Hero><template #bottom><Chart /></template></Hero>',
    '<div><Texture variant="pixelate" /><ConsoleMockupShell><FlowDiagram /></ConsoleMockupShell></div>',
    '<ConsoleShowcaseSection><template #scene><ConsoleMockup scene="workload" /></template></ConsoleShowcaseSection>'
  ]) {
    assert.deepEqual(vue(template), [], template)
  }
})

test('fires on page JSON that puts a graphic scene on a textured band', () => {
  assert.deepEqual(
    json({
      _id: 'console-showcase-section',
      props: { title: 'Firewall' },
      scenes: { scene: chartScene }
    }),
    ['graphic-on-texture']
  )
  assert.deepEqual(
    json([
      {
        _id: 'console-showcase-section',
        props: { variant: 'console' },
        scenes: { scene: { component: 'StatTileGroup', children: [{ component: 'StatTile' }] } }
      }
    ]),
    ['graphic-on-texture']
  )
  assert.deepEqual(
    json({ _id: 'media-split-section', props: { scene: { component: 'MapChart' } } }),
    ['graphic-on-texture']
  )
  assert.deepEqual(
    json({
      sections: [
        {
          _id: 'media-split-section',
          scenes: { media: { component: 'Box', children: [chartScene] } }
        }
      ]
    }),
    ['graphic-on-texture']
  )
})

test('fires on page JSON that puts any content scene on a textured band', () => {
  for (const component of [
    'Accordion',
    'Card',
    'CodeBlock',
    'Embed',
    'IntegrationCard',
    'KeyValueList',
    'PlanFeatureList'
  ]) {
    assert.deepEqual(
      json({ _id: 'console-showcase-section', scenes: { scene: { component } } }),
      ['graphic-on-texture'],
      component
    )
    assert.deepEqual(
      json({
        _id: 'console-showcase-section',
        props: { texture: 'none' },
        scenes: { scene: { component } }
      }),
      [],
      component
    )
  }
})

test('the backdrop scenes match the scene registry', () => {
  const registry = readFileSync(join(WEBKIT, 'src/assets/scene-registry.ts'), 'utf8')
  const list = /backdropScenes[^=]*=\s*\[([^\]]*)\]/.exec(registry)?.[1] ?? ''
  assert.deepEqual(
    [...list.matchAll(/'(\w+)'/g)].map((match) => match[1]),
    BACKDROP_SCENES
  )
})

test('stays silent on page JSON with a plain ground or no graphic', () => {
  for (const data of [
    {
      _id: 'console-showcase-section',
      props: { variant: 'diagram' },
      scenes: { scene: chartScene }
    },
    { _id: 'console-showcase-section', props: { texture: 'none' }, scenes: { scene: chartScene } },
    { _id: 'media-split-section', props: { texture: 'none', scene: { component: 'Chart' } } },
    { _id: 'console-showcase-section', scenes: { scene: { component: 'ConsoleMockup' } } },
    { _id: 'hero-section', props: { title: 'Build' } }
  ]) {
    assert.deepEqual(json(data), [], JSON.stringify(data))
  }
})

test('applies to sources and page JSON of components, blocks and examples only', () => {
  assert.equal(textureBackdropApplies('packages/webkit/examples/chart/page-entry.json'), true)
  assert.equal(textureBackdropApplies('packages/webkit/examples/chart/default.vue'), true)
  assert.equal(
    textureBackdropApplies('packages/webkit/blocks/view/view-table/view-table.vue'),
    true
  )
  assert.equal(
    textureBackdropApplies('packages/webkit/src/components/content/texture/texture.vue'),
    true
  )
  assert.equal(textureBackdropApplies('packages/webkit/examples/chart/examples.json'), false)
  assert.equal(textureBackdropApplies('packages/webkit/src/test/texture-backdrop.test.ts'), false)
  assert.equal(textureBackdropApplies('apps/docs/src/pages/index.vue'), false)
})

test('every graphic component marks its root with data-plain-ground', () => {
  const sources = []
  const walk = (dir) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const path = join(dir, entry.name)
      if (entry.isDirectory()) walk(path)
      else if (entry.name.endsWith('.vue')) sources.push(path)
    }
  }
  walk(join(WEBKIT, 'src/components'))
  for (const name of GRAPHIC_COMPONENTS.filter((name) => name !== 'StatTileGroup')) {
    const kebab = name.replace(/[A-Z]/g, (c, i) => `${i ? '-' : ''}${c.toLowerCase()}`)
    const file = sources.find((path) => path.endsWith(`/${kebab}/${kebab}.vue`))
    assert.ok(file, `no source for ${name}`)
    const template = readFileSync(file, 'utf8').split('<template>')[1] ?? ''
    const root = template.slice(0, template.indexOf('>'))
    assert.match(
      root,
      /\sdata-plain-ground\s/,
      `${relative(WEBKIT, file)} root carries no data-plain-ground`
    )
  }
})
