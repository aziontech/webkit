import { cleanup, render } from '@testing-library/vue'
import { afterEach, describe, expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'
import { defineComponent, h, nextTick, ref } from 'vue'

import Default from '../../../../examples/artifact-canvas/default.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import { LOCALES } from '../../../test/locales'
import WebkitProvider from '../../utils/webkit-provider/webkit-provider.vue'
import ArtifactCanvas from './artifact-canvas.vue'

afterEach(() => cleanup())

const versions = ['SELECT 1;', 'SELECT 2;', 'SELECT 3;']

function harness(props: Record<string, unknown> = {}) {
  const version = ref(0)
  const closes: number[] = []
  const copies: string[] = []
  const canvas = ref<{ focus: () => void } | null>(null)
  const Host = defineComponent({
    setup: () => () =>
      h(
        ArtifactCanvas,
        {
          ref: canvas,
          title: 'top-orders.sql',
          meta: 'SQL',
          kind: 'code',
          versions: versions.length,
          copyValue: versions[version.value],
          ...props,
          version: version.value,
          'onUpdate:version': (next: number) => (version.value = next),
          onClose: () => closes.push(1),
          onCopy: (value: string) => copies.push(value)
        },
        {
          default: ({ version: index }: { version: number }) =>
            h('pre', { 'data-version': index }, versions[index])
        }
      )
  })
  return { ...render(Host), version, closes, copies, canvas }
}

describe('ArtifactCanvas', () => {
  it('is a region named by its title with a named close, copy and content region', () => {
    const view = harness()
    expect(view.getByRole('region', { name: 'top-orders.sql' })).toHaveAttribute(
      'data-kind',
      'code'
    )
    expect(view.getByRole('heading', { level: 2, name: 'top-orders.sql' })).toBeTruthy()
    expect(view.getByRole('button', { name: 'Close top-orders.sql' })).toBeTruthy()
    expect(view.getByRole('button', { name: 'Copy top-orders.sql' })).toBeTruthy()
    const content = view.getByRole('region', { name: 'top-orders.sql content' })
    expect(content).toHaveAttribute('tabindex', '0')
    expect(view.getByTestId('ai-artifact-canvas')).toBeTruthy()
  })

  it('pages through versions and renders the slot with the version shown', async () => {
    const view = harness()
    expect(view.getByRole('group', { name: 'Artifact versions' })).toBeTruthy()
    expect(view.getByText('1 of 3')).toBeTruthy()
    await userEvent.click(view.getByRole('button', { name: 'Next version' }))
    expect(view.version.value).toBe(1)
    expect(view.container.querySelector('pre')).toHaveAttribute('data-version', '1')
    expect(view.container.querySelector('pre')!.textContent).toBe('SELECT 2;')
  })

  it('hides the pager with one version and the toolbar when nothing goes in it', () => {
    const view = harness({ versions: 1, copyValue: '' })
    expect(view.queryByRole('group', { name: 'Artifact versions' })).toBeNull()
    expect(view.queryByTestId('ai-artifact-canvas__toolbar')).toBeNull()
  })

  it('offers Download with the title as file name', () => {
    const view = harness({ downloadHref: 'data:text/plain,SELECT', versions: 1 })
    const link = view.getByRole('link', { name: 'Download top-orders.sql' })
    expect(link).toHaveAttribute('download', 'top-orders.sql')
  })

  it('closes on Close and on Escape inside, but not on an Escape already handled', async () => {
    const view = harness()
    await userEvent.click(view.getByRole('button', { name: 'Close top-orders.sql' }))
    expect(view.closes).toHaveLength(1)
    const content = view.getByRole('region', { name: 'top-orders.sql content' })
    content.focus()
    await userEvent.keyboard('{Escape}')
    expect(view.closes).toHaveLength(2)
    const handled = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true })
    handled.preventDefault()
    content.dispatchEvent(handled)
    expect(view.closes).toHaveLength(2)
  })

  it('locks the pager and marks the body busy while streaming', async () => {
    const view = harness({ streaming: true })
    expect(view.getByRole('button', { name: 'Next version' })).toBeDisabled()
    expect(view.getByRole('region', { name: 'top-orders.sql content' })).toHaveAttribute(
      'aria-busy',
      'true'
    )
    expect(view.getByTestId('ai-artifact-canvas__status').textContent).toContain(
      'Generating a new version'
    )
  })

  it('focus() moves focus to the title', async () => {
    const view = harness()
    view.canvas.value!.focus()
    await nextTick()
    expect(document.activeElement).toBe(view.getByRole('heading', { name: 'top-orders.sql' }))
  })

  it('reads its strings from the locale catalog', () => {
    const view = render(WebkitProvider, {
      props: { locale: 'pt-BR', catalogs: LOCALES },
      slots: {
        default: () => h(ArtifactCanvas, { title: 'a.sql', versions: 2, copyValue: 'x' }, () => 'x')
      }
    })
    expect(view.getByRole('button', { name: 'Fechar a.sql' })).toBeTruthy()
    expect(view.getByRole('group', { name: 'Versões do artefato' })).toBeTruthy()
  })

  it('keeps Close at the inline end under rtl', () => {
    const host = document.createElement('div')
    host.dir = 'rtl'
    document.body.appendChild(host)
    const view = render(ArtifactCanvas, {
      container: host,
      props: { title: 'a.sql' },
      slots: { default: () => 'x' }
    })
    const header = view.container.querySelector('header')!
    expect(header.lastElementChild).toHaveAccessibleName('Close a.sql')
    host.remove()
  })

  it('closes and reopens in the example, returning focus each way, without axe violations', async () => {
    const view = render(Default)
    await expectNoA11yViolations(view.container as HTMLElement)
    expect(view.getByRole('separator', { name: 'Resize the artifact' })).toBeTruthy()
    await userEvent.click(view.getByRole('button', { name: 'Close top-orders.sql' }))
    expect(view.queryByRole('region', { name: 'top-orders.sql' })).toBeNull()
    expect(document.activeElement).toHaveAccessibleName('Open top-orders.sql')
    await userEvent.click(view.getByRole('button', { name: 'Open top-orders.sql' }))
    expect(document.activeElement).toBe(
      view.getByRole('heading', { level: 2, name: 'top-orders.sql' })
    )
  })
})
