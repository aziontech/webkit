import userEvent from '@testing-library/user-event'
import { fireEvent, render, waitFor } from '@testing-library/vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h } from 'vue'

import DefaultExample from '../../../../examples/doc-agent-card/default.vue'
import NarrowExample from '../../../../examples/doc-agent-card/narrow.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import { LOCALES } from '../../../test/locales'
import WebkitProvider from '../../utils/webkit-provider/webkit-provider.vue'
import DocAgentCard from './doc-agent-card.vue'

const PROMPT = 'Set up the Azion CLI.'

afterEach(() => {
  vi.restoreAllMocks()
})

describe('DocAgentCard', () => {
  it('renders the catalog strings, a named section and an h3 title', () => {
    const { getByRole, getByTestId } = render(DocAgentCard, { props: { prompt: PROMPT } })
    const root = getByTestId('documentation-doc-agent-card')
    expect(root.tagName).toBe('SECTION')
    expect(getByRole('region', { name: 'Your AI agent, fluent in Azion' })).toBe(root)
    expect(getByRole('heading', { level: 3, name: 'Your AI agent, fluent in Azion' })).toBeTruthy()
    expect(root).toHaveTextContent('Prefer the guided route?')
    expect(getByRole('button', { name: 'Agent setup' })).toBeTruthy()
    expect(getByRole('button', { name: 'Copy prompt' })).toBeTruthy()
  })

  it('puts the copy button in the main column and the action after the divider', () => {
    const { getByTestId } = render(DocAgentCard, { props: { prompt: PROMPT } })
    const main = getByTestId('documentation-doc-agent-card__main')
    const aside = getByTestId('documentation-doc-agent-card__aside')
    expect(main).toContainElement(getByTestId('documentation-doc-agent-card__copy'))
    expect(aside).toContainElement(getByTestId('documentation-doc-agent-card__action'))
    expect(main.compareDocumentPosition(aside) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(getByTestId('documentation-doc-agent-card__art').closest('[aria-hidden]')).toBeTruthy()
  })

  it('overrides every string and links the action', () => {
    const { getByRole } = render(DocAgentCard, {
      props: {
        prompt: PROMPT,
        title: 'Agents',
        description: 'Short.',
        asideTitle: 'Guided?',
        actionLabel: 'Set up',
        actionHref: '/agent-setup'
      }
    })
    expect(getByRole('heading', { level: 3, name: 'Agents' })).toBeTruthy()
    expect(getByRole('link', { name: 'Set up' })).toHaveAttribute('href', '/agent-setup')
  })

  it('emits copy with the prompt and action on the guided button', async () => {
    const user = userEvent.setup()
    vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue()
    const { getByRole, emitted } = render(DocAgentCard, { props: { prompt: PROMPT } })
    await fireEvent.click(getByRole('button', { name: 'Copy prompt' }))
    await waitFor(() => expect(emitted('copy')).toEqual([[PROMPT]]))
    await user.click(getByRole('button', { name: 'Agent setup' }))
    expect(emitted('action')).toHaveLength(1)
  })

  it('passes a custom agent list to the copy button and accepts an actions slot', () => {
    const custom = render(DocAgentCard, {
      props: { prompt: PROMPT, agents: [{ name: 'Claude', icon: 'ai ai-claude' }] }
    })
    expect(custom.getByRole('button', { name: 'Copy prompt' })).toHaveAccessibleDescription(
      'Works with Claude'
    )
    custom.unmount()
    const Slotted = defineComponent({
      setup: () => () =>
        h(DocAgentCard, { prompt: PROMPT }, { actions: () => h('a', { href: '#' }, 'Read') })
    })
    const slotted = render(Slotted)
    expect(slotted.queryByRole('button', { name: 'Copy prompt' })).toBeNull()
    expect(slotted.getByRole('link', { name: 'Read' })).toBeTruthy()
  })

  it('reads its strings from the provider locale', () => {
    const InProvider = defineComponent({
      setup: () => () =>
        h(
          WebkitProvider,
          { catalogs: LOCALES, locale: 'pt-BR' },
          { default: () => h(DocAgentCard, { prompt: PROMPT }) }
        )
    })
    const { getByRole } = render(InProvider)
    expect(
      getByRole('heading', { level: 3, name: 'Seu agente de IA, fluente em Azion' })
    ).toBeTruthy()
    expect(getByRole('button', { name: 'Configurar agente' })).toBeTruthy()
  })

  it('keeps reading order under dir="rtl"', () => {
    const InRtl = defineComponent({
      setup: () => () => h('div', { dir: 'rtl' }, [h(DocAgentCard, { prompt: PROMPT })])
    })
    const { getByTestId } = render(InRtl)
    const main = getByTestId('documentation-doc-agent-card__main')
    const aside = getByTestId('documentation-doc-agent-card__aside')
    expect(main.compareDocumentPosition(aside) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  })

  it('renders the examples without axe violations', async () => {
    const a = render(DefaultExample)
    await expectNoA11yViolations(a.container)
    a.unmount()
    const b = render(NarrowExample)
    expect(b.getByRole('link', { name: 'Agent setup' })).toHaveAttribute('href', '#')
    await expectNoA11yViolations(b.container)
  })
})
