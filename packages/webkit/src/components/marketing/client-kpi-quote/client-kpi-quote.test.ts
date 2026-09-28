import { userEvent } from '@storybook/test'
import { render, waitFor } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import { expectNoA11yViolations } from '../../../test/axe'
import ClientKpiQuote from './client-kpi-quote.vue'

const TESTID = 'marketing-client-kpi-quote'

const props = {
  client: 'dafiti',
  clientName: 'Dafiti',
  kpi: '86% faster',
  text: 'load times, with a 45% cost reduction in data transfer.'
}

// The mark is a dynamic import, so artwork lands a microtask-and-a-tick after mount.
const markFor = (container: Element, name: string) =>
  waitFor(() => {
    const art = container.querySelector(`svg[data-mark="${name}"]`)
    expect(art).not.toBeNull()
    return art as SVGElement
  })

describe('ClientKpiQuote', () => {
  it('renders the cell under the default testid', () => {
    const { getByTestId } = render(ClientKpiQuote, { props })

    expect(getByTestId(TESTID)).toBeInTheDocument()
  })

  it('lets a consumer data-testid win over the fallback', () => {
    const { getByTestId, queryByTestId } = render(ClientKpiQuote, {
      props,
      attrs: { 'data-testid': 'story-cell' }
    })

    expect(getByTestId('story-cell')).toBeInTheDocument()
    expect(queryByTestId(TESTID)).toBeNull()
  })

  it('reads the kpi and the text as one claim', () => {
    const { container } = render(ClientKpiQuote, { props })
    const claim = container.querySelector('p')

    expect(claim?.textContent?.replace(/\s+/g, ' ').trim()).toBe(`${props.kpi} ${props.text}`)
  })

  it('leads the claim with the kpi in its own span', () => {
    const { container } = render(ClientKpiQuote, { props })

    expect(container.querySelector('p span')).toHaveTextContent(props.kpi)
  })

  it('renders the claim without a lead when kpi is empty', () => {
    const { container } = render(ClientKpiQuote, { props: { ...props, kpi: '' } })

    expect(container.querySelector('p span')).toBeNull()
    expect(container.querySelector('p')).toHaveTextContent(props.text)
  })

  it('resolves a registered client to its artwork', async () => {
    const { container } = render(ClientKpiQuote, { props })

    await markFor(container, 'dafiti')
  })

  it('keeps the client name in the caption behind the artwork', async () => {
    const { container, getByText } = render(ClientKpiQuote, { props })
    await markFor(container, 'dafiti')

    expect(getByText('Dafiti')).toHaveAttribute('data-artwork')
  })

  it('falls back to a typographic wordmark for an unregistered client', () => {
    const { container, getByText } = render(ClientKpiQuote, {
      props: { ...props, client: 'panvel', clientName: 'Panvel' }
    })

    expect(container.querySelector('svg')).toBeNull()
    expect(getByText('Panvel')).not.toHaveAttribute('data-artwork')
  })

  it('names the mark from the registry when clientName is omitted', () => {
    const { getByText } = render(ClientKpiQuote, { props: { ...props, clientName: '' } })

    expect(getByText('Dafiti')).toBeInTheDocument()
  })

  it('captions the cell with a figcaption holding the signature', () => {
    const { container } = render(ClientKpiQuote, { props })
    const figure = container.querySelector('figure')

    expect(figure?.firstElementChild?.tagName).toBe('FIGCAPTION')
  })

  it('drops the signature band when there is no client at all', () => {
    const { container } = render(ClientKpiQuote, { props: { kpi: props.kpi, text: props.text } })

    expect(container.querySelector('figcaption')).toBeNull()
  })

  it('lets the mark slot replace the registry artwork', () => {
    const { container } = render(ClientKpiQuote, {
      props,
      slots: { mark: '<img src="/dafiti.svg" alt="" data-testid="own-mark" />' }
    })

    expect(container.querySelector('[data-testid="own-mark"]')).not.toBeNull()
    expect(container.querySelector('svg[data-mark]')).toBeNull()
  })

  it('renders the actions slot under the claim', () => {
    const { getByRole } = render(ClientKpiQuote, {
      props,
      slots: { actions: '<a href="https://example.com">View success story</a>' }
    })

    expect(getByRole('link', { name: 'View success story' })).toBeInTheDocument()
  })

  it('renders no action wrapper when the slot is empty', () => {
    const { getByTestId } = render(ClientKpiQuote, { props })

    expect(getByTestId(TESTID).querySelector('div')).toBeNull()
  })

  it('forwards consumer attributes onto the root figure', () => {
    const { getByTestId } = render(ClientKpiQuote, { props, attrs: { id: 'dafiti-cell' } })
    const root = getByTestId(TESTID)

    expect(root.tagName).toBe('FIGURE')
    expect(root).toHaveAttribute('id', 'dafiti-cell')
  })

  it('has no a11y violations with artwork and an action', async () => {
    const { container } = render(ClientKpiQuote, {
      props,
      slots: { actions: '<a href="https://example.com">View success story</a>' }
    })
    await markFor(container, 'dafiti')

    await expectNoA11yViolations(container)
  })

  it('has no a11y violations on the wordmark fallback', async () => {
    const { container } = render(ClientKpiQuote, {
      props: { ...props, client: 'panvel', clientName: 'Panvel' }
    })

    await expectNoA11yViolations(container)
  })
  describe('as a link', () => {
    const linked = { ...props, href: 'https://www.azion.com/en/success-case/dafiti/' }

    it('renders the whole cell as an anchor to the href', () => {
      const { getByTestId } = render(ClientKpiQuote, { props: linked })
      const root = getByTestId(TESTID)

      expect(root.tagName).toBe('A')
      expect(root).toHaveAttribute('href', 'https://www.azion.com/en/success-case/dafiti/')
    })

    it('marks a linked cell with data-linked', () => {
      const { getByTestId } = render(ClientKpiQuote, { props: linked })

      expect(getByTestId(TESTID)).toHaveAttribute('data-linked')
    })

    it('leaves an unlinked cell without data-linked', () => {
      const { getByTestId } = render(ClientKpiQuote, { props })

      expect(getByTestId(TESTID)).not.toHaveAttribute('data-linked')
    })

    it('drops the figcaption a link may not contain, keeping the signature', () => {
      const { container, getByTestId } = render(ClientKpiQuote, { props: linked })

      expect(container.querySelector('figcaption')).toBeNull()
      expect(getByTestId(TESTID).firstElementChild).toHaveTextContent('Dafiti')
    })

    it('names the link from ariaLabel when the page states one', () => {
      const { getByRole } = render(ClientKpiQuote, {
        props: {
          ...linked,
          ariaLabel:
            'Dafiti success story: 86% faster load times, with a 45% cost reduction in data transfer.'
        }
      })

      expect(
        getByRole('link', {
          name: 'Dafiti success story: 86% faster load times, with a 45% cost reduction in data transfer.'
        })
      ).toBeInTheDocument()
    })

    it('falls back to the claim as the link name when ariaLabel is empty', () => {
      const { getByRole } = render(ClientKpiQuote, { props: linked })

      expect(getByRole('link', { name: /Dafiti 86% faster load times/ })).toBeInTheDocument()
    })

    it('never nests a second link inside the linked cell', () => {
      const { getAllByRole } = render(ClientKpiQuote, {
        props: linked,
        slots: { actions: '<a href="https://example.com">View success story</a>' }
      })

      expect(getAllByRole('link')).toHaveLength(1)
    })

    it('is reachable by Tab', async () => {
      const { getByTestId } = render(ClientKpiQuote, { props: linked })
      await userEvent.tab()

      expect(getByTestId(TESTID)).toHaveFocus()
    })

    it('leaves an unlinked cell out of the tab order', async () => {
      const { getByTestId } = render(ClientKpiQuote, { props })
      await userEvent.tab()

      expect(getByTestId(TESTID)).not.toHaveFocus()
    })

    it('has no a11y violations as a linked cell', async () => {
      const { container } = render(ClientKpiQuote, {
        props: {
          ...linked,
          ariaLabel:
            'Dafiti success story: 86% faster load times, with a 45% cost reduction in data transfer.'
        }
      })
      await markFor(container, 'dafiti')

      await expectNoA11yViolations(container)
    })
  })
})
