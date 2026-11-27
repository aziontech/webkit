import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { nextTick, ref } from 'vue'

import Kinds from '../../../../examples/module-header/alignments.vue'
import Default from '../../../../examples/module-header/default.vue'
import DescriptionWidths from '../../../../examples/module-header/description-widths.vue'
import Sizes from '../../../../examples/module-header/sizes.vue'
import WithActions from '../../../../examples/module-header/with-actions.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import ModuleHeader from './module-header.vue'

const TESTID = 'module-header'

const props = { title: 'Everything runs at the edge' }

describe('ModuleHeader', () => {
  it('renders the headline as an h2 under the default testid', () => {
    const { getByTestId, getByRole } = render(ModuleHeader, { props })

    expect(getByTestId(TESTID)).toBeInTheDocument()
    expect(getByRole('heading', { level: 2 })).toHaveTextContent('Everything runs at the edge')
  })

  it('renders inside a flush frame that keeps only its two dividing rules', () => {
    const { getByTestId } = render(ModuleHeader, { props })
    const root = getByTestId(TESTID)

    expect(root).toHaveAttribute('data-flush', 'top')
    expect(root).toHaveAttribute('data-borders', 'bottom')
  })

  it.each(['center', 'start', 'split'] as const)('reflects align="%s" on data-align', (align) => {
    const { getByTestId } = render(ModuleHeader, { props: { ...props, align } })

    expect(getByTestId(TESTID)).toHaveAttribute('data-align', align)
  })

  it('defaults to the centered alignment', () => {
    const { getByTestId } = render(ModuleHeader, { props })

    expect(getByTestId(TESTID)).toHaveAttribute('data-align', 'center')
  })

  it.each(['small', 'medium', 'large'] as const)('reflects size="%s" on data-size', (size) => {
    const { getByTestId } = render(ModuleHeader, { props: { ...props, size } })

    expect(getByTestId(TESTID)).toHaveAttribute('data-size', size)
  })

  it('defaults to the medium size', () => {
    const { getByTestId } = render(ModuleHeader, { props })

    expect(getByTestId(TESTID)).toHaveAttribute('data-size', 'medium')
  })

  it.each(['small', 'medium'] as const)('reflects padding="%s" on data-padding', (padding) => {
    const { getByTestId } = render(ModuleHeader, { props: { ...props, padding } })

    expect(getByTestId(TESTID)).toHaveAttribute('data-padding', padding)
  })

  it('defaults to the medium padding', () => {
    const { getByTestId } = render(ModuleHeader, { props })

    expect(getByTestId(TESTID)).toHaveAttribute('data-padding', 'medium')
  })

  it.each(['narrow', 'wide'] as const)(
    'reflects descriptionWidth="%s" on data-description-width',
    (descriptionWidth) => {
      const { getByTestId } = render(ModuleHeader, {
        props: { ...props, align: 'split', descriptionWidth }
      })

      expect(getByTestId(TESTID)).toHaveAttribute('data-description-width', descriptionWidth)
    }
  )

  it('defaults to the narrow description width', () => {
    const { getByTestId } = render(ModuleHeader, { props })

    expect(getByTestId(TESTID)).toHaveAttribute('data-description-width', 'narrow')
  })

  it.each(['small', 'medium', 'large'] as const)(
    'keeps the headline an h2 at size="%s"',
    (size) => {
      const { getByRole } = render(ModuleHeader, { props: { ...props, size } })

      expect(getByRole('heading', { level: 2 })).toHaveTextContent('Everything runs at the edge')
    }
  )

  it.each(['center', 'start', 'split'] as const)(
    'keeps the headline before its description in DOM order when align="%s"',
    (align) => {
      const { container } = render(ModuleHeader, {
        props: { ...props, align, eyebrow: 'Platform', description: 'One platform.' }
      })

      const heading = container.querySelector('h2')
      const paragraph = container.querySelector('p:last-of-type')

      expect(heading).toHaveTextContent('Everything runs at the edge')
      expect(paragraph).toHaveTextContent('One platform.')
      expect(heading!.compareDocumentPosition(paragraph as HTMLElement) & 4).toBe(4)
    }
  )

  it('renders no description paragraph when neither the prop nor the slot is set', () => {
    const { container } = render(ModuleHeader, { props })

    expect(container.querySelector('p')).toBeNull()
  })

  it('renders the description prop', () => {
    const { getByText } = render(ModuleHeader, {
      props: { ...props, description: 'One platform for everything.' }
    })

    expect(getByText('One platform for everything.')).toBeInTheDocument()
  })

  it('lets the default slot replace the description prop', () => {
    const { getByText, queryByText } = render(ModuleHeader, {
      props: { ...props, description: 'ignored' },
      slots: { default: 'slotted description' }
    })

    expect(getByText('slotted description')).toBeInTheDocument()
    expect(queryByText('ignored')).toBeNull()
  })

  it('renders no eyebrow when the prop is empty', () => {
    const { queryByText } = render(ModuleHeader, { props })

    expect(queryByText('Platform')).toBeNull()
  })

  it('renders the eyebrow when the prop is set', () => {
    const { getByText } = render(ModuleHeader, { props: { ...props, eyebrow: 'Platform' } })

    expect(getByText('Platform')).toBeInTheDocument()
  })

  it('renders no actions row when the slot is empty', () => {
    const { queryByRole } = render(ModuleHeader, { props })

    expect(queryByRole('button')).toBeNull()
  })

  it('renders the actions slot when it is filled', () => {
    const { getByRole } = render(ModuleHeader, {
      props,
      slots: { actions: '<button type="button">Start building</button>' }
    })

    expect(getByRole('button', { name: 'Start building' })).toBeInTheDocument()
  })

  it('forwards a consumer data-testid onto the root', () => {
    const { getByTestId } = render(ModuleHeader, {
      props,
      attrs: { 'data-testid': 'my-section-title' }
    })

    expect(getByTestId('my-section-title')).toHaveAttribute('data-align', 'center')
  })

  it('has no a11y violations with the full copy block', async () => {
    const { container } = render(ModuleHeader, {
      props: { ...props, eyebrow: 'Platform', description: 'One platform for everything.' }
    })
    await expectNoA11yViolations(container)
  })

  describe('stories', () => {
    it('renders the Default story fixture', () => {
      const { getByTestId, getByRole } = render(Default)

      expect(getByTestId(TESTID)).toHaveAttribute('data-align', 'center')
      expect(getByRole('heading', { level: 2 })).toHaveTextContent('Everything runs at the edge')
    })

    it('renders the Kinds story with one header per layout', () => {
      const { getAllByTestId } = render(Kinds)

      expect(getAllByTestId(TESTID).map((el) => el.getAttribute('data-align'))).toEqual([
        'center',
        'start',
        'split'
      ])
    })

    it('renders the Sizes story with one header per step', () => {
      const { getAllByTestId } = render(Sizes)

      expect(getAllByTestId(TESTID).map((el) => el.getAttribute('data-size'))).toEqual([
        'small',
        'medium',
        'large'
      ])
    })

    it('renders the WithActions story with both CTAs', () => {
      const { getAllByRole } = render(WithActions)

      expect(getAllByRole('button').map((el) => el.textContent?.trim())).toEqual([
        'Start for free',
        'Docs'
      ])
    })

    it('renders the DescriptionWidths story with one horizontal header per width', () => {
      const { getAllByTestId } = render(DescriptionWidths)
      const roots = getAllByTestId(TESTID)

      expect(roots.map((el) => el.getAttribute('data-align'))).toEqual(['split', 'split'])
      expect(roots.map((el) => el.getAttribute('data-description-width'))).toEqual([
        'narrow',
        'wide'
      ])
    })
  })

  describe('framed', () => {
    it('draws its own frame by default', () => {
      const { getByTestId } = render(ModuleHeader, { props: { title: 'Platform' } })
      const root = getByTestId(TESTID)

      expect(root).toHaveAttribute('data-framed')
      expect(root).toHaveAttribute('data-borders')
    })

    it('renders as a plain block when framed is false', () => {
      const { getByTestId } = render(ModuleHeader, {
        props: { title: 'Platform', framed: false }
      })
      const root = getByTestId(TESTID)

      expect(root).not.toHaveAttribute('data-framed')
      expect(root).not.toHaveAttribute('data-borders')
      expect(root).not.toHaveAttribute('data-marks')
    })

    it('keeps its copy and its heading level unframed', () => {
      const { getByRole, getByText } = render(ModuleHeader, {
        props: {
          title: 'Platform',
          eyebrow: 'Build',
          description: 'One sentence.',
          framed: false
        }
      })

      expect(getByRole('heading', { level: 2, name: 'Platform' })).toBeInTheDocument()
      expect(getByText('Build')).toBeInTheDocument()
      expect(getByText('One sentence.')).toBeInTheDocument()
    })
  })

  describe('slot presence', () => {
    it('follows a v-if slot that appears and disappears after mount', async () => {
      const shown = ref(false)
      const { queryByTestId } = render({
        components: { ModuleHeader },
        setup: () => ({ shown }),
        template: `<ModuleHeader title="Edge"><template v-if="shown" #default><span data-testid="probe">Slotted</span></template></ModuleHeader>`
      })
      expect(queryByTestId('probe')).toBeNull()

      shown.value = true
      await nextTick()
      expect(queryByTestId('probe')).not.toBeNull()
      expect(queryByTestId('probe')).not.toBeNull()

      shown.value = false
      await nextTick()
      expect(queryByTestId('probe')).toBeNull()
      expect(queryByTestId('probe')).toBeNull()
    })
  })
})
