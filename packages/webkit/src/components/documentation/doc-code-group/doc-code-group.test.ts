import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'
import { h } from 'vue'

import Default from '../../../../examples/doc-code-group/default.vue'
import Group from '../../../../examples/doc-code-group/group.vue'
import WithOutput from '../../../../examples/doc-code-group/with-output.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import DocCodeGroup from './doc-code-group.vue'

describe('DocCodeGroup', () => {
  it('renders one sample as a code block', () => {
    const { getByTestId } = render(Default)
    const root = getByTestId('documentation-doc-code-group')
    expect(root).toHaveAttribute('data-doc-chrome')
    expect(root.querySelector('code')?.textContent).toContain('azion link --preset vue')
  })

  it('renders several samples as tabs labelled by what differs', async () => {
    const { getAllByRole, container } = render(Group)
    const tabs = getAllByRole('tab')
    expect(tabs.map((tab) => tab.textContent?.trim())).toEqual(['npm', 'pnpm', 'yarn'])
    await userEvent.click(tabs[1])
    expect(container.textContent).toContain('pnpm add @aziontech/webkit')
  })

  it('titles a single sample with the readable language name by default', () => {
    const { getByTestId } = render(Default)
    expect(getByTestId('documentation-doc-code-group__code__label-text').textContent?.trim()).toBe(
      'Shell'
    )
  })

  it('drops the label header when showLabel is off', () => {
    const { queryByTestId } = render(DocCodeGroup, {
      props: { samples: [{ language: 'bash', code: 'a' }], showLabel: false }
    })
    expect(queryByTestId('documentation-doc-code-group__code__label')).toBeNull()
  })

  it('draws a sample output as a separate Output block with no copy control', () => {
    const { getByTestId } = render(WithOutput)
    const code = getByTestId('documentation-doc-code-group__code')
    const output = getByTestId('documentation-doc-code-group__output')
    expect(code.textContent).toContain('curl -I')
    expect(code.textContent).not.toContain('HTTP/2 200')
    expect(output.textContent).toContain('HTTP/2 200')
    expect(output.getAttribute('data-kind')).toBe('output')
    expect(output.hasAttribute('data-copyable')).toBe(false)
    expect(
      getByTestId('documentation-doc-code-group__output__label-text').textContent?.trim()
    ).toBe('Output')
  })

  it('follows the active tab with its output', async () => {
    const { getAllByRole, getByTestId, queryByTestId } = render(DocCodeGroup, {
      props: {
        samples: [
          { label: 'cURL', language: 'bash', code: 'curl -I https://x', output: 'HTTP/2 200' },
          { label: 'JavaScript', language: 'js', code: 'await fetch(url)' }
        ]
      }
    })
    expect(getByTestId('documentation-doc-code-group__output').textContent).toContain('HTTP/2 200')
    await userEvent.click(getAllByRole('tab')[1])
    expect(queryByTestId('documentation-doc-code-group__output')).toBeNull()
  })

  it('renders a standalone printout with kind output', () => {
    const { getByTestId } = render(DocCodeGroup, {
      props: { kind: 'output', samples: [{ code: 'Deploy finished' }] }
    })
    const block = getByTestId('documentation-doc-code-group__code')
    expect(block.getAttribute('data-kind')).toBe('output')
    expect(block.hasAttribute('data-copyable')).toBe(false)
  })

  it('falls back to the language name for a label', () => {
    const { getAllByRole } = render(DocCodeGroup, {
      props: {
        samples: [
          { language: 'bash', code: 'a' },
          { language: 'js', code: 'b' }
        ]
      }
    })
    expect(getAllByRole('tab').map((tab) => tab.textContent?.trim())).toEqual([
      'Shell',
      'JavaScript'
    ])
  })

  it('renders nothing inside the wrapper without samples', () => {
    const { getByTestId } = render(DocCodeGroup)
    expect(getByTestId('documentation-doc-code-group').children).toHaveLength(0)
  })

  it('renders under rtl', () => {
    const { container } = render({ render: () => h('div', { dir: 'rtl' }, [h(Default)]) })
    expect(container.textContent).toContain('azion link')
  })

  it('has no axe violations', async () => {
    const { container } = render(Group)
    await expectNoA11yViolations(container)
  })

  it('has no axe violations with an output block', async () => {
    const { container } = render(WithOutput)
    await expectNoA11yViolations(container)
  })
})
