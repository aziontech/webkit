import assert from 'node:assert/strict'
import test from 'node:test'
import { RuleTester } from 'eslint'
import * as vueParser from 'vue-eslint-parser'
import tsParser from '@typescript-eslint/parser'

import plugin from '../../src/eslint-plugin/index.js'
import composableReadonlyReturn from '../../src/eslint-plugin/rules/composable-readonly-return.js'
import composableScopeCleanup from '../../src/eslint-plugin/rules/composable-scope-cleanup.js'
import noPolymorphicAsProp from '../../src/eslint-plugin/rules/no-polymorphic-as-prop.js'
import {
  scanSignatures,
  SIGNATURE_MESSAGES,
  SIGNATURE_RULES,
  STANDARD_BY_SIGNATURE
} from '../../scripts/lib/signature-checks.mjs'
import { STANDARDS_BY_ID } from '../../../../.claude/hooks/_lib/standards.mjs'

const ts = new RuleTester({
  languageOptions: { parser: tsParser, ecmaVersion: 2022, sourceType: 'module' }
})
const vueTs = new RuleTester({
  languageOptions: {
    parser: vueParser,
    parserOptions: { parser: tsParser },
    ecmaVersion: 2022,
    sourceType: 'module'
  }
})

const FILE = 'src/composables/use-thing/use-thing.ts'

test('composable-readonly-return', () => {
  ts.run('composable-readonly-return', composableReadonlyReturn, {
    valid: [
      {
        filename: FILE,
        code: `
          export interface UseThingReturn { value: Readonly<Ref<number>>; setValue: (n: number) => void }
          export function useThing(): UseThingReturn {
            const value = ref(0)
            const setValue = (n: number) => { value.value = n }
            return { value: readonly(value), setValue }
          }`
      },
      {
        filename: FILE,
        code: `
          export function useThing(): { doubled: ComputedRef<number> } {
            const count = ref(1)
            const doubled = computed(() => count.value * 2)
            return { doubled }
          }`
      },
      {
        filename: FILE,
        code: `
          export function useThing(): { rootEl: Ref<HTMLElement | null>; panel: Ref<HTMLDivElement | null> } {
            const rootEl = ref(null)
            const panel = shallowRef<HTMLDivElement | null>(null)
            return { rootEl, panel }
          }`
      },
      {
        filename: FILE,
        code: `
          export const useThing = (): Ctx => inject(KEY)!
          function useLocal() { const a = ref(1); return { a } }`
      },
      {
        filename: FILE,
        code: `
          export function useThing(): Api {
            const items = ref([])
            const api = { add: () => { const items = 1; return items } }
            return { ...api, size: computed(() => items.value.length) }
          }`
      },
      {
        filename: 'src/components/x/x.ts',
        code: 'export function useThing() { const a = ref(1); return reactive({ a }) }'
      },
      {
        filename: 'src/composables/use-thing/use-thing.test.ts',
        code: 'export function useThing() { const a = ref(1); return { a } }'
      },
      {
        filename: 'src/composables/use-thing/use-thing.js',
        code: 'export function useThing() { const a = computed(() => 1); return { a } }'
      }
    ],
    invalid: [
      {
        filename: FILE,
        code: 'export function useThing(): State { const a = ref(1); return reactive({ a }) }',
        errors: [{ messageId: 'reactiveReturn' }]
      },
      {
        filename: FILE,
        code: `
          export function useThing(): Api {
            const open = ref(false)
            const query = shallowRef('')
            const setOpen = (v: boolean) => { open.value = v }
            return { open, query: query, setOpen }
          }`,
        errors: [
          { messageId: 'mutableRef', data: { name: 'useThing', ref: 'open' } },
          { messageId: 'mutableRef', data: { name: 'useThing', ref: 'query' } }
        ]
      },
      {
        filename: FILE,
        code: 'export function useThing(): Ref<number> { const count = ref(0); return count }',
        errors: [{ messageId: 'mutableRef' }]
      },
      {
        filename: FILE,
        code: 'export function useThing() { return { a: computed(() => 1) } }',
        errors: [{ messageId: 'missingReturnType' }]
      },
      {
        filename: FILE,
        code: 'export const useThing = () => { const a = ref(1); return { a: readonly(a) } }',
        errors: [{ messageId: 'missingReturnType' }]
      },
      {
        filename: FILE,
        code: 'function useThing() { return 1 }\nexport { useThing }',
        errors: [{ messageId: 'missingReturnType' }]
      },
      {
        filename: 'src/composables/use-thing/use-thing.js',
        code: 'export function useThing() { const a = ref(1); return { a } }',
        errors: [{ messageId: 'mutableRef' }]
      }
    ]
  })
})

test('composable-scope-cleanup', () => {
  ts.run('composable-scope-cleanup', composableScopeCleanup, {
    valid: [
      {
        filename: FILE,
        code: `
          export function useThing(): void {
            const onResize = () => {}
            window.addEventListener('resize', onResize)
            const id = setInterval(() => {}, 100)
            const frame = requestAnimationFrame(() => {})
            const ro = new ResizeObserver(() => {})
            onScopeDispose(() => {
              window.removeEventListener('resize', onResize)
              clearInterval(id)
              cancelAnimationFrame(frame)
              ro.disconnect()
            })
          }`
      },
      {
        filename: FILE,
        code: `
          export function useThing(): void {
            useEventListener(window, 'resize', () => {})
            useResizeObserver(el, () => {})
            useIntervalFn(() => {}, 100)
            setTimeout(() => {}, 0)
          }`
      },
      {
        filename: 'src/components/x/x-helpers.ts',
        code: "window.addEventListener('resize', () => {})"
      },
      {
        filename: 'src/composables/use-thing/use-thing.test.ts',
        code: "window.addEventListener('resize', () => {})"
      }
    ],
    invalid: [
      {
        filename: FILE,
        code: `
          export function useThing(): void {
            window.addEventListener('resize', () => {})
            onUnmounted(() => {})
          }`,
        errors: [{ messageId: 'missingDispose', data: { what: 'addEventListener()' } }]
      },
      {
        filename: FILE,
        code: `
          export function useThing(): void {
            let timer = 0
            timer = window.setTimeout(() => {}, 100)
            const id = setInterval(() => {}, 100)
            requestAnimationFrame(() => {})
            const io = new IntersectionObserver(() => {})
            const mo = new MutationObserver(() => {})
          }`,
        errors: [
          { messageId: 'missingDispose', data: { what: 'setTimeout()' } },
          { messageId: 'missingDispose', data: { what: 'setInterval()' } },
          { messageId: 'missingDispose', data: { what: 'requestAnimationFrame()' } },
          { messageId: 'missingDispose', data: { what: 'new IntersectionObserver()' } },
          { messageId: 'missingDispose', data: { what: 'new MutationObserver()' } }
        ]
      }
    ]
  })
})

test('no-polymorphic-as-prop', () => {
  const sfc = (script) => `<script setup lang="ts">${script}</script><template><div /></template>`
  vueTs.run('no-polymorphic-as-prop', noPolymorphicAsProp, {
    valid: [
      {
        filename: 'a.vue',
        code: sfc(
          "interface Props { href?: string } withDefaults(defineProps<Props>(), { href: '' })"
        )
      },
      { filename: 'b.vue', code: sfc('defineProps<{ alias?: string; asset?: string }>()') },
      { filename: 'c.vue', code: sfc('const as = 1; defineProps<{ label?: string }>()') }
    ],
    invalid: [
      {
        filename: 'd.vue',
        code: sfc(
          'interface Props { as?: string; asChild?: boolean } withDefaults(defineProps<Props>(), {})'
        ),
        errors: [
          { messageId: 'polymorphic', data: { name: 'as' } },
          { messageId: 'polymorphic', data: { name: 'asChild' } }
        ]
      },
      {
        filename: 'e.vue',
        code: sfc("type Props = { as?: 'a' | 'button' }; defineProps<Props>()"),
        errors: [{ messageId: 'polymorphic', data: { name: 'as' } }]
      },
      {
        filename: 'f.vue',
        code: sfc('defineProps({ asChild: { type: Boolean, default: false } })'),
        errors: [{ messageId: 'polymorphic', data: { name: 'asChild' } }]
      }
    ]
  })
})

test('the signature rules ship as errors in recommended and strict', () => {
  for (const preset of ['recommended', 'strict']) {
    const [config] = plugin.configs[preset]
    for (const id of Object.keys(SIGNATURE_RULES)) {
      assert.equal(plugin.rules[id], SIGNATURE_RULES[id], id)
      assert.equal(config.rules[`webkit/${id}`], 'error', `${preset}: ${id}`)
    }
  }
  const [recommended] = plugin.configs.recommended
  assert.equal(recommended.rules['webkit/prefer-define-model'], 'error')
})

test('every signature rule is paired with its standard on the lint, write-time and ci surfaces', () => {
  for (const id of Object.keys(SIGNATURE_RULES)) {
    assert.ok(SIGNATURE_MESSAGES[id], `${id} has no ratchet message`)
    const standard = STANDARDS_BY_ID[STANDARD_BY_SIGNATURE[id]]
    assert.ok(standard, `${id} maps to no standard`)
    const has = (surface, by) => standard.enforce.some((e) => e.surface === surface && e.by === by)
    assert.ok(has('lint', id), `${standard.id} does not list lint ${id}`)
    assert.ok(has('write-time', 'validate-authoring'), `${standard.id} lacks validate-authoring`)
    assert.ok(has('ci', 'check-authoring'), `${standard.id} lacks check-authoring`)
  }
})

test('scanSignatures feeds the hook and the ratchet with rule ids and lines', () => {
  const composable = 'export function useA() {\n  const a = ref(1)\n  return { a }\n}\n'
  assert.deepEqual(
    scanSignatures('/abs/src/use-a.ts', composable).map((f) => [f.id, f.line]),
    [
      ['composable-readonly-return', 1],
      ['composable-readonly-return', 3]
    ]
  )
  const sfc =
    '<script setup lang="ts">\ndefineProps<{ as?: string }>()\n</script>\n<template><div /></template>'
  assert.deepEqual(
    scanSignatures('/abs/src/a.vue', sfc).map((f) => f.id),
    ['no-polymorphic-as-prop']
  )
  assert.deepEqual(scanSignatures('/abs/src/helpers.ts', composable), [])
  assert.deepEqual(scanSignatures('/abs/src/b.vue', '<template><div /></template>'), [])
})
