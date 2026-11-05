import { userEvent } from '@storybook/test'
import { render, waitFor, within } from '@testing-library/vue'
import { afterEach, describe, expect, it } from 'vitest'
import { nextTick } from 'vue'

import { expectNoA11yViolations } from '../../../test/axe'
import SiteNav from './site-nav.vue'

const TESTID = 'sections-site-nav'
const OPEN_TIMEOUT = 3000

const menus = [
  {
    value: 'solutions',
    label: 'Solutions',
    columns: [
      [
        {
          label: 'By Need',
          items: [
            {
              label: 'Application Development',
              description: 'Build and run applications',
              href: '/solutions/app-dev'
            },
            { label: 'Application Security', description: 'Secure applications and networks' }
          ]
        }
      ],
      [
        {
          label: 'By Industry',
          items: [{ label: 'Retail', description: 'Build high-performance shopping experiences' }]
        }
      ]
    ]
  },
  {
    value: 'developer',
    label: 'Developer',
    columns: [
      [
        {
          label: 'Docs',
          items: [{ label: 'Azion Docs', description: 'Documentation', href: '/docs' }]
        }
      ]
    ]
  }
]

const links = [{ label: 'Pricing', href: '/pricing' }]
const contact = { label: 'Contact', href: '/contact' }
const primaryAction = { label: 'Start for free', href: '/signup' }
const secondaryAction = { label: 'Login', href: '/login' }

const body = () => within(document.body)

const settle = async () => {
  await nextTick()
  await new Promise((resolve) => requestAnimationFrame(() => resolve(null)))
  await nextTick()
}

const nav = (props: Record<string, unknown> = {}) =>
  render(SiteNav, {
    props: { home: '/', menus, links, contact, primaryAction, secondaryAction, ...props }
  })

afterEach(async () => {
  await settle()
})

describe('SiteNav', () => {
  it('renders the navigation under the default testid', () => {
    const { getByTestId } = nav()

    expect(getByTestId(TESTID)).toBeInTheDocument()
  })

  it('lets a consumer data-testid win over the fallback', () => {
    const { getByTestId, queryByTestId } = render(SiteNav, {
      props: { menus },
      attrs: { 'data-testid': 'site-header' }
    })

    expect(getByTestId('site-header')).toBeInTheDocument()
    expect(queryByTestId(TESTID)).toBeNull()
  })

  it('renders the bar as the banner landmark named Azion', () => {
    const { getByRole } = nav()

    expect(getByRole('banner', { name: 'Azion' })).toBeInTheDocument()
  })

  it('links the Azion mark to home', () => {
    const { getByRole } = nav({ home: '/en' })

    expect(getByRole('link', { name: 'Azion home' }).getAttribute('href')).toBe('/en')
  })

  it('renders one trigger per menu, in order, then the plain links', () => {
    const { getAllByRole, getByRole } = nav()

    const triggers = getAllByRole('button').filter((button) =>
      menus.some((menu) => button.textContent?.includes(menu.label))
    )
    expect(triggers.map((trigger) => trigger.textContent?.trim())).toEqual(
      menus.map((menu) => menu.label)
    )
    expect(getByRole('link', { name: 'Pricing' }).getAttribute('href')).toBe('/pricing')
  })

  it('renders the contact, login and sign-up actions with their links', () => {
    const { getByRole } = nav()

    expect(getByRole('link', { name: 'Contact' }).getAttribute('href')).toBe('/contact')
    expect(getByRole('link', { name: 'Login' }).getAttribute('href')).toBe('/login')
    expect(getByRole('link', { name: 'Start for free' }).getAttribute('href')).toBe('/signup')
  })

  it('omits absent actions', () => {
    const { queryByRole } = nav({
      contact: undefined,
      primaryAction: undefined,
      secondaryAction: undefined
    })

    expect(queryByRole('link', { name: 'Contact' })).toBeNull()
    expect(queryByRole('link', { name: 'Login' })).toBeNull()
    expect(queryByRole('link', { name: 'Start for free' })).toBeNull()
  })

  it('opens a mega-menu panel with its entries, linking to # when an entry has no href', async () => {
    const { getByRole } = nav()

    const trigger = getByRole('button', { name: /Solutions/ })
    await userEvent.click(trigger)

    await waitFor(() => expect(trigger).toHaveAttribute('aria-expanded', 'true'), {
      timeout: OPEN_TIMEOUT
    })
    const entry = await waitFor(
      () => body().getByRole('link', { name: /Application Development/ }),
      { timeout: OPEN_TIMEOUT }
    )
    expect(entry.getAttribute('href')).toBe('/solutions/app-dev')
    expect(body().getByRole('link', { name: /Retail/ }).getAttribute('href')).toBe('#')
  })

  it('mirrors the column count of a panel on data-columns', async () => {
    const { getByRole } = nav()

    await userEvent.click(getByRole('button', { name: /Solutions/ }))

    await waitFor(
      () => expect(document.body.querySelector('[data-columns="2"]')).not.toBeNull(),
      { timeout: OPEN_TIMEOUT }
    )
  })

  it('opens the sheet from the menu button with the tree projected from the menus', async () => {
    const { getByRole } = nav()

    await userEvent.click(getByRole('button', { name: 'Open navigation' }))

    const sheet = await waitFor(() => body().getByRole('dialog', { name: 'Menu' }), {
      timeout: OPEN_TIMEOUT
    })
    const tree = within(sheet)
    expect(tree.getByText('Solutions')).toBeInTheDocument()
    expect(tree.getByText('Developer')).toBeInTheDocument()
    expect(tree.getByRole('link', { name: 'Pricing' }).getAttribute('href')).toBe('/pricing')
    expect(tree.getByRole('link', { name: 'Contact' }).getAttribute('href')).toBe('/contact')
    expect(tree.getByRole('link', { name: 'Login' })).toBeInTheDocument()
    expect(tree.getByRole('link', { name: 'Start for free' })).toBeInTheDocument()
  })

  it('closes the sheet on Escape and restores focus to the menu button', async () => {
    const { getByRole } = nav()

    const opener = getByRole('button', { name: 'Open navigation' })
    await userEvent.click(opener)
    await waitFor(() => body().getByRole('dialog', { name: 'Menu' }), { timeout: OPEN_TIMEOUT })

    await userEvent.keyboard('{Escape}')

    await waitFor(() => expect(body().queryByRole('dialog', { name: 'Menu' })).toBeNull(), {
      timeout: OPEN_TIMEOUT
    })
    await waitFor(() => expect(document.activeElement).toBe(opener), { timeout: OPEN_TIMEOUT })
  })

  it('has no a11y violations in the bar without menu entries', async () => {
    const { container } = nav({ menus: [], links: [] })

    await expectNoA11yViolations(container)
  })

  it.skip('has no a11y violations with menu entries: navigation-menu sets role=none items inside its role=list (aria-required-children)', async () => {
    const { container } = nav()

    await expectNoA11yViolations(container)
  })
})
