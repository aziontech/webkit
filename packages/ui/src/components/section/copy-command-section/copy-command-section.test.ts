import { fireEvent, render } from '@testing-library/vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { h } from 'vue'

import Default from '../../../../examples/copy-command-section/default.vue'
import Prompt from '../../../../examples/copy-command-section/prompt.vue'
import * as en from '../../../locales/en'
import { expectNoA11yViolations } from '../../../test/axe'
import { LOCALES } from '../../../test/locales'
import ConfigProvider from '../../provider/config-provider/config-provider.vue'
import CopyCommandSection from './copy-command-section.vue'

describe('CopyCommandSection', () => {
  afterEach(() => vi.restoreAllMocks())

  it('carries the fallback testid and lets a consumer testid win', () => {
    const { getByTestId, unmount } = render(CopyCommandSection, { props: { value: 'npm i' } })
    expect(getByTestId('copy-command-section')).toBeInTheDocument()
    unmount()
    const custom = render(CopyCommandSection, {
      props: { value: 'npm i' },
      attrs: { 'data-testid': 'install' }
    })
    expect(custom.getByTestId('install')).toBeInTheDocument()
  })

  it('copies the command value as written', async () => {
    const writeText = vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue()
    const { getByRole } = render(Default)
    await fireEvent.click(getByRole('button', { name: 'Copy command' }))
    await vi.waitFor(() => expect(writeText).toHaveBeenCalledWith('npm create azion@latest'))
  })

  it('shows the whole command as wrapping text after a decorative prompt', () => {
    const { getByRole, getByTestId, getByText } = render(Default)
    const group = getByRole('group', { name: 'Command' })
    const text = getByTestId('copy-command-section__text')
    expect(group).toContainElement(text)
    expect(text.textContent?.trim()).toBe('npm create azion@latest')
    expect(text.className).toContain('group-data-[shell]:break-all')
    expect(text.className).not.toContain('mask-image')
    expect(getByText('$')).toHaveAttribute('aria-hidden', 'true')
    expect(getByRole('button', { name: 'Copy command' })).toBeInTheDocument()
  })

  it('drops the shell prompt and shows an agent prompt in full as wrapping text', () => {
    const { getByRole, getByTestId, queryByText, queryByRole } = render(Prompt)
    const group = getByRole('group', { name: 'Prompt' })
    const text = getByTestId('copy-command-section__text')
    expect(group).toContainElement(text)
    expect(text.textContent?.trim()).toBe('Deploy this repository to Azion and give me the URL')
    expect(text.className).toContain('whitespace-pre-wrap')
    expect(queryByRole('textbox')).toBeNull()
    expect(getByRole('button', { name: 'Copy prompt' })).toBeInTheDocument()
    expect(queryByText('$')).toBeNull()
  })

  it('translates its built-in labels', () => {
    const { getByRole } = render({
      render: () =>
        h(ConfigProvider, { locale: 'es', catalogs: LOCALES }, { default: () => h(Default) })
    })
    expect(getByRole('button', { name: 'Copiar comando' })).toBeInTheDocument()
  })

  it('keeps the command left to right inside an rtl page', () => {
    const { getByTestId } = render({ render: () => h('div', { dir: 'rtl' }, [h(Default)]) })
    expect(getByTestId('copy-command-section__text')).toHaveAttribute('dir', 'ltr')
  })

  it('has no axe violations', async () => {
    const { container } = render(Default)
    await expectNoA11yViolations(container)
  })

  it('has no axe violations for an agent prompt', async () => {
    const { container } = render(Prompt)
    await expectNoA11yViolations(container)
  })

  it('names its copy labels after the message, never after the namespace', () => {
    for (const catalog of [
      en.copyCommandSection,
      ...Object.values(LOCALES).map((locale) => locale.copyCommandSection)
    ]) {
      expect(Object.keys(catalog ?? {}).sort()).toEqual([
        'command',
        'copyCommand',
        'copyPrompt',
        'prompt'
      ])
    }
  })
})
