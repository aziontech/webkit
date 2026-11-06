import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import { expectNoA11yViolations } from '../../../test/axe'
import CodeSplit from './code-split.vue'

const TESTID = 'sections-code-split'
const TITLE = 'From basic caching to advanced acceleration'
const DESCRIPTION = 'Application Accelerator extends Cache with protocol optimizations.'
const COPY_LABEL = 'Copy the cache settings sample'

const oneTab = [
  {
    label: 'cache-settings.json',
    value: 'cache-settings',
    language: 'json',
    code: '{ "ttl": 60 }',
    fileName: 'cache-settings.json',
    fileIcon: 'ai ai-json'
  }
]

const markedTabs = [
  {
    label: 'OpenAI SDK',
    value: 'openai-sdk',
    language: 'ts',
    code: 'const client = new OpenAI()',
    fileName: 'client.ts',
    icon: 'ai-cor ai-open'
  },
  {
    label: 'GitHub Copilot',
    value: 'github-copilot',
    language: 'json',
    code: '[]',
    fileName: 'chatLanguageModels.json',
    icon: 'ai-cor ai-microsoft-copilot'
  }
]

const primaryAction = { label: 'Learn more', href: '/docs', trailing: true }
const secondaryAction = {
  label: 'See GitHub',
  href: 'https://github.com/aziontech',
  icon: 'pi pi-github',
  target: '_blank' as const
}

const band = (props: Record<string, unknown> = {}) =>
  render(CodeSplit, {
    props: {
      title: TITLE,
      description: DESCRIPTION,
      codeTabs: oneTab,
      copyAriaLabel: COPY_LABEL,
      primaryAction,
      ...props
    }
  })

describe('CodeSplit', () => {
  it('renders the band under the default testid', () => {
    const { getByTestId } = band()

    expect(getByTestId(TESTID)).toBeInTheDocument()
  })

  it('lets a consumer data-testid win over the fallback', () => {
    const { getByTestId, queryByTestId } = render(CodeSplit, {
      props: { title: TITLE, codeTabs: oneTab },
      attrs: { 'data-testid': 'accelerator-code' }
    })

    expect(getByTestId('accelerator-code')).toBeInTheDocument()
    expect(queryByTestId(TESTID)).toBeNull()
  })

  it('names the media split region by the title and renders it as the h2', () => {
    const { getByRole, getByText } = band()

    expect(getByRole('region', { name: TITLE })).toBeInTheDocument()
    expect(getByRole('heading', { level: 2, name: TITLE })).toBeInTheDocument()
    expect(getByText(DESCRIPTION)).toBeInTheDocument()
  })

  it('keeps the root a plain element so the region is named once', () => {
    const { getByTestId } = band()

    expect(getByTestId(TESTID).tagName).toBe('DIV')
    expect(getByTestId(TESTID).hasAttribute('aria-label')).toBe(false)
  })

  it('renders only the root when the title is empty', () => {
    const { getByTestId, queryByRole } = band({ title: '' })

    expect(getByTestId(TESTID)).toBeInTheDocument()
    expect(queryByRole('region')).toBeNull()
    expect(queryByRole('heading')).toBeNull()
  })

  it('renders the one-tab sample with its code and the copy button name', () => {
    const { getByRole, getByText } = band()

    expect(getByText('cache-settings.json')).toBeInTheDocument()
    expect(getByRole('button', { name: COPY_LABEL })).toBeInTheDocument()
  })

  it('renders one tab per file, in order, with a mark beside each', () => {
    const { getAllByRole, container } = band({ codeTabs: markedTabs })

    expect(getAllByRole('tab').map((tab) => tab.textContent?.trim())).toEqual(
      markedTabs.map((tab) => tab.label)
    )
    expect(container.querySelectorAll('[role="tab"] i.ai-cor')).toHaveLength(markedTabs.length)
  })

  it('draws no tab marks when no tab carries an icon', () => {
    const { container } = band({
      codeTabs: markedTabs.map((tab) => ({ ...tab, icon: undefined }))
    })

    expect(container.querySelectorAll('[role="tab"] i')).toHaveLength(0)
  })

  it('skips a tab without code', () => {
    const { getAllByRole } = band({
      codeTabs: [...markedTabs, { label: 'Empty', value: 'empty', code: '' }]
    })

    expect(getAllByRole('tab')).toHaveLength(markedTabs.length)
  })

  it('leaves the code sample out when no tab has code', () => {
    const { queryByTestId } = band({ codeTabs: [] })

    expect(queryByTestId('code-code-block')).toBeNull()
  })

  it('links the primary action', () => {
    const { getByRole } = band()

    expect(getByRole('link', { name: primaryAction.label }).getAttribute('href')).toBe(
      primaryAction.href
    )
  })

  it('links the secondary action with its target', () => {
    const { getByRole } = band({ secondaryAction })

    const link = getByRole('link', { name: secondaryAction.label })
    expect(link.getAttribute('href')).toBe(secondaryAction.href)
    expect(link.getAttribute('target')).toBe('_blank')
  })

  it('renders no buttons when no action is set', () => {
    const { queryAllByRole } = band({ primaryAction: undefined })

    expect(queryAllByRole('link')).toHaveLength(0)
  })

  it('has no a11y violations with one tab and one action', async () => {
    const { container } = band()

    await expectNoA11yViolations(container)
  })

  it('has no a11y violations with marked tabs and two actions', async () => {
    const { container } = band({ codeTabs: markedTabs, secondaryAction })

    await expectNoA11yViolations(container)
  })
})
