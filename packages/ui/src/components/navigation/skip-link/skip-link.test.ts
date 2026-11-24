import userEvent from '@testing-library/user-event'
import { fireEvent, render } from '@testing-library/vue'
import { afterEach, describe, expect, it } from 'vitest'
import { h } from 'vue'

import Default from '../../../../examples/skip-link/default.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import { LOCALES } from '../../../test/locales'
import ConfigProvider from '../../layout/config-provider/config-provider.vue'
import SkipLink from './skip-link.vue'

const mounted: HTMLElement[] = []

const addTarget = (tag: string, id: string, attrs: Record<string, string> = {}) => {
  const el = document.createElement(tag)
  el.id = id
  for (const [name, value] of Object.entries(attrs)) el.setAttribute(name, value)
  el.textContent = 'Main content'
  document.body.appendChild(el)
  mounted.push(el)
  return el
}

afterEach(() => {
  while (mounted.length) mounted.pop()?.remove()
  if (location.hash) history.replaceState(null, '', location.pathname + location.search)
})

describe('SkipLink', () => {
  it('renders an anchor to #main with the default testid and the catalog label', () => {
    const { getByTestId } = render(SkipLink)
    const root = getByTestId('skip-link')

    expect(root.tagName).toBe('A')
    expect(root.getAttribute('href')).toBe('#main')
    expect(root.textContent?.trim()).toBe('Skip to content')
  })

  it('lets a consumer data-testid win', () => {
    const { getByTestId, queryByTestId } = render(SkipLink, {
      attrs: { 'data-testid': 'shell-skip' }
    })

    expect(getByTestId('shell-skip').tagName).toBe('A')
    expect(queryByTestId('skip-link')).toBeNull()
  })

  it('uses the label prop, and the default slot over it', () => {
    const labelled = render(SkipLink, { props: { label: 'Skip to results' } })
    expect(labelled.getByTestId('skip-link').textContent?.trim()).toBe('Skip to results')
    labelled.unmount()

    const slotted = render(SkipLink, {
      props: { label: 'Skip to results' },
      slots: { default: 'Skip to the table' }
    })
    expect(slotted.getByTestId('skip-link').textContent?.trim()).toBe('Skip to the table')
  })

  it('points at a custom href', () => {
    const { getByTestId } = render(SkipLink, { props: { href: '#content' } })

    expect(getByTestId('skip-link').getAttribute('href')).toBe('#content')
  })

  it('is reached by the first Tab and stays in the accessibility tree at rest', async () => {
    const user = userEvent.setup()
    const { getByRole } = render(SkipLink)
    const link = getByRole('link', { name: 'Skip to content' })

    expect(link.getAttribute('aria-hidden')).toBeNull()

    document.body.focus()
    await user.tab()

    expect(document.activeElement).toBe(link)
  })

  it('moves focus into a non-focusable target with a temporary tabindex removed on blur', async () => {
    const target = addTarget('main', 'main')
    const { getByTestId } = render(SkipLink)

    await fireEvent.click(getByTestId('skip-link'))

    expect(document.activeElement).toBe(target)
    expect(target.getAttribute('tabindex')).toBe('-1')

    target.blur()

    expect(target.hasAttribute('tabindex')).toBe(false)
  })

  it('activates with Enter and focuses the target', async () => {
    const user = userEvent.setup()
    const target = addTarget('main', 'main')
    const { getByTestId } = render(SkipLink)

    getByTestId('skip-link').focus()
    await user.keyboard('{Enter}')

    expect(document.activeElement).toBe(target)
  })

  it('leaves the tabindex of an already focusable target alone', async () => {
    const target = addTarget('div', 'panel', { tabindex: '0' })
    const { getByTestId } = render(SkipLink, { props: { href: '#panel' } })

    await fireEvent.click(getByTestId('skip-link'))

    expect(document.activeElement).toBe(target)
    expect(target.getAttribute('tabindex')).toBe('0')
    target.blur()
    expect(target.getAttribute('tabindex')).toBe('0')
  })

  it('resolves an encoded hash', async () => {
    const target = addTarget('section', 'résultats')
    const { getByTestId } = render(SkipLink, { props: { href: '#r%C3%A9sultats' } })

    await fireEvent.click(getByTestId('skip-link'))

    expect(document.activeElement).toBe(target)
  })

  it('does nothing beyond navigation when the target is missing or the href is not a hash', async () => {
    const missing = render(SkipLink, { props: { href: '#nowhere' } })
    const link = missing.getByTestId('skip-link')
    link.focus()
    await fireEvent.click(link)
    expect(document.activeElement).toBe(link)
    missing.unmount()

    const target = addTarget('main', 'main')
    const external = render(SkipLink, { props: { href: '/docs' } })
    external.getByTestId('skip-link').addEventListener('click', (event) => event.preventDefault())
    await fireEvent.click(external.getByTestId('skip-link'))
    expect(target.hasAttribute('tabindex')).toBe(false)
  })

  it('forwards consumer attributes and listeners to the anchor', async () => {
    let clicks = 0
    const { getByTestId } = render(SkipLink, {
      attrs: {
        id: 'skip',
        class: 'consumer-class',
        'data-track': 'skip',
        onClick: () => {
          clicks += 1
        }
      }
    })
    const root = getByTestId('skip-link')

    expect(root.id).toBe('skip')
    expect(root.classList.contains('consumer-class')).toBe(true)
    expect(root.getAttribute('data-track')).toBe('skip')

    await fireEvent.click(root)
    expect(clicks).toBe(1)
  })

  it.each([
    ['es', 'Saltar al contenido'],
    ['pt-BR', 'Pular para o conteúdo']
  ])('reads the %s catalog under ConfigProvider', (locale, label) => {
    const { getByTestId } = render({
      render: () => h(ConfigProvider, { locale, catalogs: LOCALES }, { default: () => h(SkipLink) })
    })

    expect(getByTestId('skip-link').textContent?.trim()).toBe(label)
  })

  it('renders under dir="rtl" and still hands focus to the target', async () => {
    const target = addTarget('main', 'main')
    const { getByTestId } = render({
      render: () => h(ConfigProvider, { dir: 'rtl' }, { default: () => h(SkipLink) })
    })
    const link = getByTestId('skip-link')

    expect(link.closest('[dir="rtl"]')).not.toBeNull()

    await fireEvent.click(link)
    expect(document.activeElement).toBe(target)
  })

  it('has no a11y violations in the default render', async () => {
    const { container } = render(SkipLink)
    await expectNoA11yViolations(container)
  })

  it('renders the Default example and skips to its content region', async () => {
    const { container, getByTestId } = render(Default)
    const link = getByTestId('skip-link')

    expect(link.getAttribute('href')).toBe('#skip-link-demo-content')

    await fireEvent.click(link)
    expect(document.activeElement?.id).toBe('skip-link-demo-content')

    await expectNoA11yViolations(container)
  })
})
