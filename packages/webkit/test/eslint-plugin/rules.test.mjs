import assert from 'node:assert/strict'
import test from 'node:test'
import { fileURLToPath } from 'node:url'
import { RuleTester } from 'eslint'
import * as vueParser from 'vue-eslint-parser'
import tsParser from '@typescript-eslint/parser'

// Point every rule's catalog loader at the fixture (version-locked, deterministic).
process.env.WEBKIT_CATALOG_PATH = fileURLToPath(new URL('./fixtures/catalog.json', import.meta.url))

const validImportPath = (await import('../../src/eslint-plugin/rules/valid-import-path.js')).default
const noDeepInternalImport = (
  await import('../../src/eslint-plugin/rules/no-deep-internal-import.js')
).default
const noBarrelImport = (await import('../../src/eslint-plugin/rules/no-barrel-import.js')).default
const noWholeIconSetImport = (
  await import('../../src/eslint-plugin/rules/no-whole-icon-set-import.js')
).default
const noHardcodedColor = (await import('../../src/eslint-plugin/rules/no-hardcoded-color.js'))
  .default
const noHardcodedMotion = (await import('../../src/eslint-plugin/rules/no-hardcoded-motion.js'))
  .default
const noPhysicalDirection = (await import('../../src/eslint-plugin/rules/no-physical-direction.js'))
  .default
const { logicalClass, mirroredGradient, physicalDirectionClasses } =
  await import('../../src/eslint-plugin/direction-classes.js')
const preferTreeShakeableRoot = (
  await import('../../src/eslint-plugin/rules/prefer-tree-shakeable-root.js')
).default
const noDeprecatedComponent = (
  await import('../../src/eslint-plugin/rules/no-deprecated-component.js')
).default
const preferWebkitComponent = (
  await import('../../src/eslint-plugin/rules/prefer-webkit-component.js')
).default
const noStyleOverride = (await import('../../src/eslint-plugin/rules/no-style-override.js')).default
const { LAYOUT_CLASS_FAMILIES: ALLOWED_LAYOUT } =
  await import('../../src/eslint-plugin/layout-classes.js')
const preferDefineModel = (await import('../../src/eslint-plugin/rules/prefer-define-model.js'))
  .default
const authoringStandards = (await import('../../src/eslint-plugin/rules/authoring-standards.js'))
  .default
const containerNeedsWidth = (await import('../../src/eslint-plugin/rules/container-needs-width.js'))
  .default
const headerSearchTrigger = (await import('../../src/eslint-plugin/rules/header-search-trigger.js'))
  .default
const noWrappedPageChrome = (
  await import('../../src/eslint-plugin/rules/no-wrapped-page-chrome.js')
).default
const noOutputInCommand = (await import('../../src/eslint-plugin/rules/no-output-in-command.js'))
  .default
const noRootRelativeAsset = (
  await import('../../src/eslint-plugin/rules/no-root-relative-asset.js')
).default
const menuNodeHref = (await import('../../src/eslint-plugin/rules/menu-node-href.js')).default
const noGapAfterClosingSection = (
  await import('../../src/eslint-plugin/rules/no-gap-after-closing-section.js')
).default
const noClockInSetup = (await import('../../src/eslint-plugin/rules/no-clock-in-setup.js')).default
const noDroppedChildren = (await import('../../src/eslint-plugin/rules/no-dropped-children.js'))
  .default

const js = new RuleTester({ languageOptions: { ecmaVersion: 2022, sourceType: 'module' } })
const vue = new RuleTester({
  languageOptions: { parser: vueParser, ecmaVersion: 2022, sourceType: 'module' }
})
// SFC + TypeScript <script setup lang="ts"> — mirrors eslint.config.js (vue parser nesting the TS parser).
const vueTs = new RuleTester({
  languageOptions: {
    parser: vueParser,
    parserOptions: { parser: tsParser },
    ecmaVersion: 2022,
    sourceType: 'module'
  }
})

test('valid-import-path', () => {
  js.run('valid-import-path', validImportPath, {
    valid: [
      "import Button from '@aziontech/webkit/button'",
      "import Table from '@aziontech/webkit/table'",
      "import X from 'some-other-lib'",
      // deep / src are deferred to no-deep-internal-import:
      "import X from '@aziontech/webkit/table/internal'",
      "import X from '@aziontech/webkit/src/components/x'"
    ],
    invalid: [
      // exactly one close subpath → autofix rewrites it (fixer emits double quotes)
      {
        code: "import X from '@aziontech/webkit/buton'",
        output: 'import X from "@aziontech/webkit/button"',
        errors: [{ messageId: 'unknown', suggestions: 1 }]
      },
      // two candidates (chip, chips) → ambiguous → suggestions only, NO autofix
      {
        code: "import X from '@aziontech/webkit/chp'",
        output: null,
        errors: [{ messageId: 'unknown', suggestions: 2 }]
      }
    ]
  })
})

test('no-deep-internal-import', () => {
  js.run('no-deep-internal-import', noDeepInternalImport, {
    valid: [
      "import Button from '@aziontech/webkit/button'",
      // unknown-but-not-deep is valid-import-path's job:
      "import X from '@aziontech/webkit/buton'"
    ],
    invalid: [
      // /src/ deep import: reported, no published ancestor → no autofix
      {
        code: "import X from '@aziontech/webkit/src/components/x'",
        output: null,
        errors: [{ messageId: 'deep' }]
      },
      // deeper-than-published: nearest published ancestor is a single value → autofix
      {
        code: "import X from '@aziontech/webkit/table/internal'",
        output: 'import X from "@aziontech/webkit/table"',
        errors: [{ messageId: 'deep', suggestions: 1 }]
      }
    ]
  })
})

test('no-barrel-import', () => {
  js.run('no-barrel-import', noBarrelImport, {
    valid: [
      "import Button from '@aziontech/webkit/button'",
      "import Table from '@aziontech/webkit/table'"
    ],
    invalid: [
      {
        code: "import { Button } from '@aziontech/webkit'",
        errors: [{ messageId: 'barrel', suggestions: 1 }]
      },
      {
        code: "import { Button, Chip } from '@aziontech/webkit'",
        errors: [{ messageId: 'barrel', suggestions: 1 }]
      },
      // the guessed subpath (nonexistent) is not a published export → barrel still
      // reported, but NO split suggestion is offered (would emit an invalid import)
      {
        code: "import { Nonexistent } from '@aziontech/webkit'",
        errors: [{ messageId: 'barrel', suggestions: 0 }]
      },
      { code: "import * as WK from '@aziontech/webkit'", errors: [{ messageId: 'namespace' }] },
      // export-from re-exports, and dynamic import(), are barrels as well
      { code: "export { Button } from '@aziontech/webkit'", errors: [{ messageId: 'barrel' }] },
      { code: "export * from '@aziontech/webkit'", errors: [{ messageId: 'namespace' }] },
      { code: "const p = import('@aziontech/webkit')", errors: [{ messageId: 'namespace' }] }
    ]
  })
})

test('no-whole-icon-set-import', () => {
  js.run('no-whole-icon-set-import', noWholeIconSetImport, {
    valid: [
      // The correct usage of the icon font: a side-effect import (no binding).
      "import '@aziontech/icons'",
      {
        code: "import Icons from '@aziontech/icons'",
        options: [{ allowedFiles: ['icon-registry'] }],
        filename: 'src/icon-registry.js'
      }
    ],
    invalid: [
      { code: "import Icons from '@aziontech/icons'", errors: [{ messageId: 'wholeSet' }] },
      { code: "import * as Icons from '@aziontech/icons'", errors: [{ messageId: 'wholeSet' }] }
    ]
  })
})

test('no-hardcoded-color (script + template)', () => {
  js.run('no-hardcoded-color', noHardcodedColor, {
    valid: [
      "const c = 'var(--primary)'",
      "const c = 'text-body-sm'",
      // short 3-4 digit hex outside a style string is an id/anchor/route, not a color
      "const anchor = '#dad'",
      "const route = '#face'",
      "const hash = '#bad'",
      // a URL fragment is not a color, even when its first digits spell a valid #RRGGBBAA
      "const href = 'https://api.azion.com/#75d2b32f-fb8a-47d8-bbbd-32c2e8650ba4'",
      "const href = 'https://example.com/docs#ff0000'",
      "const href = '/reference?tab=api#ff0000ff'",
      // a full-length hex right after `/#` is a URL fragment
      "const href = 'https://example.com/#deadbeef'",
      // a bare UUID starts with 8 hex digits — an id, not a color
      "const id = '75d2b32f-fb8a-47d8-bbbd-32c2e8650ba4'"
    ],
    invalid: [
      { code: "const c = '#ff0000'", errors: [{ messageId: 'token' }] },
      // the same digits ARE a color when they stand as a value, not as a URL fragment
      { code: "const c = 'bg-[#75d2b32f]'", errors: [{ messageId: 'token' }] },
      { code: "const c = 'red #ff0000'", errors: [{ messageId: 'token' }] },
      { code: "const c = 'text-gray-500'", errors: [{ messageId: 'token' }] },
      // short hex IS a color when the string looks like a style value
      { code: "const c = 'color:#fff'", errors: [{ messageId: 'token' }] },
      // a color next to a UUID is still a color
      {
        code: "const c = 'bg-[#ff0000] 75d2b32f-fb8a-47d8-bbbd-32c2e8650ba4'",
        errors: [{ messageId: 'token' }]
      }
    ]
  })
  vue.run('no-hardcoded-color', noHardcodedColor, {
    valid: [
      { code: '<template><div class="text-body-sm">x</div></template>', filename: 'a.vue' },
      // anchor href that happens to be valid hex must not be flagged
      { code: '<template><a href="#dad">x</a></template>', filename: 'anchor.vue' },
      // a URL fragment whose first eight hex digits spell a #RRGGBBAA must not be flagged
      {
        code: '<template><a href="https://api.azion.com/#75d2b32f-fb8a-47d8-bbbd-32c2e8650ba4">x</a></template>',
        filename: 'uuid-anchor.vue'
      }
    ],
    invalid: [
      {
        code: '<template><div class="text-[#fff]">x</div></template>',
        filename: 'a.vue',
        errors: [{ messageId: 'token' }]
      },
      {
        code: '<template><div class="text-red-500">x</div></template>',
        filename: 'b.vue',
        errors: [{ messageId: 'token' }]
      }
    ]
  })
})

test('no-hardcoded-motion (script + template)', () => {
  js.run('no-hardcoded-motion', noHardcodedMotion, {
    valid: [
      // catalogued utility + tokens: fine
      "const c = 'animate-slide-in-left motion-reduce:animate-none'",
      "const c = 'transition-colors duration-150 ease-out motion-reduce:transition-none'",
      // timing from tokens in a style string: fine
      "const s = 'transition: opacity var(--duration-fast-01)'",
      // arbitrary transition PROPERTY (not timing) is allowed — the width-collapse recipe
      "const c = 'transition-[grid-template-columns]'"
    ],
    invalid: [
      { code: "const c = 'duration-[180ms]'", errors: [{ messageId: 'arbitrary' }] },
      {
        code: "const c = 'ease-[cubic-bezier(0.4,0,0.2,1)]'",
        errors: [{ messageId: 'arbitrary' }]
      },
      { code: "const c = 'animate-[wiggle_1s_ease-in-out]'", errors: [{ messageId: 'arbitrary' }] },
      { code: "const s = 'transition: opacity 200ms'", errors: [{ messageId: 'styleTiming' }] },
      { code: "const s = 'animation: spin 1.5s linear'", errors: [{ messageId: 'styleTiming' }] },
      { code: "const s = 'transition: all'", errors: [{ messageId: 'styleTiming' }] },
      // invented animation name → steered back to the catalog
      { code: "const c = 'animate-wiggle'", errors: [{ messageId: 'unknownAnimation' }] }
    ]
  })
  vue.run('no-hardcoded-motion', noHardcodedMotion, {
    valid: [
      // motion + escape on the same static class string
      {
        code: '<template><aside class="animate-slide-in-left motion-reduce:animate-none">x</aside></template>',
        filename: 'a.vue'
      },
      // no motion at all
      {
        code: '<template><div class="text-body-sm">x</div></template>',
        filename: 'b.vue'
      },
      // transition-none IS the escape — not motion
      {
        code: '<template><div class="transition-none">x</div></template>',
        filename: 'c.vue'
      }
    ],
    invalid: [
      // static class with motion and no reduced-motion escape
      {
        code: '<template><aside class="animate-slide-in-left">x</aside></template>',
        filename: 'd.vue',
        errors: [{ messageId: 'pairing' }]
      },
      {
        code: '<template><div class="transition-colors duration-150 ease-out">x</div></template>',
        filename: 'e.vue',
        errors: [{ messageId: 'pairing' }]
      },
      // arbitrary timing in a template class
      {
        code: '<template><div class="duration-[180ms] motion-reduce:transition-none">x</div></template>',
        filename: 'f.vue',
        errors: [{ messageId: 'arbitrary' }]
      },
      // inline style timing
      {
        code: '<template><div style="transition: opacity 200ms">x</div></template>',
        filename: 'g.vue',
        errors: [{ messageId: 'styleTiming' }]
      }
    ]
  })
})

test('direction classes: physical → logical mapping', () => {
  const cases = {
    'ml-2': 'ms-2',
    '-mr-px': '-me-px',
    'pl-4': 'ps-4',
    'md:pr-[12px]': 'md:pe-[12px]',
    'left-0': 'start-0',
    '-right-2': '-end-2',
    'text-left': 'text-start',
    'hover:text-right': 'hover:text-end',
    'border-l': 'border-s',
    'border-r-2': 'border-e-2',
    'border-l-(--border-default)': 'border-s-(--border-default)',
    'rounded-l-md': 'rounded-s-md',
    'rounded-tr-lg': 'rounded-se-lg',
    'rounded-bl': 'rounded-es',
    'float-right': 'float-end',
    'scroll-pl-4': 'scroll-ps-4',
    '!pl-2': '!ps-2',
    'pl-2!': 'ps-2!'
  }
  for (const [from, to] of Object.entries(cases)) assert.equal(logicalClass(from), to, from)
  for (const fine of [
    'ms-2',
    'px-4',
    'inset-x-0',
    'text-center',
    'border-x',
    'rounded-md',
    'start-0'
  ]) {
    assert.equal(logicalClass(fine), null, fine)
  }
  assert.deepEqual(physicalDirectionClasses('absolute left-1/2 -translate-x-1/2 top-0'), [])
  assert.deepEqual(
    physicalDirectionClasses('absolute left-1/2 top-0').map((h) => h.fix),
    ['start-1/2']
  )
})

test('physical gradients need an rtl: pair', () => {
  assert.equal(mirroredGradient('bg-gradient-to-r'), 'rtl:bg-gradient-to-l')
  assert.equal(mirroredGradient('bg-linear-to-tl'), 'rtl:bg-linear-to-tr')
  assert.equal(mirroredGradient('after:bg-gradient-to-l'), 'rtl:after:bg-gradient-to-r')
  assert.equal(mirroredGradient('bg-gradient-to-b'), null)
  assert.equal(mirroredGradient('rtl:bg-gradient-to-l'), null)
  assert.deepEqual(physicalDirectionClasses('bg-gradient-to-r from-(--a) rtl:bg-gradient-to-l'), [])
  assert.deepEqual(physicalDirectionClasses('ltr:bg-linear-to-r rtl:bg-linear-to-l'), [])
  assert.deepEqual(
    physicalDirectionClasses('bg-linear-to-l to-transparent').map((h) => h.fix),
    ['bg-linear-to-l rtl:bg-linear-to-r']
  )
  assert.deepEqual(physicalDirectionClasses('bg-gradient-to-r', { gradients: false }), [])
})

test('no-physical-direction (template + script + fix)', () => {
  vue.run('no-physical-direction', noPhysicalDirection, {
    valid: [
      {
        code: '<template><div class="ms-2 pe-4 text-start border-s">x</div></template>',
        filename: 'a.vue'
      },
      {
        code: '<template><span class="absolute left-1/2 -translate-x-1/2">x</span></template>',
        filename: 'b.vue'
      },
      { code: '<template><Tooltip placement="right-start" /></template>', filename: 'c.vue' },
      {
        code: "<script setup>const side = 'left-edge'</script><template><i /></template>",
        filename: 'd.vue'
      },
      {
        code: '<template><span class="bg-gradient-to-r rtl:bg-gradient-to-l">x</span></template>',
        filename: 'j.vue'
      },
      { code: '<template><span class="bg-linear-to-b">x</span></template>', filename: 'k.vue' },
      {
        code: '<template><span class="bg-gradient-to-r">x</span></template>',
        filename: 'l.vue',
        options: [{ gradients: false }]
      }
    ],
    invalid: [
      {
        code: '<template><div class="ml-2 p-4 text-right">x</div></template>',
        output: '<template><div class="ms-2 p-4 text-end">x</div></template>',
        filename: 'e.vue',
        errors: [{ messageId: 'physical' }]
      },
      {
        code: `<template><div :class="['pl-4', open && 'border-r']">x</div></template>`,
        output: `<template><div :class="['ps-4', open && 'border-e']">x</div></template>`,
        filename: 'f.vue',
        errors: [{ messageId: 'physical' }, { messageId: 'physical' }]
      },
      {
        code: '<template><div class="bg-gradient-to-r from-(--bg-canvas)">x</div></template>',
        output:
          '<template><div class="bg-gradient-to-r rtl:bg-gradient-to-l from-(--bg-canvas)">x</div></template>',
        filename: 'h.vue',
        errors: [{ messageId: 'physical' }]
      },
      {
        code: `<template><div :class="open ? 'bg-linear-to-l' : ''">x</div></template>`,
        output: `<template><div :class="open ? 'bg-linear-to-l rtl:bg-linear-to-r' : ''">x</div></template>`,
        filename: 'i.vue',
        errors: [{ messageId: 'physical' }]
      },
      {
        code: `<script setup>import { cn } from '@aziontech/webkit/utils/cn'\nconst c = cn('rounded-l-md', { 'mr-1': true })</script><template><i :class="c" /></template>`,
        output: `<script setup>import { cn } from '@aziontech/webkit/utils/cn'\nconst c = cn('rounded-s-md', { 'me-1': true })</script><template><i :class="c" /></template>`,
        filename: 'g.vue',
        errors: [{ messageId: 'physical' }, { messageId: 'physical' }]
      }
    ]
  })
})

test('no-gap-after-closing-section', () => {
  const imports = `<script setup>
import ClosingCallToAction from '@aziontech/webkit/closing-call-to-action'
import ClosingCallToActionNewsletter from '@aziontech/webkit/closing-call-to-action-newsletter'
import SectionGap from '@aziontech/webkit/section-gap'
import FrameBox from '@aziontech/webkit/frame-box'
import TextureMaterial from '@aziontech/webkit/texture-material'
import FaqSection from '@aziontech/webkit/faq-section'
</script>`
  const sfc = (template) => `${imports}<template>${template}</template>`
  vue.run('no-gap-after-closing-section', noGapAfterClosingSection, {
    valid: [
      { code: sfc('<SectionGap hatch /><ClosingCallToAction title="Go" />'), filename: 'a.vue' },
      {
        code: sfc(
          '<FaqSection /><SectionGap hatch /><FrameBox borders="none"><TextureMaterial kind="lines" /></FrameBox>'
        ),
        filename: 'b.vue'
      },
      {
        code: sfc(
          '<ClosingCallToAction title="Go" /><FrameBox borders="y"><FaqSection /></FrameBox>'
        ),
        filename: 'c.vue'
      },
      {
        code: '<template><ClosingCallToAction /><SectionGap hatch /></template>',
        filename: 'd.vue'
      }
    ],
    invalid: [
      {
        code: sfc('<ClosingCallToAction title="Go" />\n  <SectionGap hatch />'),
        filename: 'e.vue',
        errors: [{ messageId: 'doubled' }]
      },
      {
        code: sfc('<closing-call-to-action-newsletter /><!-- end --><section-gap hatch />'),
        filename: 'f.vue',
        errors: [{ messageId: 'doubled' }]
      },
      {
        code: sfc(
          '<ClosingCallToAction title="Go" /><FrameBox borders="none" marks="all"><TextureMaterial kind="lines" /></FrameBox>'
        ),
        filename: 'g.vue',
        errors: [{ messageId: 'doubled' }]
      }
    ]
  })
})

test('no-wrapped-page-chrome', () => {
  const sfc = (template, from = '@aziontech/webkit/site-footer', name = 'SiteFooter') =>
    `<script setup>import ${name} from '${from}'</script><template>${template}</template>`
  vue.run('no-wrapped-page-chrome', noWrappedPageChrome, {
    valid: [
      { code: sfc('<div class="flex flex-col"><main /><SiteFooter /></div>'), filename: 'a.vue' },
      {
        code: sfc(
          '<div class="sticky top-0 z-40"><SiteNav /></div>',
          '@aziontech/webkit/site-nav',
          'SiteNav'
        ),
        filename: 'b.vue'
      },
      {
        code: '<template><div class="border-t"><SiteFooter /></div></template>',
        filename: 'c.vue'
      },
      { code: sfc('<div class="border-t"><Footer /></div>'), filename: 'd.vue' }
    ],
    invalid: [
      {
        code: sfc('<div class="w-full border-t border-(--border-default)"><SiteFooter /></div>'),
        filename: 'e.vue',
        errors: [{ messageId: 'wrapped' }]
      },
      {
        code: sfc('<div class="md:py-8"><site-footer /></div>'),
        filename: 'f.vue',
        errors: [{ messageId: 'wrapped' }]
      },
      {
        code: sfc(
          '<header class="border-b"><SiteNav /></header>',
          '@aziontech/webkit/site-nav',
          'SiteNav'
        ),
        filename: 'g.vue',
        errors: [{ messageId: 'wrapped' }]
      }
    ]
  })
})

test('container-needs-width', () => {
  const sfc = (template, from = '@aziontech/webkit/card', name = 'Card') =>
    `<script setup>import ${name} from '${from}'</script><template>${template}</template>`
  vue.run('container-needs-width', containerNeedsWidth, {
    valid: [
      {
        code: sfc('<div class="flex gap-4"><Card class="w-full">a</Card></div>'),
        filename: 'a.vue'
      },
      {
        code: sfc('<div class="flex"><div class="flex-1"><Card>a</Card></div></div>'),
        filename: 'b.vue'
      },
      { code: sfc('<div class="flex flex-col gap-4"><Card>a</Card></div>'), filename: 'c.vue' },
      { code: sfc('<div class="grid grid-cols-2"><Card>a</Card></div>'), filename: 'd.vue' },
      { code: sfc('<div class="flex"><Card :class="width">a</Card></div>'), filename: 'e.vue' },
      {
        code: sfc('<div class="flex"><Card class="md:basis-1/2">a</Card></div>'),
        filename: 'f.vue'
      },
      { code: '<template><div class="flex"><Card>a</Card></div></template>', filename: 'g.vue' },
      {
        code: sfc(
          '<div class="flex"><StatTile class="grow" /></div>',
          '@aziontech/webkit/stat-tile',
          'StatTile'
        ),
        filename: 'h.vue'
      }
    ],
    invalid: [
      {
        code: sfc('<div class="flex gap-4"><Card>a</Card><Card>b</Card></div>'),
        filename: 'i.vue',
        errors: [{ messageId: 'collapses' }, { messageId: 'collapses' }]
      },
      {
        code: sfc('<div class="flex flex-col items-start"><Card>a</Card></div>'),
        filename: 'j.vue',
        errors: [{ messageId: 'collapses' }]
      },
      {
        code: sfc(
          '<div class="inline-flex"><stat-tile /></div>',
          '@aziontech/webkit/stat-tile',
          'StatTile'
        ),
        filename: 'k.vue',
        errors: [{ messageId: 'collapses', data: { tag: 'StatTile' } }]
      },
      {
        code: sfc(
          '<section class="flex"><ChartCard class="shrink-0" /></section>',
          '../chart-card/chart-card.vue',
          'ChartCard'
        ),
        filename: 'l.vue',
        errors: [{ messageId: 'collapses' }]
      }
    ]
  })
})

test('header-search-trigger', () => {
  const header = (right, extra = '') =>
    `<template><div class="@container"><GlobalHeader><GlobalHeader.Nav />` +
    `<GlobalHeader.Right>${right}</GlobalHeader.Right></GlobalHeader></div>${extra}</template>`
  vue.run('header-search-trigger', headerSearchTrigger, {
    valid: [
      { code: header('<SearchTrigger collapsible />'), filename: 'a.vue' },
      {
        code: '<template><GlobalHeader><GlobalHeader.Right><Avatar /></GlobalHeader.Right></GlobalHeader></template>',
        filename: 'focused.vue'
      },
      {
        code: '<template><global-header><navigation-menu /></global-header><search-trigger /></template>',
        filename: 'kebab.vue'
      },
      {
        code: '<template><SearchTrigger aria-keyshortcuts="Meta+K Control+K" /></template>',
        filename: 'b.vue'
      },
      { code: '<template><IconButton icon="pi pi-search" /></template>', filename: 'toolbar.vue' },
      { code: '<template><Kbd meta>K</Kbd></template>', filename: 'kbd.vue' }
    ],
    invalid: [
      { code: header('<Avatar />'), filename: 'c.vue', errors: [{ messageId: 'missing' }] },
      {
        code: '<template><Sidebar /><GlobalHeader><GlobalHeader.Right /></GlobalHeader></template>',
        filename: 'd.vue',
        errors: [{ messageId: 'missing' }]
      },
      {
        code: header('<SearchTrigger /><button aria-keyshortcuts="Meta+K">Search</button>'),
        filename: 'e.vue',
        errors: [{ messageId: 'handRolled' }]
      },
      {
        code: '<template><Input readonly aria-keyshortcuts="Control+K" /></template>',
        filename: 'f.vue',
        errors: [{ messageId: 'handRolled' }]
      },
      {
        code: header('<SearchTrigger /><IconButton icon="pi pi-search" aria-label="Search" />'),
        filename: 'g.vue',
        errors: [{ messageId: 'bareIcon' }]
      }
    ]
  })
})

test('prefer-tree-shakeable-root', () => {
  vue.run('prefer-tree-shakeable-root', preferTreeShakeableRoot, {
    valid: [
      // dot-notation → compound genuinely needed
      {
        code: "<script setup>import Table from '@aziontech/webkit/table'</script><template><Table><Table.Row/></Table></template>",
        filename: 'a.vue'
      },
      // already tree-shakeable root
      {
        code: "<script setup>import TableRoot from '@aziontech/webkit/table-root'</script><template><TableRoot/></template>",
        filename: 'b.vue'
      },
      // non-compound component
      {
        code: "<script setup>import Button from '@aziontech/webkit/button'</script><template><Button/></template>",
        filename: 'c.vue'
      }
    ],
    invalid: [
      {
        code: "<script setup>import Table from '@aziontech/webkit/table'</script><template><Table/></template>",
        filename: 'd.vue',
        errors: [
          {
            messageId: 'preferRoot',
            suggestions: [
              {
                messageId: 'useRoot',
                output:
                  '<script setup>import Table from "@aziontech/webkit/table-root"</script><template><Table/></template>'
              }
            ]
          }
        ]
      },
      // named sub-component imports move to their own entries: the -root entry has no named exports
      {
        code: "<script setup>\nimport Table, { TableRow as Row } from '@aziontech/webkit/table';\n</script><template><Table><Row/></Table></template>",
        filename: 'e.vue',
        errors: [
          {
            messageId: 'preferRoot',
            suggestions: [
              {
                messageId: 'useRoot',
                output:
                  '<script setup>\nimport Table from "@aziontech/webkit/table-root";\nimport Row from "@aziontech/webkit/table-row";\n</script><template><Table><Row/></Table></template>'
              }
            ]
          }
        ]
      },
      // a named binding the catalog cannot place: reported, but no suggestion that would break the import
      {
        code: "<script setup>import Table, { useTableHelper } from '@aziontech/webkit/table'</script><template><Table/></template>",
        filename: 'f.vue',
        errors: [{ messageId: 'preferRootNamed', suggestions: [] }]
      }
    ]
  })
  vueTs.run('prefer-tree-shakeable-root (type imports)', preferTreeShakeableRoot, {
    valid: [],
    invalid: [
      {
        code: '<script setup lang="ts">import Table, { type TableColumn } from \'@aziontech/webkit/table\'\nconst columns: TableColumn[] = []</script><template><Table :columns="columns"/></template>',
        filename: 'g.vue',
        errors: [{ messageId: 'preferRootNamed', suggestions: [] }]
      }
    ]
  })
})

test('no-dropped-children', () => {
  const imp = (n, s) => `<script setup>import ${n} from '@aziontech/webkit/${s}'</script>`
  vue.run('no-dropped-children', noDroppedChildren, {
    valid: [
      // the text goes through the label prop
      {
        code: `${imp('Button', 'button')}<template><Button label="Go home" href="/" /></template>`,
        filename: 'a.vue'
      },
      // a named slot the spec lists, as a template child
      {
        code: `${imp('Button', 'button')}<template><Button label="Deploy"><template #prefix><i class="pi pi-bolt" /></template></Button></template>`,
        filename: 'b.vue'
      },
      // a named slot on the component tag itself
      {
        code: `${imp('Button', 'button')}<template><Button label="Deploy" #prefix><i class="pi pi-bolt" /></Button></template>`,
        filename: 'c.vue'
      },
      // whitespace between the tags renders nothing either way
      {
        code: `${imp('Button', 'button')}<template><Button label="Go">\n  </Button></template>`,
        filename: 'd.vue'
      },
      // a component with a default slot
      {
        code: `${imp('Table', 'table')}<template><Table><Table.Row /></Table></template>`,
        filename: 'e.vue'
      },
      // a sub-component the catalog has no slot data for is not judged
      {
        code: `${imp('TableRow', 'table-row')}<template><TableRow>cell</TableRow></template>`,
        filename: 'f.vue'
      },
      // a native element and a non-webkit component are not judged
      {
        code: `<script setup>import Foo from './foo.vue'</script><template><button>Go</button><Foo>Go</Foo></template>`,
        filename: 'g.vue'
      },
      // Card content in its #content slot
      {
        code: `${imp('Card', 'card')}<template><Card><template #content><p>Body</p></template></Card></template>`,
        filename: 'h.vue'
      }
    ],
    invalid: [
      {
        code: `${imp('Button', 'button')}<template><Button href="/">Go home</Button></template>`,
        filename: 'i.vue',
        errors: [
          {
            messageId: 'droppedText',
            data: { tag: 'Button', prop: 'label' },
            suggestions: [
              {
                messageId: 'useProp',
                output: `${imp('Button', 'button')}<template><Button href="/" label="Go home" /></template>`
              }
            ]
          }
        ]
      },
      // an interpolation is dropped too; no suggestion (the value is not a static string)
      {
        code: `${imp('Button', 'button')}<template><Button>{{ text }}</Button></template>`,
        filename: 'j.vue',
        errors: [{ messageId: 'droppedText', suggestions: [] }]
      },
      // label already bound: report, but the suggestion would duplicate it
      {
        code: `${imp('Button', 'button')}<template><Button :label="name">Save</Button></template>`,
        filename: 'k.vue',
        errors: [{ messageId: 'droppedText', suggestions: [] }]
      },
      // a template with no slot directive is the default slot
      {
        code: `${imp('Button', 'button')}<template><Button label="A"><template><span>x</span></template></Button></template>`,
        filename: 'l.vue',
        errors: [{ messageId: 'droppedMarkup' }]
      },
      {
        code: `${imp('Button', 'button')}<template><button label="A" /><Button label="A"><template #default>x</template></Button></template>`,
        filename: 'm.vue',
        errors: [{ messageId: 'droppedMarkup' }]
      },
      // markup inside Card goes to a named slot, not to the title prop
      {
        code: `${imp('Card', 'card')}<template><Card><div class="p-4">Body</div></Card></template>`,
        filename: 'n.vue',
        errors: [
          {
            messageId: 'droppedMarkup',
            data: {
              tag: 'Card',
              slots: '#header, #content',
              orProp: ', or pass text through its `title` prop'
            }
          }
        ]
      },
      // a spec with no slots and no text prop
      {
        code: `${imp('TagChip', 'chip')}<template><tag-chip removable>Tag</tag-chip></template>`,
        filename: 'o.vue',
        errors: [{ messageId: 'dropped', data: { tag: 'tag-chip' } }]
      }
    ]
  })
})

test('no-deprecated-component', () => {
  js.run('no-deprecated-component', noDeprecatedComponent, {
    valid: [
      "import Chip from '@aziontech/webkit/chip'",
      "import Button from '@aziontech/webkit/button'",
      "import x from 'some-other-lib'"
    ],
    invalid: [
      // `chips` is marked deprecated (replacedBy: chip) in the fixture catalog
      {
        code: "import X from '@aziontech/webkit/chips'",
        errors: [{ messageId: 'deprecated', suggestions: 1 }]
      },
      // a non-component entry deprecated by its source JSDoc carries the note, no replacement
      {
        code: "import { webkitViteConfig } from '@aziontech/webkit/vite'",
        errors: [
          {
            message:
              "'@aziontech/webkit/vite' is deprecated in @aziontech/webkit. Since 6.0 — nothing to pre-bundle. Removed in 7.0.",
            suggestions: []
          }
        ]
      }
    ]
  })
})

test('prefer-webkit-component', () => {
  js.run('prefer-webkit-component', preferWebkitComponent, {
    valid: ["import Button from '@aziontech/webkit/button'", "import _ from 'lodash'"],
    invalid: [
      { code: "import { Button } from 'primevue/button'", errors: [{ messageId: 'prefer' }] },
      { code: "import PrimeVue from 'primevue'", errors: [{ messageId: 'prefer' }] }
    ]
  })
})

test('no-style-override', () => {
  const imp = (n, s) => `<script setup>import ${n} from '@aziontech/webkit/${s}'</script>`
  vue.run('no-style-override', noStyleOverride, {
    valid: [
      // no class/style on the webkit tag
      {
        code: `${imp('Button', 'button')}<template><Button kind="primary">Save</Button></template>`,
        filename: 'a.vue'
      },
      // class on a NON-webkit element is fine (consumer's own markup)
      {
        code: `${imp('Button', 'button')}<template><div class="p-4"><Button /></div></template>`,
        filename: 'b.vue'
      },
      // styleSeam component (card) is exempt
      {
        code: `${imp('Card', 'card')}<template><Card class="bg-[var(--bg-canvas)]" /></template>`,
        filename: 'c.vue'
      },
      // allow-listed via options (binding name)
      {
        code: `${imp('Button', 'button')}<template><Button class="x" /></template>`,
        filename: 'd.vue',
        options: [{ allow: ['Button'] }]
      },
      // checkStyle:false lets inline style through
      {
        code: `${imp('Button', 'button')}<template><Button style="color:red" /></template>`,
        filename: 'e.vue',
        options: [{ checkStyle: false }]
      },
      // layout utilities only: how the box sits in its parent, arbitrary values included
      {
        code: `${imp('Button', 'button')}<template><Button class="w-full" /></template>`,
        filename: 'l1.vue'
      },
      {
        code: `${imp('Button', 'button')}<template><Button class="w-full max-w-(--container-sm) self-start shrink-0" /></template>`,
        filename: 'l2.vue'
      },
      {
        code: `${imp('Button', 'button')}<template><Button class="max-w-[320px] self-center" /></template>`,
        filename: 'l3.vue'
      },
      {
        code: `${imp('Table', 'table')}<template><Table><Table.Row class="shrink-0" /></Table></template>`,
        filename: 'l4.vue'
      },
      {
        code: `${imp('Table', 'table')}<template><Table max-height="100%" class="h-full min-h-0"><Table.Search class="flex-1" /></Table></template>`,
        filename: 'l5.vue'
      },
      {
        code: `${imp('Button', 'button')}<template><Button class="min-w-36 grow basis-1/3" /></template>`,
        filename: 'l6.vue'
      }
    ],
    invalid: [
      {
        code: `${imp('Button', 'button')}<template><Button class="shrink-0 cursor-pointer" /></template>`,
        filename: 'cursor.vue',
        errors: [
          {
            messageId: 'overrideClasses',
            data: { classes: 'cursor-pointer', tag: 'Button', allowed: ALLOWED_LAYOUT.join(', ') }
          }
        ]
      },
      {
        code: `${imp('Button', 'button')}<template><Button class="flex-1 flex-col" /></template>`,
        filename: 'flexcol.vue',
        errors: [{ messageId: 'overrideClasses' }]
      },
      {
        code: `${imp('Button', 'button')}<template><Button class="p-8">x</Button></template>`,
        filename: 'f.vue',
        errors: [{ messageId: 'overrideClasses' }]
      },
      {
        code: `${imp('Button', 'button')}<template><Button :class="cls" /></template>`,
        filename: 'g.vue',
        errors: [{ messageId: 'override' }]
      },
      {
        code: `${imp('Button', 'button')}<template><Button style="color:red" /></template>`,
        filename: 'h.vue',
        errors: [{ messageId: 'override' }]
      },
      // dot-notation sub-component of an imported compound
      {
        code: `${imp('Table', 'table')}<template><Table><Table.Row class="x" /></Table></template>`,
        filename: 'i.vue',
        errors: [{ messageId: 'overrideClasses' }]
      },
      // one non-layout class next to allowed ones still fails
      {
        code: `${imp('Button', 'button')}<template><Button class="w-full mt-4" /></template>`,
        filename: 'l5.vue',
        errors: [
          {
            messageId: 'overrideClasses',
            data: { classes: 'mt-4', tag: 'Button', allowed: ALLOWED_LAYOUT.join(', ') }
          }
        ]
      },
      // look-alikes of the families are not layout utilities
      {
        code: `${imp('Button', 'button')}<template><Button class="w-1/2 shrink" /></template>`,
        filename: 'l6.vue',
        errors: [{ messageId: 'overrideClasses' }]
      },
      // a variant prefix is not in the list
      {
        code: `${imp('Button', 'button')}<template><Button class="lg:w-full" /></template>`,
        filename: 'l7.vue',
        errors: [{ messageId: 'overrideClasses' }]
      },
      // a bound :class stays barred even when it holds layout utilities
      {
        code: `${imp('Button', 'button')}<template><Button :class="'w-full'" /></template>`,
        filename: 'l8.vue',
        errors: [{ messageId: 'override' }]
      }
    ]
  })
})

test('prefer-define-model', () => {
  const sfc = (script) => `<script setup lang="ts">${script}</script><template><div /></template>`
  vueTs.run('prefer-define-model', preferDefineModel, {
    valid: [
      // already using defineModel — the target pattern
      { code: sfc('const model = defineModel<string>()'), filename: 'a.vue' },
      // modelValue prop but a one-way `change` emit (not update:modelValue) → not the anti-pattern
      {
        code: sfc(
          'interface Props { modelValue?: string } defineProps<Props>(); defineEmits<{ change: [v: string] }>()'
        ),
        filename: 'b.vue'
      },
      // update:modelValue emit but no modelValue prop declared → not the anti-pattern
      {
        code: sfc(
          "defineProps<{ label?: string }>(); defineEmits<{ 'update:modelValue': [v: string] }>()"
        ),
        filename: 'c.vue'
      },
      // no defineEmits at all
      { code: sfc('defineProps<{ modelValue?: string }>()'), filename: 'd.vue' }
    ],
    invalid: [
      // the real-world shape: referenced interface + withDefaults + typed emits
      {
        code: sfc(
          "interface Props { modelValue?: boolean } withDefaults(defineProps<Props>(), { modelValue: false }); defineEmits<{ 'update:modelValue': [value: boolean] }>()"
        ),
        filename: 'e.vue',
        errors: [{ messageId: 'preferModel' }]
      },
      // inline type literals
      {
        code: sfc(
          "defineProps<{ modelValue?: string }>(); defineEmits<{ 'update:modelValue': [v: string] }>()"
        ),
        filename: 'f.vue',
        errors: [{ messageId: 'preferModel' }]
      },
      // runtime forms (object props + array emits)
      {
        code: sfc(
          "defineProps({ modelValue: { type: Boolean } }); defineEmits(['update:modelValue'])"
        ),
        filename: 'g.vue',
        errors: [{ messageId: 'preferModel' }]
      }
    ]
  })
})

test('authoring-standards (shared engine: hook + ratchet + consumer lint)', () => {
  const sfc = (script, template = '<div />') =>
    `<script setup lang="ts">${script}</script><template>${template}</template>`
  vueTs.run('authoring-standards', authoringStandards, {
    valid: [
      { code: sfc('const model = defineModel<string>()'), filename: 'a.vue' },
      {
        code: sfc('defineSlots<{ default(): unknown }>()', '<div><slot /></div>'),
        filename: 'b.vue'
      },
      {
        code: sfc(
          '/** Size token. */ export type Size = "small" | "large"; interface Props { /** Visual variant. */ kind?: string; size?: Size } defineProps<Props>(); defineEmits<{ /** Fired on activation. */ click: [event: MouseEvent] }>()'
        ),
        filename: 'c.vue'
      },
      {
        code: sfc(
          "import { computed, useSlots } from 'vue'; defineSlots<{ /** Aside. */ aside(): unknown }>(); const slots = useSlots(); const hasAside = () => Boolean(slots.aside); const label = computed<string>(() => 'x')",
          '<div v-if="hasAside()"><slot name="aside" /></div>'
        ),
        filename: 'i.vue'
      },
      {
        code: sfc(
          "import { computed, useSlots } from 'vue'; defineSlots<{ /** Cells. */ default(): unknown }>(); const slots = useSlots(); const cells = computed(() => slots.default?.() ?? [])",
          '<div><slot /></div>'
        ),
        filename: 'j.vue'
      }
    ],
    invalid: [
      // hand-rolled v-model
      {
        code: sfc(
          "interface Props { modelValue?: boolean } withDefaults(defineProps<Props>(), { modelValue: false }); defineEmits<{ 'update:modelValue': [v: boolean] }>()"
        ),
        filename: 'c.vue',
        errors: [{ messageId: 'manual-v-model' }]
      },
      // runtime defineProps
      {
        code: sfc('defineProps({ kind: String })'),
        filename: 'd.vue',
        errors: [{ messageId: 'runtime-define-props' }]
      },
      // <slot> without defineSlots
      {
        code: sfc('const a = 1', '<div><slot /></div>'),
        filename: 'e.vue',
        errors: [{ messageId: 'slot-without-defineslots' }]
      },
      {
        code: sfc(
          "import { computed, useSlots } from 'vue'; defineSlots<{ /** Aside. */ aside(): unknown }>(); const slots = useSlots(); const hasAside = computed(() => Boolean(slots.aside))",
          '<div><slot name="aside" /></div>'
        ),
        filename: 'h.vue',
        errors: [{ messageId: 'computed-slot-presence' }]
      },
      {
        code: sfc(
          "import { computed, useSlots } from 'vue'; defineSlots<{ /** Media. */ media(): unknown; /** Body. */ default(): unknown }>(); const slots = useSlots(); const hasMedia = computed<boolean>(() => Boolean(slots.media)); const hasBody = computed<Record<string, boolean>>(\n  () => ({ body: !!slots['default'] })\n)",
          '<div><slot name="media" /><slot /></div>'
        ),
        filename: 'k.vue',
        errors: [
          { messageId: 'computed-slot-presence', line: 1 },
          { messageId: 'computed-slot-presence', line: 1 }
        ]
      },
      {
        code: sfc('const a = 1 // explains a', '<div><!-- explains the div --></div>'),
        filename: 'f.vue',
        errors: [{ messageId: 'prose-comment' }, { messageId: 'prose-comment' }]
      },
      {
        code: sfc('/** File header. */\n\ntype Size = "small"\ndefineProps<{ size?: Size }>()'),
        filename: 'g.vue',
        errors: [{ messageId: 'prose-comment' }]
      }
    ]
  })
  js.run('authoring-standards', authoringStandards, {
    valid: [
      // a well-formed composable in .ts
      {
        code: 'export function useOk() { const v = 1; return { v } }',
        filename: 'src/composables/use-ok.ts'
      },
      // @deprecated naming replacement + removal version
      {
        code: '/** @deprecated since 4.2 — use `kind`. Removed in 5.0 */ export const a = 1',
        filename: 'src/x.js'
      },
      {
        code: "// eslint-disable-next-line no-console\nconsole.log(1)\nconst u = 'http://x'",
        filename: 'src/directive.js'
      },
      {
        code: '/** @param {string} v */\nexport const f = (v) => v',
        filename: 'src/typed.js'
      },
      {
        code: "// url=https://www.figma.com/design/k/F?node-id=1-2\n// source=src/a.vue\n// component=A\nimport figma from 'figma'\nexport default { id: 'a' }",
        filename: 'src/components/a/a.figma.ts'
      },
      {
        code: '// a note in a test is out of scope\nexport const a = 1',
        filename: 'src/thing.test.js'
      }
    ],
    invalid: [
      // composable returning reactive() AND authored as .js → both blocks fire
      {
        code: 'export function useBad() { return reactive({ v: 1 }) }',
        filename: 'src/composables/use-bad.js',
        errors: [{ messageId: 'composable-return-reactive' }, { messageId: 'composable-js' }]
      },
      // bare @deprecated
      {
        code: '/** @deprecated */ export const a = 1',
        filename: 'src/y.js',
        errors: [{ messageId: 'deprecated-without-replacement' }]
      },
      {
        code: '// url=https://www.figma.com/design/k/F?node-id=1-2\nexport const a = 1',
        filename: 'src/a.ts',
        errors: [{ messageId: 'prose-comment', line: 1 }]
      },
      {
        code: ['// 1', 'export const a = 1 // 2', '/* 3 */ export const b = 2'].join('\n'),
        filename: 'src/w.js',
        errors: [
          { messageId: 'prose-comment', line: 1 },
          { messageId: 'prose-comment', line: 2 },
          { messageId: 'prose-comment', line: 3 }
        ]
      },
      {
        code: '/** Builds the thing. */\nexport function build() {}',
        filename: 'src/build.ts',
        errors: [{ messageId: 'prose-comment' }]
      },
      {
        code: '/**\n * Explains the value.\n * @param {string} v\n */\nexport const f = (v) => v',
        filename: 'src/typed.js',
        errors: [{ messageId: 'prose-comment' }]
      }
    ]
  })
})

test('layout class families: shared constant used by the rule and the MCP', async () => {
  const { LAYOUT_CLASS_FAMILIES, isLayoutClass, nonLayoutClasses } =
    await import('../../src/eslint-plugin/index.js')
  assert.deepEqual(
    [...LAYOUT_CLASS_FAMILIES],
    [
      'w-full',
      'h-full',
      'max-w-*',
      'min-w-*',
      'max-h-*',
      'min-h-*',
      'flex-1',
      'flex-auto',
      'flex-initial',
      'flex-none',
      'grow',
      'grow-*',
      'basis-*',
      'self-*',
      'shrink-0'
    ]
  )
  for (const ok of [
    'w-full',
    'h-full',
    'max-w-sm',
    'max-w-(--container-sm)',
    'max-w-[320px]',
    'min-w-0',
    'min-w-36',
    'max-h-96',
    'min-h-0',
    'flex-1',
    'flex-none',
    'grow',
    'grow-0',
    'basis-1/3',
    'self-end',
    'shrink-0'
  ]) {
    assert.equal(isLayoutClass(ok), true, ok)
  }
  for (const bad of [
    'w-1/2',
    'h-10',
    'max-w-',
    'min-h-',
    'self-',
    'shrink',
    'shrink-1',
    'flex',
    'flex-col',
    'flex-row',
    'flex-wrap',
    'grow-',
    'p-4',
    'gap-(--spacing-sm)',
    'cursor-pointer',
    'text-body-md',
    'bg-(--bg-surface)',
    'lg:w-full',
    ''
  ]) {
    assert.equal(isLayoutClass(bad), false, bad)
  }
  assert.deepEqual(nonLayoutClasses('w-full  mt-2 self-start text-red'), ['mt-2', 'text-red'])
})

test('no-output-in-command', () => {
  const sample = (code, language = 'bash') =>
    `const samples = [{ label: 'Shell', language: '${language}', code: ${JSON.stringify(code)} }]`
  js.run('no-output-in-command', noOutputInCommand, {
    valid: [
      sample('curl -I https://example.com'),
      sample('# Install the CLI\ncurl -fsSL https://cli.azion.app/install.sh | bash'),
      sample('# Install\nnpm install\n# Build\nnpm run build'),
      sample('#!/bin/sh\nazion deploy'),
      sample('$ azion login\n$ azion deploy'),
      sample('$ azion deploy \\\n  --local'),
      sample('curl -I https://example.com\n# HTTP/2 200', 'text'),
      'const tab = { language: "bash", code: someCode }'
    ],
    invalid: [
      {
        code: sample('curl -I https://<your-azion-domain>\n# HTTP/2 200'),
        errors: [{ messageId: 'output' }]
      },
      { code: sample('azion version\n# Azion CLI 4.23.0'), errors: [{ messageId: 'output' }] },
      {
        code: sample('azion deploy\n# => https://my-site.azion.app'),
        errors: [{ messageId: 'output' }]
      },
      { code: sample('$ azion version\nAzion CLI 4.23.0'), errors: [{ messageId: 'output' }] },
      {
        code: 'const t = { lang: `sh`, code: `npm test\n# returns 0` }',
        errors: [{ messageId: 'output' }]
      }
    ]
  })
  vue.run('no-output-in-command', noOutputInCommand, {
    valid: [
      {
        code: `<template><DocCodeGroup :samples="[{ language: 'bash', code: 'curl -I https://x', output: 'HTTP/2 200' }]" /></template>`,
        filename: 'a.vue'
      }
    ],
    invalid: [
      {
        code: `<template><DocCodeGroup :samples="[{ language: 'bash', code: 'curl -I https://x\\n# HTTP/2 200' }]" /></template>`,
        filename: 'b.vue',
        errors: [{ messageId: 'output' }]
      }
    ]
  })
})

test('no-root-relative-asset', () => {
  js.run('no-root-relative-asset', noRootRelativeAsset, {
    valid: [
      "import logo from '@aziontech/webkit/assets/magalu-extended-color.svg'",
      "const item = { logo, href: '/customers/magalu' }",
      "const doc = '/docs/edge-application'",
      "const remote = 'https://www.azion.com/media/careers/office-desks.jpg'",
      'const own = `${base}/media/careers/office-desks.jpg`',
      "const text = 'See /media/ for the press kit'",
      {
        code: "const own = '/media/hero.jpg'",
        options: [{ prefixes: ['/marketing-components/'] }]
      }
    ],
    invalid: [
      {
        code: "const logo = '/marketing-components/logos/magalu-extended-color.svg'",
        errors: [
          {
            messageId: 'known',
            data: {
              url: '/marketing-components/logos/magalu-extended-color.svg',
              specifier: '@aziontech/webkit/assets/magalu-extended-color.svg',
              binding: 'magaluExtendedColor'
            }
          }
        ]
      },
      {
        code: "const badge = '/marketing-components/badges/soc.svg'",
        errors: [
          {
            messageId: 'known',
            data: {
              url: '/marketing-components/badges/soc.svg',
              specifier: '@aziontech/webkit/assets/soc-symbol-color.svg',
              binding: 'socSymbolColor'
            }
          }
        ]
      },
      {
        code: "const photo = { src: '/media/careers/office-desks.jpg' }",
        errors: [{ messageId: 'unknown' }]
      },
      { code: 'const cover = `/media/blog/${slug}.png`', errors: [{ messageId: 'unknown' }] },
      {
        code: "const hero = 'bg-[url(/media/hero.jpg)] bg-cover'",
        errors: [{ messageId: 'unknown' }]
      },
      {
        code: "const own = '/images/hero.jpg'",
        options: [{ prefixes: ['/images/'] }],
        errors: [{ messageId: 'unknown' }]
      }
    ]
  })
  vue.run('no-root-relative-asset', noRootRelativeAsset, {
    valid: [
      {
        code: `<script setup>
  import banner from '@aziontech/webkit/assets/placeholder-image.svg'
</script>
<template><ArticleBody :banner="banner" href="/media" /></template>`,
        filename: 'a.vue'
      }
    ],
    invalid: [
      {
        code: '<template><ArticleBody banner="/media/blog/banner.svg" /></template>',
        filename: 'b.vue',
        errors: [{ messageId: 'unknown' }]
      },
      {
        code: `<template><ClientQuotes :items="[{ logo: '/marketing-components/logos/zoop-extended-color.svg' }]" /></template>`,
        filename: 'c.vue',
        errors: [{ messageId: 'known' }]
      },
      {
        code: `<script setup>
  const photos = [{ src: '/media/careers/team-talk.jpg' }]
</script>
<template><PhotoMarquee :photos="photos" /></template>`,
        filename: 'd.vue',
        errors: [{ messageId: 'unknown' }]
      }
    ]
  })
})

test('menu-node-href', () => {
  js.run('menu-node-href', menuNodeHref, {
    valid: [
      "const nav = [{ id: 'home', label: 'Home', href: '/home' }]",
      "const nav = [{ id: 'home', label: 'Home', href: '/home', path: '/home' }]",
      "const routes = [{ path: '/home', name: 'home', component: Home }]",
      "const crumbs = [{ label: 'Home', path: '/home' }]",
      "const node = { id: 'docs', label: 'Docs', path: 'relative' }",
      "const node = { id: 'docs', label: 'Docs', to: someRoute }"
    ],
    invalid: [
      {
        code: "const nav = [{ id: 'home', label: 'Home', icon: 'pi pi-home', path: '/home' }]",
        errors: [{ messageId: 'alias', data: { key: 'path' } }]
      },
      {
        code: "const node = { id: 'users', label: 'Users', to: { name: 'users' } }",
        errors: [{ messageId: 'alias', data: { key: 'to' } }]
      },
      {
        code: 'const node = { id: `x`, label: `X`, url: `/x/${id}` }',
        errors: [{ messageId: 'alias', data: { key: 'url' } }]
      }
    ]
  })
  vue.run('menu-node-href', menuNodeHref, {
    valid: [
      {
        code: `<template><Menu :groups="[{ items: [{ id: 'a', label: 'A', href: '/a' }] }]" /></template>`,
        filename: 'a.vue'
      }
    ],
    invalid: [
      {
        code: `<template><Menu :groups="[{ items: [{ id: 'a', label: 'A', path: '/a' }] }]" /></template>`,
        filename: 'b.vue',
        errors: [{ messageId: 'alias' }]
      }
    ]
  })
})

test('no-clock-in-setup', () => {
  js.run('no-clock-in-setup', noClockInSetup, {
    valid: [
      'const NOW = Date.UTC(2026, 10, 10, 12)',
      'const ago = new Date(NOW - 3_600_000)',
      "const parsed = new Date('2026-11-10T12:00:00Z')",
      'const refresh = () => { updatedAt.value = new Date() }',
      'onMounted(() => { now.value = Date.now() })',
      'watch(source, () => { stamp = Date.now() })',
      'function tick() { return Date.now() }',
      'const later = Date.now'
    ],
    invalid: [
      {
        code: 'const referenceTime = Math.floor(Date.now() / 60_000) * 60_000',
        errors: [{ messageId: 'clock', data: { call: 'Date.now()' } }]
      },
      {
        code: 'const today = new Date()',
        errors: [{ messageId: 'clock', data: { call: 'new Date()' } }]
      },
      {
        code: 'const now = ref(Date.now())',
        errors: [{ messageId: 'clock' }]
      },
      {
        code: 'const year = computed(() => new Date().getFullYear())',
        errors: [{ messageId: 'clock', data: { call: 'new Date()' } }]
      }
    ]
  })
  vue.run('no-clock-in-setup', noClockInSetup, {
    valid: [
      {
        code: `<script setup>
const NOW = Date.UTC(2026, 10, 10, 12)
</script>
<template><button @click="stamp = Date.now()">Refresh</button><Cell :value="new Date(NOW)" /></template>`,
        filename: 'a.vue'
      }
    ],
    invalid: [
      {
        code: `<script setup>
const rows = [{ updatedAt: new Date(Date.now() - 7_200_000) }]
</script>
<template><Table :data="rows" /></template>`,
        filename: 'b.vue',
        errors: [{ messageId: 'clock', data: { call: 'Date.now()' } }]
      },
      {
        code: `<template><span>{{ new Date().getFullYear() }}</span></template>`,
        filename: 'c.vue',
        errors: [{ messageId: 'clock', data: { call: 'new Date()' } }]
      }
    ]
  })
})
