import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'

import Default from '../../../../examples/section-command/default.vue'
import Prompt from '../../../../examples/section-command/prompt.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import { LOCALES } from '../../../test/locales'
import WebkitProvider from '../../utils/webkit-provider/webkit-provider.vue'

describe('SectionCommand', () => {
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
