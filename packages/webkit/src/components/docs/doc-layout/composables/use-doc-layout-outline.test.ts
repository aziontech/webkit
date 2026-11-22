import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'

import {
  useHeadingNavigation,
  useHeadingOutline
} from '../../../../composables/use-heading-navigation'
import { useDocLayoutOutline, type UseDocLayoutOutlineReturn } from './use-doc-layout-outline'

const Heading = defineComponent({
  props: { id: { type: String, required: true } },
  setup(props) {
    const el = ref<HTMLElement | null>(null)
    useHeadingOutline(el, () => ({ id: props.id, text: props.id.toUpperCase(), depth: 2 }))
    const navigate = useHeadingNavigation()
    return () =>
      h('h2', { id: props.id, ref: el }, [
        h(
          'a',
          {
            href: `#${props.id}`,
            onClick: (event: MouseEvent) => navigate(event, { id: props.id })
          },
          props.id
        )
      ])
  }
})

const mount = (ids: string[]) => {
  let state: UseDocLayoutOutlineReturn | undefined
  const Host = defineComponent({
    setup() {
      state = useDocLayoutOutline(ref(null))
      return () =>
        h(
          'div',
          ids.map((id) => h(Heading, { id, key: id }))
        )
    }
  })
  const view = render(Host)
  return { view, state: () => state! }
}

describe('useDocLayoutOutline', () => {
  it('lists the registered headings in document order and starts on the first', async () => {
    const { state } = mount(['install', 'usage'])
    await nextTick()
    expect(state().outline.value.map((item) => item.id)).toEqual(['install', 'usage'])
    expect(state().activeHeading.value).toBe('install')
  })

  it('jumps to a heading, focuses it and makes it the active one', async () => {
    const { view, state } = mount(['install', 'usage'])
    await nextTick()
    view.getByText('usage').click()
    const target = document.getElementById('usage')
    expect(document.activeElement).toBe(target)
    expect(target?.getAttribute('tabindex')).toBe('-1')
    expect(state().activeHeading.value).toBe('usage')
  })
})
