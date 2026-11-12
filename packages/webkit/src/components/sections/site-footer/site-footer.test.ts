import userEvent from '@testing-library/user-event'
import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import { expectNoA11yViolations } from '../../../test/axe'
import SiteFooter from './site-footer.vue'

const TESTID = 'sections-site-footer'

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
  { icon: 'pi pi-github', label: 'Azion on GitHub', href: 'https://github.com/aziontech' },
  {
    icon: 'pi pi-linkedin',
    label: 'Azion on LinkedIn',
    href: 'https://www.linkedin.com/company/aziontech'
  }
]

const footer = (props: Record<string, unknown> = {}) =>
  render(SiteFooter, {
    props: {
      kind: 'site',
      home: '/',
      columns,
      socials,
      statusLabel: 'All Systems Operational',
      languages: ['EN', 'PT-BR', 'ES'],
      ...props
    }
  })

describe('SiteFooter', () => {
  it('renders the footer under the default testid', () => {
    const { getByTestId } = footer()

    expect(getByTestId(TESTID)).toBeInTheDocument()
  })

  it('lets a consumer data-testid win over the fallback', () => {
    const { getByTestId, queryByTestId } = render(SiteFooter, {
      props: { columns },
      attrs: { 'data-testid': 'page-footer' }
    })

    expect(getByTestId('page-footer')).toBeInTheDocument()
    expect(queryByTestId(TESTID)).toBeNull()
  })

  it.each(['site', 'content'] as const)('mirrors kind=%s on data-kind', (kind) => {
    const { getByTestId } = footer({ kind })

    expect(getByTestId(TESTID).getAttribute('data-kind')).toBe(kind)
  })

  it('defaults to the site kind', () => {
    const { getByTestId } = render(SiteFooter, { props: { columns } })

    expect(getByTestId(TESTID).getAttribute('data-kind')).toBe('site')
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

  it('renders one social button per profile, opening in a new tab', () => {
    const { getByRole } = footer()

    socials.forEach((social) => {
      const button = getByRole('link', { name: social.label })
      expect(button.getAttribute('href')).toBe(social.href)
      expect(button.getAttribute('target')).toBe('_blank')
    })
  })

  it('places the Azion mark in CSS: the social row from lg, the signature band below it', () => {
    const { getAllByRole, getByTestId } = footer({ homeAriaLabel: 'Go home' })

    const marks = getAllByRole('link', { name: 'Go home' })
    expect(marks).toHaveLength(2)
    for (const mark of marks) expect(mark.getAttribute('href')).toBe('/')
    const inSocial = marks.find((mark) => getByTestId('layout-footer__social').contains(mark))
    const inSignature = marks.find((mark) => getByTestId('layout-footer__signature').contains(mark))
    expect(inSocial?.className).toMatch(/(^| )hidden( |$)/)
    expect(inSocial?.className).toContain('lg:inline-flex')
    expect(inSignature).toBeDefined()
    expect(getByTestId('layout-footer')).toHaveAttribute('data-signature', 'compact')
  })

  it('renders no signature band at all when home is empty', () => {
    const { queryByTestId } = footer({ home: '' })

    expect(queryByTestId('layout-footer__signature')).toBeNull()
  })

  it('renders no Azion mark when home is empty', () => {
    const { queryByRole } = footer({ home: '' })

    expect(queryByRole('link', { name: 'Azion home' })).toBeNull()
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
    expect(getByTestId(TESTID).textContent).toContain('EN')

    await userEvent.click(trigger)
    await userEvent.click(getByRole('option', { name: 'PT-BR' }))

    expect(trigger.textContent).toContain('PT-BR')
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
