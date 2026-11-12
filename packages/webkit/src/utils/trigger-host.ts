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

type Slot = (...args: unknown[]) => VNodeArrayChildren

const nameOf = ({ type }: VNode): string => (type as { name?: string }).name ?? ''

function isControl(vnode: VNode): boolean {
  const { type, props } = vnode
  if (typeof type !== 'string') return /^(Icon)?Button$/.test(nameOf(vnode))
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
      (/^(Avatar|Badge|Tag|SeverityTag)$/.test(nameOf(vnode)) && !vnode.children)
  )
}

const NON_TEXT_INPUTS = [
  'button',
  'submit',
  'reset',
  'checkbox',
  'radio',
  'file',
  'image',
  'color',
  'range'
]

const POPUP_ARIA = ['aria-expanded', 'aria-haspopup', 'aria-controls']

function isTextEntry(el: globalThis.HTMLElement): boolean {
  if (el.hasAttribute('role')) return false
  if (el instanceof globalThis.HTMLTextAreaElement) return true
  return el instanceof globalThis.HTMLInputElement && !NON_TEXT_INPUTS.includes(el.type)
}

function merge(nodes: VNode[], aria: () => TriggerAria): boolean {
  const index = nodes.findIndex(
    (vnode) => vnode.type !== Comment && !(vnode.type === Text && !String(vnode.children).trim())
  )
  const first = nodes[index]
  if (!first) return false
  if (isControl(first)) {
    const own = aria()
    own['id'] = first.props?.['id'] ?? own['id']
    const p = first.props ?? {}
    if (
      !p['role'] &&
      (first.type === 'textarea' ||
        (first.type === 'input' && !NON_TEXT_INPUTS.includes(String(p['type'] ?? 'text'))))
    ) {
      for (const name of POPUP_ARIA) delete own[name]
    }
    nodes[index] = cloneVNode(first, own, true)
    return true
  }
  const inner = (first.children as Record<string, Slot> | null)?.['default']
  if (nameOf(first) !== 'Tooltip' || typeof inner !== 'function') return false
  nodes[index] = cloneVNode(first, null, true)
  nodes[index].children = {
    default: (...args: unknown[]) => {
      const out = flatten([inner(...args)])
      merge(out, aria)
      return out
    }
  } as unknown as VNode['children']
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
      if (isTextEntry(next)) {
        for (const name of POPUP_ARIA) delete attrs[name]
      }
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
      if (merge(nodes, () => ({ ...props.aria, id: props.controlId })))
        return h('span', { ref: hostRef }, nodes)
      return h('span', { ref: hostRef, ...(isInert(nodes) && hostAttrs()) }, nodes)
    }
  }
})
