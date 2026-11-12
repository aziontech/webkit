import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { defineComponent, h } from 'vue'

import { expectNoA11yViolations } from '../../../test/axe'
import { LOCALES } from '../../../test/locales'
import WebkitProvider from '../../utils/webkit-provider/webkit-provider.vue'
import SeverityTag from './severity-tag.vue'

const LEVELS = [
  ['critical', 'Critical'],
  ['high', 'High'],
  ['medium', 'Medium'],
  ['low', 'Low'],
  ['info', 'Info']
] as const

const SIZES = ['small', 'medium'] as const

describe('SeverityTag', () => {
  it('renders with the fallback data-testid and the default level and size', () => {
    const { getByTestId } = render(SeverityTag)

    const root = getByTestId('content-severity-tag')
    expect(root).toHaveAttribute('data-severity', 'info')
    expect(root).toHaveAttribute('data-size', 'medium')
    expect(getByTestId('content-severity-tag__label')).toHaveTextContent('Info')
  })

  it('lets a consumer data-testid win and derives the sub-element ids from it', () => {
    const { getByTestId, queryByTestId } = render(SeverityTag, {
      attrs: { 'data-testid': 'alert-severity' }
    })

    expect(getByTestId('alert-severity')).toBeInTheDocument()
    expect(getByTestId('alert-severity__glyph')).toBeInTheDocument()
    expect(getByTestId('alert-severity__label')).toBeInTheDocument()
    expect(queryByTestId('content-severity-tag')).toBeNull()
  })

  it.each(LEVELS)('mirrors level %s on data-severity and labels it %s', (level, name) => {
    const { getByTestId } = render(SeverityTag, { props: { severity: level } })

    expect(getByTestId('content-severity-tag')).toHaveAttribute('data-severity', level)
    expect(getByTestId('content-severity-tag__label')).toHaveTextContent(name)
  })

  it.each(SIZES)('mirrors size %s on data-size', (size) => {
    const { getByTestId } = render(SeverityTag, { props: { size } })

    expect(getByTestId('content-severity-tag')).toHaveAttribute('data-size', size)
  })

  it('shows the label prop instead of the severity name', () => {
    const { getByTestId } = render(SeverityTag, { props: { severity: 'high', label: 'Alta' } })

    const label = getByTestId('content-severity-tag__label')
    expect(label).toHaveTextContent('Alta')
    expect(label).not.toHaveTextContent('High')
  })

  it('renders the default slot in place of the label', () => {
    const { getByTestId } = render(SeverityTag, {
      props: { severity: 'critical', label: 'ignored' },
      slots: { default: 'Sev 1' }
    })

    const root = getByTestId('content-severity-tag')
    expect(root).toHaveTextContent('Sev 1')
    expect(root).not.toHaveTextContent('ignored')
    expect(root).not.toHaveTextContent('Critical')
  })

  it('reads the default level name from the active locale catalog', () => {
    const Host = defineComponent({
      setup: () => () =>
        h(
          WebkitProvider,
          { locale: 'pt-BR', catalogs: LOCALES },
          { default: () => h(SeverityTag, { severity: 'low' }) }
        )
    })
    const { getByTestId } = render(Host)
    expect(getByTestId('content-severity-tag__label')).toHaveTextContent('Baixa')
  })

  it('hides the four-bar glyph from assistive technology', () => {
    const { getByTestId } = render(SeverityTag, { props: { severity: 'medium' } })

    const glyph = getByTestId('content-severity-tag__glyph')
    expect(glyph).toHaveAttribute('aria-hidden', 'true')
    expect(glyph.children).toHaveLength(4)
  })

  it('is not focusable', () => {
    const { getByTestId } = render(SeverityTag)

    expect(getByTestId('content-severity-tag')).not.toHaveAttribute('tabindex')
  })

  it('has no axe violations on the default render', async () => {
    const { container } = render(SeverityTag)
    await expectNoA11yViolations(container)
  })

  it.each(LEVELS)('has no axe violations at level %s', async (level) => {
    const { container } = render(SeverityTag, { props: { severity: level } })
    await expectNoA11yViolations(container)
  })
})
