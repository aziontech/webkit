#!/usr/bin/env node
// Test runner for the spec pipeline hooks and shared lib.
// Usage: node .claude/hooks/__tests__/run.mjs
// Exit 0 = all tests passed; exit 1 = at least one failure.
//
// No external deps. Uses spawnSync to feed JSON to the hooks via stdin.

import { spawnSync } from 'node:child_process'
import { existsSync, readFileSync, mkdirSync, writeFileSync, rmSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  parseSpecFile,
  parseYamlFrontmatter,
  validateFrontmatter,
  getSection,
  parseTable,
  defaultCellIsStringUndefined,
  bodyChecksum,
  constraintsBlockHasCanonicalBullets,
  parseVueSfc,
  extractAnimationClasses,
  hasMotionReduceEscape,
  resolveSpecForComponentPath,
  isLegacyComponent
} from '../_lib/spec.mjs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const ROOT = resolve(__dirname, '../../..')

// ---- tiny assertion framework ----

const results = []
function test(name, fn) {
  try {
    fn()
    results.push({ name, ok: true })
    process.stdout.write(`  ✓ ${name}\n`)
  } catch (err) {
    results.push({ name, ok: false, err: err?.message ?? String(err) })
    process.stdout.write(`  ✗ ${name}\n    ${err?.message ?? err}\n`)
  }
}
function assertEqual(actual, expected, msg) {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(`${msg ?? 'assertEqual'}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`)
  }
}
function assertTrue(cond, msg) {
  if (!cond) throw new Error(msg ?? 'assertTrue failed')
}
function group(name, fn) {
  process.stdout.write(`\n${name}\n`)
  fn()
}

function runHook(hookRelPath, input) {
  const res = spawnSync(
    process.execPath,
    [resolve(ROOT, hookRelPath)],
    { input: JSON.stringify(input), cwd: ROOT, encoding: 'utf-8' }
  )
  return { code: res.status, stderr: res.stderr ?? '', stdout: res.stdout ?? '' }
}

// ---- lib tests ----

group('lib: parseYamlFrontmatter', () => {
  test('parses strings, ints, dates, nested figma', () => {
    const fm = parseYamlFrontmatter([
      'name: tooltip',
      'category: feedback',
      'spec_version: 1',
      'created: 2026-05-22',
      'figma:',
      '  url: https://figma.com/design/abc',
      '  node_id: 10:42'
    ].join('\n'))
    assertEqual(fm.name, 'tooltip')
    assertEqual(fm.category, 'feedback')
    assertEqual(fm.spec_version, 1)
    assertEqual(fm.created, '2026-05-22')
    assertEqual(fm.figma?.url, 'https://figma.com/design/abc')
    assertEqual(fm.figma?.node_id, '10:42')
  })
})

group('lib: validateFrontmatter', () => {
  test('valid template frontmatter (with placeholders) reports errors as expected', () => {
    // The template has placeholder values like <kebab-case-name> — that's not a valid name.
    const tplPath = resolve(ROOT, '.specs/_template.md')
    const { frontmatter } = parseSpecFile(tplPath)
    const errs = validateFrontmatter(frontmatter)
    // Template is a draft with placeholder values — must NOT pass.
    assertTrue(errs.length > 0, 'template placeholders should fail validation')
  })
  test('valid filled-out frontmatter passes', () => {
    const fm = {
      name: 'tooltip',
      category: 'feedback',
      structure: 'monolithic',
      status: 'draft',
      spec_version: 1,
      created: '2026-05-22',
      last_updated: '2026-05-22'
    }
    assertEqual(validateFrontmatter(fm), [])
  })
  test('approved status without checksum fails', () => {
    const fm = {
      name: 'tooltip',
      category: 'feedback',
      structure: 'monolithic',
      status: 'approved',
      spec_version: 1,
      created: '2026-05-22',
      last_updated: '2026-05-22'
    }
    const errs = validateFrontmatter(fm)
    assertTrue(errs.some((e) => e.startsWith('checksum:')), 'should flag missing checksum')
  })
  test('invalid category fails', () => {
    const fm = {
      name: 'tooltip',
      category: 'bogus',
      structure: 'monolithic',
      status: 'draft',
      spec_version: 1,
      created: '2026-05-22',
      last_updated: '2026-05-22'
    }
    const errs = validateFrontmatter(fm)
    assertTrue(errs.some((e) => e.startsWith('category:')), 'should flag bad category')
  })
})

group('lib: body parsing', () => {
  test('getSection finds Props section in template', () => {
    const { body } = parseSpecFile(resolve(ROOT, '.specs/_template.md'))
    const props = getSection(body, 'Props')
    assertTrue(props?.includes('| Prop |'), 'Props header row present')
  })
  test('parseTable extracts rows from Props', () => {
    const { body } = parseSpecFile(resolve(ROOT, '.specs/_template.md'))
    const rows = parseTable(getSection(body, 'Props'))
    assertTrue(rows.length >= 3, `expected >=3 rows, got ${rows.length}`)
    const propNames = rows.map((r) => r.prop.replace(/`/g, ''))
    assertTrue(propNames.includes('kind'), 'kind missing')
    assertTrue(propNames.includes('size'), 'size missing')
    assertTrue(propNames.includes('disabled'), 'disabled missing')
  })
  test('defaultCellIsStringUndefined flags quoted undefined/null only', () => {
    assertTrue(defaultCellIsStringUndefined("`'undefined'`") === true, "quoted 'undefined' should flag")
    assertTrue(defaultCellIsStringUndefined("`'null'`") === true, "quoted 'null' should flag")
    assertTrue(defaultCellIsStringUndefined('`undefined`') === false, 'unquoted undefined is legitimate')
    assertTrue(defaultCellIsStringUndefined("`''`") === false, 'empty string is legitimate')
    assertTrue(defaultCellIsStringUndefined("`'medium'`") === false, 'real string default is legitimate')
  })
})

group('lib: checksum', () => {
  test('bodyChecksum is deterministic', () => {
    const { body } = parseSpecFile(resolve(ROOT, '.specs/_template.md'))
    const a = bodyChecksum(body)
    const b = bodyChecksum(body)
    assertEqual(a, b)
    assertTrue(/^[a-f0-9]{64}$/.test(a), 'looks like sha256 hex')
  })
})

group('lib: constraints block', () => {
  test('template constraints block passes canonical check', () => {
    const { body } = parseSpecFile(resolve(ROOT, '.specs/_template.md'))
    const r = constraintsBlockHasCanonicalBullets(body)
    assertEqual(r, { ok: true, missing: [] })
  })
  test('fixture _missing-constraints.md fails', () => {
    const { body } = parseSpecFile(resolve(ROOT, '.specs/__fixtures__/_missing-constraints.md'))
    const r = constraintsBlockHasCanonicalBullets(body)
    assertEqual(r.ok, false)
  })
})

group('lib: .vue parser', () => {
  test('parseVueSfc returns empty shape for empty input', () => {
    const r = parseVueSfc('<template><div/></template>')
    assertEqual(r.props, [])
    assertEqual(r.emits, [])
    assertEqual(r.slots, [])
    assertEqual(r.defineOptionsName, null)
  })
  test('parseVueSfc extracts defineProps with JSDoc', () => {
    const sfc = `
<script setup lang="ts">
defineOptions({ name: 'Tooltip', inheritAttrs: false })
interface Props {
  /** Text shown inside the tooltip. */
  text?: string
  /** Disables tooltip activation. */
  disabled?: boolean
}
const props = withDefaults(defineProps<Props>(), { text: '', disabled: false })
const emit = defineEmits<{
  show: [event: MouseEvent]
  hide: [event: MouseEvent]
}>()
defineSlots<{ default(): unknown }>()
</script>
<template><div/></template>`
    const r = parseVueSfc(sfc)
    assertEqual(r.defineOptionsName, 'Tooltip')
    assertEqual(r.props.map((p) => p.name).sort(), ['disabled', 'text'])
    assertEqual(r.emits.map((e) => e.name).sort(), ['hide', 'show'])
    assertEqual(r.slots.map((s) => s.name), ['default'])
  })
  test('parseVueSfc extracts defineProps with indented closing brace', () => {
    const sfc = `
<script setup lang="ts">
  interface Props {
    /** Label text. */
    label?: string
    /** Disables the control. */
    disabled?: boolean
  }
  const props = withDefaults(defineProps<Props>(), { label: '', disabled: false })
</script>
<template><div /></template>`
    const r = parseVueSfc(sfc)
    assertEqual(r.props.map((p) => p.name).sort(), ['disabled', 'label'])
  })
})

group('lib: animation extraction', () => {
  test('extractAnimationClasses picks up animate-* and transition-*', () => {
    const vue = '<div class="animate-popup-scale-in transition-colors duration-150 ease-out motion-reduce:transition-none"></div>'
    const classes = extractAnimationClasses(vue)
    assertTrue(classes.includes('animate-popup-scale-in'))
    assertTrue(classes.includes('transition-colors'))
    assertTrue(classes.includes('duration-150'))
    assertTrue(classes.includes('ease-out'))
  })
  test('hasMotionReduceEscape detects motion-reduce escapes', () => {
    assertTrue(hasMotionReduceEscape('class="animate-fade-in motion-reduce:animate-none"'))
    assertTrue(!hasMotionReduceEscape('class="animate-fade-in"'))
  })
})

group('lib: component path resolution', () => {
  test('resolveSpecForComponentPath maps webkit-layer .vue', () => {
    const r = resolveSpecForComponentPath(
      resolve(ROOT, 'packages/webkit/src/components/feedback/tooltip/tooltip.vue'),
      ROOT
    )
    assertEqual(r?.category, 'feedback')
    assertEqual(r?.name, 'tooltip')
  })
  test('resolveSpecForComponentPath returns null for non-webkit paths', () => {
    assertEqual(resolveSpecForComponentPath(resolve(ROOT, 'random/file.vue'), ROOT), null)
  })
})

group('lib: legacy whitelist', () => {
  test('legacy button is whitelisted', () => {
    assertTrue(isLegacyComponent('actions', 'button', ROOT))
  })
  test('unknown component is NOT whitelisted', () => {
    assertTrue(!isLegacyComponent('feedback', 'tooltip', ROOT))
  })
})

// ---- hook tests ----

group('hook: enforce-spec-exists.mjs', () => {
  test('non-target path passes through (exit 0)', () => {
    const r = runHook('.claude/hooks/enforce-spec-exists.mjs', {
      tool_name: 'Write',
      tool_input: { file_path: resolve(ROOT, 'random/file.vue') }
    })
    assertEqual(r.code, 0)
  })
  test('legacy component bypass (exit 0)', () => {
    const r = runHook('.claude/hooks/enforce-spec-exists.mjs', {
      tool_name: 'Write',
      tool_input: {
        file_path: resolve(ROOT, 'packages/webkit/src/components/actions/button/button.vue')
      }
    })
    assertEqual(r.code, 0)
  })
  test('new component without spec blocks (exit 2)', () => {
    const r = runHook('.claude/hooks/enforce-spec-exists.mjs', {
      tool_name: 'Write',
      tool_input: {
        file_path: resolve(ROOT, 'packages/webkit/src/components/feedback/tooltip/tooltip.vue')
      }
    })
    assertEqual(r.code, 2)
    assertTrue(r.stderr.includes('Spec missing'), 'stderr mentions missing spec')
  })
  test('non-Write tool name skipped (exit 0)', () => {
    const r = runHook('.claude/hooks/enforce-spec-exists.mjs', {
      tool_name: 'Read',
      tool_input: { file_path: resolve(ROOT, 'random.vue') }
    })
    assertEqual(r.code, 0)
  })
})

group('hook: validate-spec-compliance.mjs', () => {
  test('non-target path passes through (exit 0)', () => {
    const r = runHook('.claude/hooks/validate-spec-compliance.mjs', {
      tool_name: 'Write',
      tool_input: { file_path: resolve(ROOT, 'random/file.vue') }
    })
    assertEqual(r.code, 0)
  })
  test('legacy component bypass (exit 0)', () => {
    const r = runHook('.claude/hooks/validate-spec-compliance.mjs', {
      tool_name: 'Write',
      tool_input: {
        file_path: resolve(ROOT, 'packages/webkit/src/components/actions/button/button.vue')
      }
    })
    assertEqual(r.code, 0)
  })
  test('non-existent .vue path passes through (exit 0)', () => {
    const r = runHook('.claude/hooks/validate-spec-compliance.mjs', {
      tool_name: 'Write',
      tool_input: {
        file_path: resolve(ROOT, 'packages/webkit/src/components/feedback/tooltip/tooltip.vue')
      }
    })
    assertEqual(r.code, 0)
  })
})

group('hook: validate-story-source.mjs', () => {
  const story = (content) => ({ tool_name: 'Write', tool_input: { file_path: resolve(ROOT, 'x.stories.js'), content } })

  test('non-story path passes through (exit 0)', () => {
    const r = runHook('.claude/hooks/validate-story-source.mjs', {
      tool_name: 'Write',
      tool_input: { file_path: resolve(ROOT, 'random/file.vue'), content: '<foo />' }
    })
    assertEqual(r.code, 0)
  })
  test('new story with literal docs + toSfc + PascalCase passes (exit 0)', () => {
    const r = runHook(
      '.claude/hooks/validate-story-source.mjs',
      story(
        [
          "import Foo from '@aziontech/webkit/foo'",
          "import { toSfc } from '../../_shared/story-source'",
          "tags: ['autodocs']",
          'const T = `<Foo bar="1" />`',
          'docs: { canvas: { sourceState: "shown" }, source: { code: toSfc(IMPORT, T) } }'
        ].join('\n')
      )
    )
    assertEqual(r.code, 0)
  })
  test('docs as a function call blocks (exit 2)', () => {
    const r = runHook(
      '.claude/hooks/validate-story-source.mjs',
      story(
        [
          "import Foo from '@aziontech/webkit/foo'",
          "import { toSfc } from '../../_shared/story-source'",
          "tags: ['autodocs']",
          "docs: runnableDocs({ imports: IMPORT })"
        ].join('\n')
      )
    )
    assertEqual(r.code, 2)
    assertTrue(/docs-not-literal/.test(r.stderr), 'should flag docs function call')
  })
  test('lowercase/kebab component tag blocks (exit 2)', () => {
    const r = runHook(
      '.claude/hooks/validate-story-source.mjs',
      story(
        [
          "import EmptyState from '@aziontech/webkit/empty-state'",
          "import { toSfc } from '../../_shared/story-source'",
          "tags: ['autodocs']",
          'const T = `<empty-state title="x" />`',
          'docs: { canvas: { sourceState: "shown" }, source: { code: toSfc(IMPORT, T) } }'
        ].join('\n')
      )
    )
    assertEqual(r.code, 2)
    assertTrue(/lowercase-tag/.test(r.stderr), 'should flag lowercase tag')
  })
  test('import binding not matching export subpath blocks (exit 2)', () => {
    const r = runHook(
      '.claude/hooks/validate-story-source.mjs',
      story(
        [
          "import Chip from '@aziontech/webkit/chips'",
          "import { toSfc } from '../../_shared/story-source'",
          "tags: ['autodocs']",
          'const T = `<Chip label="x" />`',
          'docs: { canvas: { sourceState: "shown" }, source: { code: toSfc(IMPORT, T) } }'
        ].join('\n')
      )
    )
    assertEqual(r.code, 2)
    assertTrue(/import-binding-mismatch/.test(r.stderr), 'should flag binding/subpath mismatch')
  })
  test('hand-rolled transform blocks (exit 2)', () => {
    const r = runHook(
      '.claude/hooks/validate-story-source.mjs',
      story(
        ["import Foo from '@aziontech/webkit/foo'", "tags: ['autodocs']", 'docs: { source: { transform: (code) => code } }'].join('\n')
      )
    )
    assertEqual(r.code, 2)
    assertTrue(/handrolled-transform|missing-helper/.test(r.stderr), 'should flag hand-rolled / missing helper')
  })
  test('nested <template> blocks (exit 2)', () => {
    const r = runHook(
      '.claude/hooks/validate-story-source.mjs',
      story(
        [
          "import Foo from '@aziontech/webkit/foo'",
          "import { toSfc } from '../../_shared/story-source'",
          "tags: ['autodocs']",
          'const T = `<template>\n  <template>\n    <Foo />\n  </template>\n</template>`',
          'docs: { canvas: { sourceState: "shown" }, source: { code: toSfc(IMPORT, T) } }'
        ].join('\n')
      )
    )
    assertEqual(r.code, 2)
    assertTrue(/nested-template/.test(r.stderr), 'should flag nested template')
  })
})

// ---- summary ----

const failed = results.filter((r) => !r.ok)
process.stdout.write(`\n${results.length} tests, ${results.length - failed.length} passed, ${failed.length} failed.\n`)
process.exit(failed.length === 0 ? 0 : 1)
