import { cleanup, render, waitFor, within } from '@testing-library/vue'
import { afterEach, describe, expect, it } from 'vitest'
import { type Component, defineComponent, h } from 'vue'

import DocsShell from '../../../../blocks/shell/shell-docs/shell-docs.vue'
import AgentGuide from '../../../../blocks/shell/shell-docs/variants/agent-guide.vue'
import AgentSetup from '../../../../blocks/shell/shell-docs/variants/agent-setup.vue'
import Article from '../../../../blocks/shell/shell-docs/variants/article.vue'
import Landing from '../../../../blocks/shell/shell-docs/variants/landing.vue'
import Reference from '../../../../blocks/shell/shell-docs/variants/reference.vue'

afterEach(() => cleanup())

const pages: [string, Component][] = [
  ['Article', Article],
  ['Reference', Reference],
  ['Landing', Landing],
  ['AgentSetup', AgentSetup],
  ['AgentGuide', AgentGuide]
]

const inShell = (page: Component) =>
  render(defineComponent({ render: () => h(DocsShell, null, { default: () => h(page) }) }))

const outlineLinks = (rail: HTMLElement) =>
  within(rail)
    .getAllByRole('link')
    .filter((link) => link.getAttribute('href')?.startsWith('#'))
    .map((link) => link.textContent?.trim())

describe('shell/shell-docs page bodies', () => {
  it.each(pages)('%s renders only its article, with no chrome of its own', (_, page) => {
    const view = render(page)
    const article = view.container.querySelector('article')
    expect(article).toBeTruthy()
    expect(view.queryByTestId('doc-layout')).toBeNull()
    for (const header of view.container.querySelectorAll('header')) {
      expect(article?.contains(header)).toBe(true)
    }
    expect(view.queryByRole('main')).toBeNull()
    expect(view.queryByRole('contentinfo')).toBeNull()
    expect(view.queryByRole('navigation', { name: 'Documentation' })).toBeNull()
  })

  it('fills the shell outline from the Article headings', async () => {
    const view = inShell(Article)
    expect(view.getAllByRole('main')).toHaveLength(1)
    const rail = await view.findByTestId('doc-layout__aside')
    await waitFor(() =>
      expect(outlineLinks(rail)).toEqual([
        'Before you start',
        'Deploy a template via Console',
        'Test it',
        'Deploy with Azion CLI',
        'Next steps',
        'Related resources'
      ])
    )
    expect(within(rail).getByText('Ready to build?')).toBeTruthy()
  })

  it('fills the shell outline from the Reference headings, replacing the stand-in guide', async () => {
    const view = inShell(Reference)
    const rail = await view.findByTestId('doc-layout__aside')
    await waitFor(() =>
      expect(outlineLinks(rail)).toEqual([
        'Request path',
        'Rule structure',
        'Scope and limits',
        'Next steps'
      ])
    )
    expect(view.queryByText('Prerequisites')).toBeNull()
  })

  it('shows no outline rail and no call to action for the Landing page', async () => {
    const view = inShell(Landing)
    await waitFor(() => expect(view.getByText('Start by interface')).toBeTruthy())
    expect(view.queryByTestId('doc-layout__aside')).toBeNull()
    expect(view.queryByText('Ready to build?')).toBeNull()
  })

  it('outlines its stand-in guide when rendered alone', async () => {
    const view = render(DocsShell)
    const rail = await view.findByTestId('doc-layout__aside')
    await waitFor(() => expect(outlineLinks(rail)).toContain('Verify the response'))
  })
})

describe('shell/shell-docs marks the page you are on in the rail', () => {
  const current = () =>
    [...document.querySelectorAll('[data-testid="doc-layout"] [aria-current="page"]')]
      .filter((el) => !el.closest('nav[aria-label="Breadcrumb"], [data-testid^="breadcrumb"]'))
      .map((el) => el.textContent?.trim())

  it.each([
    ['Article', Article, 'First deploy'],
    ['Reference', Reference, 'Overview'],
    ['Landing', Landing, 'Overview'],
    ['AgentSetup', AgentSetup, 'Overview'],
    ['AgentGuide', AgentGuide, 'Claude Code']
  ] as [string, Component, string][])('%s marks %s', async (_name, page, label) => {
    inShell(page)
    await waitFor(() => expect(current()).toContain(label))
  })

  it('the stand-in page marks Getting started', async () => {
    render(DocsShell)
    await waitFor(() => expect(current()).toContain('Getting started'))
  })
})
