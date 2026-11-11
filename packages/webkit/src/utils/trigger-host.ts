import {
  cloneVNode,
  Comment,
  defineComponent,
  Fragment,
  h,
  onBeforeUnmount,
  onMounted,
  onUpdated,
  type PropType,
  ref,
  Text,
  type VNode,
  type VNodeArrayChildren
} from 'vue'

import { triggerControl } from './trigger-control'

export type TriggerAria = Record<string, string | undefined>

function flatten(nodes: VNodeArrayChildren, out: VNode[] = []): VNode[] {
  for (const node of nodes) {
    if (Array.isArray(node)) flatten(node, out)
    else if (node && typeof node === 'object')
      if ((node as VNode).type === Fragment)
        flatten(((node as VNode).children ?? []) as VNodeArrayChildren, out)
      else out.push(node as VNode)
  }
  return out
}

type Slots = Record<string, unknown>

const CONTROLS = new Set(['Button', 'IconButton'])
const WRAPPERS = new Set(['Tooltip'])
const LEAVES = new Set(['Avatar', 'Badge', 'Tag', 'SeverityTag'])

function componentName({ type }: VNode): string {
  return typeof type === 'string' ? '' : ((type as { name?: string }).name ?? '')
}

function isControl(vnode: VNode): boolean {
  const { type, props } = vnode
  if (typeof type !== 'string') return CONTROLS.has(componentName(vnode))
  const p = props ?? {}
  return (
    /^(button|input|select|textarea)$/.test(type) ||
    (type === 'a' && p['href'] != null) ||
    p['role'] === 'button' ||
    Number(p['tabindex'] ?? -1) >= 0
  )
}

function isInert(nodes: VNodeArrayChildren): boolean {
  return flatten(nodes).every(
    (vnode) =>
      vnode.type === Comment ||
      vnode.type === Text ||
      (typeof vnode.type === 'string' &&
        !isControl(vnode) &&
        (!Array.isArray(vnode.children) || isInert(vnode.children))) ||
      (LEAVES.has(componentName(vnode)) && vnode.children == null)
  )
}

function firstIndex(nodes: VNode[]): number {
  return nodes.findIndex(
    (vnode) => vnode.type !== Comment && !(vnode.type === Text && !String(vnode.children).trim())
  )
}

function mergeFirst(nodes: VNode[], attrs: () => TriggerAria): boolean {
  const index = firstIndex(nodes)
  const first = nodes[index]
  if (!first) return false
  if (isControl(first)) {
    const own = attrs()
    if (first.props?.['id'] != null) delete own['id']
    nodes[index] = cloneVNode(first, own, true)
    return true
  }
  const slots = first.children as Slots | null
  const inner = slots && !Array.isArray(slots) && typeof slots === 'object' && slots['default']
  if (!WRAPPERS.has(componentName(first)) || typeof inner !== 'function') return false
  const copy = cloneVNode(first, null, true)
  const rest: Slots = { ...slots }
  delete rest['_']
  copy.children = {
    ...rest,
    default: (...args: unknown[]) => {
      const value = (inner as (...a: unknown[]) => unknown)(...args)
      const out = flatten((Array.isArray(value) ? value : [value]) as VNodeArrayChildren)
      mergeFirst(out, attrs)
      return out
    }
  } as unknown as VNode['children']
  nodes[index] = copy
  return true
}

export const TriggerHost = defineComponent({
  name: 'TriggerHost',
  props: {
    aria: { type: Object as PropType<TriggerAria>, required: true },
    controlId: { type: String, default: undefined },
    disabled: Boolean,
    asButton: Boolean
  },
  emits: ['control'],
  setup(props, { slots, emit }) {
    const hostRef = ref<globalThis.HTMLElement | null>(null)
    let control: globalThis.HTMLElement | null = null
    let ownsId = false

    const hostAttrs = (): TriggerAria => ({
      ...props.aria,
      id: props.controlId,
      ...(props.asButton && { role: 'button', tabindex: props.disabled ? '-1' : '0' })
    })

    const release = (el: globalThis.HTMLElement) => {
      for (const name of [...Object.keys(props.aria), 'role', 'tabindex'])
        if (name in props.aria || el === hostRef.value) el.removeAttribute(name)
      if (ownsId) el.removeAttribute('id')
    }

    const sync = () => {
      const host = hostRef.value
      if (!host) return
      const next = triggerControl(host)
      if (control !== next) {
        if (control) release(control)
        ownsId = !!props.controlId && (!next.id || next.id === props.controlId)
        control = next
      }
      const attrs = next === host ? hostAttrs() : { ...props.aria, id: undefined }
      if (ownsId) attrs['id'] = props.controlId
      for (const [name, value] of Object.entries(attrs))
        if (value !== undefined) next.setAttribute(name, value)
        else if (name !== 'id') next.removeAttribute(name)
      emit('control', next)
    }

    onMounted(sync)
    onUpdated(sync)
    onBeforeUnmount(() => {
      if (control) release(control)
      emit('control', null)
    })

    return () => {
      const nodes = flatten(slots['default']?.() ?? [])
      if (mergeFirst(nodes, () => ({ ...props.aria, id: props.controlId })))
        return h('span', { ref: hostRef }, nodes)
      return h('span', { ref: hostRef, ...(isInert(nodes) && hostAttrs()) }, nodes)
    }
  }
})
