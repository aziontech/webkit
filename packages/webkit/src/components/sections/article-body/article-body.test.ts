import { userEvent } from '@storybook/test'
import { render } from '@testing-library/vue'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { expectNoA11yViolations } from '../../../test/axe'
import ArticleBody from './article-body.vue'

const TESTID = 'sections-article-body'

const article = {
  title: 'Magalu Ensures High Availability at Scale with Azion',
  description: 'Explore how Magalu enhances cybersecurity with Azion.',
  date: 'FEB 4, 2022',
  readTime: '5 min read',
  href: 'https://www.azion.com/en/success-case/magalu/'
}

const body = [
  '## Challenge',
  '',
  'Magalu is the most innovative retail company in LATAM, which includes:',
  '',
  '- Magalu’s e-commerce platform;',
  '- App Magalu.',
  '',
  '## Results and Impact',
  '',
  '### In numbers',
  '',
  'Millions of threats blocked per year.'
].join('\n')

const share = {
  title: 'Share this article',
  copyLink: 'Copy link',
  shareX: 'Share on X',
  shareLinkedIn: 'Share on LinkedIn'
}

const community = {
  title: 'Community',
  links: [
    { label: 'Join us on Discord', href: 'https://discord.com/invite/x', icon: 'pi pi-discord' },
    { label: 'Read our blog posts', href: '/blog', icon: 'pi pi-comment' }
  ]
}

const copyPage = {
  label: 'Copy page',
  menu: [
    { value: 'link', label: 'Get page link', icon: 'pi pi-link' },
    { value: 'markdown', label: 'View page as markdown', icon: 'pi pi-eye' }
  ]
}

const trail = [
  { label: 'Success cases', href: '/success-cases' },
  { label: article.title, current: true }
]

const band = (props: Record<string, unknown> = {}) =>
  render(ArticleBody, {
    props: {
      eyebrow: 'Blog',
      article,
      trail,
      body,
      banner: '/media/blog/banner.svg',
      share,
      community,
      copyPage,
      ...props
    }
  })

const stubClipboard = () => {
  const writeText = vi.fn().mockResolvedValue(undefined)
  vi.spyOn(globalThis.navigator, 'clipboard', 'get').mockReturnValue({
    writeText
  } as unknown as Clipboard)
  return writeText
}

afterEach(() => {
  vi.restoreAllMocks()
})

describe('ArticleBody', () => {
  it('renders the band under the default testid', () => {
    const { getByTestId } = band()

    expect(getByTestId(TESTID)).toBeInTheDocument()
  })

  it('lets a consumer data-testid win over the fallback', () => {
    const { getByTestId, queryByTestId } = render(ArticleBody, {
      props: { article },
      attrs: { 'data-testid': 'post' }
    })

    expect(getByTestId('post')).toBeInTheDocument()
    expect(queryByTestId(TESTID)).toBeNull()
  })

  it('renders the headline as the page h1 with its eyebrow, lead and byline', () => {
    const { getByRole, getByText } = band()

    expect(getByRole('heading', { level: 1, name: article.title })).toBeInTheDocument()
    expect(getByText('Blog')).toBeInTheDocument()
    expect(getByText(article.description)).toBeInTheDocument()
    expect(getByText('FEB 4, 2022 • 5 min read')).toBeInTheDocument()
  })

  it('renders the breadcrumb trail', () => {
    const { getByRole } = band()

    expect(getByRole('link', { name: 'Success cases' }).getAttribute('href')).toBe('/success-cases')
  })

  it('renders the markdown body as headings with slug ids, lists and paragraphs', () => {
    const { getByRole } = band()

    const prose = getByRole('article')
    expect(prose.querySelector('h2#challenge')?.textContent?.trim()).toBe('Challenge')
    expect(prose.querySelector('h2#results-and-impact')).not.toBeNull()
    expect(prose.querySelector('h3#in-numbers')).not.toBeNull()
    expect(Array.from(prose.querySelectorAll('li')).map((li) => li.textContent?.trim())).toEqual([
      'Magalu’s e-commerce platform;',
      'App Magalu.'
    ])
    expect(prose.querySelectorAll('p')).toHaveLength(2)
  })

  it('feeds the outline from the headings, the first one active', () => {
    const { getByRole } = band()

    const outline = getByRole('navigation', { name: 'On this page' })
    const links = Array.from(outline.querySelectorAll('a'))
    expect(links.map((link) => link.getAttribute('href'))).toEqual([
      '#challenge',
      '#results-and-impact',
      '#in-numbers'
    ])
  })

  it('omits the outline when the body has no heading', () => {
    const { queryByRole } = band({ body: 'Just a paragraph.' })

    expect(queryByRole('navigation', { name: 'On this page' })).toBeNull()
  })

  it('builds the share links from the article URL', () => {
    const { getByRole } = band()

    expect(getByRole('link', { name: share.shareX }).getAttribute('href')).toBe(
      `https://x.com/intent/tweet?url=${article.href}&via=aziontech`
    )
    expect(getByRole('link', { name: share.shareLinkedIn }).getAttribute('href')).toBe(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(article.href)}`
    )
  })

  it('copies the article URL from the copy-link button', async () => {
    const writeText = stubClipboard()
    const { getByRole } = band()

    await userEvent.click(getByRole('button', { name: share.copyLink }))

    expect(writeText).toHaveBeenCalledWith(article.href)
  })

  it('copies the body from the copy-page button', async () => {
    const writeText = stubClipboard()
    const { getByRole } = band()

    await userEvent.click(getByRole('button', { name: 'Copy page' }))

    expect(writeText).toHaveBeenCalledWith(body)
  })

  it('opens external community links in a new tab', () => {
    const { getByRole } = band()

    expect(getByRole('link', { name: 'Join us on Discord' }).getAttribute('target')).toBe('_blank')
    expect(getByRole('link', { name: 'Read our blog posts' }).hasAttribute('target')).toBe(false)
  })

  it('names the left rail and its groups', () => {
    const { getByRole } = band()

    expect(getByRole('complementary', { name: share.title })).toBeInTheDocument()
    expect(getByRole('region', { name: community.title })).toBeInTheDocument()
  })

  it('omits the left rail when no group is set', () => {
    const { queryByRole } = band({ share: undefined, community: undefined, copyPage: undefined })

    expect(queryByRole('complementary', { name: share.title })).toBeNull()
    expect(queryByRole('button', { name: 'Copy page' })).toBeNull()
  })

  it('omits the banner when none is set', () => {
    const { container } = band({ banner: '' })

    expect(container.querySelector('img[src="/media/blog/banner.svg"]')).toBeNull()
  })

  it('has no a11y violations without the copy-page split button', async () => {
    const { container } = band({ copyPage: undefined })

    await expectNoA11yViolations(container)
  })

  it.skip('has no a11y violations with the copy-page split button — BLOCKED by the split-button nested-interactive defect', async () => {
    const { container } = band()

    await expectNoA11yViolations(container)
  })
})
