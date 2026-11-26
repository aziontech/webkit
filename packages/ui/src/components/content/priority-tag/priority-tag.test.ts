import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { defineComponent, h } from 'vue'

import Priorities from '../../../../examples/priority-tag/priorities.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import { LOCALES } from '../../../test/locales'
import ConfigProvider from '../../provider/config-provider/config-provider.vue'
import PriorityTag from './priority-tag.vue'

const LEVELS = [
  ['urgent', 'Urgent'],
  ['high', 'High'],
  ['medium', 'Medium'],
  ['low', 'Low'],
  ['none', 'No priority']
] as const

const SIZES = ['small', 'medium'] as const

describe('PriorityTag', () => {
  it('renders with the fallback data-testid and the default level and size', () => {
    const { getByTestId } = render(PriorityTag)

    const root = getByTestId('priority-tag')
    expect(root).toHaveAttribute('data-priority', 'none')
    expect(root).toHaveAttribute('data-size', 'medium')
    expect(getByTestId('priority-tag__label')).toHaveTextContent('Priority: No priority')
  })

  it('lets a consumer data-testid win and derives the inner ids from it', () => {
    const { getByTestId, queryByTestId } = render(PriorityTag, {
      props: { priority: 'low' },
      attrs: { 'data-testid': 'ticket-priority' }
    })

    expect(getByTestId('ticket-priority')).toBeInTheDocument()
    expect(getByTestId('ticket-priority__glyph')).toBeInTheDocument()
    expect(getByTestId('ticket-priority__label')).toBeInTheDocument()
    expect(queryByTestId('priority-tag')).toBeNull()
  })

  it.each(LEVELS)(
    'mirrors level %s on data-priority and names it "Priority: %s"',
    (level, name) => {
      const { getByTestId } = render(PriorityTag, { props: { priority: level } })

      expect(getByTestId('priority-tag')).toHaveAttribute('data-priority', level)
      expect(getByTestId('priority-tag__label')).toHaveTextContent(`Priority: ${name}`)
    }
  )

  it('keeps the axis prefix out of sight and the level visible', () => {
    const { getByText } = render(PriorityTag, { props: { priority: 'high' } })

    expect(getByText('Priority:')).toHaveClass('sr-only')
    expect(getByText('High')).not.toHaveClass('sr-only')
  })

  it.each(SIZES)('mirrors size %s on data-size', (size) => {
    const { getByTestId } = render(PriorityTag, { props: { size } })

    expect(getByTestId('priority-tag')).toHaveAttribute('data-size', size)
  })

  it('shows the label prop instead of the level name and keeps the prefix', () => {
    const { getByTestId } = render(PriorityTag, { props: { priority: 'medium', label: 'Normal' } })

    const label = getByTestId('priority-tag__label')
    expect(label).toHaveTextContent('Priority: Normal')
    expect(label).not.toHaveTextContent('Medium')
  })

  it('renders the default slot in place of the label and keeps the prefix', () => {
    const { getByTestId } = render(PriorityTag, {
      props: { priority: 'urgent', label: 'ignored' },
      slots: { default: 'P1' }
    })

    const label = getByTestId('priority-tag__label')
    expect(label).toHaveTextContent('Priority: P1')
    expect(label).not.toHaveTextContent('ignored')
    expect(label).not.toHaveTextContent('Urgent')
  })

  it('reads the prefix and the level name from the active locale catalog', () => {
    const Host = defineComponent({
      setup: () => () =>
        h(
          ConfigProvider,
          { locale: 'pt-BR', catalogs: LOCALES },
          { default: () => h(PriorityTag, { priority: 'low' }) }
        )
    })
    const { getByTestId } = render(Host)
    expect(getByTestId('priority-tag__label')).toHaveTextContent('Prioridade: Baixa')
  })

  it('draws three hidden bars for the bar levels', () => {
    const { getByTestId } = render(PriorityTag, { props: { priority: 'medium' } })

    const glyph = getByTestId('priority-tag__glyph')
    expect(glyph).toHaveAttribute('aria-hidden', 'true')
    expect(glyph.children).toHaveLength(3)
  })

  it('draws the hidden alert mark for urgent instead of the bars', () => {
    const { getByTestId } = render(PriorityTag, { props: { priority: 'urgent' } })

    const glyph = getByTestId('priority-tag__glyph')
    expect(glyph.tagName).toBe('I')
    expect(glyph).toHaveAttribute('aria-hidden', 'true')
    expect(glyph).toHaveClass('az-circle-alert')
    expect(glyph.children).toHaveLength(0)
  })

  it('is not focusable', () => {
    const { getByTestId } = render(PriorityTag)

    expect(getByTestId('priority-tag')).not.toHaveAttribute('tabindex')
  })

  it('renders the glyph before the label in a right-to-left container', () => {
    const { getByTestId } = render(
      defineComponent({
        setup: () => () => h('div', { dir: 'rtl' }, [h(PriorityTag, { priority: 'high' })])
      })
    )

    const root = getByTestId('priority-tag')
    expect(root.firstElementChild).toBe(getByTestId('priority-tag__glyph'))
    expect(root.lastElementChild).toBe(getByTestId('priority-tag__label'))
  })

  it('renders every level of the priorities example', () => {
    const { getAllByTestId } = render(Priorities)

    expect(getAllByTestId('priority-tag').map((el) => el.dataset.priority)).toEqual([
      'urgent',
      'high',
      'medium',
      'low',
      'none'
    ])
  })

  it('has no axe violations on the default render', async () => {
    const { container } = render(PriorityTag)
    await expectNoA11yViolations(container)
  })

  it.each(LEVELS)('has no axe violations at level %s', async (level) => {
    const { container } = render(PriorityTag, { props: { priority: level } })
    await expectNoA11yViolations(container)
  })
})
