import assert from 'node:assert/strict'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import test from 'node:test'

import {
  areaOf,
  codeLines,
  collectFiles,
  kindOf,
  measure
} from '../../scripts/lib/maintainability.mjs'

const repeat = (n, line) => Array.from({ length: n }, (_, i) => line(i)).join('\n')

const sfc = ({ script = '', templateLines = 1 } = {}) =>
  `<script setup lang="ts">\n${script}\n</script>\n<template>\n  <div>\n${repeat(
    templateLines,
    (i) => `    <span>${i}</span>`
  )}\n  </div>\n</template>\n`

const vueWithCodeLines = (total) => sfc({ templateLines: total - 6 })

const tsWithCodeLines = (total) => repeat(total, (i) => `export const value${i} = ${i}`) + '\n'

const fn = (lines) =>
  `export function sample() {\n${repeat(lines - 2, (i) => `  console.log(${i})`)}\n}\n`

const branches = (count) =>
  `export function sample(x: number) {\n${repeat(count, (i) => `  if (x === ${i}) return ${i}`)}\n  return -1\n}\n`

const propsInterface = (count) =>
  `interface Props {\n${repeat(count, (i) => `  p${i}?: string`)}\n}\nconst props = defineProps<Props>()`

async function run(files) {
  const dir = mkdtempSync(join(tmpdir(), 'azion-ui-maintainability-'))
  try {
    for (const [file, content] of Object.entries(files)) {
      mkdirSync(dirname(join(dir, file)), { recursive: true })
      writeFileSync(join(dir, file), content)
    }
    const measured = await measure(dir, collectFiles(dir))
    return Object.fromEntries(measured.map((f) => [f.file, f]))
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
}

const rules = (entry) => entry.violations.map((v) => v.rule)

const COMPONENT = 'src/components/action/sample/sample.vue'

test('codeLines skips blank lines and comment-only lines', () => {
  const text = 'a\n\n// note\n/* one\ntwo */\nb // tail\n<!-- html -->\n'
  const comments = [
    [text.indexOf('// note'), text.indexOf('// note') + 7],
    [text.indexOf('/*'), text.indexOf('*/') + 2],
    [text.indexOf('// tail'), text.indexOf('// tail') + 7],
    [text.indexOf('<!--'), text.indexOf('-->') + 3]
  ]
  assert.equal(codeLines(text, comments), 2)
})

test('kinds and areas follow the folders', () => {
  assert.equal(kindOf(COMPONENT), 'component')
  assert.equal(kindOf('examples/button/default.vue'), 'component')
  assert.equal(kindOf('blocks/view/view-table/view-table.vue'), 'block-page')
  assert.equal(kindOf('blocks/view/view-table/variants/empty.vue'), 'block-variant')
  assert.equal(kindOf('src/composables/use-x/use-x.ts'), 'module')
  assert.equal(kindOf('src/locales/en.ts'), 'data')
  assert.equal(kindOf('blocks/view/view-table/sample.ts'), 'data')
  assert.equal(areaOf(COMPONENT), 'src/components/action')
  assert.equal(areaOf('blocks/view/view-table/view-table.vue'), 'blocks/view')
  assert.equal(areaOf('examples/button/default.vue'), 'examples')
  assert.equal(areaOf('src/cli/cli.js'), 'src/cli')
})

test('collectFiles leaves out tests, Code Connect, declarations and test folders', async () => {
  const measured = await run({
    'src/components/action/sample/sample.vue': sfc(),
    'src/components/action/sample/sample.test.ts': 'export {}\n',
    'src/components/action/sample/sample.figma.ts': 'export {}\n',
    'src/utils/types.d.ts': 'export {}\n',
    'src/test/helper.ts': 'export {}\n'
  })
  assert.deepEqual(Object.keys(measured), ['src/components/action/sample/sample.vue'])
})

test('component file: 400 lines pass, 401 fail', async () => {
  const m = await run({
    'src/components/action/a/a.vue': vueWithCodeLines(400),
    'src/components/action/b/b.vue': vueWithCodeLines(401)
  })
  assert.equal(m['src/components/action/a/a.vue'].lines, 400)
  assert.deepEqual(rules(m['src/components/action/a/a.vue']), [])
  assert.deepEqual(rules(m['src/components/action/b/b.vue']), ['component-file'])
})

test('blank, comment and HTML comment lines are not counted', async () => {
  const notes = (line) => repeat(20, () => line)
  const file = `<script setup lang="ts">\n${notes('// note')}\n/*\n${notes(' * note')}\n */\n\n\n</script>\n<template>\n  <div>\n${notes('    <!-- note -->')}\n${repeat(394, (i) => `    <span>${i}</span>`)}\n  </div>\n</template>\n`
  const m = await run({ [COMPONENT]: file })
  assert.equal(m[COMPONENT].lines, 400)
  assert.equal(m[COMPONENT].scriptLines, 0)
  assert.deepEqual(rules(m[COMPONENT]), [])
})

test('script setup: 200 lines pass, 201 fail', async () => {
  const m = await run({
    'src/components/action/a/a.vue': sfc({ script: repeat(200, (i) => `const a${i} = ${i}`) }),
    'src/components/action/b/b.vue': sfc({ script: repeat(201, (i) => `const a${i} = ${i}`) })
  })
  assert.equal(m['src/components/action/a/a.vue'].scriptLines, 200)
  assert.deepEqual(rules(m['src/components/action/a/a.vue']), [])
  assert.deepEqual(rules(m['src/components/action/b/b.vue']), ['script-setup'])
})

test('module: 300 lines pass, 301 fail; data files have no file limit', async () => {
  const m = await run({
    'src/composables/use-a/use-a.ts': tsWithCodeLines(300),
    'src/composables/use-b/use-b.ts': tsWithCodeLines(301),
    'src/locales/en.ts': tsWithCodeLines(900)
  })
  assert.deepEqual(rules(m['src/composables/use-a/use-a.ts']), [])
  assert.deepEqual(rules(m['src/composables/use-b/use-b.ts']), ['module'])
  assert.deepEqual(rules(m['src/locales/en.ts']), [])
})

test('function: 60 lines pass, 61 fail, in .ts and in script setup', async () => {
  const m = await run({
    'src/utils/a.ts': fn(60),
    'src/utils/b.ts': fn(61),
    [COMPONENT]: sfc({ script: fn(61).replace('export ', '') })
  })
  assert.deepEqual(rules(m['src/utils/a.ts']), [])
  assert.deepEqual(rules(m['src/utils/b.ts']), ['function-lines'])
  assert.equal(m['src/utils/b.ts'].violations[0].value, 61)
  assert.deepEqual(rules(m[COMPONENT]), ['function-lines'])
})

test('complexity: 12 passes, 13 fails; template expressions are not counted', async () => {
  const template = `<div :class="${repeat(14, (i) => `x === ${i} ? 'a' : `)}'b'" />`
  const m = await run({
    'src/utils/a.ts': branches(11),
    'src/utils/b.ts': branches(12),
    [COMPONENT]: `<script setup lang="ts">\nconst x = 1\n</script>\n<template>\n  ${template}\n</template>\n`
  })
  assert.deepEqual(rules(m['src/utils/a.ts']), [])
  assert.deepEqual(rules(m['src/utils/b.ts']), ['complexity'])
  assert.equal(m['src/utils/b.ts'].violations[0].value, 13)
  assert.deepEqual(rules(m[COMPONENT]), [])
})

test('line length: 200 characters pass, 201 fail', async () => {
  const line = (n) => `export const text = '${'a b '.repeat(60).slice(0, n - 22)}'\n`
  const m = await run({ 'src/utils/a.ts': line(200), 'src/utils/b.ts': line(201) })
  assert.deepEqual(rules(m['src/utils/a.ts']), [])
  assert.deepEqual(rules(m['src/utils/b.ts']), ['line-length'])
})

test('block page: 400 lines pass, 401 fail; block variant: 120 pass, 121 fail', async () => {
  const m = await run({
    'blocks/view/view-a/view-a.vue': vueWithCodeLines(400),
    'blocks/view/view-b/view-b.vue': vueWithCodeLines(401),
    'blocks/view/view-a/variants/empty.vue': vueWithCodeLines(120),
    'blocks/view/view-a/variants/error.vue': vueWithCodeLines(121)
  })
  assert.deepEqual(rules(m['blocks/view/view-a/view-a.vue']), [])
  assert.deepEqual(rules(m['blocks/view/view-b/view-b.vue']), ['block-page'])
  assert.deepEqual(rules(m['blocks/view/view-a/variants/empty.vue']), [])
  assert.deepEqual(rules(m['blocks/view/view-a/variants/error.vue']), ['block-variant'])
})

test('props: 20 pass, 21 fail, counting extends and intersections', async () => {
  const extended = `interface Base {\n${repeat(11, (i) => `  b${i}?: string`)}\n}\ntype Extra = { e0?: string } & { e1?: string }\ninterface Props extends Base {\n${repeat(8, (i) => `  p${i}?: string`)}\n}\nconst props = defineProps<Props & Extra>()`
  const m = await run({
    'src/components/action/a/a.vue': sfc({ script: propsInterface(20) }),
    'src/components/action/b/b.vue': sfc({ script: propsInterface(21) }),
    'src/components/action/c/c.vue': sfc({ script: extended }),
    'src/components/action/d/d.vue': sfc({
      script: `const props = withDefaults(defineProps<{\n${repeat(21, (i) => `  p${i}?: string`)}\n}>(), {})`
    })
  })
  assert.deepEqual(rules(m['src/components/action/a/a.vue']), [])
  assert.deepEqual(rules(m['src/components/action/b/b.vue']), ['props'])
  assert.equal(m['src/components/action/c/c.vue'].props, 21)
  assert.deepEqual(rules(m['src/components/action/c/c.vue']), ['props'])
  assert.deepEqual(rules(m['src/components/action/d/d.vue']), ['props'])
})

test('models: 5 pass, 6 fail', async () => {
  const models = (n) => repeat(n, (i) => `const m${i} = defineModel<string>('m${i}')`)
  const m = await run({
    'src/components/action/a/a.vue': sfc({ script: models(5) }),
    'src/components/action/b/b.vue': sfc({ script: models(6) })
  })
  assert.deepEqual(rules(m['src/components/action/a/a.vue']), [])
  assert.deepEqual(rules(m['src/components/action/b/b.vue']), ['models'])
})
