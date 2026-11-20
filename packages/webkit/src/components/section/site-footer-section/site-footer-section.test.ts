import userEvent from '@testing-library/user-event'
import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import LanguageExample from '../../../../examples/site-footer-section/language.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import SiteFooterSection from './site-footer-section.vue'

const TESTID = 'site-footer-section'

const columns = [
  {
    title: 'Products',
    links: [
      { label: 'Functions', href: '/products/functions' },
      { label: 'Cache', href: '/products/cache' }
    ]
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Careers', href: '/careers' }
    ]
  }
]

const socials = [
  { icon: 'az az-github', label: 'Azion on GitHub', href: 'https://github.com/aziontech' },
  {
    icon: 'az az-linkedin',
    label: 'Azion on LinkedIn',
    href: 'https://www.linkedin.com/company/aziontech'
  }
]

const footer = (props: Record<string, unknown> = {}) =>
  render(SiteFooterSection, {
    props: {
      variant: 'site',
      home: '/',
      columns,
      socials,
      statusLabel: 'All Systems Operational',
      languages: ['EN', 'PT-BR', 'ES'],
      ...props
    }
  })

describe('SiteFooterSection', () => {
  it('renders the footer under the default testid', () => {
    const { getByTestId } = footer()

    expect(getByTestId(TESTID)).toBeInTheDocument()
  })

  it('lets a consumer data-testid win over the fallback', () => {
    const { getByTestId, queryByTestId } = render(SiteFooterSection, {
      props: { columns },
      attrs: { 'data-testid': 'page-footer' }
    })

    expect(getByTestId('page-footer')).toBeInTheDocument()
    expect(queryByTestId(TESTID)).toBeNull()
  })

  it.each(['site', 'content'] as const)('mirrors variant=%s on data-variant', (variant) => {
    const { getByTestId } = footer({ variant })

    expect(getByTestId(TESTID).getAttribute('data-variant')).toBe(variant)
  })

  it('defaults to the site variant', () => {
    const { getByTestId } = render(SiteFooterSection, { props: { columns } })

    expect(getByTestId(TESTID).getAttribute('data-variant')).toBe('site')
  })

  it('renders the contentinfo landmark named by ariaLabel', () => {
    const { getByRole } = footer({ ariaLabel: 'Site footer' })

    expect(getByRole('contentinfo', { name: 'Site footer' })).toBeInTheDocument()
  })

  it('renders every column link, in order', () => {
    const { getByText, getByRole } = footer()

    columns.forEach((column) => expect(getByText(column.title)).toBeInTheDocument())
    columns
      .flatMap((column) => column.links)
      .forEach((link) =>
        expect(getByRole('link', { name: link.label }).getAttribute('href')).toBe(link.href)
      )
  })

  it('opens an external link in a new tab and names it so, leaving internal links alone', async () => {
    const { getByRole, container } = footer({
      columns: [
        {
          title: 'Developer',
          links: [
            { label: 'Docs', href: '/docs' },
            { label: 'Our Community', href: 'https://discord.gg/azion', target: '_blank' }
          ]
        }
      ]
    })

    const external = getByRole('link', { name: 'Our Community (opens in a new tab)' })
    expect(external.getAttribute('target')).toBe('_blank')
    expect(external.getAttribute('rel')).toBe('noopener noreferrer')
    expect(external).toHaveAttribute('data-external')

    const internal = getByRole('link', { name: 'Docs' })
    expect(internal.hasAttribute('target')).toBe(false)
    expect(internal).not.toHaveAttribute('data-external')

    await expectNoA11yViolations(container)
  })

  it('renders one social button per profile, opening in a new tab', () => {
    const { getByRole } = footer()

    socials.forEach((social) => {
      const button = getByRole('link', { name: social.label })
      expect(button.getAttribute('href')).toBe(social.href)
      expect(button.getAttribute('target')).toBe('_blank')
    })
  })

  it('renders the Azion mark once, leading the bottom bar before the social icons', () => {
    const { getAllByRole, getByTestId } = footer({ homeAriaLabel: 'Go home' })

    const marks = getAllByRole('link', { name: 'Go home' })
    expect(marks).toHaveLength(1)
    expect(marks[0]?.getAttribute('href')).toBe('/')
    expect(getByTestId('footer__brand')).toContainElement(marks[0] ?? null)
    const start = getByTestId('footer__social')
    expect(start.firstElementChild).toBe(getByTestId('footer__brand'))
    expect(getByTestId('footer__bar')).toContainElement(getByTestId('footer__status'))
  })

  it('fills the status slot with the status line and the language slot with the select, in order', () => {
    const { getByRole, getByTestId, getByText } = footer()

    const bar = getByTestId('footer__status')
    const status = getByText('All Systems Operational')
    const select = getByRole('combobox', { name: 'Language' })
    expect(bar).toContainElement(status)
    expect(bar).toContainElement(select)
    expect(status.compareDocumentPosition(select) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  })

  it('renders no bottom bar when there is neither a status line nor languages', () => {
    const { queryByTestId } = footer({ statusLabel: '', languages: [] })

    expect(queryByTestId('footer__status')).toBeNull()
  })

  it('renders no Azion mark when home is empty', () => {
    const { queryByRole, queryByTestId } = footer({ home: '' })

    expect(queryByRole('link', { name: 'Azion home' })).toBeNull()
    expect(queryByTestId('footer__brand')).toBeNull()
  })

  it('renders the status line when set and nothing when empty', () => {
    const { getByText, unmount } = footer()

    expect(getByText('All Systems Operational')).toBeInTheDocument()
    unmount()

    const { queryByText } = footer({ statusLabel: '' })
    expect(queryByText('All Systems Operational')).toBeNull()
  })

  it('selects the first language and switches to another one', async () => {
    const { getByRole, getByTestId } = footer()

    const trigger = getByRole('combobox', { name: 'Language' })
    expect(trigger.textContent).toContain('English')

    await userEvent.click(trigger)
    await userEvent.click(getByRole('option', { name: 'Português (Brasil)' }))

    expect(trigger.textContent).toContain('Português (Brasil)')
    expect(getByTestId('language-select__code').textContent).toBe('BR')
  })

  it('emits update:language with the chosen option', async () => {
    const { getByRole, emitted } = footer()

    await userEvent.click(getByRole('combobox', { name: 'Language' }))
    await userEvent.click(getByRole('option', { name: 'Español' }))

    expect(emitted()['update:language']).toEqual([['ES']])
  })

  it('shows the bound language and round-trips v-model:language in the Language example', async () => {
    const { getByRole, getByText } = render(LanguageExample)

    const trigger = getByRole('combobox', { name: 'Language' })
    expect(trigger.textContent).toContain('Português (Brasil)')
    expect(getByText('Page language: PT-BR')).toBeTruthy()

    await userEvent.click(trigger)
    await userEvent.click(getByRole('option', { name: 'Español' }))

    expect(getByText('Page language: ES')).toBeTruthy()
    expect(trigger.textContent).toContain('Español')
  })

  it('renders no language select when languages is empty', () => {
    const { queryByRole } = footer({ languages: [] })

    expect(queryByRole('combobox')).toBeNull()
  })

  it('has no a11y violations', async () => {
    const { container } = footer()

    await expectNoA11yViolations(container)
  })
})
