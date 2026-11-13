import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import { expectNoA11yViolations } from '../../../test/axe'
import ContactHub from './contact-hub.vue'

const TESTID = 'sections-contact-hub'
const TOPIC_TESTID = 'marketing-topic'

const lanes = [
  {
    icon: 'pi pi-briefcase',
    title: 'Sales',
    description: 'Discuss your requirements, get custom pricing, or see the platform running.',
    action: { label: 'Talk to sales', href: '/contact/sales' }
  },
  {
    icon: 'pi pi-headphones',
    title: 'Support',
    description: 'Log in with your Azion account to open a ticket.',
    action: {
      label: 'Log in to open a ticket',
      href: 'https://console.azion.com/login',
      trailing: true
    },
    statusLink: { label: 'System status', href: 'https://status.azion.com/', target: '_blank' }
  }
]

const channels = [
  {
    icon: 'pi pi-shield',
    title: 'Under a cyberattack?',
    description: 'Get emergency mitigation for an attack in progress.',
    href: 'https://www.azion.com/en/lp/under-attack-mitigation/',
    target: '_blank'
  },
  {
    icon: 'pi pi-discord',
    title: 'Join the community',
    description: 'Ask developers and the Azion team on Discord.',
    href: 'https://discord.com/invite/pM8ANzztuB',
    target: '_blank'
  },
  {
    icon: 'pi pi-book',
    title: 'Read the docs',
    description: 'Guides, API reference, and troubleshooting.',
    href: '/en/documentation/'
  }
]

const band = (props: Record<string, unknown> = {}) =>
  render(ContactHub, { props: { lanes, channels, ...props } })

describe('ContactHub', () => {
  it('renders the band under the default testid', () => {
    const { getByTestId } = band()

    expect(getByTestId(TESTID)).toBeInTheDocument()
  })

  it('lets a consumer data-testid win over the fallback', () => {
    const { getByTestId, queryByTestId } = render(ContactHub, {
      props: { lanes, channels },
      attrs: { 'data-testid': 'contact' }
    })

    expect(getByTestId('contact')).toBeInTheDocument()
    expect(queryByTestId(TESTID)).toBeNull()
  })

  it('renders one h2 per lane and channel, in order', () => {
    const { getAllByRole } = band()

    expect(
      getAllByRole('heading', { level: 2 }).map((heading) => heading.textContent?.trim())
    ).toEqual([...lanes, ...channels].map((entry) => entry.title))
  })

  it('renders each lane action as a link to its team', () => {
    const { getByRole } = band()

    expect(getByRole('link', { name: 'Talk to sales' }).getAttribute('href')).toBe('/contact/sales')
    expect(getByRole('link', { name: 'Log in to open a ticket' }).getAttribute('href')).toBe(
      'https://console.azion.com/login'
    )
  })

  it('renders the status link in a new tab with a safe rel', () => {
    const { getByRole } = band()

    const status = getByRole('link', { name: 'System status' })
    expect(status.getAttribute('href')).toBe('https://status.azion.com/')
    expect(status.getAttribute('target')).toBe('_blank')
    expect(status.getAttribute('rel')).toBe('noopener noreferrer')
  })

  it('renders no status link or action when a lane carries none', () => {
    const { queryByRole } = band({
      lanes: [{ icon: 'pi pi-briefcase', title: 'Sales', description: 'Talk to us.' }],
      channels: []
    })

    expect(queryByRole('link')).toBeNull()
  })

  it('renders each channel as a linked topic, honouring its target', () => {
    const { getAllByTestId } = band()

    const topics = getAllByTestId(TOPIC_TESTID)
    expect(topics.map((topic) => topic.getAttribute('href'))).toEqual(
      channels.map((channel) => channel.href)
    )
    expect(topics[0]?.getAttribute('target')).toBe('_blank')
    expect(topics[0]?.getAttribute('rel')).toBe('noopener noreferrer')
    expect(topics[2]?.hasAttribute('target')).toBe(false)
    expect(topics[2]?.hasAttribute('rel')).toBe(false)
  })

  it('renders only the root when lanes and channels are empty', () => {
    const { getByTestId, queryByRole, queryByTestId } = band({ lanes: [], channels: [] })

    expect(getByTestId(TESTID)).toBeInTheDocument()
    expect(queryByRole('heading')).toBeNull()
    expect(queryByTestId('layout-frame-box')).toBeNull()
  })

  it('renders only the channels when no lane is set', () => {
    const { getAllByRole, getAllByTestId } = band({ lanes: [] })

    expect(getAllByTestId(TOPIC_TESTID)).toHaveLength(channels.length)
    expect(
      getAllByRole('heading', { level: 2 }).map((heading) => heading.textContent?.trim())
    ).toEqual(channels.map((channel) => channel.title))
  })

  it('has no a11y violations', async () => {
    const { container } = band()

    await expectNoA11yViolations(container)
  })
})
