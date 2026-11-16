import userEvent from '@testing-library/user-event'
import { render } from '@testing-library/vue'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { expectNoA11yViolations } from '../../../test/axe'
import { toast } from '../../feedback/toast/composables/use-toast-store'
import ArticleBodySection from './article-body-section.vue'

const TESTID = 'article-body-section'

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
    { label: 'Join us on Discord', href: 'https://discord.com/invite/x', icon: 'ai ai-discord' },
    { label: 'Read our blog posts', href: '/blog', icon: 'ai ai-comment' }
  ]
}

const copyPage = {
  label: 'Copy page',
  menu: [
    { value: 'link', label: 'Get page link', icon: 'ai ai-link' },
    { value: 'markdown', label: 'View page as markdown', icon: 'ai ai-eye' }
  ]
}

const trail = [
  { label: 'Success cases', href: '/success-cases' },
  { label: article.title, active: true }
]

const band = (props: Record<string, unknown> = {}) =>
  render(ArticleBodySection, {
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

describe('ArticleBodySection', () => {
  it('renders the band under the default testid', () => {
    const { getByTestId } = band()

    expect(getByTestId(TESTID)).toBeInTheDocument()
  })

  it('sets the anchor as the band id', () => {
    const { getByTestId } = render(ArticleBodySection, { props: { article, anchor: 'band' } })
    expect(getByTestId(TESTID)).toHaveAttribute('id', 'band')
  })

  it('lets a consumer data-testid win over the fallback', () => {
    const { getByTestId, queryByTestId } = render(ArticleBodySection, {
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

  it('marks the active breadcrumb entry with aria-current', () => {
    const { container } = band()

    const current = container.querySelector('[aria-current="page"]')
    expect(current?.textContent).toContain(article.title)
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

    expect(writeText).toHaveBeenCalledWith(window.location.href)
  })

  it('copies the page as markdown from the copy-page button', async () => {
    const writeText = stubClipboard()
    const success = vi.spyOn(toast, 'success')
    const { getByRole } = band({ share: { ...share, copiedPage: 'Copied!' } })

    await userEvent.click(getByRole('button', { name: 'Copy page' }))

    expect(writeText).toHaveBeenCalledWith(
      `# ${article.title}\n\n${article.description}\n\n${body}`
    )
    expect(success).toHaveBeenCalledWith('Copied!')
  })

  it('confirms a copied link with the locale toast by default', async () => {
    stubClipboard()
    const success = vi.spyOn(toast, 'success')
    const { getByRole } = band()

    await userEvent.click(getByRole('button', { name: share.copyLink }))

    expect(success).toHaveBeenCalledWith('Link copied')
  })

  it('raises an error toast when the clipboard refuses', async () => {
    vi.spyOn(globalThis.navigator, 'clipboard', 'get').mockReturnValue({
      writeText: vi.fn().mockRejectedValue(new Error('denied'))
    } as unknown as Clipboard)
    const error = vi.spyOn(toast, 'error')
    const { getByRole } = band()

    await userEvent.click(getByRole('button', { name: share.copyLink }))

    expect(error).toHaveBeenCalledWith('Could not copy', {
      description: 'Your browser blocked clipboard access.'
    })
  })

  it('copies the feed URL from the copy-feed button only when both are set', async () => {
    const writeText = stubClipboard()
    const first = band()
    expect(first.queryByRole('button', { name: 'Copy RSS feed' })).toBeNull()
    first.unmount()

    const { getByRole } = band({
      share: { ...share, copyFeed: 'Copy RSS feed', feed: 'https://example.com/feed.xml' }
    })
    await userEvent.click(getByRole('button', { name: 'Copy RSS feed' }))

    expect(writeText).toHaveBeenCalledWith('https://example.com/feed.xml')
  })

  it('opens an assistant from the copy-page menu with the encoded prompt', async () => {
    const open = vi.spyOn(window, 'open').mockReturnValue(null)
    const { getByRole, findByRole } = band({
      copyPage: {
        label: 'Copy page',
        menu: [
          ...copyPage.menu,
          { value: 'claude', label: 'Open in Claude', icon: 'ai ai-sparkles' }
        ]
      },
      assistants: { claude: 'https://claude.example.com/new?q={prompt}' }
    })

    await userEvent.click(getByRole('button', { name: /more|options|menu/i }))
    await userEvent.click(await findByRole('menuitem', { name: 'Open in Claude' }))

    const prompt = encodeURIComponent(`Read ${article.href} so I can ask questions about it.`)
    expect(open).toHaveBeenCalledWith(
      `https://claude.example.com/new?q=${prompt}`,
      '_blank',
      'noopener'
    )
  })

  it('renders code blocks, numbered lists and inline runs', () => {
    const { container, getByRole } = band({
      body: [
        'Read the [guide](https://example.com/docs) with **care**, *slowly*, and run `deploy`.',
        '',
        '```bash',
        'npm run build',
        '',
        'npm run deploy',
        '```',
        '',
        '1. First step',
        '2. Second step'
      ].join('\n')
    })

    const link = getByRole('link', { name: 'guide' })
    expect(link.getAttribute('href')).toBe('https://example.com/docs')
    expect(link.getAttribute('target')).toBe('_blank')
    expect(container.querySelector('article strong')?.textContent).toBe('care')
    expect(container.querySelector('article em')?.textContent).toBe('slowly')
    expect(container.querySelector('article p code')?.textContent).toBe('deploy')
    expect(container.querySelector('article pre code')?.textContent).toBe(
      'npm run build\n\nnpm run deploy'
    )
    expect(
      Array.from(container.querySelectorAll('article ol li')).map((li) => li.textContent?.trim())
    ).toEqual(['First step', 'Second step'])
  })

  it('leads the byline with the writers and their photos', () => {
    const { getByText, getByAltText } = band({
      article: {
        ...article,
        author: 'Jane Doe and John Smith',
        authors: [{ name: 'Jane Doe', avatar: '/people/jane.png' }, { name: 'John Smith' }]
      }
    })

    expect(getByText('Jane Doe and John Smith')).toBeInTheDocument()
    expect(getByAltText('Jane Doe').getAttribute('src')).toBe('/people/jane.png')
  })

  it('scrolls to a heading from the outline and writes its hash', async () => {
    const before = window.location.href
    try {
      const { getAllByRole } = band()
      const entry = getAllByRole('link').find(
        (link) => link.getAttribute('href') === '#results-and-impact'
      )!

      await userEvent.click(entry)

      expect(window.location.hash).toBe('#results-and-impact')
    } finally {
      window.history.replaceState(null, '', before)
    }
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

  it('has no a11y violations with the copy-page split button', async () => {
    const { container } = band()

    await expectNoA11yViolations(container)
  })
})
