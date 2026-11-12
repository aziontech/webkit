import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { nextTick, ref } from 'vue'

import Default from '../../../../examples/separator/default.vue'
import Orientations from '../../../../examples/separator/orientations.vue'
import WithLabel from '../../../../examples/separator/with-label.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import Separator from './separator.vue'

const TESTID = 'layout-separator'

describe('Separator', () => {
  it('renders a separator with the default testid and horizontal semantics by default', () => {
    const { getByTestId } = render(Separator)
    const root = getByTestId(TESTID)

    expect(root).toBeInTheDocument()
    expect(root).toHaveAttribute('role', 'separator')
    expect(root).toHaveAttribute('aria-orientation', 'horizontal')
    expect(root).toHaveAttribute('data-orientation', 'horizontal')
  })

  it('reflects the orientation prop on aria-orientation and data-orientation', () => {
    const { getByTestId } = render(Separator, { props: { orientation: 'vertical' } })
    const root = getByTestId(TESTID)

    expect(root).toHaveAttribute('aria-orientation', 'vertical')
    expect(root).toHaveAttribute('data-orientation', 'vertical')
  })

  it.each(['horizontal', 'vertical'] as const)(
    'sets both orientation attributes to %s',
    (orientation) => {
      const { getByTestId } = render(Separator, { props: { orientation } })
      const root = getByTestId(TESTID)

      expect(root).toHaveAttribute('aria-orientation', orientation)
      expect(root).toHaveAttribute('data-orientation', orientation)
    }
  )

  it('renders no label span and is not marked labelled when there is no content', () => {
    const { getByTestId, queryByTestId } = render(Separator)
    const root = getByTestId(TESTID)

    // data-labelled is `hasContent || null` — absent (not "false") when empty.
    expect(root).not.toHaveAttribute('data-labelled')
    expect(queryByTestId(`${TESTID}__label`)).toBeNull()
  })

  it('renders the label prop inside the label span and marks the root labelled', () => {
    const { getByTestId } = render(Separator, { props: { label: 'OR' } })
    const root = getByTestId(TESTID)
    const label = getByTestId(`${TESTID}__label`)

    expect(root).toHaveAttribute('data-labelled', 'true')
    expect(label).toBeInTheDocument()
    expect(label).toHaveTextContent('OR')
  })

  it('names a labelled separator by its label for assistive technology', () => {
    const { getByRole } = render(Separator, { props: { label: 'Or' } })
    expect(getByRole('separator', { name: 'Or' })).toBeTruthy()
  })

  it('renders default slot content in the label span, overriding the label prop', () => {
    const { getByTestId } = render(Separator, {
      props: { label: 'ignored' },
      slots: { default: 'sliced' }
    })
    const root = getByTestId(TESTID)
    const label = getByTestId(`${TESTID}__label`)

    expect(root).toHaveAttribute('data-labelled', 'true')
    expect(label).toHaveTextContent('sliced')
    expect(label).not.toHaveTextContent('ignored')
  })

  it('forwards consumer data-testid onto the root and derives the label testid from it', () => {
    const { getByTestId } = render(Separator, {
      attrs: { 'data-testid': 'my-divider' },
      props: { label: 'OR' }
    })

    const root = getByTestId('my-divider')
    expect(root).toHaveAttribute('role', 'separator')
    expect(getByTestId('my-divider__label')).toHaveTextContent('OR')
  })

  it('has no a11y violations without a label (horizontal)', async () => {
    const { container } = render(Separator)
    await expectNoA11yViolations(container)
  })

  it('has no a11y violations with a label', async () => {
    const { container } = render(Separator, { props: { label: 'OR' } })
    await expectNoA11yViolations(container)
  })

  it('has no a11y violations when vertical', async () => {
    const { container } = render(Separator, { props: { orientation: 'vertical' } })
    await expectNoA11yViolations(container)
  })

  describe('stories', () => {
    it('renders the Default story fixture', () => {
      const { getByTestId } = render(Default)
      const root = getByTestId(TESTID)

      expect(root).toHaveAttribute('role', 'separator')
      expect(root).toHaveAttribute('data-orientation', 'horizontal')
    })

    it('renders the WithLabel story with its labelled separator', () => {
      const { getByTestId } = render(WithLabel)
      const root = getByTestId(TESTID)

      expect(root).toHaveAttribute('data-orientation', 'horizontal')
      expect(root).toHaveAttribute('data-labelled', 'true')
      expect(getByTestId(`${TESTID}__label`)).toHaveTextContent('OR')
    })

    it('renders the Orientations story with one horizontal and one vertical divider', () => {
      const { getAllByTestId } = render(Orientations)
      const [horizontal, vertical] = getAllByTestId(TESTID)

      expect(horizontal).toHaveAttribute('data-orientation', 'horizontal')
      expect(vertical).toHaveAttribute('aria-orientation', 'vertical')
      expect(vertical).toHaveAttribute('data-orientation', 'vertical')
    })
  })
})

describe('Separator slot presence', () => {
  it('follows a v-if slot that appears and disappears after mount', async () => {
    const shown = ref(false)
    const { queryByTestId } = render({
      components: { Separator },
      setup: () => ({ shown }),
      template: `<Separator><template v-if="shown" #default><span data-testid="probe">Slotted</span></template></Separator>`
    })
    expect(queryByTestId('layout-separator__label')).toBeNull()

    shown.value = true
    await nextTick()
    expect(queryByTestId('layout-separator__label')).not.toBeNull()
    expect(queryByTestId('probe')).not.toBeNull()

    shown.value = false
    await nextTick()
    expect(queryByTestId('layout-separator__label')).toBeNull()
    expect(queryByTestId('probe')).toBeNull()
  })
})
