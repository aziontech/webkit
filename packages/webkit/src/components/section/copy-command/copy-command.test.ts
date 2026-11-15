import { fireEvent, render } from '@testing-library/vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { h } from 'vue'

import Default from '../../../../examples/copy-command/default.vue'
import Prompt from '../../../../examples/copy-command/prompt.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import { LOCALES } from '../../../test/locales'
import WebkitProvider from '../../provider/webkit-provider/webkit-provider.vue'
import CopyCommand from './copy-command.vue'

describe('CopyCommand', () => {
  afterEach(() => vi.restoreAllMocks())

  it('carries the fallback testid and lets a consumer testid win', () => {
    const { getByTestId, unmount } = render(CopyCommand, { props: { value: 'npm i' } })
    expect(getByTestId('copy-command')).toBeInTheDocument()
    unmount()
    const custom = render(CopyCommand, {
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

  it('shows the command read-only with a decorative prompt', () => {
    const { getByRole, getByText } = render(Default)
    const field = getByRole('textbox', { name: 'Command' })
    expect(field).toHaveValue('npm create azion@latest')
    expect(field).toHaveAttribute('readonly')
    expect(getByText('$')).toHaveAttribute('aria-hidden', 'true')
    expect(getByRole('button', { name: 'Copy command' })).toBeInTheDocument()
  })

  it('drops the shell prompt and renames the field for an agent prompt', () => {
    const { getByRole, queryByText } = render(Prompt)
    expect(getByRole('textbox', { name: 'Prompt' })).toBeInTheDocument()
    expect(getByRole('button', { name: 'Copy prompt' })).toBeInTheDocument()
    expect(queryByText('$')).toBeNull()
  })

  it('translates its built-in labels', () => {
    const { getByRole } = render({
      render: () =>
        h(WebkitProvider, { locale: 'es', catalogs: LOCALES }, { default: () => h(Default) })
    })
    expect(getByRole('button', { name: 'Copiar comando' })).toBeInTheDocument()
  })

  it('keeps the command left to right inside an rtl page', () => {
    const { getByRole } = render({ render: () => h('div', { dir: 'rtl' }, [h(Default)]) })
    expect(getByRole('textbox')).toHaveAttribute('dir', 'ltr')
  })

  it('has no axe violations', async () => {
    const { container } = render(Default)
    await expectNoA11yViolations(container)
  })
})
