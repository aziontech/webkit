import { existsSync, readFileSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import type { Page } from '@playwright/test'

export type KeyboardEntry = 'field' | 'page'

export type KeyboardTarget = {
  entry: KeyboardEntry
  escape?: 'cancel'
  navigates?: boolean
}

export type KeyboardStop = {
  id: number
  body: boolean
  description: string
  ring: boolean
  modal: boolean
  frame: boolean
  editor: boolean
}

export type KeyboardStart = {
  entry: { ok: boolean; description: string }
}

export type KeyboardReach = {
  unreached: string[]
  furthest: number
}

export type KeyboardResult = {
  violations: string[]
  stops: number
  limit: boolean
}

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../../..')
const BLOCKS = join(ROOT, 'packages/webkit/blocks')
export const KEYBOARD_BASELINE = resolve(
  dirname(fileURLToPath(import.meta.url)),
  '../keyboard-baseline.json'
)

export const MAX_STOPS = 200

export const DEMO_ROUTES: { name: string; path: string; target: KeyboardTarget }[] = [
  { name: 'resources', path: '/resources', target: { entry: 'page' } },
  {
    name: 'resource-create',
    path: '/resources/new',
    target: { entry: 'field', escape: 'cancel', navigates: true }
  },
  { name: 'resource-detail', path: '/resources/1020655', target: { entry: 'page' } },
  { name: 'resource-edit', path: '/resources/1020655/edit', target: { entry: 'page' } },
  { name: 'resource-delete', path: '/resources/1020655/delete', target: { entry: 'field' } },
  { name: 'resource-deploy', path: '/resources/1020655/deploy', target: { entry: 'field' } },
  { name: 'settings', path: '/settings', target: { entry: 'page' } },
  { name: 'onboarding', path: '/onboarding', target: { entry: 'field' } },
  { name: 'onboarding-plan', path: '/onboarding/plan', target: { entry: 'field' } },
  { name: 'onboarding-profile', path: '/onboarding/profile', target: { entry: 'field' } },
  { name: 'assistant', path: '/assistant', target: { entry: 'page' } },
  { name: 'ai-keys', path: '/settings/ai-keys', target: { entry: 'page' } }
]

type BlockKeyboard = { entry?: KeyboardEntry; escape?: 'cancel' }

export function blockTarget(id: string): KeyboardTarget {
  const file = join(BLOCKS, id, 'block.json')
  const manifest = existsSync(file)
    ? (JSON.parse(readFileSync(file, 'utf8')) as { keyboard?: BlockKeyboard })
    : {}
  const group = relative(BLOCKS, join(BLOCKS, id)).split('/')[0]
  const entry = manifest.keyboard?.entry ?? (group === 'create' ? 'field' : 'page')
  return manifest.keyboard?.escape ? { entry, escape: manifest.keyboard.escape } : { entry }
}

export type KeyboardBaseline = Record<string, string[]>

export function readKeyboardBaseline(): KeyboardBaseline {
  return existsSync(KEYBOARD_BASELINE)
    ? (JSON.parse(readFileSync(KEYBOARD_BASELINE, 'utf8')) as KeyboardBaseline)
    : {}
}

export const baselineKey = (path: string, width: number) =>
  width === 1280 ? path : `${path} @${width}`

export function newViolations(found: string[], allowed: string[] = []): string[] {
  const left = new Map<string, number>()
  for (const item of allowed) left.set(item, (left.get(item) ?? 0) + 1)
  const out: string[] = []
  for (const item of found) {
    const count = left.get(item) ?? 0
    if (count > 0) left.set(item, count - 1)
    else out.push(item)
  }
  return out
}

export function keyboardStart(entry: KeyboardEntry): KeyboardStart {
  type Probe = {
    ids: WeakMap<Element, number>
    elements: Element[]
    before: WeakMap<Element, string>
    visited: Set<number>
    initial: Element | null
  }
  const FIELD =
    'input:not([type=hidden]):not([type=button]):not([type=submit]):not([type=reset]):not([type=image]), select, textarea, [role=combobox], [role=textbox], [role=radio], [role=checkbox], [role=switch], [role=slider], [role=spinbutton], [contenteditable=""], [contenteditable=true]'

  const shadows = (value: string) =>
    value === 'none'
      ? []
      : value
          .split(/,(?![^(]*\))/)
          .map((part) => part.trim())
          .filter(
            (part) =>
              !/rgba\([^)]*,\s*0(\.0+)?\)/.test(part) &&
              !/(?:^|\s)(?:0px\s+){3}0px(?:\s|$)/.test(part)
          )
  const decoration = (style: CSSStyleDeclaration) => {
    const outline =
      style.outlineStyle !== 'none' &&
      parseFloat(style.outlineWidth) > 0 &&
      !/rgba\([^)]*,\s*0(\.0+)?\)|transparent/.test(style.outlineColor)
        ? `outline ${style.outlineWidth} ${style.outlineStyle} ${style.outlineColor}`
        : ''
    return [outline, ...shadows(style.boxShadow)].filter(Boolean).join(' | ')
  }
  const layer = (style: CSSStyleDeclaration) => {
    if (style.content === 'none' || parseFloat(style.opacity) === 0) return ''
    const border =
      parseFloat(style.borderTopWidth) > 0 &&
      style.borderTopStyle !== 'none' &&
      !/rgba\([^)]*,\s*0(\.0+)?\)|transparent/.test(style.borderTopColor)
        ? `border ${style.borderTopWidth} ${style.borderTopColor}`
        : ''
    return [decoration(style), border].filter(Boolean).join(' | ')
  }
  const look = (element: Element) =>
    [
      decoration(getComputedStyle(element)),
      layer(getComputedStyle(element, '::before')),
      layer(getComputedStyle(element, '::after'))
    ].join(' || ')

  for (const animation of document.getAnimations())
    if (animation instanceof CSSTransition) animation.finish()
  const probe: Probe = {
    ids: new WeakMap(),
    elements: [],
    before: new WeakMap(),
    visited: new Set(),
    initial: document.activeElement === document.body ? null : document.activeElement
  }
  const entryEl = probe.initial instanceof HTMLElement ? probe.initial : null
  entryEl?.blur()
  for (const element of Array.from(document.body.querySelectorAll('*'))) {
    if (element.closest('svg')) continue
    probe.before.set(element, look(element))
  }
  entryEl?.focus({ preventScroll: true })
  ;(window as unknown as { __keyboardProbe: Probe }).__keyboardProbe = probe

  const visible = (element: Element) => {
    if (element.closest('[inert], [aria-hidden="true"]')) return false
    if (!element.checkVisibility({ visibilityProperty: true })) return false
    const rect = element.getBoundingClientRect()
    return rect.width > 0 || rect.height > 0
  }
  const enabled = (element: Element) =>
    !element.matches(':disabled') && element.getAttribute('aria-disabled') !== 'true'
  const modals = Array.from(document.querySelectorAll('dialog:modal, [aria-modal="true"]')).filter(
    visible
  )
  const modal = modals[modals.length - 1] ?? null
  const scope = modal ?? document.querySelector('main') ?? document.body

  const describe = (element: Element) => {
    const tag = element.tagName.toLowerCase()
    const role = element.getAttribute('role')
    const testId = element.closest('[data-testid]')?.getAttribute('data-testid')
    const labelled = element
      .getAttribute('aria-labelledby')
      ?.split(/\s+/)
      .map((id) => document.getElementById(id)?.textContent ?? '')
      .join(' ')
    const labels = (element as HTMLInputElement).labels
    const name = (
      element.getAttribute('aria-label') ||
      labelled ||
      (labels && labels.length ? labels[0]!.textContent : '') ||
      element.getAttribute('placeholder') ||
      element.getAttribute('title') ||
      (element as HTMLElement).innerText ||
      ''
    )
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 40)
    return `${tag}${role ? `[role=${role}]` : ''}${testId ? ` in ${testId}` : ''}${name ? ` "${name}"` : ''}`
  }

  const active = document.activeElement
  const inModal = Boolean(modal && active && modal.contains(active) && active !== modal)
  if (entry === 'field') {
    const fields = Array.from(scope.querySelectorAll(FIELD)).filter(
      (field) => visible(field) && enabled(field)
    )
    const first = fields[0]
    const together = first?.closest('[role=radiogroup], [role=group]')
    const ok = Boolean(
      first &&
      active &&
      (active === first ||
        first.contains(active) ||
        (together && together.contains(active) && active.matches(FIELD)))
    )
    return {
      entry: {
        ok: ok || !first,
        description: ok
          ? ''
          : `focus starts on ${active && active !== document.body ? describe(active) : 'the page'}, not the first field ${first ? describe(first) : ''}`.trim()
      }
    }
  }
  const ok =
    !active ||
    active === document.body ||
    active === document.documentElement ||
    active.matches('h1, [role=heading][aria-level="1"]') ||
    inModal
  return {
    entry: { ok, description: ok ? '' : `focus starts on ${describe(active)}, not the page` }
  }
}

export function keyboardStop(): KeyboardStop {
  type Probe = {
    ids: WeakMap<Element, number>
    elements: Element[]
    before: WeakMap<Element, string>
    visited: Set<number>
    initial: Element | null
  }
  for (const animation of document.getAnimations())
    if (animation instanceof CSSTransition) animation.finish()
  const probe = (window as unknown as { __keyboardProbe: Probe }).__keyboardProbe
  let active: Element | null = document.activeElement
  while (active?.shadowRoot?.activeElement) active = active.shadowRoot.activeElement
  const visible = (element: Element) => {
    if (!element.checkVisibility({ visibilityProperty: true })) return false
    const rect = element.getBoundingClientRect()
    return rect.width > 0 || rect.height > 0
  }
  const modal = Array.from(document.querySelectorAll('dialog:modal, [aria-modal="true"]')).some(
    visible
  )
  if (!active || active === document.body || active === document.documentElement)
    return {
      id: -1,
      body: true,
      description: 'body',
      ring: true,
      modal,
      frame: false,
      editor: false
    }

  let id = probe.ids.get(active)
  if (id === undefined) {
    id = probe.elements.length
    probe.ids.set(active, id)
    probe.elements.push(active)
  }
  probe.visited.add(id)

  const shadows = (value: string) =>
    value === 'none'
      ? []
      : value
          .split(/,(?![^(]*\))/)
          .map((part) => part.trim())
          .filter(
            (part) =>
              !/rgba\([^)]*,\s*0(\.0+)?\)/.test(part) &&
              !/(?:^|\s)(?:0px\s+){3}0px(?:\s|$)/.test(part)
          )
  const decoration = (style: CSSStyleDeclaration) => {
    const outline =
      style.outlineStyle !== 'none' &&
      parseFloat(style.outlineWidth) > 0 &&
      !/rgba\([^)]*,\s*0(\.0+)?\)|transparent/.test(style.outlineColor)
        ? `outline ${style.outlineWidth} ${style.outlineStyle} ${style.outlineColor}`
        : ''
    return [outline, ...shadows(style.boxShadow)].filter(Boolean).join(' | ')
  }
  const layer = (style: CSSStyleDeclaration) => {
    if (style.content === 'none' || parseFloat(style.opacity) === 0) return ''
    const border =
      parseFloat(style.borderTopWidth) > 0 &&
      style.borderTopStyle !== 'none' &&
      !/rgba\([^)]*,\s*0(\.0+)?\)|transparent/.test(style.borderTopColor)
        ? `border ${style.borderTopWidth} ${style.borderTopColor}`
        : ''
    return [decoration(style), border].filter(Boolean).join(' | ')
  }
  const look = (element: Element) =>
    [
      decoration(getComputedStyle(element)),
      layer(getComputedStyle(element, '::before')),
      layer(getComputedStyle(element, '::after'))
    ].join(' || ')

  const hosts = new Set<Element>([active])
  let parent = active.parentElement
  for (let depth = 0; parent && depth < 6; depth++, parent = parent.parentElement) hosts.add(parent)
  for (const sibling of [active.previousElementSibling, active.nextElementSibling])
    if (sibling) hosts.add(sibling)
  for (const sibling of [
    active.parentElement?.previousElementSibling,
    active.parentElement?.nextElementSibling
  ])
    if (sibling) hosts.add(sibling)
  for (const child of Array.from(active.querySelectorAll('*')).slice(0, 40)) hosts.add(child)
  for (const around of [active.parentElement, active.parentElement?.parentElement])
    for (const child of Array.from(around?.querySelectorAll('*') ?? []).slice(0, 80))
      hosts.add(child)
  for (const label of Array.from((active as HTMLInputElement).labels ?? [])) {
    hosts.add(label)
    for (const child of Array.from(label.querySelectorAll('*')).slice(0, 20)) hosts.add(child)
  }
  const controls = active.getAttribute('aria-controls')
  const thumb =
    active instanceof HTMLInputElement &&
    active.type === 'range' &&
    /focus-visible:\[&::-webkit-slider-thumb\]:(?:ring|outline)/.test(
      active.getAttribute('class') ?? ''
    )
  const iframe = active.tagName === 'IFRAME'
  const ring =
    thumb ||
    iframe ||
    Array.from(hosts).some((host) => {
      const now = look(host)
      const fresh = probe.initial && (probe.initial === host || probe.initial.contains(host))
      const before = fresh ? ' ||  || ' : (probe.before.get(host) ?? ' ||  || ')
      return now.replace(/\s*\|\|\s*/g, '') !== '' && now !== before
    })

  const tag = active.tagName.toLowerCase()
  const role = active.getAttribute('role')
  const testId = active.closest('[data-testid]')?.getAttribute('data-testid')
  const labelled = active
    .getAttribute('aria-labelledby')
    ?.split(/\s+/)
    .map((ref) => document.getElementById(ref)?.textContent ?? '')
    .join(' ')
  const labels = (active as HTMLInputElement).labels
  const name = (
    active.getAttribute('aria-label') ||
    labelled ||
    (labels && labels.length ? labels[0]!.textContent : '') ||
    active.getAttribute('placeholder') ||
    active.getAttribute('title') ||
    (active as HTMLElement).innerText ||
    controls ||
    ''
  )
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 40)
  return {
    id,
    body: false,
    description: `${tag}${role ? `[role=${role}]` : ''}${testId ? ` in ${testId}` : ''}${name ? ` "${name}"` : ''}`,
    ring,
    modal,
    frame: iframe,
    editor: active.matches('textarea, [contenteditable=""], [contenteditable=true]')
  }
}

export function keyboardReach(limited: boolean): KeyboardReach {
  type Probe = {
    ids: WeakMap<Element, number>
    elements: Element[]
    before: WeakMap<Element, string>
    visited: Set<number>
    initial: Element | null
  }
  const probe = (window as unknown as { __keyboardProbe: Probe }).__keyboardProbe
  const INTERACTIVE =
    'button, a[href], input:not([type=hidden]), select, textarea, summary, [tabindex], [contenteditable=""], [contenteditable=true], [role=button], [role=link], [role=tab], [role=menuitem], [role=menuitemcheckbox], [role=menuitemradio], [role=checkbox], [role=switch], [role=combobox]'
  const ROVING =
    '[role=radiogroup], [role=tablist], [role=toolbar], [role=menu], [role=menubar], [role=listbox], [role=grid], [role=treegrid], [role=tree]'
  const visible = (element: Element) => {
    if (element.closest('[inert], [aria-hidden="true"]')) return false
    if (!element.checkVisibility({ visibilityProperty: true })) return false
    const rect = element.getBoundingClientRect()
    return rect.width > 0 || rect.height > 0
  }
  const modals = Array.from(document.querySelectorAll('dialog:modal, [aria-modal="true"]')).filter(
    visible
  )
  const modal = modals[modals.length - 1] ?? null
  const scope = modal ?? document.body

  const visited = Array.from(probe.visited).map((id) => probe.elements[id]!)
  const reached = (element: Element) =>
    visited.some((stop) => stop === element || element.contains(stop) || stop.contains(element))
  let furthest: Element | null = null
  for (const stop of visited)
    if (!furthest || furthest.compareDocumentPosition(stop) & Node.DOCUMENT_POSITION_FOLLOWING)
      furthest = stop

  const groups = new Map<string, { members: Element[]; first: Element }>()
  for (const element of Array.from(scope.querySelectorAll(INTERACTIVE))) {
    if (element.closest('svg')) continue
    if (element.matches(':disabled') || element.getAttribute('aria-disabled') === 'true') continue
    if (!visible(element)) continue
    const tabindex = element.getAttribute('tabindex')
    const group = element.closest(ROVING)
    const radio =
      element instanceof HTMLInputElement && element.type === 'radio' && element.name
        ? `radio:${element.form?.id ?? ''}:${element.name}`
        : ''
    if (tabindex !== null && Number(tabindex) < 0 && !group && !radio) continue
    let key: string
    if (radio) key = radio
    else if (group) {
      let id = probe.ids.get(group)
      if (id === undefined) {
        id = probe.elements.length
        probe.ids.set(group, id)
        probe.elements.push(group)
      }
      key = `group:${id}`
    } else {
      let id = probe.ids.get(element)
      if (id === undefined) {
        id = probe.elements.length
        probe.ids.set(element, id)
        probe.elements.push(element)
      }
      key = `element:${id}`
    }
    const entry = groups.get(key) ?? { members: [], first: group ?? element }
    entry.members.push(element)
    groups.set(key, entry)
  }

  const describe = (element: Element) => {
    const tag = element.tagName.toLowerCase()
    const role = element.getAttribute('role')
    const testId = element.closest('[data-testid]')?.getAttribute('data-testid')
    const labels = (element as HTMLInputElement).labels
    const name = (
      element.getAttribute('aria-label') ||
      (labels && labels.length ? labels[0]!.textContent : '') ||
      element.getAttribute('placeholder') ||
      element.getAttribute('title') ||
      (element as HTMLElement).innerText ||
      ''
    )
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 40)
    return `${tag}${role ? `[role=${role}]` : ''}${testId ? ` in ${testId}` : ''}${name ? ` "${name}"` : ''}`
  }

  const unreached: string[] = []
  for (const { members, first } of groups.values()) {
    if (members.some(reached)) continue
    if (
      furthest &&
      members.every(
        (member) => furthest!.compareDocumentPosition(member) & Node.DOCUMENT_POSITION_FOLLOWING
      ) &&
      limited
    )
      continue
    unreached.push(describe(first))
  }
  return { unreached, furthest: probe.visited.size }
}

export async function sweepKeyboard(
  page: Page,
  target: KeyboardTarget,
  { maxStops = MAX_STOPS }: { maxStops?: number } = {}
): Promise<KeyboardResult> {
  const violations: string[] = []
  const start = await page.evaluate(keyboardStart, target.entry)
  if (!start.entry.ok) violations.push(`entry: ${start.entry.description}`)

  const seen = new Map<number, number>()
  const ringless = new Set<number>()
  let previous: KeyboardStop | null = null
  let lastBody = -1
  let stops = 0
  let limit = false
  let inside = 0
  let escaped = false
  for (let index = 0; ; index++) {
    if (index >= maxStops) {
      limit = true
      break
    }
    await page.keyboard.press('Tab')
    const stop = await page.evaluate(keyboardStop)
    if (stop.body) {
      if (previous?.body) break
      lastBody = index
      previous = stop
      continue
    }
    stops++
    if (previous && !previous.body && previous.id === stop.id) {
      if (stop.frame && inside < 30) {
        inside++
        continue
      }
      if (stop.editor && !escaped) {
        escaped = true
        await page.keyboard.press('Escape')
        continue
      }
      if (!stop.modal) violations.push(`trap: focus stays on ${stop.description}`)
      break
    }
    inside = 0
    escaped = false
    const firstSeen = seen.get(stop.id)
    if (firstSeen !== undefined) {
      if (lastBody < firstSeen && !stop.modal)
        violations.push(`trap: focus cycles back to ${stop.description} without leaving the page`)
      break
    }
    seen.set(stop.id, index)
    if (!stop.ring && !ringless.has(stop.id)) {
      ringless.add(stop.id)
      violations.push(`ring: no visible focus on ${stop.description}`)
    }
    previous = stop
  }

  const reach = await page.evaluate(keyboardReach, limit)
  for (const item of reach.unreached) violations.push(`reach: Tab never reaches ${item}`)

  if (target.escape === 'cancel') violations.push(...(await checkEscape(page, target)))
  return { violations, stops, limit }
}

const FIRST_FIELD =
  'input:not([type=hidden]):not([type=button]):not([type=submit]):not([type=reset]):not([type=checkbox]):not([type=radio]):not([type=search]):not([role=searchbox]):not([role=combobox]):not([placeholder^=Search]):not([aria-label^=Search]):not([placeholder^=Filter]):not([aria-label^=Filter]), textarea'

async function checkEscape(page: Page, target: KeyboardTarget): Promise<string[]> {
  const out: string[] = []
  const url = page.url()
  await page.goto(url)
  await page.waitForLoadState('networkidle').catch(() => undefined)
  const dialogs = page.locator('[role=alertdialog]:visible, [role=dialog]:visible, dialog[open]')
  const before = await dialogs.count()
  const inMain = page.locator(`main ${FIRST_FIELD}`).filter({ visible: true }).first()
  const field =
    (await inMain.count()) > 0
      ? inMain
      : page.locator(FIRST_FIELD).filter({ visible: true }).first()
  if ((await field.count()) === 0) return out
  await field.focus()
  await page.keyboard.type('keyboard sweep')
  await page.keyboard.press('Escape')
  const guarded = await dialogs
    .nth(before)
    .waitFor({ state: 'visible', timeout: 2_000 })
    .then(() => true)
    .catch(() => false)
  if (!guarded && page.url() === url)
    out.push('escape: Escape on a dirty form opens no unsaved-changes guard')
  if (guarded && page.url() !== url) out.push('escape: Escape left a dirty form without asking')
  if (target.navigates) {
    await page.goto(url)
    await page.waitForLoadState('networkidle').catch(() => undefined)
    await page.keyboard.press('Escape')
    const left = await page
      .waitForURL((next) => next.toString() !== url, { timeout: 2_000 })
      .then(() => true)
      .catch(() => false)
    if (!left) out.push('escape: Escape on a clean form does not leave the page')
  }
  return out
}
