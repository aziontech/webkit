import assert from 'node:assert/strict'
import { readdirSync, readFileSync } from 'node:fs'
import { join, relative } from 'node:path'
import test from 'node:test'

const PKG = new URL('../../', import.meta.url).pathname

export const FLOATING_OVERLAYS = [
  'collection-preferences',
  'combobox',
  'command',
  'command-root',
  'confirm-dialog',
  'context-menu',
  'context-menu-root',
  'date-picker',
  'date-picker-root',
  'date-range-picker',
  'dialog',
  'dialog-root',
  'drawer',
  'drawer-root',
  'dropdown-menu',
  'dropdown-menu-root',
  'feedback-reason-dialog',
  'filter-menu',
  'filter-menu-root',
  'hover-card',
  'hover-card-root',
  'multi-select',
  'multi-select-root',
  'popover',
  'popover-root',
  'select',
  'select-root',
  'tooltip'
]

const OPEN_ATTRIBUTES = ['open', 'default-open', 'defaultOpen']

function trueRefs(script) {
  const names = new Set()
  for (const match of script.matchAll(/\bconst\s+(\w+)\s*=\s*ref\(\s*true\s*\)/g))
    names.add(match[1])
  return names
}

function overlayBindings(source) {
  const bindings = new Set()
  const pattern = /import\s+(\w+)\s+from\s+['"]@aziontech\/ui\/([\w-]+)['"]/g
  for (const [, name, subpath] of source.matchAll(pattern)) {
    if (FLOATING_OVERLAYS.includes(subpath)) bindings.add(name)
  }
  return bindings
}

export function findOpenOnLoad(source) {
  const bindings = overlayBindings(source)
  if (!bindings.size) return []
  const script = source.match(/<script[^>]*>([\s\S]*?)<\/script>/)?.[1] ?? ''
  const template = source.slice(source.indexOf('<template'))
  const refs = trueRefs(script)
  const findings = []
  for (const tag of template.matchAll(/<([A-Z][\w]*)(\s[^>]*?)?\/?>/g)) {
    const [, name, attributes = ''] = tag
    if (!bindings.has(name)) continue
    for (const attribute of attributes.matchAll(
      /(?:^|\s)(v-model:|:)?([\w-]+)(?:="([^"]*)")?(?=\s|$)/g
    )) {
      const [, prefix = '', key, value] = attribute
      if (!OPEN_ATTRIBUTES.includes(key)) continue
      const forced =
        (prefix === '' && value === undefined) ||
        (prefix === ':' && (value === 'true' || refs.has(value))) ||
        (prefix === 'v-model:' && refs.has(value))
      if (forced)
        findings.push(`<${name} ${prefix}${key}${value === undefined ? '' : `="${value}"`}>`)
    }
  }
  return findings
}

function vueFiles(dir, out = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) {
      if (entry.name !== 'variants' && entry.name !== 'node_modules') vueFiles(path, out)
    } else if (entry.name.endsWith('.vue')) out.push(path)
  }
  return out
}

test('no example or block opens a floating overlay on page load', () => {
  const offenders = []
  for (const root of ['examples', 'blocks']) {
    for (const file of vueFiles(join(PKG, root))) {
      const findings = findOpenOnLoad(readFileSync(file, 'utf8'))
      if (findings.length) offenders.push(`${relative(PKG, file)}: ${findings.join(', ')}`)
    }
  }
  assert.deepEqual(
    offenders,
    [],
    'a floating overlay opens on the reader click, hover or focus, never on load (rules/azion-ui-overlays-closed-on-load.md)'
  )
})

test('the scan flags every forced-open shape', () => {
  const head = "<script setup>\n  import Popover from '@aziontech/ui/popover-root'\n"
  const cases = [
    '<Popover :open="true">',
    '<Popover open>',
    '<Popover default-open side="auto">',
    '<Popover\n    :default-open="true"\n  >',
    '<Popover v-model:open="shown">'
  ]
  for (const tag of cases) {
    const source = `${head}  const shown = ref(true)\n</script>\n<template>${tag}</Popover></template>`
    assert.equal(findOpenOnLoad(source).length, 1, tag)
  }
})

test('the scan stays silent on closed overlays and inline disclosures', () => {
  const sources = [
    '<script setup>\n  import Popover from \'@aziontech/ui/popover-root\'\n  const shown = ref(false)\n</script>\n<template><Popover v-model:open="shown" side="auto"></Popover></template>',
    '<script setup>\n  import Popover from \'@aziontech/ui/popover-root\'\n</script>\n<template><Popover :open="false" :default-open="false"></Popover></template>',
    "<script setup>\n  import Accordion from '@aziontech/ui/doc-accordion'\n</script>\n<template><Accordion default-open></Accordion></template>",
    "<script setup>\n  import DropdownMenu from '@aziontech/ui/dropdown-menu'\n</script>\n<template><DropdownMenu><DropdownMenu.Sub default-open /></DropdownMenu></template>"
  ]
  for (const source of sources) assert.deepEqual(findOpenOnLoad(source), [])
})
