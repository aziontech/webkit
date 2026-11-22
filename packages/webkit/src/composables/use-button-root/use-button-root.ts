import { computed, type ComputedRef, type FunctionalComponent, h, useAttrs } from 'vue'

import { safeHref } from '../../utils/safe-href'

export interface UseButtonRootProps {
  /** Disables interaction. */
  disabled: boolean
  /** Shows the loading state and blocks activation. */
  loading: boolean
  /** The link URL; a safe one renders the root as an anchor. */
  href: string
  /** Link target when the root is an anchor. */
  target: string
  /** Native button type; `button` when the component has none. */
  type?: string
}

export interface UseButtonRootReturn {
  /** The root element: renders `tag` with the bound attributes and the default slot. */
  Root: FunctionalComponent<{ tag: 'a' | 'button' }>
  /** The consumer attributes plus the tag, link, disabled, loading and test id bindings of the root. */
  rootAttrs: ComputedRef<Record<string, unknown>>
  /** Click handler that blocks activation while inert and emits otherwise. */
  onClick: (event: MouseEvent) => void
}

const Root: FunctionalComponent<{ tag: 'a' | 'button' }> = ({ tag }, { attrs, slots }) =>
  h(tag, attrs, slots['default']?.())
Root.props = ['tag']

function anchorBindings(
  props: UseButtonRootProps,
  href: string,
  inert: boolean,
  attrs: Record<string, unknown>
): Record<string, unknown> {
  return {
    tag: 'a',
    href,
    target: props.target,
    rel: props.target === '_blank' ? 'noopener noreferrer' : attrs['rel'],
    type: undefined,
    disabled: false,
    tabindex: inert ? -1 : attrs['tabindex']
  }
}

function buttonBindings(props: UseButtonRootProps): Record<string, unknown> {
  return {
    tag: 'button',
    href: null,
    target: undefined,
    type: props.type ?? 'button',
    disabled: props.disabled
  }
}

function stateBindings(props: UseButtonRootProps, inert: boolean): Record<string, unknown> {
  return {
    'aria-disabled': inert || undefined,
    'aria-busy': props.loading || undefined,
    'data-disabled': props.disabled ? '' : undefined,
    'data-loading': props.loading ? '' : undefined,
    'data-inert': inert ? '' : undefined
  }
}

export function useButtonRoot(
  props: UseButtonRootProps,
  name: string,
  emitClick: (event: MouseEvent) => void
): UseButtonRootReturn {
  const attrs = useAttrs()

  const rootAttrs = computed(() => {
    const href = safeHref(props.href, attrs['download'] != null && attrs['download'] !== false)
    const inert = props.disabled || props.loading
    return {
      ...attrs,
      ...(href === null ? buttonBindings(props) : anchorBindings(props, href, inert, attrs)),
      ...stateBindings(props, inert),
      'data-testid': attrs['data-testid'] ?? name
    }
  })

  return {
    Root,
    rootAttrs,
    onClick: (event: MouseEvent) => {
      if (props.disabled || props.loading) event.preventDefault()
      else emitClick(event)
    }
  }
}
