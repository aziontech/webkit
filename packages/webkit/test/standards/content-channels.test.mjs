import assert from 'node:assert/strict'
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

import {
  CONTENT_CHANNELS,
  CONTENT_FOLDERS,
  NOT_CONTENT,
  PIPE_TABLE
} from '../../scripts/lib/content-channels.mjs'

const PKG = join(dirname(fileURLToPath(import.meta.url)), '../..')
const COMPONENTS = join(PKG, 'src/components')
const read = (path) => readFileSync(join(PKG, path), 'utf8')

const parser = read('src/components/docs/doc-markdown/parse-doc-markdown.ts')
const blockTags = new Set(
  [
    ...parser.match(/DOC_MARKDOWN_BLOCK_TAGS[^=]*=\s*\[([\s\S]*?)\]/)[1].matchAll(/'([A-Za-z]+)'/g)
  ].map((match) => match[1])
)
const renderer = read('src/components/docs/doc-markdown/doc-markdown.vue')
const scenes = read('src/assets/scene-registry.ts')
const contentScenes = read('src/assets/content-scenes.ts')
const loadsContent = (tag, name) =>
  new RegExp(`\\b${tag}: \\(\\) =>\\s*import\\('[^']*/${name}/${name}\\.vue'\\)`).test(
    contentScenes
  )
const sections = read('src/components/marketing/site-page/site-page-sections.ts')

const componentFile = (folder) => join(COMPONENTS, folder, `${folder.split('/')[1]}.vue`)

test('every content component declares its channels', () => {
  const missing = []
  for (const category of CONTENT_FOLDERS) {
    for (const name of readdirSync(join(COMPONENTS, category))) {
      const folder = `${category}/${name}`
      if (!existsSync(componentFile(folder))) continue
      if (!CONTENT_CHANNELS[folder] && !NOT_CONTENT[folder]) missing.push(folder)
    }
  }
  assert.deepEqual(
    missing,
    [],
    'Add each to CONTENT_CHANNELS in scripts/lib/content-channels.mjs (see rules/webkit-content-channels.md).'
  )
})

for (const [folder, entry] of Object.entries(CONTENT_CHANNELS)) {
  test(`${folder} declares each channel once, and the declared ones are wired`, () => {
    assert.ok(existsSync(componentFile(folder)), `${folder} has no component`)
    const pending = entry.pending ?? []
    const outOfScope = entry.outOfScope ?? {}
    for (const channel of ['docs', 'site']) {
      const states = [
        Boolean(entry[channel]),
        pending.includes(channel),
        Boolean(outOfScope[channel])
      ]
      assert.equal(
        states.filter(Boolean).length,
        1,
        `${folder}: ${channel} must be wired, pending or out of scope with a reason`
      )
    }
    const name = folder.split('/')[1]
    const docs = entry.docs ?? (pending.includes('docs') ? null : undefined)
    if (entry.docs === PIPE_TABLE) {
      assert.match(
        renderer,
        /case 'table':\s*return h\(\s*TableRoot/,
        `doc-markdown.vue does not render a pipe table with ${folder}`
      )
      assert.ok(
        new RegExp(`import\\('[^']*/${folder}/${name}\\.vue'\\)`).test(renderer),
        `doc-markdown.vue does not load ${folder} lazily`
      )
    } else if (entry.docs) {
      assert.ok(blockTags.has(entry.docs), `DocMarkdown does not parse <${entry.docs}>`)
      assert.ok(
        new RegExp(
          `${folder.replace('/', '\\/')}\\/${name}\\.vue|\\.\\.\\/${name}\\/${name}\\.vue`
        ).test(renderer) ||
          (renderer.includes(`'${entry.docs}'`) && loadsContent(entry.docs, name)),
        `doc-markdown.vue neither imports ${folder} nor loads it from content-scenes.ts`
      )
      assert.ok(
        new RegExp(`\\b${entry.docs}\\b[,:\\s]|'${entry.docs}'`).test(renderer),
        `doc-markdown.vue maps no <${entry.docs}> tag`
      )
    }
    if (entry.site?.startsWith('scene:')) {
      const scene = entry.site.slice('scene:'.length)
      assert.ok(
        new RegExp(`\\b${scene}: \\(\\) =>\\s*import\\('[^']*/${name}/${name}\\.vue'\\)`).test(
          scenes
        ) ||
          (new RegExp(`\\b${scene}: contentScene\\('${scene}'\\)`).test(scenes) &&
            loadsContent(scene, name)),
        `${scene} is not a scene that loads ${folder}`
      )
    } else if (entry.site) {
      assert.match(
        sections,
        new RegExp(`'${entry.site}': \\(\\) =>`),
        `SitePage does not register ${entry.site}`
      )
    }
    if (docs === null) {
      assert.ok(
        !new RegExp(`/${name}/${name}\\.vue`).test(renderer),
        `${folder} is wired in DocMarkdown now: move docs from pending to the tag`
      )
    }
  })
}
