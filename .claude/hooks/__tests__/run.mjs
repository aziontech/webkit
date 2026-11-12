#!/usr/bin/env node
// Test runner for the spec pipeline hooks and shared lib.
// Usage: node .claude/hooks/__tests__/run.mjs
// Exit 0 = all tests passed; exit 1 = at least one failure.
//
// No external deps. Uses spawnSync to feed JSON to the hooks via stdin.

import { spawnSync } from 'node:child_process'
import { existsSync, readFileSync, mkdirSync, mkdtempSync, writeFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { resolve, dirname, join } from 'node:path'
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
  isLegacyComponent,
  templateSectionErrors,
  TEMPLATE_2_SECTIONS
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
    throw new Error(
      `${msg ?? 'assertEqual'}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`
    )
  }
}
function assertTrue(cond, msg) {
  if (!cond) throw new Error(msg ?? 'assertTrue failed')
}
function group(name, fn) {
  process.stdout.write(`\n${name}\n`)
  fn()
}

function runHook(hookRelPath, input, cwd = ROOT) {
  const res = spawnSync(process.execPath, [resolve(ROOT, hookRelPath)], {
    input: JSON.stringify(input),
    cwd,
    encoding: 'utf-8'
  })
  return { code: res.status, stderr: res.stderr ?? '', stdout: res.stdout ?? '' }
}

// ---- lib tests ----

group('lib: parseYamlFrontmatter', () => {
  test('parses strings, ints, dates, nested figma', () => {
    const fm = parseYamlFrontmatter(
      [
        'name: tooltip',
        'category: feedback',
        'spec_version: 1',
        'created: 2026-05-22',
        'figma:',
        '  url: https://figma.com/design/abc',
        '  node_id: 10:42'
      ].join('\n')
    )
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
    assertTrue(
      errs.some((e) => e.startsWith('checksum:')),
      'should flag missing checksum'
    )
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
    assertTrue(
      errs.some((e) => e.startsWith('category:')),
      'should flag bad category'
    )
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
    assertTrue(
      defaultCellIsStringUndefined("`'undefined'`") === true,
      "quoted 'undefined' should flag"
    )
    assertTrue(defaultCellIsStringUndefined("`'null'`") === true, "quoted 'null' should flag")
    assertTrue(
      defaultCellIsStringUndefined('`undefined`') === false,
      'unquoted undefined is legitimate'
    )
    assertTrue(defaultCellIsStringUndefined("`''`") === false, 'empty string is legitimate')
    assertTrue(
      defaultCellIsStringUndefined("`'medium'`") === false,
      'real string default is legitimate'
    )
  })
})

group('lib: template 2 sections', () => {
  const filled = TEMPLATE_2_SECTIONS.map((h) => `## ${h}\n\n- Filled in.\n`).join('\n')
  test('a template-1 spec created before the cutoff is exempt', () => {
    assertEqual(templateSectionErrors({ created: '2026-05-22' }, '## Purpose\n\nx\n'), [])
  })
  test('a spec created after the cutoff must declare template 2', () => {
    const errs = templateSectionErrors({ created: '2030-01-01' }, filled)
    assertTrue(
      errs.some((e) => e.startsWith('template:')),
      'should require template: 2'
    )
  })
  test('a template-2 spec with every section filled passes', () => {
    assertEqual(templateSectionErrors({ template: 2, created: '2030-01-01' }, filled), [])
  })
  test('a template-2 spec missing or leaving a section as a placeholder fails', () => {
    const tpl = getSection(parseSpecFile(resolve(ROOT, '.specs/_template.md')).body, 'Performance')
    const body = filled.replace('## Performance\n\n- Filled in.', `## Performance\n\n${tpl}`)
    const errs = templateSectionErrors(
      { template: 2 },
      body.replace(/## Responsive[\s\S]*?(?=## )/, '')
    )
    assertTrue(
      errs.some((e) => e.includes('Responsive') && e.includes('missing')),
      'flags missing section'
    )
    assertTrue(
      errs.some((e) => e.includes('Performance') && e.includes('placeholder')),
      'flags placeholder'
    )
  })
  test('the template itself declares template 2 and carries every section', () => {
    const { frontmatter, body } = parseSpecFile(resolve(ROOT, '.specs/_template.md'))
    assertEqual(frontmatter.template, 2)
    for (const h of TEMPLATE_2_SECTIONS)
      assertTrue(getSection(body, h) !== null, `template has ## ${h}`)
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
    assertEqual(
      r.slots.map((s) => s.name),
      ['default']
    )
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
    const vue =
      '<div class="animate-popup-scale-in transition-colors duration-150 ease-out motion-reduce:transition-none"></div>'
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

// Every component has a spec since #1148, so the shipped whitelist is empty; the bypass is
// exercised against a fixture root that lists one component.
const LEGACY_ROOT = mkdtempSync(join(tmpdir(), 'webkit-legacy-'))
mkdirSync(resolve(LEGACY_ROOT, '.claude/hooks/_lib'), { recursive: true })
writeFileSync(
  resolve(LEGACY_ROOT, '.claude/hooks/_lib/legacy-components.json'),
  JSON.stringify([{ category: 'actions', name: 'button' }])
)
const MISSING_SPEC_VUE = 'packages/webkit/src/components/feedback/no-such-widget/no-such-widget.vue'

group('lib: legacy whitelist', () => {
  test('the shipped whitelist is empty', () => {
    assertEqual(
      JSON.parse(readFileSync(resolve(ROOT, '.claude/hooks/_lib/legacy-components.json'), 'utf-8')),
      []
    )
    assertTrue(!isLegacyComponent('actions', 'button', ROOT))
  })
  test('legacy button is whitelisted', () => {
    assertTrue(isLegacyComponent('actions', 'button', LEGACY_ROOT))
  })
  test('unknown component is NOT whitelisted', () => {
    assertTrue(!isLegacyComponent('feedback', 'tooltip', LEGACY_ROOT))
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
  test('component with an approved spec passes (exit 0)', () => {
    const r = runHook('.claude/hooks/enforce-spec-exists.mjs', {
      tool_name: 'Write',
      tool_input: {
        file_path: resolve(ROOT, 'packages/webkit/src/components/actions/button/button.vue')
      }
    })
    assertEqual(r.code, 0)
  })
  test('legacy component bypass (exit 0)', () => {
    const r = runHook(
      '.claude/hooks/enforce-spec-exists.mjs',
      {
        tool_name: 'Write',
        tool_input: {
          file_path: resolve(
            LEGACY_ROOT,
            'packages/webkit/src/components/actions/button/button.vue'
          )
        }
      },
      LEGACY_ROOT
    )
    assertEqual(r.code, 0)
  })
  test('new component without spec blocks (exit 2)', () => {
    assertTrue(!existsSync(resolve(ROOT, '.specs/no-such-widget.md')))
    const r = runHook('.claude/hooks/enforce-spec-exists.mjs', {
      tool_name: 'Write',
      tool_input: { file_path: resolve(ROOT, MISSING_SPEC_VUE) }
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
  test('component that matches its spec passes (exit 0)', () => {
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
      tool_input: { file_path: resolve(ROOT, MISSING_SPEC_VUE) }
    })
    assertEqual(r.code, 0)
  })
})

group('hook: validate-authoring.mjs comments', () => {
  const write = (rel, content) =>
    runHook('.claude/hooks/validate-authoring.mjs', {
      tool_name: 'Write',
      tool_input: { file_path: resolve(ROOT, rel), content }
    })
  test('a prose comment in a component blocks (exit 2)', () => {
    const r = write(
      'packages/webkit/src/components/actions/button/zz.ts',
      '// why\nexport const a = 1'
    )
    assertEqual(r.code, 2)
    assertTrue(r.stderr.includes('prose-comment'), 'names the check')
  })
  test('a prose comment in another package blocks (exit 2)', () => {
    assertEqual(write('packages/theme/src/zz.js', 'export const a = 1 // note').code, 2)
  })
  test('prop JSDoc and directives pass (exit 0)', () => {
    const sfc = [
      '<script setup lang="ts">',
      '  interface Props {',
      '    /** Visual variant. */',
      '    kind?: string',
      '  }',
      '  defineProps<Props>()',
      '  // eslint-disable-next-line no-console',
      '  console.log(1)',
      '</script>',
      '<template><div /></template>'
    ].join('\n')
    assertEqual(write('packages/webkit/src/components/actions/button/zz.vue', sfc).code, 0)
  })
  test('test files are out of scope (exit 0)', () => {
    assertEqual(
      write('packages/webkit/src/components/actions/button/zz.test.ts', '// ok\n').code,
      0
    )
  })
})

group('hook: validate-authoring.mjs built-in strings', () => {
  const write = (rel, content) =>
    runHook('.claude/hooks/validate-authoring.mjs', {
      tool_name: 'Write',
      tool_input: { file_path: resolve(ROOT, rel), content }
    })
  const sfc = (template, defaults = '') =>
    [
      '<script setup lang="ts">',
      '  interface Props {',
      '    /** Visible label. */',
      '    label?: string',
      '  }',
      `  withDefaults(defineProps<Props>(), { ${defaults} })`,
      '</script>',
      `<template>${template}</template>`
    ].join('\n')
  test('a literal aria-label in a component template blocks (exit 2)', () => {
    const r = write(
      'packages/webkit/src/components/actions/button/zz.vue',
      sfc('<button aria-label="Close dialog" />')
    )
    assertEqual(r.code, 2)
    assertTrue(r.stderr.includes('i18n:hardcoded-ui-string'), 'names the check')
  })
  test('an English prop default blocks (exit 2)', () => {
    const r = write(
      'packages/webkit/src/components/actions/button/zz.vue',
      sfc('<span />', "\n    label: 'Save changes'\n")
    )
    assertEqual(r.code, 2)
    assertTrue(r.stderr.includes('i18n:hardcoded-default-string'), 'names the check')
  })
  test('a catalog-bound label passes (exit 0)', () => {
    const r = write(
      'packages/webkit/src/components/actions/button/zz.vue',
      sfc('<button :aria-label="t(\'dialog.close\')" />')
    )
    assertEqual(r.code, 0)
  })
  test('examples are product copy and out of scope (exit 0)', () => {
    assertEqual(
      write('packages/webkit/examples/button/zz.vue', sfc('<button aria-label="Close dialog" />'))
        .code,
      0
    )
  })
})

group('hook: validate-references.mjs', () => {
  test('the Code Connect runtime resolves in a .figma.ts template (exit 0)', () => {
    const r = runHook('.claude/hooks/validate-references.mjs', {
      tool_name: 'Write',
      tool_input: {
        file_path: resolve(ROOT, 'packages/webkit/src/components/actions/button/zz.figma.ts'),
        content: "import figma from 'figma'"
      }
    })
    assertEqual(r.code, 0)
  })
  test('the Code Connect runtime blocks outside a .figma.ts template (exit 2)', () => {
    const r = runHook('.claude/hooks/validate-references.mjs', {
      tool_name: 'Write',
      tool_input: {
        file_path: resolve(ROOT, 'packages/webkit/src/components/actions/button/zz.ts'),
        content: "import figma from 'figma'"
      }
    })
    assertEqual(r.code, 2)
  })
})

// ---- summary ----

const failed = results.filter((r) => !r.ok)
process.stdout.write(
  `\n${results.length} tests, ${results.length - failed.length} passed, ${failed.length} failed.\n`
)
rmSync(LEGACY_ROOT, { recursive: true, force: true })
process.exit(failed.length === 0 ? 0 : 1)
