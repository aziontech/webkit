import { fireEvent, render, screen, waitFor, within } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import Configure from '../../blocks/platform/create/source-wizard/variants/configure.vue'
import GitSource from '../../blocks/platform/create/source-wizard/variants/git-source.vue'
import Install from '../../blocks/platform/create/source-wizard/variants/install.vue'
import Method from '../../blocks/platform/create/source-wizard/variants/method.vue'
import Repository from '../../blocks/platform/create/source-wizard/variants/repository.vue'
import TemplateSource from '../../blocks/platform/create/source-wizard/variants/template-source.vue'
import { expectNoA11yViolations } from './axe'

const wait = { timeout: 5000 }

describe('source-wizard steps', () => {
  it('git: connects the account, loads the repositories and lists them', async () => {
    render(Method)
    await fireEvent.click(screen.getByRole('button', { name: /Import from Git/ }))
    await fireEvent.click(await screen.findByRole('button', { name: 'Connect GitHub' }))
    expect(await screen.findByRole('button', { name: /next-js-boilerplate/ }, wait)).toBeTruthy()
  })

  it('git source: picking a repository answers the step and prefills Configure', async () => {
    const view = render(GitSource)
    await expectNoA11yViolations(view.container)
    expect(screen.queryByRole('button', { name: 'Next' })).toBeNull()
    await fireEvent.click(screen.getByRole('button', { name: /docs-site/ }))
    const name = await screen.findByRole<HTMLInputElement>('textbox', { name: /^Name/ })
    expect(name.value).toBe('docs-site')
  })

  it('git source: a search with no match says so', async () => {
    render(GitSource)
    await fireEvent.update(screen.getByRole('textbox', { name: 'Search repositories' }), 'zzz')
    expect(screen.getByText('No repository matches “zzz”.')).toBeTruthy()
    expect(screen.getByRole('status').textContent).toBe('No repository matches zzz')
  })

  it('template source: groups the templates, tags the featured ones and moves on', async () => {
    const view = render(TemplateSource)
    await expectNoA11yViolations(view.container)
    for (const group of ['Official', 'Community', 'Frameworks']) {
      expect(screen.getByRole('heading', { name: group })).toBeTruthy()
    }
    expect(screen.getAllByText('Featured')).toHaveLength(3)
    await fireEvent.click(screen.getByRole('button', { name: /Astro Blog/ }))
    expect(await screen.findByText('Connect a Git account')).toBeTruthy()
  })

  it('repository: Next with no name shows the required message', async () => {
    const view = render(Repository)
    await expectNoA11yViolations(view.container)
    const name = screen.getByRole<HTMLInputElement>('textbox', { name: 'Repository name' })
    expect(name.value).toBe('nextjs-commerce')
    await fireEvent.update(name, '')
    await fireEvent.click(screen.getByRole('button', { name: 'Next' }))
    expect(await screen.findByText('This field is required.')).toBeTruthy()
  })

  it('repository: Existing lists the repositories and Next moves to Configure', async () => {
    render(Repository)
    await fireEvent.click(screen.getByRole('radio', { name: 'Existing repository' }))
    await fireEvent.click(screen.getByRole('button', { name: 'Next' }))
    expect(await screen.findByText('Select a repository, or create a new one.')).toBeTruthy()
    await fireEvent.click(screen.getByRole('button', { name: /internal-admin/ }))
    await fireEvent.click(screen.getByRole('button', { name: 'Next' }))
    expect(await screen.findByText('acme/internal-admin')).toBeTruthy()
  })

  it('configure: flags an edited command and validates the name', async () => {
    const view = render(Configure)
    await expectNoA11yViolations(view.container)
    await fireEvent.click(screen.getByRole('button', { name: /Build command/ }))
    await fireEvent.update(
      await screen.findByRole('textbox', { name: 'Build command' }),
      'pnpm build'
    )
    expect(await screen.findByText('Edited')).toBeTruthy()
    await fireEvent.click(screen.getByRole('button', { name: 'Use the default' }))
    await waitFor(() => expect(screen.queryByText('Edited')).toBeNull())

    await fireEvent.update(screen.getByRole('textbox', { name: /^Name/ }), '')
    await fireEvent.click(screen.getByRole('button', { name: 'Create and deploy' }))
    expect(await screen.findByText('This field is required.')).toBeTruthy()
  })

  it('configure: the firewall switch reveals the binding, with DDoS locked on', async () => {
    render(Configure)
    await fireEvent.click(screen.getByRole('switch', { name: 'Protect with a firewall' }))
    await fireEvent.click(screen.getByRole('radio', { name: 'New firewall' }))
    const name = await screen.findByRole<HTMLInputElement>('textbox', { name: /Firewall name/ })
    expect(name.value).toBe('storefront-checkout-firewall')
    const ddos = screen.getByRole('switch', { name: 'DDoS Protection' })
    expect(ddos.hasAttribute('disabled') || ddos.getAttribute('aria-disabled') === 'true').toBe(
      true
    )
  })

  it('install: requires the origin and previews what gets added', async () => {
    const view = render(Install)
    await expectNoA11yViolations(view.container)
    await fireEvent.click(screen.getByRole('button', { name: 'Add to service-01' }))
    expect(await screen.findByText('This field is required.')).toBeTruthy()
    await fireEvent.update(
      screen.getByRole('textbox', { name: /Origin address/ }),
      'origin.example.com'
    )
    const added = screen.getByText('Records').parentElement as HTMLElement
    expect(within(added).getByText(/origin\.example\.com/)).toBeTruthy()
  })
})
