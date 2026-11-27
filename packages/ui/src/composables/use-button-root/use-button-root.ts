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

const flag = (on: boolean) => (on ? '' : undefined)

const aria = (on: boolean) => on || undefined

const isDownload = (value: unknown) => value != null && value !== false

export function useButtonRoot(
  props: UseButtonRootProps,
  name: string,
  emitClick: (event: MouseEvent) => void
): UseButtonRootReturn {
  const attrs = useAttrs()

  const off = () => props.disabled || `${attrs['aria-disabled']}` === 'true'
  const blocked = () => off() || props.loading

  const rootAttrs = computed(() => {
    const href = safeHref(props.href, isDownload(attrs['download']))
    const anchor = href !== null
    const inert = blocked()
    return {
      ...attrs,
      tag: anchor ? 'a' : 'button',
      href,
      target: anchor ? props.target : undefined,
      rel: anchor && props.target === '_blank' ? 'noopener noreferrer' : attrs['rel'],
      type: anchor ? undefined : (props.type ?? 'button'),
      disabled: !anchor && props.disabled,
      tabindex: anchor && inert ? -1 : attrs['tabindex'],
      'aria-disabled': aria(inert),
      'aria-busy': aria(props.loading),
      'data-disabled': flag(off()),
      'data-loading': flag(props.loading),
      'data-inert': flag(inert),
      'data-testid': attrs['data-testid'] ?? name
    }
  })

  return {
    Root,
    rootAttrs,
    onClick: (event: MouseEvent) => {
      if (blocked()) event.preventDefault()
      else emitClick(event)
    }
  }
}
